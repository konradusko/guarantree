import {validate_warranty_end_date} from '../../validate/validate_warranty_end_date.js'
import {validate_warranty_start_date} from '../../validate/validate_warranty_start_date.js'
const update_item_config = (req,res,next)=>{
    res.locals.update_item_config = {
        body_keys_allow_to_pass:['warranty_start_date','warranty_end_date','comment','seller_name','seller_adress','seller_email','phone_number_seller','purchase_amount','serial_number'],
        body_keys_require_to_validate:['token','public_id_item'],
        item_prefix:'Items',
        validate:[
            {
                key:'serial_number',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:'Numer seryjny nie może być pusty.',
                error_max:"Numer seryjny nie może być dłuższy niż 25 znaków."
            },
            {
                key:'purchase_amount',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:'Kwota zakupu nie może być pusta.',
                error_max:"Kwota zakupu nie może być dłuższa niż 25 znaków."
            },
            {
                key:'warranty_start_date',
                require_:false,
                validate_warranty_start_date:validate_warranty_start_date,
                warranty_start_date_error:"Data ma zły format"
            },
            {
                key:'warranty_end_date',
                require:false,
                validate_warranty_end_date: validate_warranty_end_date,
                warranty_end_date_error:"Data ma zły format"
             },
             {
                key:'comment',
                require_:false,
                min_length:1,
                max_length:25,
                error_min:`Komentarz nie może być pusty.`,
                error_max:"Komentarz nie może być dłuższy nić 25 znaków."
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
        ]
    }
    next()
}

export{update_item_config}