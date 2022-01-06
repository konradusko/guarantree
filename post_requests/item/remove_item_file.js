import express from 'express'
const  remove_item_file = express.Router()
import {remove_files_module} from '../../modules/remove_file_module/remove_files_module.js'
remove_item_file.post('/removeItemFile',async(req,res)=>{
    try {
        const item_unique_id = res.locals.item_unique_id
        const config = res.locals.remove_item_config
        const body = req.body
        try {
            const message = await remove_files_module(item_unique_id,config,body)
            return res.json(message)
        } catch (error) {
            return res.json(error)
        }
    } catch (error) {
        return res.json({message:'Nie udało się usunąć pliku.'})
    }
}) 
export{remove_item_file}