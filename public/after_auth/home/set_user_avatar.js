export default function set_user_avatar(avatar){
    const html_avatar = document.querySelector('#home_page_user_avatar')
    html_avatar.src = avatar.avatar_path
    html_avatar.dataset.public = avatar.avatar_public
    html_avatar.dataset.avatar_id = avatar.avatar_id
}

