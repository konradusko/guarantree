export default async function main_profile(){
    const create_token = await import('../create_token.js')
    const get_add_data_to_server = await import('../get_data_from_server.js')
    const boxes = await import('../boxes.js')
    const change_name_F = await import('../after_auth/profile/change_name.js')
    const change_Email_F = await import('../after_auth/profile/change_email.js')
    const change_Password_F = await import('../after_auth/profile/change_password.js')
    const notification_F = await import('../global_notification.js')
    const add_file_F = await import ('../add_file.js')
    let avatar = null;
    const avatarImageFromUser = document.querySelector('#imgNewAvatar')
    const baseImgSrc = `data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`

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
    document.querySelector('#button_change_password_dialog').addEventListener('click',()=>{
        boxes.default('chPass')
    })

    document.querySelector('#button_change_name').addEventListener('click',function(){
        change_name_F.default(this,notification_F.default)
    })
    document.querySelector('#button_change_email').addEventListener('click',function(){
        change_Email_F.default(this,notification_F.default)
    })
    document.querySelector('#button_change_password').addEventListener('click',function(){
        change_Password_F.default(this,notification_F.default)
    })

    function clearAvatar(){
        avatar = null
        avatarImageFromUser.src = baseImgSrc
    }
    //zmień avatar będzie dostępny tylko i wyłącznie po pobraniu danych
    get_add_data_to_server.default(notification_F.default,create_token,'/getProfileData',10).then(({itemsLength,public_avatars,slots,userAvatar})=>{
        //wyswietlamy sloty
        document.querySelector('#user_slots').innerText=slots;
        //wyswietlam sloty zajęte
        document.querySelector('#used_slots').innerText=itemsLength
        //wyświetlam zdjęcie użytkownika

        const user_avatar_HTML = document.querySelector('#user_avatar')
        user_avatar_HTML.src = userAvatar.avatar_path
        user_avatar_HTML.dataset.Public = userAvatar.avatar_public
        user_avatar_HTML.dataset.AvatarId = userAvatar.avatar_id

        let img
        const box_for_avatar_images = document.querySelector('#box_for_avatar_images');
        for(const xd in public_avatars){
            img = document.createElement('img')
            img.dataset.id = xd
            img.dataset.public = public_avatars[xd].public
            img.src = public_avatars[xd].path
            img.className = 'BoxDial__defaultAvater'
            img.alt = 'Avatar'
            box_for_avatar_images.appendChild(img)
            img.addEventListener('click',function(){
                avatar = this.dataset.id
                if(avatarImageFromUser.src != baseImgSrc)
                avatarImageFromUser.src = baseImgSrc
                return notificationChangeAvatar({text:'Wybrano avatara',typ:'accept'})
            })
        }

        //dodaje przyciski
        document.querySelector('#button_change_avatar_dialog').addEventListener('click',()=>{
            clearAvatar()
            boxes.default('chAvatar',clearAvatar)
        })
        document.querySelector('#button_select_avatar').addEventListener('click',()=>{
            avatar = null
        })
        document.querySelector('#button_select_avatar').addEventListener('change', async function(event){
               await add_file_F.default({maxSize:2100000,allowFormat:["image/jpeg","image/png","application/pdf"],event})
                    .then(({fileBase64,format})=>{
                    avatarImageFromUser.src = fileBase64
                    avatar = fileBase64
                        return notificationChangeAvatar({text:'Plik przeszedł weryfikacje',typ:'accept'})
                    })
                    .catch((error)=>{
                        avatar = null
                        return notificationChangeAvatar({text:error,typ:'info'})
                    })
        })
        document.querySelector('#button_change_avatar').addEventListener('click',async function(){
            if(avatar === null)
                return notificationChangeAvatar({text:'Nie wybrano żadnego avatara',typ:'info'})
            this.disabled = true
            await get_add_data_to_server.default(notification_F.default,create_token,'/addNewUserAvatar',0,[{key:'avatar',value:avatar}])
            .then(({token,avatar})=>{
                user_avatar_HTML.src = token
                user_avatar_HTML.dataset.Public = avatar.public
                user_avatar_HTML.dataset.AvatarId = avatar.id
                clearAvatar()
                document.querySelector(`.BoxDialog[data-dialogName="chAvatar"]`).close();
                this.disabled = false
            }).catch((error)=>{
                clearAvatar()
                this.disabled = false
            })
        })
    })
    .catch((data)=>{
        // notification_F.default({
        //     text:`Nie udało się pobrać danych, odśwież aplikacje.`,
        //     typInformation:'alert',
        //     timeInformation:'no',
        //     remove:false,
        // })
    })


    function notificationChangeAvatar({text,typ}){
            notification_F.default({
                text:text,
                typInformation:typ,
                timeInformation:'yes',
                remove:true,
            })
    }
}

    