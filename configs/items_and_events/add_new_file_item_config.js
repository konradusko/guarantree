
import {validate_files} from '../../validate/validate_files.js'
const add_new_item_file_config = (req,res,next)=>{
    res.locals.add_new_file_item_config = {
        body_keys_allow_to_pass:['files'],
        body_keys_require_to_validate:['token','public_id_item'],
        item_prefix:'Items',
        add_photo_prefix:'Items',
        get_files_length:{
            prefix:'Items',
            type:'files_length_'
        },  
        tokens:{
            files:30
        },
        validate:[
            {
            key:'files',
            max_files:2,
            max_files_error:'Jest za dużo plików',
            require_:true,
            error_require:"Musisz podać pliki.",
            validate_files:validate_files,
            error_files:"Zdjęcia są nie prawidłowe."
        }]
    }
    next()
}
export{add_new_item_file_config}