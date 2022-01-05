import pkg from "firebase-admin"
const {firestore} = pkg

const get_information = (data)=>{
    return new Promise(async(res,rej)=>{
        const {
            collection_id,
            doc_id,
            type
        } = data
        const firebase_data = await firestore().collection(collection_id).doc(doc_id).get()
        if(firebase_data.exists){
            switch (type) {
                case 'user_avatar':
                    res({
                        avatar_id:firebase_data._fieldsProto.avatar.mapValue.fields.id.stringValue,
                        avatar_path:firebase_data._fieldsProto.avatar.mapValue.fields.path.stringValue,
                        avatar_type:firebase_data._fieldsProto.avatar.mapValue.fields.type.stringValue,
                        avatar_public:firebase_data._fieldsProto.avatar.mapValue.fields.public.booleanValue
                    })
                    break;
                    case 'get_user_slots':
                        res(firebase_data._fieldsProto.slots.integerValue)
                    break
                    case "user_items":
                        res({
                            items:firebase_data._fieldsProto.items.arrayValue.values
                        })
                    break;
                default:
                    rej()
                    break;
            }
        }else{
            rej()
        }
    })
}
export{get_information}