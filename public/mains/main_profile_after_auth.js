export default async function main_profile(){
    const create_token = await import('../create_token.js')
    const get_data_profile = await import('../get_data_from_server.js')

    /** 
     * 
     * dodac przyciski do zmiany e-mail
     * zmiany hasla
     * zmiany nazwy
     * do wylogowania sie
     * etc
     */


    //zmień avatar będzie dostępny tylko i wyłącznie po pobraniu danych
    get_data_profile.default(create_token,'/getProfileData',10).then(({itemsLength,public_avatars,slots,userAvatar})=>{
        console.log(slots)
    })
    .catch((data)=>{
        const notification_data = document.querySelector('#get_data_info')
        notification_data.children[0].innerText = `Nie udało się pobrać danych, odśwież aplikacje.`
        notification_data.dataset.timeinfo = 'no'
        notification_data.dataset.typinfo = 'alert'
    })

}

    