import express from 'express'
const create_account = express.Router()
import {validate_body_data} from '../validate/validate_body_data.js'
import {validate_body_keys} from '../validate/validate_body_keys.js'
import {validate_base64} from '../validate/validate_file.js'
import {add_photo_to_storage} from '../modules/add_photo_do_storage/add_photo_to_storage.js'
import pkg from 'firebase-admin'
const {auth} = pkg
create_account.post('/createAccount',async(req,res)=>{

    const body = req.body;
    const config = res.locals.create_account;
    let custom //informuje o tym czy jest publiczny avatar czy nie
    //sprawdzenie czy body nie zawiera dodatkowych niepotrzebnych danych
    if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
    return res.json({message:'Body zawiera niedozwolone parametry.'})

    //validacje danych jakie dostajemy bez avatara
    const validate = validate_body_data(body,config.validate)
    if(typeof validate === 'string')
    return res.json({message:validate})
    
    //sprawdzam avatara
    let avatar;
    if(body.avatar === '1'||body.avatar === '2'||body.avatar === '3'){
        avatar = res.locals.create_account.avatar_information.public_avatars[Number(body.avatar)-1] 
        custom= true
    }else{
        try {
            avatar = await validate_base64({
                base64:body.avatar,
                allow_format:config.avatar_information.allow_format,
                size:config.avatar_information.max_size_of_file
            })
            custom = false;
        } catch (info) {
            return res.json({message:info})
        }
    }

    try {
       //Tworzenie uzytkownika

        const user =  await auth().createUser({
            email:body.email,
            password:body.password,
            displayName:body.name
        })
        console.log(user.uid)
        //dodaje zdj do bazy danych
        if(!custom){
            avatar = {
                path:`UsersPhotos/${user.uid}/avatar${avatar.end_point}`,
                type:avatar.type,
                blob:avatar.blob
            }
            console.log(avatar)
            //dodajemy zdjęcie
            try {
                
            } catch (error) {
                
            }
        }
    } catch (info) {
        console.log(info)
        return res.json({message:info})
    }



})

export{create_account}