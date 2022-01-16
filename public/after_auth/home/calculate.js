//tutaj będziemy liczyć ile dni co i jak
export default function calculate_data(items,get_days_in_month){
    //przyjmuje tablice za parameter
    // YYYY-MM-DD
    console.log(items)
    const _container_for_items = document.querySelector('#main_items_container')
    _container_for_items.innerHTML = ''
    const _warranty_start_date = new Date(`${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`)
    let _warranty_end_date,
    end_date_year,
    end_date_months,
    end_date_day,
     _warranty_start_from_database,
     tmp_div
    for(const x in items){
        if(items[x].warranty_end_date.type === 'end_date'){
             _warranty_end_date = items[x].warranty_end_date.value.split('-')
            _warranty_end_date = `${_warranty_end_date[1]}/${_warranty_end_date[2]}/${_warranty_end_date[0]}`
            _warranty_end_date = new Date(_warranty_end_date)

        }else if(items[x].warranty_end_date.type === 'time'){
             _warranty_start_from_database = items[x].warranty_start_date.split('-')

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
            //month/day/year
            _warranty_end_date = new Date(`${end_date_months}/${end_date_day}/${end_date_year}`)
        }
       const time = _warranty_end_date - _warranty_start_date
       const days = Math.sign(time) === 0 || Math.sign(time) === -1 ? 0  : Math.ceil(time / (1000 * 60 * 60 * 24));
       tmp_div = document.createElement('div')
       tmp_div.innerHTML= `
       <div class="WarrantyList__item" data-IdItem="x" data-StatusItem="young" data-TypeItem="warranty">
       <div class="WarrantyList__ItemFirstPart">
           <img class="WarrantyList__ItemImg" src="https://picsum..photos/65/65" alt="">
           <div class="WarrantyList__ItemNoImg"></div>
           <div class="WarrantyList__ItemDot"></div>
       </div>
       <div class="WarrantyList__ItemSecondPart">
           <h2 class="WarrantyList__ItemName">
               Nowa
           </h2>
           <p class="WarrantyList__ItemDescription">
               Okres gwarancyjny: xx.xx.xx - xx.xx.xx
           </p>
       </div>
       <div class="WarrantyList__ItemThirdPart">
           21 dni
       </div>
   </div>`
    }
} 

