import express from 'express'
const  remove_item = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {get_information} from '../../modules/get_info/get_information.js'
import {remove_item_from_db} from '../../modules/add_update_delete_firebase/delete_data.js'
import { remove_file } from '../../modules/storage/delete_photo_from_storage.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'
remove_item.post('/deleteItem',async(req,res)=>{
    try {
        const item_unique_id = res.locals.item_unique_id
        const config = res.locals.remove_item_config
        const body = req.body
        const uid = res.locals.uid.uid
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
        return res.json({message:'Body zawiera niedozwolone parametry.'})

        //Najpierw usunąć od użytkownika
        //Przedmioty uzytkownika
        try {
            var {items} =  await get_information({
                collection_id:config.get_user_items.collection_id,
                doc_id:uid,
                type:config.get_user_items.type
            })
        } catch (error) {
            return res.json({message:'Nie udało się usunąć przedmiotu.'})
        }
        

        //Eventy
        try {
            var events = await get_information({
                collection_id:config.get_events.collection_id,
                doc_id:item_unique_id,
                type:config.get_events.type
            })
        } catch (error) {
        }
      

        const find_to_delete = items.find(e=>e.stringValue === item_unique_id)
        if(find_to_delete === undefined)
            return res.json({message:'Takie wydarzenie nie istnieje.'})

        const new_items =  items.filter(post => post.stringValue !== item_unique_id)
        let items_to_add = new Array
        for(const xee in new_items){
            items_to_add.push(new_items[xee].stringValue)
        }

        try {
            await update_data({
                doc_id:uid,
                collection_id:config.get_user_items.collection_id,
                data_to_add:{items:items_to_add}
            })
            //usuwam wszystkie eventy
            if( events.length !=0){
                for(const s in events){
                    try {
                         remove_item_from_db(config.prefix_remove_events,events[s].stringValue)
                    } catch (error) {}
                }
            }
          
            //usuwam przedmiot z bazy danych
            try {
              remove_item_from_db(config.prefix_remove_item,item_unique_id)
            } catch (error) {            }
            //usuwam wszystkie pliki
            try {
                 remove_file(`${config.prefix_remove_item}/${item_unique_id}`)
            } catch (error) {}
            return res.json({message:'Przedmiot został usunięty.'})
        } catch (error) {
            return res.json({message:'Nie udało się usunąć przedmiotu.'})
        }
    } catch (error) {
        return res.json({message:'Nie udało się usunąć przedmiotu.'})
    }
})
export{remove_item}