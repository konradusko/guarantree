
const delete_item_avatar_config = (req,res,next)=>{
    res.locals.delete_user_avatar_config = {
        body_keys_allow_to_pass:[],
        body_keys_require_to_validate:['token','public_id_item'],
        collection_id:"Items",
        get_user_info_type:'user_avatar',
        create_token_minutes:20
    }
    next()
}
export{delete_item_avatar_config}