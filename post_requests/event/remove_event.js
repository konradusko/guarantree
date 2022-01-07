import express from 'express'
const  remove_event = express.Router()
import {get_information} from '../../modules/get_info/get_information.js'
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {remove_item_from_db} from '../../modules/add_update_delete_firebase/delete_data.js'
import {remove_not_added_files} from '../../modules/remove_files_not_added/remove_not_added_files.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'
remove_event.post('/deleteEvent',async(req,res)=>{
    try {
        const body = req.body
        const event_unique_id = res.locals.event_unique_id
        const item_unique_id = res.locals.item_unique_id
        const config = res.locals.remove_event_config
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
        return res.json({message:'Body zawiera niedozwolone parametry.'})
        //najpierw usunac z przedmiotu ten event
        const events =  await get_information({
            collection_id:config.get_events.collection_id,
            doc_id:item_unique_id,
            type:config.get_events.type
        })
        const files_to_delete = await get_information({
            collection_id:config.get_files.collection_id,
            doc_id:event_unique_id,
            type:config.get_files.type
        })
        const find_to_delete = events.find(e=>e.stringValue === event_unique_id)
        if(find_to_delete === undefined)
            return res.json({message:'Takie wydarzenie nie istnieje.'})
        const new_events =  events.filter(post => post.stringValue !== event_unique_id)
        let events_to_add = new Array
        for(const xee in new_events){
            events_to_add.push(new_events[xee].stringValue)
        }
        //zaktualizować o usunięty event
        try {
            await update_data({
                doc_id:item_unique_id,
                collection_id:config.get_events.collection_id,
                data_to_add:{events:events_to_add}
            })
            //usunąć pliki
            //usunąć z bazy danych
            remove_item_from_db(config.prefix,event_unique_id)
            let files_to_remove = new Array
            for(const t in files_to_delete){
                files_to_remove.push(files_to_delete[t].mapValue.fields.path.stringValue)
            }
            console.log(files_to_remove)
            remove_not_added_files(files_to_remove)
            return res.json({message:'Wydarzenie zostało usunięte.'})
        } catch (error) {
            console.log(error)
            return res.json({message:'Nie udalo się usunąć wydarzenia.'})
        }
      


    } catch (error) {
        console.log(error)
        return res.json({message:'Nie udało się usunąć wydarzenia.'})
    }
})
export{remove_event}