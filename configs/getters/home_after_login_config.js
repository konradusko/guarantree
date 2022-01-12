
const get_item_config = (req,res,next)=>{
    res.locals.get_item_config ={
        get_items:{
            collection_id:'Users',
            type:'get_items_and_avatar'
        }
    }
    next()
}
export{get_item_config}