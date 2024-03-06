import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc ,collection, getDocs} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId:process.env.MEASURE_MENT_ID

};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db, doc, getDoc, getFirestore, collection ,getDocs};
export default app;




