

const post_routers_config_profile = (req,res,next)=>{
    res.locals.post_config ={
        body_keys_allow_to_pass:[],
        body_keys_require_to_validate:['token'],
        need_validation:true,
        page:'/after_auth/profile.ejs',
        javaScript:"./mains/main_profile_after_auth.js"
    }
    next()
}
export{post_routers_config_profile}