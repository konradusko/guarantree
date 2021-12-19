import { is_html_in_text } from "../modules/html/is_html_in_text.js";

const middleware_find_html = (req,res,next)=>{
    const keys = Object.keys(req.body)
    for(let i=0; i<keys.length;i++){
        if(is_html_in_text(req.body[keys[i]])){
            return res.json({message:"Niektóre wartości posiadają tagi html które są niedozwolone."})

        }
    }
    next()
}
export{middleware_find_html}