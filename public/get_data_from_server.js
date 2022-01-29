export default  function get_data_from_server(notificationFunction,create_token,href,max_req_send,arr_Addisional_data){
    //'/getProfileData'
    return new Promise((res,rej)=>{
        let count = 0,max_count = max_req_send,
        countRequest =0, max_count_request = 10,
         data_for_body = new Object
         if(arr_Addisional_data != undefined)
            for(const e in arr_Addisional_data){
                data_for_body[arr_Addisional_data[e].key] = arr_Addisional_data[e].value
            }
        const get_date_check = async()=>{
            data_for_body['token'] = await create_token.default()
            fetch(href,{
                method:"POST",
                headers:{
                    Accept: "application/json",
                   "Content-Type": "application/json",
                },
                body:JSON.stringify(data_for_body)
            })
            .then(response => response.json()) // convert to json
            .then((data)=>{
         
                if('internal_error' in data && data.internal_error){
                    count++
                    notificationFunction({
                        text:data.message,
                        typInformation:'alert',
                        timeInformation:'yes',
                        remove:true,
                    })
                    if(count >= max_count)
                        return rej(data)

                 
                    setTimeout(() => {
                        return  get_date_check()
                        }, 4000);
                }else{
                    notificationFunction({
                        text:data.message,
                        typInformation:'accept',
                        timeInformation:'yes',
                        remove:true,
                    })
                   return res(data)
                }
            })
            .catch(()=>{
                    countRequest++
                    if(countRequest >=max_count_request)
                       return rej({message:'Nie udało się połączyć z serwerem'})
                    notificationFunction({
                        text:`Brak połączenia, ponawiam próbę.`,
                        typInformation:'alert',
                        timeInformation:'yes',
                        remove:true,
                    })
                setTimeout(() => {
                return  get_date_check()
                }, 4000);
            })
        }
        get_date_check()
    })

}