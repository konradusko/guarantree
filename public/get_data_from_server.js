export default  function get_data_from_server(notificationFunction,create_token,href,max_req_send,arr_Addisional_data){
    //'/getProfileData'
    return new Promise((res,rej)=>{
        const mainNotification = 'main_container_notification',
            idNotification = 'DataFromServerNotification'
        let count = 0,max_count = max_req_send,
         data_for_body = new Object
         if(arr_Addisional_data != undefined)
            for(const e in arr_Addisional_data){
                data_for_body[arr_Addisional_data[e].key] = arr_Addisional_data[e].value
            }
        const get_date_check = async()=>{
            if(document.querySelector(`#${idNotification}`) != undefined)
            document.querySelector(`#${idNotification}`).remove()
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
                    if(count >= max_count)
                        return rej(data)

                    notificationFunction({
                        main_container:mainNotification,
                        text:data.message,
                        typInformation:'alert',
                        timeInformation:'yes',
                        remove:true,
                        idNotification:idNotification
                    })
                    setTimeout(() => {
                        return  get_date_check()
                        }, 4000);
                }else{
                    notificationFunction({
                        main_container:mainNotification,
                        text:data.message,
                        typInformation:'info',
                        timeInformation:'yes',
                        remove:true,
                        idNotification:idNotification
                    })
                    res(data)
                }
            })
            .catch(()=>{
                
                    notificationFunction({
                        main_container:mainNotification,
                        text:`Brak połączenia, ponawiam próbę.`,
                        typInformation:'alert',
                        timeInformation:'yes',
                        remove:true,
                        idNotification:idNotification
                    })
                setTimeout(() => {
                return  get_date_check()
                }, 4000);
            })
        }
        get_date_check()
    })

}