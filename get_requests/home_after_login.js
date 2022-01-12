import express from "express"
const home_after_login = express.Router()
import {verify_token_middlewares_routes} from '../middlewares/tokens_betweeng_pages.js'
home_after_login.get('/home',(req,res)=>{
    return res.render('auth.ejs', {
        template: '/home'
    })
})

home_after_login.post('/home',(req,res)=>{
    const config = res.locals.post_config
    verify_token_middlewares_routes(req,res,config)
})
export {home_after_login}