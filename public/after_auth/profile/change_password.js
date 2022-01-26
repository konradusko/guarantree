export default function change_password(element,notificationFunction){
    const idForNotification = 'notification_change_password',main_container='main_container_notification'
    element.disabled = true
    if(document.querySelector(`#${idForNotification}`) != undefined)
    document.querySelector(`#${idForNotification}`).remove()

    const currentPassword = document.querySelector("#change_password_currentPassword"),
    newPassword_1 = document.querySelector('#change_password_n_1'),
    newPassword_2 = document.querySelector('#change_password_n_2'),
    min_length = 6,max_length = 25

    if(currentPassword.value == ""){
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


    if(newPassword_1.value != newPassword_2.value){
        notificationFunction({
            main_container:main_container,
            text:"Nowe hasła różnią się od siebie",
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        newPassword_2.focus()
        return element.disabled = false
    }

    if(newPassword_1.value.length <min_length){
        notificationFunction({
            main_container:main_container,
            text:`Hasło musi zawierać co najmniej ${min_length} znaków`,
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        newPassword_1.focus()
        return element.disabled = false
    }

    if(newPassword_1.length > max_length){
        notificationFunction({
            main_container:main_container,
            text:`Hasło nie może być dłuższe niż  ${max_length} znaków`,
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        newPassword_1.focus()
        return element.disabled = false 
    }

    if(newPassword_1.value == currentPassword.value){
        notificationFunction({
            main_container:main_container,
            text:`Nowe hasło musi być inne niż obecne`,
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        newPassword_1.focus()
        return element.disabled = false
    }
    const credential = firebase.auth.EmailAuthProvider.credential( firebase.auth().currentUser.email, currentPassword.value )
    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(()=>{
        firebase.auth().currentUser.updatePassword(newPassword_1.value).then(() => {
            currentPassword.value=''
            newPassword_1.value = ''
            newPassword_2.value = ''
            notificationFunction({
                main_container:main_container,
                text:`Hasło zostało zmienione`,
                typInformation:'info',
                timeInformation:'yes',
                remove:true,
                idNotification:idForNotification
            })
            document.querySelector(`.BoxDialog[data-dialogName="chPass"]`).close();
            return element.disabled = false
          }).catch((error) => {
            notificationFunction({
                main_container:main_container,
                text:`Wystąpił błąd podczas zmiany hasła`,
                typInformation:'alert',
                timeInformation:'yes',
                remove:true,
                idNotification:idForNotification
            })
            return element.disabled = false
          });
    }).catch((er)=>{
        console.log(er)
        notificationFunction({
            main_container:main_container,
            text:`Obecne hasło jest błędne`,
            typInformation:'alert',
            timeInformation:'yes',
            remove:true,
            idNotification:idForNotification
        })
        currentPassword.focus()
        return element.disabled = false 
    })
}