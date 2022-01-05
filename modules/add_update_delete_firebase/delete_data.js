import pkg from "firebase-admin"
const {firestore} = pkg
const remove_item_from_db = (...data)=>{
    return new Promise((res,rej)=>{
        //0 collection
        //1 doc
        const collection = data[0],doc = data[1]

            const dbRef =  firestore().collection(collection);
            dbRef.doc(doc).delete().then(()=>{
                res()
            })
            .catch((er)=>{
                rej(er)
            })

    })
}
export{remove_item_from_db}