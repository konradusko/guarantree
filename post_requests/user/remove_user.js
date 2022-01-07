import express from 'express'
const  remove_user = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {get_information} from '../../modules/get_info/get_information.js'
import {remove_item_from_db} from '../../modules/add_update_delete_firebase/delete_data.js'
import { remove_file } from '../../modules/storage/delete_photo_from_storage.js'
import pkg from 'firebase-admin'
const {auth} = pkg
remove_user.post('/deleteAccount', async(req,res)=>{
    try {
        const body = req.body
        const config = res.locals.remove_user_config
        const uid = res.locals.uid.uid
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
        return res.json({message:'Body zawiera niedozwolone parametry.'})
        //pobrać wszystkie przedmioty
        //pobrać wszystkie eventy z danego przedmiotu
        try {
            var {items} = await get_information({
                collection_id:config.get_user_items.collection_id,
                doc_id:uid,
                type:config.get_user_items.type
            })
        } catch (error) {}
   
        //pobrać eventy 
        let tmp;
        let _events_to_remove = new Array
     
            for(const x in items){
                try {
                tmp = await get_information({
                    collection_id:config.get_events_items.collection_id,
                    doc_id:items[x].stringValue,
                    type:config.get_events_items.type
                })
                _events_to_remove = _events_to_remove.concat(tmp)
                 } catch (error) {        }
            }
       
       
        auth().deleteUser(uid).then(()=>{
            for(const i in items){
                try {
                    //usuwam wszystkie pliki
                    remove_file(`${config.prefix_remove_items}/${items[i].stringValue}`)
                } catch (error) {}
                try {
                    remove_item_from_db(config.prefix_remove_items,items[i].stringValue)
                } catch (error) {}
            }
            for(const x in _events_to_remove){
                try {
                    //usuwam wszystkie eventy
                    remove_item_from_db(config.prefix_remove_events,_events_to_remove[x].stringValue)
                } catch (error) {}
            }
            try {
                remove_item_from_db(config.prefix_remove_user,uid)
            } catch (error) {}
            return res.json({message:'Konto zostało usunięte.'})
        }).catch((er)=>{
            return res.json({message:'Nie udało się usunąć konta.'})
        })

    } catch (error) {
        console.log(error)
        return res.json({message:'Nie udało się usunąć konta.'})
    }
})
export{remove_user}