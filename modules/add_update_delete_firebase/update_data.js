import pkg from "firebase-admin"
const {firestore} = pkg

const update_data = (data)=>{
    return new Promise((res,rej)=>{
 
        const {
            doc_id,
            collection_id,
            data_to_add
        } = data
        firestore().collection(collection_id).doc(doc_id).update(data_to_add).then(()=>{
            res()
        }).catch((er)=>{
            rej()
        })
            
    })
}
export{update_data}