
const get_only_using_token_config = (req,res,next)=>{
    res.locals.get_only_using_token_config = {
        body_keys_allow_to_pass:[],
        body_keys_require_to_validate:['token']
    }
    next()
}
export{get_only_using_token_config}