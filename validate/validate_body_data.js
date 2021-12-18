const validate_body_data = (body,i_v)=>{
    console.log(i_v)

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
        }

    }

    return true
}

export {validate_body_data}