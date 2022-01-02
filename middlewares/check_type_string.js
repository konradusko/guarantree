
const middleware_type_of_data = (req,res,next)=>{
    const keys = Object.keys(req.body)
    for(let i=0; i<keys.length;i++){
        if(req.body[keys[i]] != 'files' && !(typeof req.body[keys[i]] === "string"))
        return res.json({message:"Wszystkie wartości muszą być typem string."})
    }
    next()
} 
export{middleware_type_of_data}