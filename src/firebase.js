import React from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyBYDtvUcsPUm-j7Jm2ELnjkR47wpufE2vw",
    authDomain: "insta-clone-8d65e.firebaseapp.com",
    projectId: "insta-clone-8d65e",
    storageBucket: "insta-clone-8d65e.appspot.com",
    messagingSenderId: "43218416168",
    appId: "1:43218416168:web:826976a85f8516cdba3b1d",
    measurementId: "G-5L2YTNJFND"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth()
  const storage = firebase.storage()
  const db = app.firestore()

export {auth,db,storage}
