// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCuts-N1bPLc9Kr1cwkhvL6pCQGJTxys88",
    authDomain: "dreamtalk-f6108.firebaseapp.com",
    projectId: "dreamtalk-f6108",
    storageBucket: "dreamtalk-f6108.appspot.com",
    messagingSenderId: "550251729643",
    appId: "1:550251729643:web:eb985cdbd4f1e86e05a4ae",
    measurementId: "G-86BYT1YWLP"
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const auth = getAuth(app);

export { auth };
