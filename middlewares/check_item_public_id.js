import { get_information } from "../modules/get_info/get_information.js"

const check_item_public_id = async(req,res,next)=>{
        if(!('public_id_item' in req.body))
            return res.json({message:'Publiczne id przedmiotu jest niezbędne do tej operacji.'})

        const uid = res.locals.uid.uid
        //pobrać wszystkie id przedmiotów uzywkownika
        //jeśli znajdzie, to pobrać ownera tego przedmiotu i sprawdzić
        try {
            const {items} = await get_information({
                collection_id:"Users",
                doc_id:uid,
                type:"user_items"
            }) 
            if(items.length ===0)
                return res.json({message:"Nie masz dostępu do tego przedmiotu."})
            const find_public_id = items.find(e=> e.stringValue.split('.')[1] === req.body.public_id_item)
            
            if(find_public_id === undefined)
                return res.json({message:'Nie masz dostępu do tego przedmiotu.'})
            
            //teraz sprawdzam własciciela przedmiotu
            const {owner_id} = await get_information({
                collection_id:"Items",
                doc_id:find_public_id.stringValue,
                type:"item_owner"
            }) 
            if(owner_id!=uid)
                return res.json({message:'Nie masz dostępu do tego przedmiotu.'})
            res.locals.item_unique_id = find_public_id.stringValue
            next()
        } catch (error) {
            return res.json({message:"Wystąpił błąd, spróbuj ponownie za chwile."})
        }
        

}
export{check_item_public_id}