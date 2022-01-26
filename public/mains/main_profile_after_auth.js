export default async function main_profile(){
    const create_token = await import('../create_token.js')
    const get_data_profile = await import('../get_data_from_server.js')
    const boxes = await import('../boxes.js')
    const change_name_F = await import('../after_auth/profile/change_name.js')
    const change_Email_F = await import('../after_auth/profile/change_email.js')
    const notification_F = await import('../global_notification.js')

    console.log(firebase.auth().currentUser.email)
    /** 
     * 
     * dodac przyciski do zmiany e-mail
     * zmiany hasla
     * zmiany nazwy
     * do wylogowania sie
     * etc
     */
    //wyswietlam nazwe uzytkownika
    document.querySelector('#userName').innerText = `Witaj ${firebase.auth().currentUser.displayName}`
    //zmiana nazwy
    document.querySelector('#button_change_name_dialog').addEventListener('click',()=>{
        boxes.default('chName')
    })
    document.querySelector('#button_change_email_dialog').addEventListener('click',()=>{
        boxes.default('chEmail')
    })
    document.querySelector('#button_change_name').addEventListener('click',function(){
        change_name_F.default(this,notification_F.default)
    })
    document.querySelector('#button_change_email').addEventListener('click',function(){
        change_Email_F.default(this,notification_F.default)
    })
    //zmień avatar będzie dostępny tylko i wyłącznie po pobraniu danych
    get_data_profile.default(notification_F.default,create_token,'/getProfileData',10).then(({itemsLength,public_avatars,slots,userAvatar})=>{
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
        notification_F.default({
            main_container:`main_container_notification`,
            text:`Nie udało się pobrać danych, odśwież aplikacje.`,
            typInformation:'alert',
            timeInformation:'no',
            remove:false,
            idNotification:'ErrorConnection'
        })
    })

}

    