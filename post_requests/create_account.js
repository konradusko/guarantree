import express from 'express'
const create_account = express.Router()
import {validate_body_data} from '../validate/validate_body_data.js'
import {validate_body_keys} from '../validate/validate_body_keys.js'
create_account.post('/createAccount',(req,res)=>{

    const body = req.body;
    const config = res.locals.create_account;
    //sprawdzenie czy body nie zawiera dodatkowych niepotrzebnych danych
    if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
    return res.json({message:'Body zawiera niedozwolone parametry.'})

    //validacje danych jakie dostajemy bez avatara
    const validate = validate_body_data(body,config.validate)
    console.log(validate,'validate')
    if(typeof validate === 'string')
    return res.json({message:validate})
    
    //sprawdzam avatara
    let avatar;
    if(body.avatar === '1'||body.avatar === '2'||body.avatar === '3')
    avatar = Number(body.avatar)-1
    console.log(avatar)


})

export{create_account}