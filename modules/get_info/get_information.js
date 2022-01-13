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
                    case 'item_owner':
                        res({
                            owner_id:firebase_data._fieldsProto.owner.stringValue
                        })
                    break;
                    case 'files_length_':
                        res(firebase_data._fieldsProto.files.arrayValue.values)
                    break;
                    case 'events_length':
                        res(firebase_data._fieldsProto.events.arrayValue.values)
                    break;
                    case 'get_items_and_avatar':
                        res({avatar:{
                            avatar_id:firebase_data._fieldsProto.avatar.mapValue.fields.id.stringValue,
                            avatar_path:firebase_data._fieldsProto.avatar.mapValue.fields.path.stringValue,
                            avatar_type:firebase_data._fieldsProto.avatar.mapValue.fields.type.stringValue,
                            avatar_public:firebase_data._fieldsProto.avatar.mapValue.fields.public.booleanValue
                        },items:firebase_data._fieldsProto.items.arrayValue.values})
                    break;
                    case 'item_home_front':
                        res({avatar:{
                            avatar_id:firebase_data._fieldsProto.avatar.mapValue.fields.id.stringValue,
                            avatar_path:firebase_data._fieldsProto.avatar.mapValue.fields.path.stringValue,
                            avatar_type:firebase_data._fieldsProto.avatar.mapValue.fields.type.stringValue,
                            avatar_public:firebase_data._fieldsProto.avatar.mapValue.fields.public.booleanValue
                            },
                            warranty_end_date:{
                                value:firebase_data._fieldsProto.warranty_end_date.mapValue.fields.value.stringValue,
                                type:firebase_data._fieldsProto.warranty_end_date.mapValue.fields.type.stringValue
                            },
                            warranty_start_date: firebase_data._fieldsProto.warranty_start_date.stringValue   
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