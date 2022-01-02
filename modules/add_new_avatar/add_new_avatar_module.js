import { validate_base64 } from '../../validate/validate_file.js'
import { get_information } from '../../modules/get_info/get_information.js'
import { update_data } from '../../modules/add_update_delete_firebase/update_data.js'
import { add_photo_to_storage } from '../../modules/storage/add_photo_to_storage.js'
import { remove_file } from '../storage/delete_photo_from_storage.js'
import { makeId } from '../create_id/create_id.js'
import { create_token_photo } from '../token/create_photo_acces_token.js'
const add_new_avatar_module = (data)=>{
    return new Promise(async(res,rej)=>{
        const {
            config,
            avatar_info,
            body,
            uid
        } = data;
        let avatar,token_acces,custom;
        if(Number(body.avatar) >=0 &&Number(body.avatar) <avatar_info.public_avatars.length){
            avatar = avatar_info.public_avatars[Number(body.avatar)] 
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
                return rej({message:info})
            }
        }
    
        //Sprawdzić czy jest publiczny avatar 
        //jeśli nie jest publiczny to usunąć zdjęcie
    
        //pobieram informacje na temat avatara
        try {
            //pobieram informacje
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
                    return rej({message:'Avatar jest taki sam jak obecny.'})
    
                    //teraz zaktualizować o avatara
                    try {
                        await update_data({
                            doc_id:uid,
                            collection_id:config.collection_id,
                            data_to_add:{avatar}//publiczny avatar
                        })
                        try {
                            token_acces = await create_token_photo(avatar.path,config.create_token_minutes)
                            return res({message:'Avatar został zaktualizowany.',token:token_acces})
                        } catch (error) {
                            return res({message:'Avatar został zaktualizowany.'})
                        }
                    } catch (error) {
                        return rej({message:'Wystąpił błąd, spróbuj ponownie1.'})
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
                                return res({message:'Avatar został zaktualizowany.',token:token_acces})
                            } catch (error) {
                                return res({message:'Avatar został zaktualizowany.'})
                            }
                        } catch (error) {
                            //usuwam zbędne i tyle
                            try {
                                if(! avatar.public)
                                await remove_file(avatar.path)
                            } catch (error) {}
                         
                            return rej({message:'Nie udało się zaktualizować avatara.'})
                        }
                    } catch (error) {
                        return rej({message:'Nie udało się zaktualizować avatara.'})
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
                            return res({message:'Avatar został zaktualizowany.',token:token_acces})
                        } catch (error) {
                            return res({message:'Avatar został zaktualizowany.'})
                        }
                    } catch (error) {
                        return rej({message:'Nie udało się zaktualizować avatara.'})
                    }
                }else{
                    //najpierw daje mu podstawowego
                    //nastepnie usuwam starego
                    //nastepnie uploud nowego
                    //i do bazy danych nowy
                    try {
                        const hold_avatar = avatar
                        avatar = avatar_info.custom_avatar //dodaje białego avatar
                        await update_data({
                            doc_id:uid,
                            collection_id:config.collection_id,
                            data_to_add:{avatar}
                        })
                        try {
                            if(!current_avatar.avatar_public)
                            await remove_file(current_avatar.avatar_path)
                        } catch (error) {}
    
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
                                console.log(token_acces)
                                return res({message:'Avatar został zaktualizowany.',token:token_acces})
                            } catch (error) {
                                return res({message:'Avatar został zaktualizowany.'})
                            }
                        } catch (error) {
                            return rej({message:'Nie udało się zaktualizować avatara.'})
                        }
                    } catch (error) {
                        return rej({message:'Nie udało się zaktualizować avatara.'})
                    }
                }
            }
        } catch (error) {
            console.log(error)
            return rej({message:'Wystąpił błąd, spróbuj ponownie4.'})
        }
    })
}
export{add_new_avatar_module}