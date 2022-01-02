
import {isValidDate} from '../validate/is_valid_date.js'
const validate_warranty_end_date = (data)=>{
        if(data.includes('/')){
            //jeden typ
            if(data.split('/').length != 2)
            return true
            if(data.split('/')[0] == '' || data.split('/')[1] == '')
            return true
            if(isNaN(data.split('/')[0]) || isNaN(data.split('/')[1]))
            return true
            if((parseInt(data.split('/')[1]) >=0) && !(parseInt(data.split('/')[1] )<=12))
            return true
            if(Math.sign(parseInt(data.split('/')[1])) == -1 || Math.sign(parseInt(data.split('/')[0])) == -1)
            return true
            if(parseInt(data.split('/')[0]) === 0 && parseInt(data.split('/')[1]) === 0)
            return true
            return false
        }

        if(!(data.includes('/')) && data.length === 10){
            if(isValidDate(data))
            return false
            return true
        }
        return true
}
export{validate_warranty_end_date}