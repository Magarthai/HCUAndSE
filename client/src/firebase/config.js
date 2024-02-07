import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc ,collection, getDocs} from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyC8hQX1Cb3cp6mIshjvICxsh_0hgo8mj7k",
    authDomain: "hcu-optimizing.firebaseapp.com",
    projectId: "hcu-optimizing",
    storageBucket: "hcu-optimizing.appspot.com",
    messagingSenderId: "132533632621",
    appId: "1:132533632621:web:23a74d285bb5cac0468964"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db, doc, getDoc, getFirestore, collection ,getDocs};
export default app;




