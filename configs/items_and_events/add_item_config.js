import {validate_files} from '../../validate/validate_files.js'
import {validate_warranty_end_date} from '../../validate/validate_warranty_end_date.js'
import {validate_warranty_start_date} from '../../validate/validate_warranty_start_date.js'
const add_item_config = (req,res,next)=>{
    res.locals.add_item_config = {
        body_keys_allow_to_pass:['avatar','files','serial_number','seller_name','seller_adress','seller_email','phone_number_seller','phone_number_seller','item_name','brand','model','purchase_amount','warranty_start_date','warranty_end_date'],
        body_keys_require_to_validate:['token'],
        add_photo_prefix:'Items',
        get_slots:{
            collection_id:'Users',
            type:"get_user_slots"
        },
        belong:'item',
        add_item_to_user:{
            collection_id:'Users',
            type:"user_items"
        },
        tokens:{
            avatar:30,
            photo:30
        },
        validate:[
            {
                key:'avatar',
                require_:true,
                error_require:'Avatar jest wymagany',
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
               key:'warranty_end_date',
               require:true,
               error_require:"Końcowa data jest wymagana",
               validate_warranty_end_date: validate_warranty_end_date,
               warranty_end_date_error:"Data ma zły format"
            },
            {
                key:'warranty_start_date',
                require_:true,
                error_require:'Data rozpoczęcia gwarancji jest wymagana.',
                validate_warranty_start_date:validate_warranty_start_date,
                warranty_start_date_error:"Data ma zły format"
            },
            {
                key:'item_name',
                require_:true,
                error_require:"Nazwa przedmiotu jest wymagana.",
                min_length:4,
                max_length:25,
                error_min:'Nazwa przedmiotu powinna zawierać co najmniej 4 znaki.',
                error_max:"Nazwa przedmiotu nie powinna być dłuższa niż 25 znaków."
            },
            {
                key:'brand',
                require_:true,
                error_require:"Nazwa marki jest wymagana.",
                min_length:1,
                max_length:25,
                error_min:'Nazwa marki nie może być pusta.',
                error_max:"Nazwa marki nie powinna być dłuższa niż 25 znaków."
            },
            {
                key:'model',
                require_:true,
                error_require:"Model jest wymagany.",
                min_length:1,
                max_length:25,
                error_min:'Model nie może być pusty.',
                error_max:"Model nie może być dłuższy nic 25 znakow."
            },
            {
                key:'purchase_amount',
                require_:true,
                error_require:"Kwota zakupu jest wymagana.",
                min_length:1,
                max_length:25,
                error_min:'Kwota zakupu nie może być pusta.',
                error_max:"Kwota zakupu nie może być dłuższa niż 25 znaków."
            },
            {
                key:'serial_number',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:'Numer seryjny nie może być pusty.',
                error_max:"Numer seryjny nie może być dłuższy niż 25 znaków."
            },
            {
                key:'seller_name',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:`Nazwa przedmiotu nie może być pusta.`,
                error_max:"Nazwa sprzedawcy nie może byc dłuższa niż 25 znaków."
            },
            {
                key:'seller_adress',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:`Adres sprzedawcy nie może być pusty.`,
                error_max:"Adres sprzedawcy nie może byc dłuższy niż 25 znaków."
            },
            {
                key:'seller_email',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:`Adres e-mail nie może być pusty.`,
                error_max:"Adres e-mail nie może byc dłuższy niż 25 znaków."
            },
            {
                key:'phone_number_seller',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:`Numer telefonu sprzedawcy nie może być pusty.`,
                error_max:"Numer telefonu sprzedawcy nie może być dłuższy nić 25 znaków."
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
export{add_item_config}