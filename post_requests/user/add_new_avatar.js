import express from 'express'
const add_new_avatar = express.Router()
import {validate_body_keys_with_return} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {validate_base64} from '../../validate/validate_file.js'
import {get_information} from '../../modules/get_info/get_information.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'
import {add_photo_to_storage} from '../../modules/storage/add_photo_to_storage.js'
import { remove_file } from '../../modules/storage/delete_photo_from_storage.js'
import {makeId} from '../../modules/create_id/create_id.js'
import {create_token_photo} from '../../modules/token/create_photo_acces_token.js'
add_new_avatar.post('/addNewUserAvatar',async(req,res)=>{
    const uid = res.locals.uid.uid
    const body = req.body;
    const config = res.locals.update_avatar;
    const avatar_info = res.locals.avatar_information
    let custom;
    const check_body = validate_body_keys_with_return({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass})
    if(!check_body)
    return res.json({message:'Body zawiera niedozwolone parametry.'})
    if(typeof check_body === 'string')
    return res.json({message:'Brak wartości do zmiany'})

     //validacje danych jakie dostajemy bez avatara
    const validate = validate_body_data(body,config.validate)
    if(typeof validate === 'string')
    return res.json({message:validate})
    //sprawdzanie avatara
    let avatar,token_acces;
    if(body.avatar === '1'||body.avatar === '2'||body.avatar === '3'){
        avatar = avatar_info.public_avatars[Number(body.avatar)-1] 
        custom= true
    }else{
        try {
            avatar = await validate_base64({
                base64:body.avatar,
                allow_format:avatar_info.allow_format,
                size:avatar_info.max_size_of_file
            })
            custom = false;
        } catch (info) {
            return res.json({message:info})
        }
    }

    //Sprawdzić czy jest publiczny avatar 
    //jeśli nie jest publiczny to usunąć zdjęcie

    //pobieram informacje na temat avatara
    try {
        const current_avatar = await get_information({
            collection_id:config.collection_id,
            doc_id:uid,
            type:config.get_user_info_type
        })
        //sprawdzic
        if(current_avatar.avatar_public){
            if(custom){
                //jest publiczny avatar, i zmiana na kolejnego publicznego
                //sprawdzam czy nie jest taki sam przypadkiem
                if(current_avatar.avatar_path === avatar.path && current_avatar.avatar_type === avatar.type)//sa takie same
                    return res.json({message:'Zdjęcie jest takie samo jak obecne.'})

                //teraz zaktualizować o avatara
                try {
                
                    await update_data({
                        doc_id:uid,
                        collection_id:config.collection_id,
                        data_to_add:{avatar}
                    })
                    try {
                        token_acces = await create_token_photo(avatar.path,config.create_token_minutes)
                        return res.json({messgae:'Avatar został zaktualizowany.',token:token_acces})
                    } catch (error) {
                        return res.json({messgae:'Avatar został zaktualizowany.'})
                    }
                } catch (error) {
                    return res.json({message:'Wystąpił błąd, spróbuj ponownie1.'})
                }
            }else{
                // tutaj wystarczy tylko dodać avatara nowego do bazy danych i zaktualizować informacje
                const tmp_avatar = {
                    path:`${config.add_photo_prefix}/${uid}/${makeId(20)}${avatar.end_point}`,
                    type:avatar.type,
                    blob:avatar.blob
                }
                   //dodajemy zdjęcie
                try {
                 await add_photo_to_storage(tmp_avatar.blob,tmp_avatar.path,tmp_avatar.type)
                    avatar = {
                        path:tmp_avatar.path,
                        id:makeId(20),
                        public:false,
                        type:tmp_avatar.type
                    }
                    try {
                        await update_data({
                            doc_id:uid,
                            collection_id:config.collection_id,
                            data_to_add:{avatar}
                        })
                        try {
                            token_acces = await create_token_photo(avatar.path,config.create_token_minutes)
                            return res.json({messgae:'Avatar został zaktualizowany.',token:token_acces})
                        } catch (error) {
                            return res.json({messgae:'Avatar został zaktualizowany.'})
                        }
                    } catch (error) {
                        //usuwam zbędne i tyle
                        if(! avatar.public)
                        await remove_file(avatar.path)
                        return res.json({message:'Wystąpił błąd, spróbuj ponownie 2.'})
                    }
                } catch (error) {
                    return res.json({message:'Wystąpił błąd, spróbuj ponownie3.'})
                }
            }
        }else{
            //nie jest publiczny
            //sprawdzmy czy to co chcemy dodać jest publiczne
            if(custom){
                //jest publiczny
                //dodać nowy ale i usunąć stary
                try {
                    await update_data({
                        doc_id:uid,
                        collection_id:config.collection_id,
                        data_to_add:{avatar}
                    })
                    try {
                        if(!current_avatar.avatar_public)
                        await remove_file(current_avatar.avatar_path)
                    } catch (error) {}
                    try {
                        token_acces = await create_token_photo(avatar.path,config.create_token_minutes)
                        return res.json({messgae:'Avatar został zaktualizowany.',token:token_acces})
                    } catch (error) {
                        return res.json({messgae:'Avatar został zaktualizowany.'})
                    }
                } catch (error) {
                    return res.json({message:'Wystąpił błąd, spróbuj ponownie1.'})
                }
            }else{
                //najpierw daje mu podstawowego
                //nastepnie usuwam starego
                //nastepnie uploud nowego
                //i do bazy danych nowy
                try {
                    const hold_avatar = avatar
                    avatar = avatar_info.public_avatars[0] 
                    await update_data({
                        doc_id:uid,
                        collection_id:config.collection_id,
                        data_to_add:{avatar}
                    })
                    if(!current_avatar.avatar_public)
                    await remove_file(current_avatar.avatar_path)

                    const tmp_change_avatar = {
                        path:`${config.add_photo_prefix}/${uid}/${makeId(20)}${hold_avatar.end_point}`,
                        type:hold_avatar.type,
                        blob:hold_avatar.blob
                    }
                    await add_photo_to_storage(tmp_change_avatar.blob,tmp_change_avatar.path,tmp_change_avatar.type)
                    try {
                        avatar = {
                            path:tmp_change_avatar.path,
                            id:makeId(20),
                            public:false,
                            type:tmp_change_avatar.type
                        }
                        await update_data({
                            doc_id:uid,
                            collection_id:config.collection_id,
                            data_to_add:{avatar}
                        })
                        try {
                            token_acces = await create_token_photo(avatar.path,config.create_token_minutes)
                            return res.json({messgae:'Avatar został zaktualizowany.',token:token_acces})
                        } catch (error) {
                            return res.json({messgae:'Avatar został zaktualizowany.'})
                        }
                    } catch (error) {
                        return res.json({message:'Nie udało się zaktualizować avatara.'})
                    }
                } catch (error) {
                    return res.json({message:'Nie udało się zaktualizować avatara.'})
                }
            }
        }
    } catch (error) {
        console.log(error)
        return res.json({message:'Wystąpił błąd, spróbuj ponownie4.'})
    }
})
export{add_new_avatar}