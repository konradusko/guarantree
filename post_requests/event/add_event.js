import express from 'express'
const add_event = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {get_information} from '../../modules/get_info/get_information.js'
import { makeId ,generateGuid} from '../../modules/create_id/create_id.js'
import {add_files} from '../../modules/add_files_item_event/add_files.js'
import {add_data_to_firebase} from '../../modules/add_update_delete_firebase/add_data.js'
import {remove_not_added_files} from '../../modules/remove_files_not_added/remove_not_added_files.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'
import {create_token_photo} from '../../modules/token/create_photo_acces_token.js'
import {remove_item_from_db} from '../../modules/add_update_delete_firebase/delete_data.js'
add_event.post('/addEvent', async(req,res)=>{
    try {
        const uid = res.locals.uid.uid
        const item_unique_id = res.locals.item_unique_id
        const config = res.locals.add_event_config
        const files_config = res.locals.files_config
        const body = req.body

        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
            return res.json({message:'Body zawiera niedozwolone parametry.'})

     // Sprawdzam validacje danych
        const validate = validate_body_data(body,config.validate)
        if(typeof validate === 'string')
            return res.json({message:validate})
    
        //Pobrać i zobaczyć czy możemy dodać jeszcze event
        const event_from_firebase = await get_information({
            collection_id:config.get_events_from_item.collection_id,
            doc_id:item_unique_id,
            type:config.get_events_from_item.type
        })
        if(event_from_firebase.length >= config.events_limit)
            return res.json({message:`Nie można dodać wjęcej eventów, maksymalna ilość eventów to: ${config.events_limit}`})

        //dodanie zdjęć
        const public_id = generateGuid()
        const unique_event_id = `${generateGuid()}.${public_id}`


        let _files_to_add = new Array

        if('files' in body && body.files.length >0){
            try {
                _files_to_add = await add_files(body.files,files_config,config,item_unique_id)
            } catch (error) {
                return res.json({message:"Wystąpił błąd podczas dodawania przedmiotu."})
            }
        }
        const event_to_add = {
            files:_files_to_add,
            date_of_event:body.date_of_event,
            event_name:body.event_name,
            comment:'comment'in body?body.comment:'',
            owner:uid,
            public_id:public_id
        }
        try {
            //dodaje do bazy danych
            //teraz dodać do przedmiotu
            await add_data_to_firebase({
                doc_id:unique_event_id,
                collection_id:config.prefix_add_event,
                data_to_add:event_to_add
            })
            let new_Events = new Array
            new_Events.push(unique_event_id)
            for(const xd in event_from_firebase){
                new_Events.push(event_from_firebase[xd].stringValue)
            }
            try {
                await update_data( {
                    doc_id:item_unique_id,
                    collection_id:config.add_event_to_item_prefix,
                    data_to_add:{events:new_Events}})
             
                const to_response_event = {
                    date_of_event:event_to_add.date_of_event,
                    event_name:event_to_add.event_name,
                    event_public_id:event_to_add.public_id
                }
                let token_from_firebase;
                let tokens = new Array
        
                for(const xde in _files_to_add){
                    try {
                        token_from_firebase = await create_token_photo(_files_to_add[xde].path,config.tokens.photo)
                        tokens.push({
                            token:token_from_firebase[0],
                            id:_files_to_add[xde].id,
                            type:_files_to_add[xde].type,
                            belong:_files_to_add[xde].belong
                        })
                    } catch (error) {
                        tokens.push({
                            token:'',
                            id:_files_to_add[xde].id,
                            type:_files_to_add[xde].type,
                            belong:_files_to_add[xde].belong
                        })
                    }
                }
        
                return res.json({message:"Wydarzenie zostało dodane!",event:to_response_event,tokens})
            } catch (error) {
                console.log(error)
                remove_item_from_db(config.prefix_add_event,unique_event_id)
                let files_to_remove = new Array
                for(const t in _files_to_add){
                    files_to_remove.push(_files_to_add[t])
                }
                remove_not_added_files(files_to_remove)
                return res.json({message:'Nie udało się dodać wydarzenia3.'})
            }
           
        } catch (error) {
            let files_to_remove = new Array
            for(const t in _files_to_add){
                files_to_remove.push(_files_to_add[t])
            }
            remove_not_added_files(files_to_remove)
            return res.json({message:'Nie udało się dodać wydarzenia2.'})
        }
    } catch (error) {
        return res.json({message:'Nie udało się dodać wydarzenia1.'})
    }
})
export{add_event}