export default async function home_main_after_auth(){

   firebase.auth().currentUser.getIdToken().then((token)=>{
      console.log(token)
      fetch('/gethome',{
         method:"POST",
         headers:{
             Accept: "application/json",
            "Content-Type": "application/json",
         },
         body:JSON.stringify({token})
     }).then(response => response.json())
     .then((xd)=>{
        console.log(xd)
     })
   })
 
}