import { get_information } from "../modules/get_info/get_information.js"

const check_event_public_id = async(req,res,next)=>{
    
    if(!('public_id_event' in req.body))
        return res.json({message:'Publiczne id wydarzenia jest niezbędne do tej operacji.'})

    const unique_id_item = res.locals.item_unique_id
    const uid = res.locals.uid.uid
    try {
        const events = await get_information({
            collection_id:"Items",
            doc_id:unique_id_item,
            type:"events_length"
        }) 
        if(events.length ===0)
            return res.json({message:'Nie masz dostępu do tego wydarzenia.'})

        const find_public_id = events.find(e=> e.stringValue.split('.')[1] === req.body.public_id_event)
        if(find_public_id === undefined)
            return res.json({message:'Nie masz dostępu do tego wydarzenia.'})

        //teraz sprawdzam własciciela wydarzenia
        const {owner_id} = await get_information({
            collection_id:"Events",
            doc_id:find_public_id.stringValue,
            type:"item_owner"
        }) 
        if(owner_id!=uid)
            return res.json({message:'Nie masz dostępu do tego wydarzenia.'})
        res.locals.event_unique_id = find_public_id.stringValue
            next()
    } catch (error) {
        return res.json({message:'Wystąpił błąd spróbuj ponownie za chwile.'})
    }
    
}
export{check_event_public_id}