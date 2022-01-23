export default async function home_main_after_auth(){
   const create_token = await import ('../create_token.js')
   const get_data = await import('../get_data_from_server.js')
   const set_user_avatar = await import('../after_auth/home/set_user_avatar.js')
   const calculate_and_inner_data = await import('../after_auth/home/calculate.js')
   const get_days_in_month = await import('../get_days_in_month.js')
   const scroll_config = await import('../scroll_config.js')
   const boxes = await import('../boxes.js')
   //tablica z wszystkimi przedmiotami
   let items_ = new Array
   //dodaje przyciski do profilu dodania przedmiotu sklepu
   const user_profile_button =  [... document.querySelectorAll('.route_to_profile')]
   user_profile_button.forEach((profile)=>{
      profile.addEventListener('click',()=>{
         window.location.href='/profile'
      })
   })
   //dodanie przedmiotu
   document.querySelector('#add_new_item_button').addEventListener('click',()=>{
      window.location.href='/AddNewItem'
   })
   //sklep
   document.querySelector('#shop_button').addEventListener('click',()=>{
      window.location.href='/Shop'
   })

   get_data.default(create_token,'/getHome',10).then(({items,user_avatar})=>{
      
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
                document.querySelector(`[data--id-item="${items_[x].id}"]`).style.display = 'none'
             }

          }
          if(check === undefined)
          container_for_items.appendChild(element_not_found)
          if(check === true && document.querySelector('#not_found')!= null)
          element_not_found.remove()
       })


       //ustawiam przycisk na filtry
       document.querySelector('#filters_element').addEventListener('click',()=>{
          boxes.default('filters')
    })

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
                window.location.href=`/item?itemId=${element.dataset.IdItem}`  
          })
       })
       const sort_inner_element = (check_end)=>{
          let i =0,arr_for_end = new Array
          for( i in items_){
             if(check_end && items_[i].days ===0)
                arr_for_end.push(items_[i])
             if(!check_end || check_end && items_[i].days !=0)
             document.querySelector(`[data--id-item="${items_[i].id}"]`).style.order = Number(i)+1
          }
          i++
          for(const e in arr_for_end){
             document.querySelector(`[data--id-item="${arr_for_end[e].id}"]`).style.order = Number(i)+1
          }
          document.querySelector(`.BoxDialog[data-dialogName="filters"]`).close();
       }
          document.querySelector('#sort_from_A_Z').addEventListener('click',()=>{
             items_.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
             sort_inner_element(false)
          })
       document.querySelector('#sort_from_Z_A').addEventListener('click',()=>{
             items_.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()))
             sort_inner_element(false)
       })
       document.querySelector('#sort_from_date_start').addEventListener('click',()=>{
             items_.sort((a, b) => a.start_date.getTime()-b.start_date.getTime())
             sort_inner_element(false)
       })
       document.querySelector('#sort_from_date_end').addEventListener('click',()=>{
             items_.sort((a, b) => b.end_date.getTime()-a.end_date.getTime())
             sort_inner_element(false)
       })
       document.querySelector('#sort_from_days_high').addEventListener('click',()=>{
             items_.sort((a, b) => a.days-b.days)
             sort_inner_element(true)
       })
   }).catch(()=>{
      console.log('przycisk do przeladowania')
   })
     
}