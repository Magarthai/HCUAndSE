import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc ,collection, getDocs} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDmwM30APYs62qlMx4HSNxrUQ5cFcTB5IM",
  authDomain: "hcu-test.firebaseapp.com",
  projectId: "hcu-test",
  storageBucket: "hcu-test.appspot.com",
  messagingSenderId: "1043366648624",
  appId: "1:1043366648624:web:69e71a9886b747e49506f5"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db, doc, getDoc, getFirestore, collection ,getDocs};
export default app;




