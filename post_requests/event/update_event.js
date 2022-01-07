import express from 'express'
const update_event = express.Router()
import {validate_body_keys_with_return} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'

update_event.post('/updateEvent',async(req,res)=>{
    try {
        const event_unique_id = res.locals.event_unique_id
        const body = req.body
        const config = res.locals.update_event_config

            //sprawdzic dane
        const check_body = validate_body_keys_with_return({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass})
        if(!check_body)
            return res.json({message:'Body zawiera niedozwolone parametry.'})
        if(typeof check_body === 'string')
            return res.json({message:check_body})

        const validate = validate_body_data(body,config.validate)
        if(typeof validate === 'string')
            return res.json({message:validate})
        
            let _to_update = new Object
            for(const x in check_body){
                    _to_update[check_body[x]] = body[check_body[x]]
            }
            try {
                await update_data({
                    doc_id:event_unique_id,
                    collection_id:config.event_prefix,
                    data_to_add:_to_update
                })
                return res.json({message:'Przedmiot został zaktualizowany.'})
            } catch (error) {
                return res.json({message:'Nie udało się zaktualizować przedmiotu.'})
            }
    } catch (error) {
        return res.json({message:'Nie udało się zaktualizować wydarzenia.'})
    }
})
export{update_event}