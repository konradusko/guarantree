import { makeId } from "../../modules/create_id/create_id.js"
const item_avatar_info = (req,res,next)=>{
    res.locals.avatar_information_item={
        allow_format:["image/png","image/jpg"],
        max_size_of_file:2100000,
        custom_avatar:{
            public:true,
            path:'./path1',
            type:'TUTAJ MA BYC CUSTOM AVATAR',
            id:makeId(20)
           },
        public_avatars:[
            {
             public:true,
             path:'./path1',
             type:'Tavatar',
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
                path:'./path4',
                type:'image/png',
                id:makeId(20)
               },
        ]
    }
    next()
}
export{item_avatar_info}