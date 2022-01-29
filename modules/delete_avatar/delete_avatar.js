
import { get_information } from '../../modules/get_info/get_information.js'
import { remove_file } from '../storage/delete_photo_from_storage.js'
import { update_data } from '../../modules/add_update_delete_firebase/update_data.js'
import { create_token_photo } from '../token/create_photo_acces_token.js'
const delete_avatar = (...args)=>{
    return new Promise(async(res,rej)=>{
           //0 config
           //1 uid
           //2 avatar info
           const config = args[0]
           const uid = args[1]
           const avatar_info = args[2]
        try {
            const current_avatar = await get_information({
                collection_id:config.collection_id,
                doc_id:uid,
                type:config.get_user_info_type
            })
            if(current_avatar.avatar_public)
            return rej({message:'Nie można usunąć publicznego avataru',internal_error:true})
            
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

                try {
                    const  token_acces = await create_token_photo(avatar.path,config.create_token_minutes)
                    delete avatar['path']
                    return res({message:'Avatar został usunięty.',token:token_acces[0],avatar})
                } catch (error) {
                    return res({message:'Avatar został usunięty.',token:'',avatar})
                }

            } catch (error) {
                return rej({message:'Coś poszło nie tak.',internal_error:true})
            }
        } catch (error) {
            return rej({message:'Coś poszło nie tak.',internal_error:true})
        }
    })
}
export{delete_avatar}