export default function addFile({
    maxSize,
    allowFormat,
    event
}){
    return new Promise((res,rej)=>{
    
            const files = event.target.files[0]
            if(files.size > maxSize)
                return rej('Plik jest za duży')
            
            const fileReader = new FileReader();
            fileReader.onloadend =  (e)=> {
                let header = ""
                const arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                for(let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }
                const format = getTypeFile(header)
                console.log(format)
                if(format === undefined)
                    return rej('Plik ma zły format')
                const findFormat = allowFormat.find(e=>e === format)
                if(findFormat === undefined)
                    return rej('Plik ma zły format')

                const blob = new Blob([files],{
                    type:findFormat
                })
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = ()=>{
                    res({fileBase64:reader.result,format:findFormat})
                    }
            }
            fileReader.readAsArrayBuffer(files);      
        function getTypeFile(code){
            switch (code) {
                case "89504e47":
                    return "image/png"
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    return "image/jpeg"
                case "25504446":
                    return 'application/pdf'
                default:
                  return undefined
            }
        }
    })
}