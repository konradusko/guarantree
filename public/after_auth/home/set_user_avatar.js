export default function set_user_avatar(avatar){
    const html_avatar = document.querySelector('#home_page_user_avatar')
    html_avatar.src = avatar.avatar_path
    html_avatar.dataset.Public = avatar.avatar_public
    html_avatar.dataset.AvatarId = avatar.avatar_id
}

