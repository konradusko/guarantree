import {isValidDate} from '../validate/is_valid_date.js'
const validate_warranty_start_date = (data)=>{
    if(data.length != 10)
    return true
    if(isValidDate(data))
    return false
    return true
}
export{validate_warranty_start_date}