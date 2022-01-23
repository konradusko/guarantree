

const get_profile_data_config = (req,res,next)=>{
    res.locals.get_profile_config = {
        get_user_data:{
            collection_id:'Users',
            type:'requireProfile'
        },
        tokens:{
            avatar:30,
        }
    }
    next()
}
export{get_profile_data_config}