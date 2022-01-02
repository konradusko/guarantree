
import { get_information } from '../../modules/get_info/get_information.js'
import { remove_file } from '../storage/delete_photo_from_storage'
import { update_data } from '../../modules/add_update_delete_firebase/update_data.js'
const delete_avatar = (...args)=>{
    return new Promise((res,rej)=>{
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
            return rej('Nie można usunąć publicznego avataru.')
            
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
                return res('Avatar został usunięty')
            } catch (error) {
                return rej('Coś poszło nie tak.')
            }
        } catch (error) {
            return rej('Coś poszło nie tak.')
        }
    })
}
export{delete_avatar}