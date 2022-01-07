

const remove_event_config = (req,res,next)=>{
    res.locals.remove_event_config={
        body_keys_allow_to_pass:[],
        body_keys_require_to_validate:['token','public_id_event','public_id_item'],
        get_events:{
            collection_id:'Items',
            type:'events_length'
        },
        get_files:{
            collection_id:'Events',
            type:'files_length_'
        },
        prefix:"Events"
    }
    next()
}
export{remove_event_config}