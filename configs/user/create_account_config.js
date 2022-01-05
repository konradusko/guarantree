import {validate_email} from '../../validate/validate_email.js'
const create_account_config = (req,res,next)=>{
    res.locals.create_account = {
        free_slots:3,
        body_keys_allow_to_pass:['displayName','password','email','avatar',],
        body_keys_require_to_validate:[],
        add_photo_prefix:'UsersPhotos',
        collection_id:'Users',
        validate:[
           {
               key:'displayName',
               require_:true,
               min_length:4,
               max_length:25,
               error_require:'Nazwa użytkownika jest wymagana.',
               error_min:'Nazwa uzytkownika powinna zawierać co najmniej 4 znaki.',
               error_max:"Nazwa użytkownika nie powinna być dłuższa niż 25 znaków."
           },
           {
               key:'password',
               require_:false,
               min_length:6,
               max_length:25,
               error_require:'Hasło jest wymagane.',
               error_min:'Hasło powinno zawierać co najmniej 6 znaków.',
               error_max:'Hasło nie może być dłuższe niż 25 znaków.'
           },
           {
               key:'email',
               require_:true,
               validate_email:validate_email,
               error_require:'Adres e-mail jest wymagany',
               error_email:'Email jest niepoprawny.'
           },
           {
               key:'avatar',
               require_:true,
               error_require:'Avatar jest wymagany',
           }
        ]
    }
    next()
}
export{create_account_config}