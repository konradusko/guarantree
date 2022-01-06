import express from 'express'
const update_item = express.Router()
import {validate_body_keys_with_return} from '../../validate/validate_body_keys.js'
import {validate_body_data} from '../../validate/validate_body_data.js'
import {update_data} from '../../modules/add_update_delete_firebase/update_data.js'
update_item.post('/updateItem',async(req,res)=>{

    const item_unique_id = res.locals.item_unique_id
    const config = res.locals.update_item_config
    const body = req.body

    //sprawdzic dane
    const check_body = validate_body_keys_with_return({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass})
    if(!check_body)
        return res.json({message:'Body zawiera niedozwolone parametry.'})
    if(typeof check_body === 'string')
        return res.json({message:check_body})

    console.log(check_body)
    const validate = validate_body_data(body,config.validate)
    if(typeof validate === 'string')
        return res.json({message:validate})

    let _to_update = new Object
    for(const x in check_body){
        if(check_body[x] === 'warranty_end_date'){
            _to_update[check_body[x]] =body[check_body[x]].includes('/')?
                {
                    value:body[check_body[x]],
                    type:'time'}:
                {  
                    value:body[check_body[x]],
                    type:'end_date'
                } 
        }else{
            _to_update[check_body[x]] = body[check_body[x]]
        }
    }
    try {
        await update_data({
            doc_id:item_unique_id,
            collection_id:config.item_prefix,
            data_to_add:_to_update//publiczny avatar
        })
        return res.json({message:'Przedmiot został zaktualizowany.'})
    } catch (error) {
        return res.json({message:'Nie udało się zaktualizować przedmiotu.'})
    }
})

export{update_item}