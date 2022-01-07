

const remove_item_config = (req,res,next)=>{
    res.locals.remove_item_config = {
        body_keys_allow_to_pass:[],
        body_keys_require_to_validate:['token','public_id_item'],
        get_user_items:{
            collection_id:'Users',
            type:'user_items'
        },
        get_events:{
            collection_id:'Items',
            type:'events_length'
        },
        get_events_file:{
            collection_id:'Events',
            type:'files_length_'
        },
        prefix_remove_events:"Events",
        prefix_remove_item:'Items'
    }
    next()
}
export{remove_item_config}