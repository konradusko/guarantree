import pkg from 'firebase-admin'
const {storage} = pkg
const add_photo_to_storage = (blob,path,type)=>{
    return new Promise(async(res,rej)=>{
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const my_photo = storage().bucket()
            const my_file = my_photo.file(path)
            const my_stream = my_file.createWriteStream( {metadata: { contentType: type}})
            my_stream.write(buffer)
            my_stream.end()
            my_stream.on('error',()=>{
               return rej()
            })
            my_stream.on('finish',()=>{
               return res()
            })
        } catch (error) {
            rej(error)
        }
      
    })
}
export{add_photo_to_storage}