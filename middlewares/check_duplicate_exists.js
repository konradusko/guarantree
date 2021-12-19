const check_duplicate_exists = (req,res,next)=>{
    const values = Object.keys(req.body)
    if(new Set(values).size !== values.length)
    return res.json({message:'Istnieja duplikaty wartosci.'})
    next()
}
export{check_duplicate_exists}