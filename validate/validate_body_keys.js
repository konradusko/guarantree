const validate_body_keys = (data)=>{
        const {body,require_to_validate,allow_to_pass} = data;
        const body_keys = Object.keys(body)

        const body_informations = body_keys.filter(e=>{
            if(allow_to_pass.indexOf(e) === -1 ){
                //jest inny ale to moze byc wymagany
                if(require_to_validate.indexOf(e) === -1)
                return e
            }
        })
        if(body_informations.length !=0)//oznacze ze sa w body jakies niechciane rzeczy
        return false

        if(body_informations.length == 0)
        return true

}

export{validate_body_keys}