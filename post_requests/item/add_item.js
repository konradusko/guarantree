import express from 'express'
const add_new_item = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {add_photo_to_storage} from '../../modules/storage/add_photo_to_storage.js'
import {validate_base64} from '../../validate/validate_file.js'
import {add_files} from '../../modules/add_files_item_event/add_files.js'
import { makeId ,generateGuid} from '../../modules/create_id/create_id.js'
import {get_information} from '../../modules/get_info/get_information.js'
import {add_data_to_firebase} from '../../modules/add_update_delete_firebase/add_data.js'
import {remove_not_added_files} from '../../modules/remove_files_not_added/remove_not_added_files.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'
import {remove_item_from_db} from '../../modules/add_update_delete_firebase/delete_data.js'
import {create_token_photo} from '../../modules/token/create_photo_acces_token.js'
add_new_item.post('/addItem',async(req,res)=>{
    try {
        const uid = res.locals.uid.uid
        const config = res.locals.add_item_config
        const avatar_info = res.locals.avatar_information_item
        const files_config = res.locals.files_config
        const body = req.body;
        let files_to_remove = new Array
        let tokens = {avatar:'',files:[]}
        let slots;
        let token_from_firebase;
        //Sprawdzam czy nie ma nie potrzebnych rzeczy w body
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
        return res.json({message:'Body zawiera niedozwolone parametry.'})
    
        // Sprawdzam validacje danych
        const validate = validate_body_data(body,config.validate)
        if(typeof validate === 'string')
        return res.json({message:validate})
      
        //sprawdzić czy użytkownik ma sloty
        try {
           slots = await get_information({
                collection_id:config.get_slots.collection_id,
                doc_id:uid,
                type:config.get_slots.type
            })
            if(Math.sign(slots) === 0 || Math.sign(slots) === -1)
            return res.json({message:"Nie masz wystarczającej ilości slotów."})
        } catch (error) {
            return res.json({message:'Wystąpił błąd podczas dodawania przedmiotu.'})
        }
        const public_id = generateGuid()
        const unique_item_id = `${generateGuid()}.${public_id}`
        
        let _files_to_add = new Array
        //sprawdzam avatara
        let custom
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
        //jeśli jest nie customowy avatar to dodaje do bazy danych
        if(!custom){
            const tmp_avatar = {
                path:`${config.add_photo_prefix}/${unique_item_id}/${makeId(20)}${avatar.end_point}`,
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
        //Dodaje pliki do bazy danych
        if('files' in body && body.files.length >0){
            try {
                _files_to_add = await add_files(body.files,files_config,config,unique_item_id)
            } catch (error) {
                return res.json({message:"Wystąpił błąd podczas dodawania przedmiotu."})
            }
        }
    
        //dodanie przedmiotu do bazy danych
        //dodac do bazy danych
        //dodac uzytkownikowy
        //zrobić validacje 
    
        //wybranie typu daty zakonczenia
        const item_to_add = {
            avatar:avatar,
            files:_files_to_add,
            warranty_end_date:body.warranty_end_date.includes('/')?{
                value:body.warranty_end_date,
                type:'time'}:
                {  
                    value:body.warranty_end_date,
                    type:'end_date'
                },
            warranty_start_date:body.warranty_start_date,
            item_name:body.item_name,
            brand:body.brand,
            model:body.model,
            purchase_amount:body.purchase_amount,
            serial_number:'serial_number'in body?body.serial_number:'',
            seller_name:'seller_name' in body?body.seller_name:'',
            seller_adress:'seller_adress' in body?body.seller_adress:'',
            seller_email:'seller_email' in body ? body.seller_email:'',
            phone_number_seller:'phone_number_seller' in body?body.phone_number_seller:'',
            comment:'comment'in body?body.comment:'',
            events:[],
            owner:uid,
            public_id_item:public_id
        }
        try {
            //dodaje item do bazy danych
            await add_data_to_firebase({
                doc_id:unique_item_id,
                collection_id:config.add_photo_prefix,
                data_to_add:item_to_add
            })
            try {
                const {items} = await get_information({
                    collection_id:config.add_item_to_user.collection_id,
                    doc_id:uid,
                    type:config.add_item_to_user.type
                }) 
                let new_items = new Array
                new_items.push(unique_item_id)
                for(const h in items){
                    new_items.push(items[h].stringValue)
                }
                slots -= 1
                await update_data( {
                    doc_id:uid,
                    collection_id:config.add_item_to_user.collection_id,
                    data_to_add:{slots,items:new_items}})
                //pobrać tokeny i odesłać
                
                
                try {
                    token_from_firebase = await create_token_photo(avatar.path,config.tokens.avatar)
                    tokens.avatar=token_from_firebase[0]
                } catch (error) {}
                
                for(const xd in _files_to_add){
                    try {
                        token_from_firebase = await create_token_photo(_files_to_add[xd].path,config.tokens.photo)
                        tokens.files.push({
                            token:token_from_firebase[0],
                            id:_files_to_add[xd].id,
                            type:_files_to_add[xd].type,
                            belong:_files_to_add[xd].belong
                        })
                    } catch (error) {
                        tokens.files.push({
                            token:'',
                            id:_files_to_add[xd].id,
                            type:_files_to_add[xd].type,
                            belong:_files_to_add[xd].belong
                        })
                    }
                }
                const to_response_item={
                    warranty_end_date:item_to_add.warranty_end_date,
                    warranty_start_date:item_to_add.warranty_start_date,
                    item_name:item_to_add.item_name,
                    brand:item_to_add.brand,
                    model:item_to_add.model,
                    purchase_amount:item_to_add.purchase_amount,
                    serial_number:item_to_add.serial_number,
                    seller_name:item_to_add.seller_name,
                    seller_adress:item_to_add.seller_adress,
                    seller_email:item_to_add.seller_email,
                    phone_number_seller:item_to_add.phone_number_seller,
                    comment:item_to_add.comment,
                    public_id_item:item_to_add.public_id_item,
                    number_of_files:_files_to_add.length

                }
                return res.json({message:'Przedmiot został utworzony',item:to_response_item,tokens:tokens})

            } catch (error) {
                if(!avatar.public){
                    files_to_remove.push(avatar)
                }
                for(const t in _files_to_add){
                    files_to_remove.push(_files_to_add[t])
                }

                remove_not_added_files(files_to_remove)
                try {
                    remove_item_from_db(config.add_photo_prefix,unique_item_id)
                } catch (error) {}
                return res.json({message:'Nie udało się dodać przedmiotu.'})
            }
        } catch (error) {
            //usuwamy tego czego nie dodało
            //avatar
            if(!avatar.public){
                files_to_remove.push(avatar)
            }
            for(const t in _files_to_add){
                files_to_remove.push(_files_to_add[t])
            }
            remove_not_added_files(files_to_remove)
            return res.json({message:'Nie udało się dodać przedmiotu.'})
        }
    } catch (error) {
        return res.json({message:'Nie udało się dodać przedmiotu.'})
    }
   
})
export{add_new_item}