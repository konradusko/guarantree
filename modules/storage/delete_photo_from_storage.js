import pkg from 'firebase-admin'
const {storage} = pkg
const remove_file = (path)=>{
    return new Promise(async(res,rej)=>{
        if(path === undefined)
            return rej()
        if(!(typeof path === 'string'))
            return rej()
        storage().bucket().deleteFiles({
            prefix:path,
        }).then(()=>{
            res()
        })
        .catch((er)=>{
            res()
        })
    })
   
}
export{remove_file}