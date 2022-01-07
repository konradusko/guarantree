import fs from 'fs'
import express from 'express'
const app = express()
const PORT = 4025
import firebase from 'firebase-admin'
const serviceAccount  = JSON.parse(fs.readFileSync('./firebase/firebase_key.json'))
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket:"gs://paragonytest-7d604.appspot.com/"
  });


app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"));

//global middleware
import { middleware_find_html } from './middlewares/check_html_tags.js'
import { middleware_type_of_data } from './middlewares/check_type_string.js'
import { check_token_middleware } from './middlewares/check_token.js'
import {check_duplicate_exists} from './middlewares/check_duplicate_exists.js'

//post register
import {create_account} from './post_requests/user/create_account.js'
import {create_account_config} from './configs/user/create_account_config.js'
import {user_avatar_info} from './configs/user/avatar_info.js'
/*
@createAccount
-sprawdzam czy wszystko jest typem string
-sprawdzam czy występują tagi html
-sprawdzam czy nie ma zdublowanych wartosci
-przekazuje config avatar
-przekazuje config
*/
app.post(
    '/createAccount',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    user_avatar_info,
    create_account_config,
    create_account
)
/*
@deleteAccount

*/
app.post('/deleteAccount')



/*
@deleteUserAvatar
-sprawdzam czy wszystko jest typem string
-sprawdzam czy występują tagi html
-sprawdzam czy nie ma zdublowanych wartosci
-sprawdzam poprawnosc tokenu
-dołączam avatar_info_user-config
-dołączam config

*/

import {delete_user_avatar} from './post_requests/user/delete_user_avatar.js'
import {delete_user_avatar_config} from './configs/user/delete_user_avatar_config.js'
app.post(
    '/deleteUserAvatar',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    user_avatar_info,
    delete_user_avatar_config,
    delete_user_avatar
    )
/*
@addNewUserAvatar
-sprawdzam czy wszystko jest typem string
-sprawdzam czy występują tagi html
-sprawdzam czy nie ma zdublowanych wartosci
-sprawdzam poprawnosc tokenu
-dołączam config o avatarze
-dołączam config

*/
import {add_new_avatar} from './post_requests/user/add_new_avatar.js'
import {add_new_avatar_config} from './configs/user/add_new_avatar_config.js'
app.post(
    '/addNewUserAvatar',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    add_new_avatar_config,
    user_avatar_info,
    add_new_avatar
    )

// ITEM
/* ADD ITEM */
import {add_item_config} from './configs/items_and_events/add_item_config.js'
import {item_avatar_info} from './configs/items_and_events/avatar_info_item.js'
import {files_config_item} from './configs/items_and_events/files_config.js'
import {add_new_item} from './post_requests/item/add_item.js'
/**
 * Sprawdzam czy wszystko jest typem string
 * Sprawdzam czy nie występują tagi HTML
 * Sprawdzam czy nie ma zduplikowanych wartosci
 * Sprawdzam token
 * Dodaje item config
 * Dodaje avatar config
 * Dodaje files config
 */
app.post(
    '/addItem',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    add_item_config,
    item_avatar_info,
    files_config_item,
    add_new_item
    )

/**
 * UPDATE ITEM
 * * Sprawdzam czy wszystko jest typem string
 * Sprawdzam czy nie występują tagi HTML
 * Sprawdzam czy nie ma zduplikowanych wartosci
 * Sprawdzam token
 * Sprawdzam publiczne id
 * załączam token
 * załączam logike aktualizowania przedmiotu
 */
import {update_item_config} from './configs/items_and_events/update_item_config.js'
import {check_item_public_id} from './middlewares/check_item_public_id.js'
import {update_item} from './post_requests/item/update_item.js'
app.post(
    '/updateItem',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    check_item_public_id,
    update_item_config,
    update_item
)

/**
 * Delete Avatar
 *  * Sprawdzam czy wszystko jest typem string
 * Sprawdzam czy nie występują tagi HTML
 * Sprawdzam czy nie ma zduplikowanych wartosci
 * Sprawdzam token
 * Sprawdzam publiczne id
 * dołączam configi
 * dołączam silnik
 */
import {delete_item_avatar_config} from './configs/items_and_events/delete_item_avatar_config.js'
import {delete_item_avatar} from './post_requests/item/delete_item_avatar.js'
app.post(
    '/deleteItemAvatar',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    check_item_public_id,
    item_avatar_info,
    delete_item_avatar_config,
    delete_item_avatar
)

/**
 * Add new Avatar
 *  * * Sprawdzam czy wszystko jest typem string
 * Sprawdzam czy nie występują tagi HTML
 * Sprawdzam czy nie ma zduplikowanych wartosci
 * Sprawdzam token
 * Sprawdzam publiczne id
 * dołączam configi
 * dołączam silnik
 */
import {add_new_avatar_item} from './post_requests/item/add_new_avatar_item.js'
import {add_new_avatar_item_config} from './configs/items_and_events/add_new_avatar_item_config.js'
app.post(
    '/addNewAvatarItem',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    check_item_public_id,
    item_avatar_info,
    add_new_avatar_item_config,
    add_new_avatar_item
    )

/**
 * Remove files
 *  Sprawdzam czy wszystko jest typem string
 * Sprawdzam czy nie występują tagi HTML
 * Sprawdzam czy nie ma zduplikowanych wartosci
 * Sprawdzam token
 * Sprawdzam publiczne id
 * Załączam config  
*/
import {remove_item_files_config} from './configs/items_and_events/remove_item_files_config.js'
import {remove_item_file} from './post_requests/item/remove_item_file.js'
app.post(
    '/removeItemFile',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    check_item_public_id,
    remove_item_files_config,
    remove_item_file
)
/**
 * Add new files
 * Sprawdzam czy wszystko jest typem string
 * Sprawdzam czy nie występują tagi HTML
 * Sprawdzam czy nie ma zduplikowanych wartosci
 * Sprawdzam token
 * Sprawdzam publiczne id
 */
import {add_new_item_file_config} from './configs/items_and_events/add_new_file_item_config.js'
import {add_item_files} from './post_requests/item/add_item_files.js'
app.post(
    '/addNewFileItem',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    check_item_public_id,
    add_new_item_file_config,
    files_config_item,
    add_item_files

)
/**
 * Delete item
 */

//event
/**
 * Dodanie eventu
 * * Sprawdzam czy wszystko jest typem string
 * Sprawdzam czy nie występują tagi HTML
 * Sprawdzam czy nie ma zduplikowanych wartosci
 * Sprawdzam token
 * Sprawdzam publiczne id
 * dołączam ogólny config plików
 */
import {add_event_config} from './configs/items_and_events/add_event_config.js'
import {add_event} from './post_requests/event/add_event.js'
app.post('/addEvent',
    middleware_type_of_data,
    middleware_find_html,
    check_duplicate_exists,
    check_token_middleware,
    check_item_public_id,
    files_config_item,
    add_event_config,
    add_event
    )
/**
 * Aktualizowanie eventu
 */
app.post('/updateEvent')

/**
 * Dodanie plików
 */
app.post('/addFilesEvent')
/**
 * Usunięcie plików
 */
app.post('/deleteFilesEvent')

/**
 * Usunięcie eventu
 */

app.post('/deleteItem')
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });