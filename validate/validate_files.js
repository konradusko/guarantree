const validate_files = (files)=>{
    if(!Array.isArray(files))
    return true
    for(const x in files){
        if(typeof files[x] != 'string')
        return true
    }

    return false
}
export{validate_files}