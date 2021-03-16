import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();

// createUserWithEmailAndPassword는 사용하려면 firebase.auth() 안에 존재한다. 때문에 이를 사용하려면 firebase.auth().createUserWithEamilAndPassword();와 같이 호출해야 한다.
// 하지만 firebase.auth()를 authService로 export하면 이를 import하는 파일에서는 authService.createUserWithEmailAndPassword();와 같이 호출할 수 있는 듯?