const makeId = (length)=>{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *characters.length));
    }
    return result
}
const generateGuid = ()=>{
    const uuid = `${new Date().getTime().toString(24)}xxxxxxxxyxxxxxxyxxxxxyyxxx`.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
        return v.toString(16);  
     })
     return uuid
}

export {makeId,generateGuid}