export default async function main_profile(){
    const create_token = await import('../create_token.js')
    const get_data_profile = await import('../get_data_from_server.js')
    const boxes = await import('../boxes.js')
    const change_name_F = await import('../after_auth/profile/change_name.js')
    /** 
     * 
     * dodac przyciski do zmiany e-mail
     * zmiany hasla
     * zmiany nazwy
     * do wylogowania sie
     * etc
     */
    console.log(firebase.auth().currentUser)
    //zmiana nazwy
    document.querySelector('#button_change_name_dialog').addEventListener('click',()=>{
        boxes.default('chName')
    })
    document.querySelector('#button_change_name').addEventListener('click',change_name_F.default)
    //zmień avatar będzie dostępny tylko i wyłącznie po pobraniu danych
    get_data_profile.default(create_token,'/getProfileData',10).then(({itemsLength,public_avatars,slots,userAvatar})=>{
        //wyswietlamy sloty
        document.querySelector('#user_slots').innerText=slots;
        //wyswietlam sloty zajęte
        document.querySelector('#used_slots').innerText=itemsLength
        //wyświetlam zdjęcie użytkownika


        const user_avatar_HTML = document.querySelector('#user_avatar')
        user_avatar_HTML.src = userAvatar.avatar_path
        user_avatar_HTML.dataset.Public = userAvatar.avatar_public
        user_avatar_HTML.dataset.AvatarId = userAvatar.avatar_id


        //dodaje przyciski

    })
    .catch((data)=>{
        const notification_data = document.querySelector('#get_data_info')
        notification_data.children[0].innerText = `Nie udało się pobrać danych, odśwież aplikacje.`
        notification_data.dataset.timeinfo = 'no'
        notification_data.dataset.typinfo = 'alert'
    })

}

    