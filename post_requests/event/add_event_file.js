import express from 'express'
const add_event_files = express.Router()
import {add_file_modules} from '../../modules/add_files_item_event/add_files_MODULE.js'
add_event_files.post('/addFilesEvent', async(req,res)=>{
    try {
        const item_unique_id = res.locals.item_unique_id
        const event_unique_id = res.locals.event_unique_id
        const config = res.locals.add_new_file_event_config
        const files_info = res.locals.files_config
        const body = req.body
        const length_from_user = body.files.length
        
        try {
            const response = await add_file_modules(item_unique_id,config,files_info,body,length_from_user,event_unique_id)
            return res.json(response)
        } catch (error) {
            return res.json(error)
        }

    } catch (error) {
        return res.json({message:'Nie udało się dodać plików.'})
    }
})
export{add_event_files}