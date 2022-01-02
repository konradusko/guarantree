import {validate_files} from '../../validate/validate_files.js'
import {validate_warranty_end_date} from '../../validate/validate_warranty_end_date.js'
import {validate_warranty_start_date} from '../../validate/validate_warranty_start_date.js'
const add_item_config = ()=>{
    res.locals.add_item_config = {
        body_keys_allow_to_pass:['avatar','files','serial_number','seller_name','seller_adress','seller_email','phone_number_seller','phone_number_seller','item_name','brand','model','purchase_amount','warranty_start_date','warranty_end_date'],
        body_keys_require_to_validate:['token'],
        add_photo_prefix:'Items',
        validate:[
            {
                key:'avatar',
                require_:true,
                error_require:'Avatar jest wymagany',
            },
            {
                key:'files',
                require_:false,
                validate_files:validate_files,
                error_files:"Zdjęcia są nie prawidłowe."
            },
            {
               key:'warranty_end_date',
               require:true,
               validate_warranty_end_date: validate_warranty_end_date,
               warranty_end_date_error:"Data ma zły format"
            },
            {
                key:'warranty_start_date',
                require_:true,
                validate_warranty_start_date:validate_warranty_start_date,
                warranty_start_date_error:"Data ma zły format"
            },
            {
                key
            }
        ]
    }

}
export{add_item_config}