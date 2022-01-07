import {validate_body_keys_with_return} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {get_information} from '../../modules/get_info/get_information.js'
import { update_data } from '../../modules/add_update_delete_firebase/update_data.js'
import {remove_file} from '../../modules/storage/delete_photo_from_storage.js'

const remove_files_module = (...data)=>{
    return new Promise(async(res,rej)=>{
        try {
            /**
             *   0 item_unique_id 
                 1 config 
                 2 body 
             */
            const item_unique_id = data[0],config = data[1],body = data[2]
            const check_body = validate_body_keys_with_return({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass})
            if(!check_body)
                return rej({message:'Body zawiera niedozwolone parametry.'})
            if(typeof check_body === 'string')
                 return rej({message:check_body})
        
            
            
            const validate = validate_body_data(body,config.validate)
            if(typeof validate === 'string')
            return res({message:validate})
      
            //Trzeba teraz pobrać wszystkie przedmioty
    
            const files_from_firebase = await get_information({
                collection_id:config.get_files_.prefix,
                doc_id:item_unique_id,
                type:config.get_files_.type
            })
            const check_if_id_exist = files_from_firebase.find(e=>e.mapValue.fields.id.stringValue === body.file_id)
            if(check_if_id_exist === undefined)
                return rej({message:'Plik o podanym id nie istnieje.'})
    
            const new_files = files_from_firebase.filter(post => post.mapValue.fields.id.stringValue !== body.file_id)
            let new_files_to_add = new Array
            for(const _ in new_files){
                new_files_to_add.push({
                    id:new_files[_].mapValue.fields.id.stringValue,
                    path:new_files[_].mapValue.fields.path.stringValue,
                    type:new_files[_].mapValue.fields.type.stringValue,
                    belong:files_from_firebase[_].mapValue.fields.belong.stringValue
                })
            }
            await update_data( {
                doc_id:item_unique_id,
                collection_id:config.update_prefix,
                data_to_add:{files:new_files_to_add}})
            //teraz usunac go z storage
                try {
                    await remove_file(check_if_id_exist.mapValue.fields.path.stringValue)
                } catch (error) {}
            return res({message:'Plik został usunięty.'})
        } catch (error) {
            return rej({message:"Nie udało się usunąc pliku."})
        }
       
    })
}
export{remove_files_module}