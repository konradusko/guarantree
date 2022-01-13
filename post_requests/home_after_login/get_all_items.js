import express from 'express'
const get_items_home_page = express.Router()
import {validate_body_keys} from '../../validate/validate_body_keys.js'
import {get_information} from '../../modules/get_info/get_information.js'
import {create_token_photo} from '../../modules/token/create_photo_acces_token.js'
get_items_home_page.post('/gethome',async(req,res)=>{
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
            let items_from_db = new Array
            for(const x in items){
                try {
                    const front = await get_information({
                        collection_id:_personal_config.get_directly_items.collection_id,
                        doc_id:items[x].stringValue,
                        type:_personal_config.get_directly_items.type
                    })
                    try {
                        front.avatar.avatar_path = (await create_token_photo(front.avatar.avatar_path,_personal_config.tokens.avatar_item))[0]
                    } catch (error) {
                        front.avatar.avatar_path = ''
                    }
                    items_from_db.push(front)
                } catch (error) {
                    
                }
            }
            try {
                avatar.avatar_path = (await create_token_photo(avatar.avatar_path,_personal_config.tokens.avatar_user))[0]
            } catch (error) {
                avatar.avatar_path = ''
            }
            return res.json({message:'Dane zostały pobrane',user_avatar:avatar,items:items_from_db})
            //stworzyc token i pobrać przedmioty
        } catch (error) {
            return res.json({message:'Nie udało się pobrać przedmiotów, spróbuj ponownie.'})
        }
     
    } catch (error) {
        return res.json({message:'Nie udało się pobrać przedmiotów, spróbuj ponownie.'})   
    }
})
export{get_items_home_page}