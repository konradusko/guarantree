import pkg from "firebase-admin"
const {firestore} = pkg
const add_data_to_firebase = (data)=>{
    return new Promise((res,rej)=>{
        const {
            doc_id,
            collection_id,
            data_to_add
        } = data
        firestore().collection(collection_id).doc(doc_id).set(data_to_add).then(()=>{
            res()
        }).catch((er)=>{
            rej()
        })
            
 
    })
}
export{add_data_to_firebase}