export default function change_email(element,notificationFunction){

    element.disabled = true
    const currentEmail  = document.querySelector('#change_email_currentEmail'),
    newEmail = document.querySelector('#change_email_newEmail'),
    currentPassword = document.querySelector('#change_email_currentPassword'),
     reg_exp_mail_validate =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i


     const currentEmailFirebase = firebase.auth().currentUser.email
    
     if(currentEmail.value == ''){
        notificationFunction({
            text:"Proszę podać obecny adres email",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        currentEmail.focus()
        return element.disabled = false
     }
     if(currentEmail.value != currentEmailFirebase){
        notificationFunction({
            text:"Obecny email jest błędny",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        currentEmail.focus()
        return element.disabled = false
     }
     if(newEmail.value === currentEmailFirebase){
        notificationFunction({
            text:"Nowy email musi być różny od obecnego",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        newEmail.focus()
        return element.disabled = false
     }

     if(!reg_exp_mail_validate.test(String(newEmail.value).toLowerCase())){
        notificationFunction({
            text:"Nowy email jest niepoprawny",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        newEmail.focus()
        return element.disabled = false
     }
     if(currentPassword.value == ''){
        notificationFunction({
            text:"Podaj obecne hasło",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
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
                text:"Adres email został pomyślnie zmieniony",
                typInformation:'accept',
                timeInformation:'yes',
                remove:true,
            })
            document.querySelector(`.BoxDialog[data-dialogName="chEmail"]`).close();
            return element.disabled = false
        }).catch((er)=>{
            if(er.code == "auth/email-already-in-use"){
                notificationFunction({
                    text:"Podany email jest już zajęty",
                    typInformation:'info',
                    timeInformation:'yes',
                    remove:true,
                })
                return element.disabled = false
            }else{
                notificationFunction({
                    text:"Wystąpił błąd podczas zmiany email",
                    typInformation:'info',
                    timeInformation:'yes',
                    remove:true,
                })
                return element.disabled = false
            }
         
        })
     }).catch((er)=>{
        notificationFunction({
            text:"Podane hasło jest błędne",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        currentPassword.focus()
        return element.disabled = false
     })
       
}