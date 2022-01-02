

const files_config_item = (req,res,next)=>{
    res.locals.files_config = {
        allow_format:["image/png","image/jpg","application/pdf"],
        max_size_of_file:2100000,
        max_file_in_request:2
    }
    next()
}
export{files_config_item}