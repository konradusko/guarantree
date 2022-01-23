import express from "express"
const profile_after_login = express.Router()
import {verify_token_middlewares_routes} from '../middlewares/tokens_betweeng_pages.js'
profile_after_login.get('/profile',(req,res)=>{
    return res.render('auth.ejs', {
        template: '/profile'
    })
})

profile_after_login.post('/profile',(req,res)=>{
    const config = res.locals.post_config
    verify_token_middlewares_routes(req,res,config)
})
export {profile_after_login}