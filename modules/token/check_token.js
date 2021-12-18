import pkg from 'firebase-admin'
const {auth} = pkg
const check_token = (token)=>{
    return new Promise((res,rej)=>{
        auth().verifyIdToken(token)
            .then((decodedToken)=>{
               return res(decodedToken)
            })
            .catch((er)=>{
               return rej(er)
            })
    })
}
export{check_token}