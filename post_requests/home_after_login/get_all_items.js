import express from 'express'
const get_items_home_page = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {get_information} from '../../modules/get_info/get_information.js'
get_items_home_page.post('/gethome',async(req,res)=>{
    console.log('xddd')
    try {
        const config = res.locals.get_only_using_token_config
        const _personal_config = res.locals.get_item_config
        const body = req.body
        const uid = res.locals.uid.uid
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
        return res.json({message:'Body zawiera niedozwolone parametry.'})

        //Pobrać wszystkie id przedmiotów
        //Pobrać wszystkie przedmioty
        try {
            const {avatar,items} = await get_information({
                collection_id:_personal_config.get_items.collection_id,
                doc_id:uid,
                type:_personal_config.get_items.type
            })
            console.log(avatar,items)
            //stworzyc token i pobrać przedmioty
        } catch (error) {
            console.log(error)
            return res.json({message:'Nie udało się pobrać przedmiotów, spróbuj ponownie.'})
        }
     
    } catch (error) {
        console.log(error)
        return res.json({message:'Nie udało się pobrać przedmiotów, spróbuj ponownie.'})   
    }
})
export{get_items_home_page}