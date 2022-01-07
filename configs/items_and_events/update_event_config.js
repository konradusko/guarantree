

import {validate_warranty_start_date} from '../../validate/validate_warranty_start_date.js'

const update_event_config = (req,res,next) =>{
    res.locals.update_event_config = {
        body_keys_allow_to_pass:['date_of_event','event_name','comment'],
        body_keys_require_to_validate:['token','public_id_event','public_id_item'],
        event_prefix:'Events',
        validate:[
            {
                key:'date_of_event',
                require_:false,
                error_require:'Data wydarzenia jest wymagana.',
                validate_warranty_start_date:validate_warranty_start_date,
                warranty_start_date_error:"Data ma zły format"
            },
            {
                key:'event_name',
                require_:false,
                error_require:"Nazwa wydarzenia jest wymagana.",
                min_length:4,
                max_length:25,
                error_min:'Nazwa wydarzenia powinna zawierać co najmniej 4 znaki.',
                error_max:"Nazwa wydarzenia nie powinna być dłuższa niż 25 znaków."
            },
            {
                key:'comment',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:`Komentarz nie może być pusty.`,
                error_max:"Komentarz nie może być dłuższy nić 25 znaków."
            },
        ]
    }
    next()
}
export{update_event_config}