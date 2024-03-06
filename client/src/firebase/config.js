import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc ,collection, getDocs} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDkTX-23ykC4wkl4a1tl1DT4dkGtr67L_Y",
  authDomain: "hcu-kmutt.firebaseapp.com",
  projectId: "hcu-kmutt",
  storageBucket: "hcu-kmutt.appspot.com",
  messagingSenderId: "195854847510",
  appId: "1:195854847510:web:d81ebd801efb56d7aa6f37",
  measurementId: "G-MVCRXWQKEE"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db, doc, getDoc, getFirestore, collection ,getDocs};
export default app;




