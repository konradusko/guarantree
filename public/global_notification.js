export default function globalNotification({
    main_container,
    text,
    typInformation,
    timeInformation,
    remove,
    idNotification
}){
    const main_container_notification = document.querySelector(`#${main_container}`)
    const div = document.createElement('div')
    div.className = `TopInfo__info`
    div.innerHTML = `<span style="color: white">${text}</span>`
    div.dataset.typinfo = typInformation
    div.dataset.timeinfo = timeInformation
    div.id = idNotification
    main_container_notification.appendChild(div)
    if(remove)
    setTimeout(() => {
        div.remove()
    }, 10000);
}
