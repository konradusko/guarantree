import express from 'express'
const add_new_avatar = express.Router()
import {validate_body_keys_with_return} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {add_new_avatar_module} from '../../modules/add_new_avatar/add_new_avatar_module.js'
add_new_avatar.post('/addNewUserAvatar',async(req,res)=>{
    try {
        const uid = res.locals.uid.uid
    const body = req.body;
    const config = res.locals.update_avatar;
    const avatar_info = res.locals.avatar_information

    const check_body = validate_body_keys_with_return({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass})
    if(!check_body)
    return res.json({message:'Body zawiera niedozwolone parametry.'})
    if(typeof check_body === 'string')
    return res.json({message:check_body})

    
     //validacje danych jakie dostajemy bez avatara
    const validate = validate_body_data(body,config.validate)
    if(typeof validate === 'string')
    return res.json({message:validate})
    //sprawdzanie avatara

    try {
        const response = await add_new_avatar_module({
            config,
            avatar_info,
            body,
            uid
        })
        console.log(response)
        return res.json(response)
    } catch (error) {
        return res.json(error)
    }
    } catch (error) {
        return res.json({message:'Nie udało się dodać avataru.'})
    }
    
   
})
export{add_new_avatar}