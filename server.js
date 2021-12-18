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
@updateAccount
*/
app.post('/updateAccound')

/*
@deleteUserAvatar

*/
app.post('/deleteUserAvatar')
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



app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });