export default function change_name(element,notificationFunction){
    const idForNotification = 'notification_change_name',main_container='main_container_notification'
    element.disabled = true
    if(document.querySelector(`#${idForNotification}`) != undefined)
    document.querySelector(`#${idForNotification}`).remove()
    const min_length_name = 4,max_length_name = 25,
    n_n_input_1 = document.querySelector('#input_N_name_1'),
    n_n_input_2 = document.querySelector('#input_N_name_2')
    if(n_n_input_1.value != n_n_input_2.value)
        notifi({
            text:"Podane wartości różnią się od siebie",
            typ:'alert',
            time:'yes'
        })


    const currentName = firebase.auth().currentUser.displayName
    if(currentName === n_n_input_1.value)
        notifi({
            text:"Nazwa musi być różna od obecnej",
            typ:'alert',
            time:'yes'
        })
      
    
    if(n_n_input_1.value.length < min_length_name)
        notifi({
            text:`Nazwa musi zawierać co najmniej ${min_length_name} znaki`,
            typ:'alert',
            time:'yes'
        })

    if(n_n_input_1.value.length >max_length_name)
        notifi({
            text:`Nazwa nie może być dłuższa niż ${max_length_name} znaków`,
            typ:'alert',
            time:'yes'
        })
    function notifi({text,typ,time}){
        notificationFunction({
            main_container:main_container,
            text:text,
            typInformation:typ,
            timeInformation:time,
            remove:true,
            idNotification:idForNotification
        })
        n_n_input_1.focus()
        return element.disabled = false
    }

}