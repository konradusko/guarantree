export default function boxes(data){
    const body = document.querySelector(`.BoxDialog[data-dialogName="${data}"]`)
    body.show();
       //Odczyt wysokości boxa (0% - 100%)
       if(body.open == true)
        document.querySelector(`.BoxDialog[data-dialogName="${data}"] .BoxDialog__BoxFull`).style.setProperty(`height`, `${body.dataset.dialogheight}vh`);
    // Scrotule do boxa po otwarciu
    body.scrollTo(0,body.scrollHeight);


    // Jeśli box jest ukryty to dalgobox się zamyka
    body.addEventListener("scroll", (event)=>{
        if(body.scrollTop == 0)
        body.close();
        
    })
    //Przycisk X zamyka dialogbox
    document.querySelector(`.BoxDialog[data-dialogName="${data}"] .BoxDialog__MenuClose`).addEventListener("click", ()=>{
        body.close();
    })
    //Przycisk anuluj zamyka box
    if(document.querySelector(`.BoxDialog[data-dialogName="${data}"] .BoxDial__Button--cancel`) != null)
    document.querySelector(`.BoxDialog[data-dialogName="${data}"] .BoxDial__Button--cancel`).addEventListener("click", ()=>{
        body.close();
    })

}