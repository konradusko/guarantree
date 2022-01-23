import express from 'express'
const get_profile_info = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {get_information} from '../../modules/get_info/get_information.js'
import {create_token_photo} from '../../modules/token/create_photo_acces_token.js'
get_profile_info.post('/getProfileData',(req,res)=>{
    try {
        const config = res.locals.get_only_using_token_config
        const _personal_config = res.locals.get_profile_config
        const public_avatars = res.locals.avatar_information.public_avatars
        const body = req.body
        const uid = res.locals.uid.uid
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
        return res.json({message:'Body zawiera niedozwolone parametry.',internal_error:true})

        //usera profilowe
        //ilosc slotow
        //ilość przedmiotów
        //avatary
        console.log(public_avatars)
        try {
            
        } catch (error) {
            return res.json({message:'Coś poszło nie tak, ponawiam próbe pobrania danych.',internal_error:true})
        }
    } catch (error) {
        return res.json({message:'Coś poszło nie tak, ponawiam próbe pobrania danych.',internal_error:true})
    }
})
export{get_profile_info}