

export default function create_token(){
    return new Promise((response,rejec)=>{
        firebase.auth().onAuthStateChanged(async (user) => {
         const token = (user != null)? await user.getIdToken(true):'null'
            response(token)
    })
    })
}