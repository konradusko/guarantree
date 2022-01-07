

const remove_event_files_config = (req,res,next)=>{
    res.locals.remove_item_config = {
        body_keys_allow_to_pass:['file_id'],
        body_keys_require_to_validate:['token','public_id_item','public_id_event'],
        update_prefix:'Events',
        get_files_:{
            prefix:'Events',
            type:'files_length_'
        },  
        validate:[
            {
                key:'file_id',
                require_:true,
                error_require:'Id pliku jest wymagane.',
            },
        ]
    }
    next()
}
export{remove_event_files_config}