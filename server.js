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

//post register
import {create_account} from './post_requests/create_account.js'
import {create_account_config} from './configs/create_account_config.js'
/*
@createAccount
-sprawdzam czy wszystko jest typem string
-sprawdzam czy występują tagi html
-przekazuje config


*/
app.post(
    '/createAccount',
    middleware_type_of_data,
    middleware_find_html,
    create_account_config,
    create_account
)




app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });