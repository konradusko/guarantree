import {validate_email} from '../../validate/validate_email.js'
const update_account_config = (req,res,next)=>{
    res.locals.update_account_config = {
        body_keys_allow_to_pass:['e_mail','userName'],
        body_keys_require_to_validate:['token'],
        validate:[
            {
                key:'e_mail',
                require_:false,
                validate_email:validate_email,
                error_email:'Email jest niepoprawny.'
            },
            {
                key:'userName',
                require_:false,
                min_length:4,
                max_length:25,
                error_min:'Nazwa uzytkownika powinna zawierać co najmniej 4 znaki.',
                error_max:"Nazwa użytkownika nie powinna być dłuższa niż 25 znaków."
            },
        ]
    }
}
export{update_account_config}