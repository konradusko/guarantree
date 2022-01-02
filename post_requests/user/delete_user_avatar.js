import express from 'express'
const delete_user_avatar = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {delete_avatar} from '../../modules/delete_avatar/delete_avatar.js'
delete_user_avatar.post('/deleteUserAvatar',async(req,res)=>{
    const config = res.locals.delete_user_avatar_config
    const body = req.body
    const uid = res.locals.uid.uid
    const avatar_info = res.locals.avatar_information

    if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
    return res.json({message:'Body zawiera niedozwolone parametry.'})
    try {
         const message =  await delete_avatar(config,uid,avatar_info)
        return res.json({message:message})
    } catch (error) {
        return res.json({message:error})
    }

})
export{delete_user_avatar}