import express from 'express'
import pkg from 'firebase-admin'
const {auth} = pkg
const update_user = express.Router()
import {validate_body_keys_with_return} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
update_user.post('/updateAccount',(req,res)=>{
    const uid = res.locals.uid.uid
    const config = res.locals.update_account_config
    const body = req.body
    const check_body = validate_body_keys_with_return({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass})
    if(!check_body)
    return res.json({message:'Body zawiera niedozwolone parametry.'})
    if(typeof check_body === 'string')
    return res.json({message:'Brak wartości do zmiany'})

    const validate = validate_body_data(body,config.validate)
    if(typeof validate === 'string')
    return res.json({message:validate})

    let to_update = {}
    check_body.forEach(el=>{
        to_update[el] = body[el]
    })

    auth().updateUser(uid,to_update).then((user)=>{
        return res.json({message:'Dane zostały zaktualizowane.' ,displayName:user.displayName,email:user.email})
    }).catch((error)=>{
        if("errorInfo"in error && "message"in error.errorInfo &&error.errorInfo.message === "The email address is already in use by another account.")
        return res.json({message:'Ten email jest już zajęty.'})
        return res.json({message:'Coś poszło nie tak, spróbuj ponownie.'})
    })


})
export{update_user}