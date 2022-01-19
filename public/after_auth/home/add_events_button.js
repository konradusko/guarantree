export default function add_events_button(boxes_F){
    //dodanie przycisku do filtrów
    document.querySelector('#filters_element').addEventListener('click',()=>{
        boxes_F('filters')
    })
}