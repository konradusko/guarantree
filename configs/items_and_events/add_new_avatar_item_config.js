
const add_new_avatar_item_config = (req,res,next)=>{
    res.locals.update_avatar={
        body_keys_allow_to_pass:['avatar'],
        body_keys_require_to_validate:['token','public_id_item'],
        collection_id:"Items",
        get_user_info_type:'user_avatar',
        add_photo_prefix:'Items',
        create_token_minutes:20,
        validate:[
            {
                key:'avatar',
                require_:true,
                error_require:'Avatar jest wymagany',
            }
        ]
    }

    next()
}
export{add_new_avatar_item_config}