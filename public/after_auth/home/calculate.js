//tutaj będziemy liczyć ile dni co i jak
export default function calculate_data(items,get_days_in_month,callback){
    //przyjmuje tablice za parameter
    // YYYY-MM-DD
    console.log(items.length)
    const _container_for_items = document.querySelector('#main_items_container')
    const _warranty_start_date = new Date(`${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`)
    let _warranty_end_date,
    end_date_year,
    end_date_months,
    end_date_day,
     _warranty_start_from_database,
     _warranty_end_date_from_database,
     tmp_div,
     _days_for_status,
     time_for_status,
    days,
    time,
    _warranty_hold_start_date,
    is_archive,
   status,
   object_to_return
    for(const x in items){
        _warranty_start_from_database = items[x].warranty_start_date.split('-')
        _warranty_end_date_from_database = items[x].warranty_end_date.value.split('-')
        if(items[x].warranty_end_date.type === 'end_date'){
            _warranty_end_date = `${_warranty_end_date_from_database[1]}/${_warranty_end_date_from_database[2]}/${_warranty_end_date_from_database[0]}`
            _warranty_end_date = new Date(_warranty_end_date)

        }else if(items[x].warranty_end_date.type === 'time'){
      

            _warranty_end_date = items[x].warranty_end_date.value.split('/')
            //0 year 1 month
            _warranty_end_date = {
                year:_warranty_end_date[0],
                month:_warranty_end_date[1]
            }
            //najpierw dodaje lata
            end_date_year = Number(_warranty_start_from_database[0])+Number(_warranty_end_date.year)
            end_date_months = Number(_warranty_start_from_database[1])+Number(_warranty_end_date.month)
            end_date_day = Number(_warranty_start_from_database[2])
            if( end_date_months>12){
                end_date_year+=Math.trunc(end_date_months/12)
                end_date_months=end_date_months%12
            }

            if(end_date_day === 1 && end_date_months != 1){
                //jeśli dzień jest równy 1 ale miesiąc nie jest pierwszy
                end_date_months-=1
                end_date_day = get_days_in_month.default(end_date_year,end_date_months)
            }else if(end_date_day === 1 && end_date_months ===1){
                //trzeba bedzie zmniejszyc rok o 1
                 end_date_year-=1
                 end_date_months=12
                end_date_day = get_days_in_month.default(end_date_year,end_date_months)
            }else{
                //zmniejszam dzien o jeden
                end_date_day -=1
            }
            _warranty_end_date_from_database = [end_date_year,end_date_months,end_date_day]
            //month/day/year
            _warranty_end_date = new Date(`${end_date_months}/${end_date_day}/${end_date_year}`)
        }
        
        time = Math.abs(_warranty_start_date -_warranty_end_date )
        days =Math.ceil(time / (1000 * 60 * 60 * 24));
        _warranty_hold_start_date = new Date(`${_warranty_start_from_database[1]}/${_warranty_start_from_database[2]}/${_warranty_start_from_database[0]}`)
        is_archive = _warranty_start_date.getTime()>_warranty_end_date.getTime()

        time_for_status = _warranty_end_date - _warranty_hold_start_date
        _days_for_status =  Math.ceil(time_for_status  / (1000 * 60 * 60 * 24));
       if(is_archive)
        days = 0
        if (days === 0 )
            status = 'archive'
        if(days !=0){
            //trzeba obliczyć teraz kolor
            if(days < ((25/100)*_days_for_status).toFixed(0))
            status = 'old'

            if(days >= ((25/100)*_days_for_status).toFixed(0))
            status = 'medium'

            if(days >= ((50/100)*_days_for_status).toFixed(0))
            status = 'young'

            if(days >= ((75/100)*_days_for_status).toFixed(0))
            status = 'new'

        }
        object_to_return= new Object
        object_to_return.days = days
        if(days ===0 && !is_archive)
        days="Dziś"
        if(days ===1 && !is_archive)
        days +=' Dzień'
        if(days>1 && !is_archive)
        days+=' Dni'

       tmp_div = document.createElement('div')
       tmp_div.className = `WarrantyList__item`
       tmp_div.dataset.IdItem = items[x].public_id_item
       tmp_div.dataset.StatusItem = status

       object_to_return.id = items[x].public_id_item
       object_to_return.status = status
       object_to_return.name = items[x].item_name
       object_to_return.start_date = _warranty_hold_start_date
       object_to_return.end_date = _warranty_end_date
       tmp_div.dataset.TypeItem = `warranty`
       tmp_div.innerHTML= `
 
       <div class="WarrantyList__ItemFirstPart">
           <img class="WarrantyList__ItemImg" src="${items[x].avatar.avatar_path}" alt="Avatar" data-AvatarId=${items[x].avatar.avatar_id} data-AvatarPublic=${items[x].avatar.avatar_public} data-AvatarType=${items[x].avatar.avatar_type}>
           <div class="WarrantyList__ItemNoImg"></div>
           <div class="WarrantyList__ItemDot"></div>
       </div>
       <div class="WarrantyList__ItemSecondPart">
           <h2 class="WarrantyList__ItemName">
               ${items[x].item_name}
           </h2>
           <p class="WarrantyList__ItemDescription">
               Okres gwarancyjny: ${String(_warranty_start_from_database[2]).length === 1?'0'+_warranty_start_from_database[2]:_warranty_start_from_database[2]}.${String(_warranty_start_from_database[1]).length === 1?'0'+_warranty_start_from_database[1]:_warranty_start_from_database[1]}.${_warranty_start_from_database[0]} - ${String(_warranty_end_date_from_database[2]).length === 1?'0'+_warranty_end_date_from_database[2]:_warranty_end_date_from_database[2]}.${String(_warranty_end_date_from_database[1]).length === 1?'0'+_warranty_end_date_from_database[1]:_warranty_end_date_from_database[1]}.${_warranty_end_date_from_database[0]}
           </p>
       </div>
       <div class="WarrantyList__ItemThirdPart">
           ${days === 0? 'Zakończona':days}
       </div>
 `
   _container_for_items.appendChild(tmp_div)

    callback(tmp_div,object_to_return)
    }

} 

