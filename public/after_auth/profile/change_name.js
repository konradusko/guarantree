export default function change_name(){
    this.disabled = true
    const notification_change_name = document.querySelector('#change_name_notification'),
    min_length_name = 4,max_length_name = 25,
    n_n_input_1 = document.querySelector('#input_N_name_1'),
    n_n_input_2 = document.querySelector('#input_N_name_2')
    console.log('xd')
    console.log(this)
    if(n_n_input_1.value != n_n_input_2.value){
        notification_change_name.dataset.typinfo = 'alert'
        notification_change_name.children[0].innerText = 'Nazwy różnią się od siebie'
        n_n_input_1.focus()
        return this.disabled = false
    }
    console.log('eeeeeeee')
}