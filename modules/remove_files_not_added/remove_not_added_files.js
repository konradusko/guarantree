import { remove_file } from "../storage/delete_photo_from_storage.js"

const remove_not_added_files = async(args)=>{
    for(const e in args){
        try {
            await remove_file(args[e].path)
        } catch (error) {
        }
    }
}

export{remove_not_added_files}