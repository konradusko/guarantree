export default function change_password(element,notificationFunction){
    element.disabled = true
    const currentPassword = document.querySelector("#change_password_currentPassword"),
    newPassword_1 = document.querySelector('#change_password_n_1'),
    newPassword_2 = document.querySelector('#change_password_n_2'),
    min_length = 6,max_length = 25

    if(currentPassword.value == ""){
        notificationFunction({
            text:"Podaj obecne hasło",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        currentPassword.focus()
        return element.disabled = false
    }


    if(newPassword_1.value != newPassword_2.value){
        notificationFunction({
            text:"Nowe hasła różnią się od siebie",
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        newPassword_2.focus()
        return element.disabled = false
    }

    if(newPassword_1.value.length <min_length){
        notificationFunction({
            text:`Hasło musi zawierać co najmniej ${min_length} znaków`,
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        newPassword_1.focus()
        return element.disabled = false
    }

    if(newPassword_1.length > max_length){
        notificationFunction({
            text:`Hasło nie może być dłuższe niż  ${max_length} znaków`,
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        newPassword_1.focus()
        return element.disabled = false 
    }

    if(newPassword_1.value == currentPassword.value){
        notificationFunction({
            text:`Nowe hasło musi być inne niż obecne`,
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
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
                text:`Hasło zostało zmienione`,
                typInformation:'info',
                timeInformation:'yes',
                remove:true,
            })
            document.querySelector(`.BoxDialog[data-dialogName="chPass"]`).close();
            return element.disabled = false
          }).catch((error) => {
            notificationFunction({
                text:`Wystąpił błąd podczas zmiany hasła`,
                typInformation:'accept',
                timeInformation:'yes',
                remove:true,
            })
            return element.disabled = false
          });
    }).catch((er)=>{
        console.log(er)
        notificationFunction({
            text:`Obecne hasło jest błędne`,
            typInformation:'info',
            timeInformation:'yes',
            remove:true,
        })
        currentPassword.focus()
        return element.disabled = false 
    })
}