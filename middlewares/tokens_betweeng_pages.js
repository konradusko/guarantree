import fs from "fs"
import pkg from 'firebase-admin'
import { validate_body_keys } from "../validate/validate_body_keys.js"
const {auth} = pkg

const verify_token_middlewares_routes = (req,res,config)=>{
    try {
        if(!('token' in req.body))
        return res.json({message:'Token jest wymagany.'})
        const body = req.body
        const token = req.body.token
        if(!validate_body_keys({body:body,require_to_validate:config.body_keys_require_to_validate,allow_to_pass:config.body_keys_allow_to_pass}))
            return res.json({message:'Body zawiera niedozwolone parametry.'})

        auth().verifyIdToken(token).then(()=>{
            if(!config.need_validation){
                //nie potrzebuje validacji a mamy token
               return res.json({
                    redirect:'/home'
                })
            }else if (config.need_validation){
                //jest token i jest potrzebna validacja
                fs.readFile('views' + config.page,"utf8",(err,temp)=>{
                    if(err)
                    return res.json({
                            redirect:'/home'
                        })
                    return res.json({
                        template:temp,
                        javascript_href:config.javaScript
                    })
                })
            }
        })
        .catch(()=>{
            if(config.need_validation){
                //wymagana jest validacja a nie mamy tokenu
                return res.json({
                    redirect:'/login'
                })
            }else if(!config.need_validation){
                //nie jest wymagany token no i nie posiadamy go
                fs.readFile('views' + config.page,"utf8",(err,temp)=>{
                    if(err)
                    return res.json({
                            redirect:'/login'
                        })
                    return res.json({
                        template:temp,
                        javascript_href:config.javaScript
                    })
                })
            }
        })
    } catch (error) {
        return res.json({message:'Wystąpił błąd spróbuj za chwilę.'})
    }

}
export{verify_token_middlewares_routes}