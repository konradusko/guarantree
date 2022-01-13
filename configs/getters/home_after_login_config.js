
const get_item_config = (req,res,next)=>{
    res.locals.get_item_config ={
        get_items:{
            collection_id:'Users',
            type:'get_items_and_avatar'
        },
        get_directly_items:{
            collection_id:'Items',
            type:'item_home_front'
        },
        tokens:{
            avatar_item:30,
            avatar_user:30
        }
    }
    next()
}
export{get_item_config}