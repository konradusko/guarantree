
import {validate_warranty_start_date} from '../../validate/validate_warranty_start_date.js'
import {validate_files} from '../../validate/validate_files.js'
const add_event_config = (req,res,next) =>{
    res.locals.add_event_config = {
        body_keys_allow_to_pass:['date_of_event','event_name','comment','files'],
        body_keys_require_to_validate:['token','public_id_item'],
        add_photo_prefix:'Items',
        prefix_add_event:'Events',
        add_event_to_item_prefix:"Items",
        tokens:{
            photo:30
        },
        belong:'event',
        get_events_from_item:{
            collection_id:'Items',
            type:'events_length'
        },
        events_limit:10,//Liczba eventów w danym przedmiocie
        validate:[
            {
                key:'date_of_event',
                require_:true,
                error_require:'Data wydarzenia jest wymagana.',
                validate_warranty_start_date:validate_warranty_start_date,
                warranty_start_date_error:"Data ma zły format"
            },
            {
                key:'files',
                max_files:2,
                max_files_error:'Jest za dużo plików',
                require_:false,
                validate_files:validate_files,
                error_files:"Zdjęcia są nie prawidłowe."
            },
            {
                key:'event_name',
                require_:true,
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
export{add_event_config}