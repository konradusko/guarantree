export default function change_email(element,notificationFunction){
    const idForNotification = 'notification_change_email',main_container='main_container_notification'
    element.disabled = true
    if(document.querySelector(`#${idForNotification}`) != undefined)
    document.querySelector(`#${idForNotification}`).remove()
    const currentEmail  = document.querySelector('#change_email_currentEmail'),
    newEmail = document.querySelector('#change_email_newEmail'),
    currentPassword = document.querySelector('#change_email_currentPassword'),
     reg_exp_mail_validate =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i


     const currentEmailFirebase = firebase.auth().currentUser.email
    
     if(currentEmail.value == ''){
        notificationFunction({
            main_container:main_container,
            text:"Proszę podać obecny adres email",
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        currentEmail.focus()
        return element.disabled = false
     }
     if(currentEmail.value != currentEmailFirebase){
        notificationFunction({
            main_container:main_container,
            text:"Obecny email jest błędny",
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        currentEmail.focus()
        return element.disabled = false
     }
     if(newEmail.value === currentEmailFirebase){
        notificationFunction({
            main_container:main_container,
            text:"Nowy email musi być różny od obecnego",
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        newEmail.focus()
        return element.disabled = false
     }

     if(!reg_exp_mail_validate.test(String(newEmail.value).toLowerCase())){
        notificationFunction({
            main_container:main_container,
            text:"Nowy email jest niepoprawny",
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        newEmail.focus()
        return element.disabled = false
     }
     if(currentPassword.value == ''){
        notificationFunction({
            main_container:main_container,
            text:"Podaj obecne hasło",
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        currentPassword.focus()
        return element.disabled = false
     }
     const credential = firebase.auth.EmailAuthProvider.credential( firebase.auth().currentUser.email, currentPassword.value)
     firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function() {
        firebase.auth().currentUser.updateEmail(newEmail.value).then(()=>{
            //wyswietlic gdzie ma byc nowa nazwa wyswietlona
            newEmail.value =''
            currentEmail.value = ''
            currentPassword.value = ''
            notificationFunction({
                main_container:main_container,
                text:"Adres email został pomyślnie zmieniony",
                typInformation:'info',
                timeInformation:'yes',
                remove:true,
                idNotification:idForNotification
            })
            document.querySelector(`.BoxDialog[data-dialogName="chEmail"]`).close();
            return element.disabled = false
        }).catch((er)=>{
            if(er.code == "auth/email-already-in-use"){
                notificationFunction({
                    main_container:main_container,
                    text:"Podany email jest już zajęty",
                    typInformation:'alert',
                    timeInformation:'yes',
                    remove:true,
                    idNotification:idForNotification
                })
                return element.disabled = false
            }else{
                notificationFunction({
                    main_container:main_container,
                    text:"Wystąpił błąd podczas zmiany email",
                    typInformation:'alert',
                    timeInformation:'yes',
                    remove:true,
                    idNotification:idForNotification
                })
                return element.disabled = false
            }
         
        })
     }).catch((er)=>{
        notificationFunction({
            main_container:main_container,
            text:"Podane hasło jest błędne",
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        currentPassword.focus()
        return element.disabled = false
     })
       
}