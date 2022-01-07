import express from 'express'
const  remove_event_file = express.Router()
import {remove_files_module} from '../../modules/remove_file_module/remove_files_module.js'
remove_event_file.post('/deleteFilesEvent',async(req,res)=>{
    try {
        const event_unique_id = res.locals.event_unique_id
        const config = res.locals.remove_item_config
        const body = req.body
        try {
            const message = await remove_files_module(event_unique_id,config,body)
            return res.json(message)
        } catch (error) {
            return res.json(error)
        }
    } catch (error) {
        return res.json({message:'Nie udało się usunąć pliku.'})
    }
}) 
export{remove_event_file}