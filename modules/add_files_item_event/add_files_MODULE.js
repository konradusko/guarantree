import {validate_body_data} from '../../validate/validate_body_data.js'
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import { get_information } from '../../modules/get_info/get_information.js'
import {add_files} from '../../modules/add_files_item_event/add_files.js'
import { update_data } from '../../modules/add_update_delete_firebase/update_data.js'
import {create_token_photo} from '../../modules/token/create_photo_acces_token.js'



const add_file_modules = (...args)=>{
    return new Promise(async(res,rej)=>{
        /*
        0 item_unique_id 
        1 config 
        2 files_info 
        3 body 
        4 length_from_user 
        */
       const item_unique_id = args[0],
            config = args[1],
            files_info = args[2],
            body = args[3],
            length_from_user = args[4]

        try {
            if(length_from_user === 0)
            return rej({message:"Brak plików do dodania."})
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
        return rej({message:'Body zawiera niedozwolone parametry.'})

        const validate = validate_body_data(body,config.validate)
        if(typeof validate === 'string')
            return res.json({message:validate})
        
        //Sprawdzić ile plików moge jeszcze dodać
       
           const files_from_firebase = await get_information({
                collection_id:config.get_files_length.prefix,
                doc_id:item_unique_id,
                type:config.get_files_length.type
            })
        if(files_from_firebase.length+length_from_user > files_info.max_file_in_request)
            return rej({message:`Liczba plików ile możesz wciąż dodać: ${files_info.max_file_in_request-files_from_firebase.length}`})
    
        const _files_to_add = await add_files(body.files,files_info,config,item_unique_id)
        if(_files_to_add.length === 0)
            return rej({message:"Niestety pliki nie zostały dodane. Przyczyną może być błędny plik."})

        //dodać pliki
        let array_for_file_base = [..._files_to_add]
        let token_from_firebase
        let tokens = new Array
        for(const e in files_from_firebase){
            array_for_file_base.push({
                path:files_from_firebase[e].mapValue.fields.path.stringValue,
                id:files_from_firebase[e].mapValue.fields.id.stringValue,
                type:files_from_firebase[e].mapValue.fields.type.stringValue
            })
        }
        await update_data( {
            doc_id:item_unique_id,
            collection_id:config.item_prefix,
            data_to_add:{files:array_for_file_base}})

            for(const xd in _files_to_add){
                try {
                    token_from_firebase = await create_token_photo(_files_to_add[xd].path,config.tokens.files)
                    tokens.push({
                        token:token_from_firebase[0],
                        id:_files_to_add[xd].id,
                        type:_files_to_add[xd].type
                    })
                } catch (error) {
                    tokens.push({
                        token:'',
                        id:_files_to_add[xd].id,
                        type:_files_to_add[xd].type
                    })
                }
            }

        return res({message:`Liczba plików które zostały dodane: ${_files_to_add.length}/${length_from_user}`,tokens})
        } catch (error) {
           return rej({message:'Coś poszło nie tak.'})
        }
    })
}
export{add_file_modules}