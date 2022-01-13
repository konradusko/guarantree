

export default function create_token(){
    return new Promise((response,rejec)=>{
        firebase.auth().onAuthStateChanged(async (user) => {
        const get_token = (token_given)=>{
            return new Promise((res,rej)=>{
                if(token_given != 'null'){
                    firebase.auth().currentUser.getIdToken().then((token)=>{
                       res(token)
                    }).catch((er)=>{
                        res('null')
                    })
                }else if(token_given == 'null'){
                    res('null')
                }
           
            })
        }
        const check_user = (user != null)? user.getIdToken(true):'null'
        const token = await get_token(check_user)
        response(token)
    })
    })
}