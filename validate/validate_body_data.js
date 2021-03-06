const validate_body_data = (body,i_v)=>{
    for(let i =0; i<i_v.length;i++){
        //sprawdzam czy jest wymagany i czy istnieje
        if(i_v[i].require_ && body[i_v[i].key] === undefined)
            return i_v[i].error_require
        //jesli nie jest wymagany ale jest body to sprawdzic trzeba
        if(body[i_v[i].key] != undefined){
            if('min_length' in i_v[i] && body[i_v[i].key].length < i_v[i].min_length)
                return i_v[i].error_min
            if('max_length' in i_v[i] && body[i_v[i].key].length > i_v[i].max_length)
                return i_v[i].error_max
            if('validate_email' in i_v[i] && !(i_v[i].validate_email(body[i_v[i].key])))
                return i_v[i].error_email
            if('max_files' in i_v[i] && Array.isArray(body[i_v[i].key]) && body[i_v[i].key].length > i_v[i].max_files)
                return i_v[i].max_files_error
            if('validate_files' in i_v[i] && i_v[i].validate_files(body[i_v[i].key]))
                return i_v[i].error_files
            if('validate_warranty_end_date' in i_v[i] && i_v[i].validate_warranty_end_date(body[i_v[i].key]))
                return i_v[i].warranty_end_date_error
            if('validate_warranty_start_date' in i_v[i] && i_v[i].validate_warranty_start_date(body[i_v[i].key]))
                return i_v[i].warranty_start_date_error
        }

    }

    return true
}

export {validate_body_data}