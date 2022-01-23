export default async function main_profile(){
    const create_token = await import('../create_token.js')
    const get_data_profile = await import('../get_data_from_server.js')




    //zmień avatar będzie dostępny tylko i wyłącznie po pobraniu danych
    get_data_profile.default(create_token,'/getProfileData').then(()=>{
        
    })
    .catch(()=>{

    })
}

    