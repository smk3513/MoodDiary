// Import the functions you need from the SDKs you need
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAchVx-Al9JsSidEwyn1IqZ4oyParGWxcA",
  authDomain: "mooddiary-5fad4.firebaseapp.com",
  projectId: "mooddiary-5fad4",
  storageBucket: "mooddiary-5fad4.appspot.com",
  messagingSenderId: "792426653283",
  appId: "1:792426653283:web:cbda896fd421965b9afa56"
};
let FIREBASE_APP;
if (!getApps().length) {
  FIREBASE_APP = initializeApp(firebaseConfig);
  initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  FIREBASE_APP = getApp();
}


const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);


export {FIREBASE_AUTH, FIRESTORE_DB};