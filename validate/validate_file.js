import fetch from "node-fetch"
import {types_of_files} from '../configs/types_of_files.js'
const validate_base64 = (data)=>{
    return new Promise((res,rej)=>{
     const  {
        base64,
        allow_format,
        size
        } = data;
        fetch(base64)
            .then(res=>res.blob())
            .then(async(blob)=>{
                if(blob.size>size)
                    rej('Plik jest za duży.')

             const arr = (new Uint8Array(await blob.arrayBuffer())).subarray(0, 4);
             let header = ""
             for(let i =0; i<arr.length;i++){
                 header += arr[i].toString(16);
             }

             const format = types_of_files(header)
             if(allow_format.find(e=>e === format.type) === undefined)
                rej('Plik ma zły format.')
                res({
                    blob:blob,
                    end_point:format.end_point,
                    type:format.type
                })
            })
            .catch((er)=>{
                rej("Nie udało się wczytać pliku, prawdopodobnie jest on uszkodzony.")
            })
    })
}
export{validate_base64}