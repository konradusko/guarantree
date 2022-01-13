export default async function home_main_after_auth(){
   const create_token = await import ('../create_token.js')
   const get_data = await import('../after_auth/home/get_data.js')
   try {
         await get_data.default(create_token)
   } catch (error) {
      
   }

}