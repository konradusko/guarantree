import express from 'express'
const create_account = express.Router()
import {validate_body_data} from '../../validate/validate_body_data.js'
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {validate_base64} from '../../validate/validate_file.js'
import {add_photo_to_storage} from '../../modules/storage/add_photo_to_storage.js'
import { makeId ,generateGuid} from '../../modules/create_id/create_id.js'
import { add_data_to_firebase } from '../../modules/add_update_delete_firebase/add_data.js'
import { remove_file } from '../../modules/storage/delete_photo_from_storage.js'
import pkg from 'firebase-admin'
const {auth} = pkg
create_account.post('/createAccount',async(req,res)=>{

    const body = req.body;
    const config = res.locals.create_account;
    const avatar_info = res.locals.avatar_information
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
    if(Number(body.avatar) >=0 &&Number(body.avatar) <avatar_info.public_avatars.length){
        avatar = avatar_info.public_avatars[Number(body.avatar)] 
        custom= true
    }else{
        try {
            avatar = await validate_base64({
                base64:body.avatar,
                allow_format:avatar_info.allow_format,
                size:avatar_info.max_size_of_file
            })
            custom = false;
        } catch (info) {
            return res.json({message:info})
        }
    }
        //Tworzenie uzytkownika
        auth().createUser({
            email:body.email,
            password:body.password,
            displayName:body.displayName
        }).then(async (user)=>{
            if(!custom){
               const tmp_avatar = {
                    path:`${config.add_photo_prefix}/${user.uid}/${makeId(20)}${avatar.end_point}`,
                    type:avatar.type,
                    blob:avatar.blob
                }
                //dodajemy zdjęcie
                try {
                    await add_photo_to_storage(tmp_avatar.blob,tmp_avatar.path,tmp_avatar.type)
                    avatar = {
                        path:tmp_avatar.path,
                        id:makeId(20),
                        public:false,
                        type:tmp_avatar.type
                    }
                } catch (error) {
                    //nie dodalo zdjecia to damy mu publiczne niech sie cieszy
                    avatar = avatar_info.custom_avatar
                }
            }
                //dodajemy uzytkownika do bazy danych
                try {
                    const to_add = {
                        slots:config.free_slots,
                        items:[],
                        avatar:avatar,
                        id:generateGuid()

                    }
                    await add_data_to_firebase({
                        doc_id:user.uid,
                        collection_id:'Users',
                        data_to_add:to_add
                    })
                    res.json({message:"Konto zostało utworzone!"})
                } catch (error) {
                    //usuwam avatara
                    if( avatar.public == false)
                    try {
                    await remove_file(avatar.path)} catch (error) {}
                    //Zrobic funkcje w tle która bedzie co chwile usuwała
                    auth().deleteUser(user.uid).then((result)=>{
                        return res.json({message:'Utworzenie konto nie powiodło się.'})
                    })
                    .catch((er)=>{
                        return res.json({message:'Utworzenie konto nie powiodło się.'})
                    })
                }

        }).catch((error)=>{
            if("errorInfo"in error && "message"in error.errorInfo &&error.errorInfo.message === "The email address is already in use by another account.")
                return res.json({message:"Ten adres e-mail jest już zajęty."})
                 return res.json({message:'Utworzenie konto nie powiodło się.'})
        })




})

export{create_account}