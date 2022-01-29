export default function globalNotification({
    text,
    typInformation,
    timeInformation,
    remove,
}){
    const allExisting = [...document.querySelectorAll('.TopInfo__floating')]
    allExisting.forEach((element)=>{
        if(element.dataset.timeinfo == 'yes')
        element.dataset.typinfo = 'remove'
    })
    //wszystkim elementom zmienic dataset i po problemie
    const main_container_notification = document.querySelector(`#main_container_notification`)
    const div = document.createElement('div')
    div.innerHTML = `<span style="color: white">${text}</span>`
    div.dataset.typinfo = typInformation
    if(timeInformation === 'yes')
    div.className = `TopInfo__floating`
    if(timeInformation === 'no')
    div.className = `TopInfo__info TopInfo__info--warranty`
    div.dataset.timeinfo = timeInformation
    main_container_notification.appendChild(div)
    if(remove)
    setTimeout(() => {
        div.remove()
    }, 10000);
}
