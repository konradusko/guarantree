export default async function home_main_after_auth(){
   const create_token = await import ('../create_token.js')
   const get_data = await import('../after_auth/home/get_data.js')
   const set_user_avatar = await import('../after_auth/home/set_user_avatar.js')
   const add_events_button = await import('../after_auth/home/add_events_button.js')
   const calculate_and_inner_data = await import('../after_auth/home/calculate.js')
   const get_days_in_month = await import('../get_days_in_month.js')
   const scroll_config = await import('../scroll_config.js')
   const boxes = await import('../boxes.js')
   //tablica z wszystkimi przedmiotami
   let items_ = new Array
   //dodaje przyciski do 
   //profilu
   //dodania nowego przedmiotu
   //malutkiego menu na dole   
   add_events_button.default(boxes.default)
   //search button logic
   const container_for_items =  document.querySelector('#main_items_container')
   const search_button = document.querySelector('#search_input')
   const element_not_found = document.createElement('div')
   element_not_found.className = 'WarrantyList__item' 
   element_not_found.innerHTML = ` <div class="WarrantyList__ItemSecondPart" id="not_found">
                                 <h2 class="WarrantyList__ItemName">
                                    Brak wyszukiwanej frazy
                                 </h2>
                              </div>`
   search_button.addEventListener('input',(e)=>{
      container_for_items.scrollTop = 0
      let check
      for(const x in items_){
         if(items_[x].name.includes(e.target.value)){
            check=true
           document.querySelector(`[data--id-item="${items_[x].id}"]`).style.display = 'flex'
         }else{
            console.log('e')
            document.querySelector(`[data--id-item="${items_[x].id}"]`).style.display = 'none'
         }

      }
      if(check === undefined)
      container_for_items.appendChild(element_not_found)
      if(check === true && document.querySelector('#not_found')!= null)
      element_not_found.remove()
   })

   const {items,user_avatar} =  await get_data.default(create_token)
   //wyswietlamy avatara uzytkownika
   set_user_avatar.default(user_avatar)

   container_for_items.innerHTML = ''
   //wlaczam scroll
   scroll_config.default('.WarrantyList__ItemsList')
   //liczymy i dodajemy przedmioty
   calculate_and_inner_data.default(items,get_days_in_month,(item,object_for_array)=>{
      items_.push(object_for_array)
      item.addEventListener('click',(e)=>{
            let count =0;
            let element = e.target
            while(element.dataset.IdItem === undefined||count === 200){
                  element = element.parentNode
                  count++
            }        
      })
   })

  

}