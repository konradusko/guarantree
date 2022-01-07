
const remove_user_config = (req,res,next)=>{
    res.locals.remove_user_config = {
        body_keys_allow_to_pass:[],
        body_keys_require_to_validate:['token'],
        get_user_items:{
            collection_id:'Users',
            type:'user_items'
        },
        get_events_items:{
            collection_id:'Items',
            type:'events_length'
        },
        prefix_remove_items:'Items',
        prefix_remove_events:'Events',
        prefix_remove_user:'Users'
    }
    next()
}
export{remove_user_config}