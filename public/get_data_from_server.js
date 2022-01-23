export default  function get_data_from_server(create_token,href,max_req_send,arr_Addisional_data){
    //'/getProfileData'
    return new Promise((res,rej)=>{
        const notification_info = document.querySelector('#get_data_info')
        let count = 0,max_count = max_req_send
        const get_date_check = async()=>{
            const token = await create_token.default()
            let data_for_body = {token:token}
            if(arr_Addisional_data != undefined)
            for(const e in arr_Addisional_data){
                data_for_body[arr_Addisional_data[e].key] = arr_Addisional_data[e].value
            }
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
                        
                    notification_info.children[0].innerText = data.message
                    notification_info.dataset.timeinfo = 'no'
                    notification_info.dataset.typinfo = 'alert'
                    setTimeout(() => {
                        return  get_date_check()
                        }, 4000);
                }else{
                    notification_info.dataset.typinfo = 'off'
                    notification_info.children[0].innerText = data.message
                    notification_info.dataset.timeinfo = 'yes'
                    notification_info.dataset.typinfo = 'info'
                    res(data)
                }
            })
            .catch(()=>{
                
                notification_info.children[0].innerText = `Brak połączenia, ponawiam próbę.`
                notification_info.dataset.timeinfo = 'no'
                notification_info.dataset.typinfo = 'alert'
                setTimeout(() => {
                return  get_date_check()
                }, 4000);
            })
        }
        get_date_check()
    })

}