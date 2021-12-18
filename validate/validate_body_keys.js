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

const validate_body_keys_with_return = (data) =>{

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

        const filter_array = body_keys.filter(e=>{//filtrue z potrzebnych do validacji rzeczy
            if(require_to_validate.indexOf(e) === -1)
            return e
        })

        if( filter_array.length == 0)
        return 'Brak wartości do zmiany'

        return filter_array
}
export{validate_body_keys,validate_body_keys_with_return}