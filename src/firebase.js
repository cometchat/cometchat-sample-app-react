import firebase from "firebase/app";
import "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAcG7iLRqMENDD11Dr68ufKP0Hllns4hcw",
    authDomain: "push-notification-testin-b511f.firebaseapp.com",
    projectId: "push-notification-testin-b511f",
    storageBucket: "push-notification-testin-b511f.appspot.com",
    messagingSenderId: "891111922927",
    appId: "1:891111922927:web:230c60ebc6fde976b68f1a",
    measurementId: "G-W72N7QMQEM"
};
  
const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);
 
const messaging = initializedFirebaseApp.messaging();

firebase.messaging().onMessage(message => {
    console.log("message", message);
});
export { messaging };
