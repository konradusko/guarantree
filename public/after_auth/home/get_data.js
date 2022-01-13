

export default function get_data(create_token){
    return new Promise(async(res,rej)=>{
        const token = await create_token.default()
        fetch('/getHome',{
            method:"POST",
            headers:{
                Accept: "application/json",
               "Content-Type": "application/json",
            },
            body:JSON.stringify({token})
        })
        .then(response => response.json()) // convert to json
        .then((res)=>{
            console.log(res)
        }).catch(()=>{rej()})
    })
}