import { makeId } from "../../modules/create_id/create_id.js"
const user_avatar_info = (req,res,next)=>{
    res.locals.avatar_information={
        allow_format:["image/png","image/jpg"],
        max_size_of_file:2100000,
        public_avatars:[
            {
             public:true,
             path:'./path1',
             type:'TUTAJ BRAK AVATARAAAAAA, BIALE TLOOOOOOO',
             id:makeId(20)
            },
            {
            public:true,
            path:'./path2',
            type:'image/png',
            id:makeId(20)
            },
            {
            public:true,
            path:'./path3',
            type:'image/png',
            id:makeId(20)
            },
            {
                public:true,
                path:'./path1',
                type:'image/png',
                id:makeId(20)
               },
        ]
    }
    next()
}
export{user_avatar_info}