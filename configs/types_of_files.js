const types_of_files = (code)=>{
    switch (code) {
        case "89504e47":
            return {type:"image/png",end_point:'.png'}
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
            return {type:"image/jpeg",end_point:'.png'}
        case "25504446":
            return {type:'application/pdf',end_point:'.png'}
        default:
           return undefined
    }
}
export{types_of_files}
// TO - DO
//Do uzupełnienia