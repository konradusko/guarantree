import express from 'express'
const add_new_item = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {add_photo_to_storage} from '../../modules/storage/add_photo_to_storage.js'
import {validate_base64} from '../../validate/validate_file.js'
import {add_files} from '../../modules/add_files_item_event/add_files.js'
import { makeId ,generateGuid} from '../../modules/create_id/create_id.js'
import {get_information} from '../../modules/get_info/get_information.js'
add_new_item.post('/addItem',async(req,res)=>{
    const uid = res.locals.uid.uid
    const config = res.locals.add_item_config
    const avatar_info = res.locals.avatar_information_item
    const files_config = res.locals.files_config
    const body = req.body;
    //Sprawdzam czy nie ma nie potrzebnych rzeczy w body
    if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
    return res.json({message:'Body zawiera niedozwolone parametry.'})

    // Sprawdzam validacje danych
    // const validate = validate_body_data(body,config.validate)
    // if(typeof validate === 'string')
    // return res.json({message:validate})
  
    //sprawdzić czy użytkownik ma sloty
    try {
       var {slots} = await get_information({
            collection_id:config.get_slots.collection_id,
            doc_id:uid,
            type:config.get_slots.type
        })
        if(Math.sign(slots) === 0 || Math.sign(slots) === -1)
        return res.json({message:"Nie masz wystarczającej ilości slotów."})
        console.log(slots)
    } catch (error) {
        return res.json({message:'Wystąpił błąd podczas dodawania przedmiotu.'})
    }

    const unique_item_id = generateGuid()+makeId(15)
    //sprawdzam avatara
    let custom
    let avatar;
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
            return res.json({message:info})
        }
    }
    //jeśli jest nie customowy avatar to dodaje do bazy danych
    if(!custom){
        const tmp_avatar = {
            path:`${config.add_photo_prefix}/${unique_item_id}/${makeId(20)}${avatar.end_point}`,
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
        } catch (error) {
            //nie dodalo zdjecia to damy mu publiczne niech sie cieszy
            avatar = avatar_info.custom_avatar
        }
    }
    //Dodaje pliki do bazy danych
    if(body.files.length >0){
        try {
            await add_files(body.files,avatar_info,config,unique_item_id)
        } catch (error) {
            return res.json({message:"Wystąpił błąd podczas dodawania przedmiotu."})
        }
    }
  
})
export{add_new_item}