const engine = (urlPath)=>{
    const firebaseConfig = {
        apiKey: "AIzaSyBsiq48Spvfq6OsV0CalQFJi6Gd8NAQFu4",
        authDomain: "paragonytest-7d604.firebaseapp.com",
        projectId: "paragonytest-7d604",
        storageBucket: "paragonytest-7d604.appspot.com",
        messagingSenderId: "512522830802",
        appId: "1:512522830802:web:c84b68993f02e37b5cfe0b",
        measurementId: "G-E9C8GS5ZS1"
    };
   
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
        const send_req = async()=>{
            const token = user != null? await user.getIdToken(true):'null'
            fetch(urlPath,{
            method:"POST",
            headers:{
                Accept: "application/json",
               "Content-Type": "application/json",
            },
            body:JSON.stringify({token})
        })
        .then(response => response.json()) // convert to json
        .then(async(json)=>{
            console.log(json)
            if('redirect' in json)
                return location.href = json.redirect
            if(!('redirect' in json)){
                if("template" in json){
                    document.querySelector('#content').innerHTML=json.template
                }
                if("javascript_href" in json){
                    //zaimportować javascript
                    const module = await import(json.javascript_href)
                    module.default()
                }
            }
        }).catch((er)=>{
            //tutaj wyświetlić błąd
            document.querySelector('#content').innerHTML=`
            <aside class="GW__TopInfo TopInfo" id="notification_main">
            <div class="TopInfo__info" data-typinfo="alert" data-timeinfo="yes">
                <!--? Wiadomość na górze strony | zmienić data-typinfo="off" na np alert-->
                <span style="color: red">Arkusz motywu nie został załadowany poprawnie</span>
                </div>
            </aside>
            `
            setTimeout(() => {
                send_req()
            }, 5000);
        })
        }
        send_req()
    })
}
