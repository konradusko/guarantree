import express from 'express'
const update_user = express.Router()

update_user.post('/updateAccount',(req,res)=>{
    const uid = res.locals.uid.uid
    const config = res.locals.update_account_config
    
    console.log(uid)

    console.log()
    auth().getUser(uid).then((e)=>{
        console.log(e)
    })
})
export{update_user}