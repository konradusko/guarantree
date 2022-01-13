import {check_token} from '../modules/token/check_token.js'
const check_token_middleware = async(req,res,next)=>{
    if(!('token' in req.body))
    return res.json({message:'Token jest wymagany'})

    try {
        const uid = await check_token(req.body.token)
        res.locals.uid = uid
        next()
    } catch (error) {
        return res.json({message:'Token jest nieprawidłowy.'})
    }
}
export{check_token_middleware}