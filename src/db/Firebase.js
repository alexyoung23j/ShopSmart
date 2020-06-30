import firebase from 'firebase/app';
import "@firebase/firestore";
require("firebase/auth")

var firebaseConfig = {
    apiKey: "AIzaSyC91qBooEdbmpKnyDFPtISvKeErASeCqvU",
    authDomain: "smartshopper-257fe.firebaseapp.com",
    databaseURL: "https://smartshopper-257fe.firebaseio.com",
    projectId: "smartshopper-257fe",
    storageBucket: "smartshopper-257fe.appspot.com",
    messagingSenderId: "981798472116",
    appId: "1:981798472116:web:85851e2e3b1921b6a20ae1",
    measurementId: "G-V6704Z495Y"
  };

firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default firebase

