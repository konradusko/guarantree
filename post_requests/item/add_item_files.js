import express from 'express'
const add_item_files = express.Router()
import {add_file_modules} from '../../modules/add_files_item_event/add_files_MODULE.js'
add_item_files.post('/addNewFileItem', async(req,res)=>{
    try {
        const item_unique_id = res.locals.item_unique_id
        const config = res.locals.add_new_file_item_config
        const files_info = res.locals.files_config
        const body = req.body
        const length_from_user = body.files.length
        
        try {
            const response = await add_file_modules(item_unique_id,config,files_info,body,length_from_user)
            return res.json(response)
        } catch (error) {
            return res.json(error)
        }

    } catch (error) {
        return res.json({message:'Nie udało się dodać plików.'})
    }
})
export{add_item_files}