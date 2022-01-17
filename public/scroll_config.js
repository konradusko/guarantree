export default function scroll_config(selector){
    //? Ukrywanie i pokazywanie menu
let DefaultPosition = 0;
const scroll = document.querySelector(selector); 
const mainMenu = document.querySelector(".GW__nav");
scroll.addEventListener("scroll", ()=>{ 
   const st = scroll.scrollTop; 
   if (st > DefaultPosition){
      // w dól
      mainMenu.classList.add("nav--hidden");
      mainMenu.classList.remove("nav--show");
   } else {
      // w góre
      mainMenu.classList.remove("nav--hidden");
      mainMenu.classList.add("nav--show");
   }
   DefaultPosition = st <= 0 ? 0 : st; 
}, false);
}