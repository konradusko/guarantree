import { validate_base64 } from "../../validate/validate_file.js"
import { add_photo_to_storage } from "../storage/add_photo_to_storage.js"
import { makeId } from "../create_id/create_id.js"
const add_files = (...args) =>{
    //o pliki
    //1 validate info
    //2 config
    //3 uid - unikalne id przedmiotu
 
    return new Promise(async(res,rej)=>{
        const files = args[0],avatar_info = args[1],config = args[2],uid = args[3]
        let tmp_base_64,tmp_obj,tmp_array = new Array,array_to_return = new Array
        console.log(files.length)
        for(const e in files){
            try {
                tmp_base_64 = await validate_base64({
                    base64:files[e],
                    allow_format:avatar_info.allow_format,
                    size:avatar_info.max_size_of_file
                })
                tmp_obj = {
                    path:`${config.add_photo_prefix}/${uid}/${makeId(20)}${tmp_base_64.end_point}`,
                    id:makeId(20),
                    type:tmp_base_64.type,
                    blob:tmp_base_64.blob,
                    belong:config.belong
                }
                tmp_array.push(tmp_obj)
            } catch (error) {
            }
            
        }
        //dodaje do bazy danych
        for(const a in tmp_array){
            try {
            await add_photo_to_storage(tmp_array[a].blob,tmp_array[a].path,tmp_array[a].type)
            delete tmp_array[a]['blob']
            array_to_return.push(tmp_array[a])
            } catch (error) {}
        }
        res(array_to_return)
    })
}
export{add_files}