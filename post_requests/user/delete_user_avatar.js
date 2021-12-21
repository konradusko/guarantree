import express from 'express'
const delete_user_avatar = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {get_information} from '../../modules/get_info/get_information.js'
import { remove_file } from '../../modules/storage/delete_photo_from_storage.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'
delete_user_avatar.post('/deleteUserAvatar',async(req,res)=>{
    const config = res.locals.delete_user_avatar_config
    const body = req.body
    const uid = res.locals.uid.uid
    const avatar_info = res.locals.avatar_information

    if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
    return res.json({message:'Body zawiera niedozwolone parametry.'})
    
    try {
        const current_avatar = await get_information({
            collection_id:config.collection_id,
            doc_id:uid,
            type:config.get_user_info_type
        })
        if(current_avatar.avatar_public)
            return res.json({message:'Nie można usunąć publicznego avataru.'})
        
        //update zrobić na publicznego a potem usunac zdjecie
        const avatar = avatar_info.custom_avatar 
        try {
            await update_data({
                doc_id:uid,
                collection_id:config.collection_id,
                data_to_add:{avatar}
            })
            try {
                if(! current_avatar.avatar_public)
                await remove_file(current_avatar.avatar_path)
            } catch (error) {}
            return res.json({message:'Avatar został usunięty'})
        } catch (error) {
            return res.json({message:'Coś poszło nie tak.'})
        }
    } catch (error) {
        return res.json({message:'Coś poszło nie tak.'})
    }
})
export{delete_user_avatar}