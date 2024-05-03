import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc ,collection, getDocs} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDIqtqA7_22ZfSpQbuOAqrqkHfKp0Ezy7s",
  authDomain: "healthcareunitkmutt.firebaseapp.com",
  projectId: "healthcareunitkmutt",
  storageBucket: "healthcareunitkmutt.appspot.com",
  messagingSenderId: "216301803833",
  appId: "1:216301803833:web:952c5dd74aca58bf90b0e8"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db, doc, getDoc, getFirestore, collection ,getDocs};
export default app;




