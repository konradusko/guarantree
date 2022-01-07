import { remove_file } from "../storage/delete_photo_from_storage.js"

const remove_not_added_files = async(args)=>{
    const local_ = [...args]
    for(const e in local_){
        try {
            await remove_file(local_[e].path)
        } catch (error) {
        }
    }
}

export{remove_not_added_files}