
const validate_email = (data)=>{
    const reg_exp_mail_validate =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return reg_exp_mail_validate.test(String(data).toLowerCase()) == true? true:false
}
export {validate_email}