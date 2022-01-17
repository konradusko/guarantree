export default async function home_main_after_auth(){
   const create_token = await import ('../create_token.js')
   const get_data = await import('../after_auth/home/get_data.js')
   const set_user_avatar = await import('../after_auth/home/set_user_avatar.js')
   const add_events_button = await import('../after_auth/home/add_events_button.js')
   const calculate_and_inner_data = await import('../after_auth/home/calculate.js')
   const get_days_in_month = await import('../get_days_in_month.js')
   const scroll_config = await import('../scroll_config.js')
   //dodaje przyciski do 
   //profilu
   //dodania nowego przedmiotu
   //malutkiego menu na dole   
   add_events_button.default()

   const {items,user_avatar} =  await get_data.default(create_token)
   //wyswietlamy avatara uzytkownika
   set_user_avatar.default(user_avatar)


   //ustawiam mutation observer

   // const container_for_items = document.querySelector('#main_items_container')
   // const mutationObserver = new MutationObserver((entries)=>{
   //    for(const x in entries){
   //       entries[x].addedNodes[0].addEventListener('click',(e)=>{
   //          let element = e.target
   //          while(element.dataset.IdItem === undefined){
   //             element = element.parentNode
   //          }

   //       console.log(element.dataset.IdItem)            
   //       })
   //    }
   // })
   // mutationObserver.observe(container_for_items,{ childList:true})
   document.querySelector('#main_items_container').innerHTML = ''
   //wlaczam scroll
   scroll_config.default('.WarrantyList__ItemsList')
   //liczymy i dodajemy przedmioty
   calculate_and_inner_data.default(items,get_days_in_month,(item)=>{
      item.addEventListener('click',(e)=>{
            let element = e.target
            while(element.dataset.IdItem === undefined){
                  element = element.parentNode
            }
         console.log(element.dataset.IdItem)            
      })
   })
}