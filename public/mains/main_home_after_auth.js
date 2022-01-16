export default async function home_main_after_auth(){
   const create_token = await import ('../create_token.js')
   const get_data = await import('../after_auth/home/get_data.js')
   const set_user_avatar = await import('../after_auth/home/set_user_avatar.js')
   const add_events_button = await import('../after_auth/home/add_events_button.js')
   const calculate_and_inner_data = await import('../after_auth/home/calculate.js')
   const get_days_in_month = await import('../get_days_in_month.js')
   //najpierw dodać jeszcze do przycisków eventy
   const {items,user_avatar} =  await get_data.default(create_token)
   //wyswietlamy avatara uzytkownika
   set_user_avatar.default(user_avatar)
   //dodaje przyciski do 
   //profilu
   //dodania nowego przedmiotu
   //malutkiego menu na dole   
   add_events_button.default()

   //ustawiam mutation observer

   const container_for_items = document.querySelector('#main_items_container')
   const mutationObserver = new MutationObserver((entries)=>{
      console.log(entries)
   })
   mutationObserver.observe(container_for_items,{ childList:true})

   //liczymy i dodajemy przedmioty
   calculate_and_inner_data.default(items,get_days_in_month)
}