

export default function get_data(create_token){
    return new Promise((res,rej)=>{
        const notification_error = document.querySelector('#error_download_items'),
        notification_info = document.querySelector('#get_items_info')
        const get_date_check = async()=>{
            try {
             
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
                .then((data)=>{
                    notification_error.dataset.typinfo = 'off'
                    notification_info.children[0].innerText = data.message
                    notification_info.dataset.typinfo = 'info'
                    console.log(data)
                   res(data)
                }).catch(()=>{rej()})
            } catch (error) {
                //powiadomienie o błędzie
                notification_error.dataset.typinfo = 'alert'
                get_date_check()
            }
        }
        get_date_check()
    })
}