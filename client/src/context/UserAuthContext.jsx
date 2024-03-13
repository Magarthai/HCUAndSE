import React, { createContext, useContext, useEffect, useState } from 'react';
import {where,doc} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset
} from 'firebase/auth';
import { collection, getDocs, query,updateDoc } from 'firebase/firestore';
import male from "../picture/male.png";
import female from "../picture/female.png";
import { auth, db } from '../firebase/config';
import liff from '@line/liff';
import axios from 'axios';
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const REACT_APP_MONGO_API = process.env.REACT_APP_MONGO_API
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState(male);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function sendEmailVerify(email) {
    return sendEmailVerification(auth, email);
  }

  function resetPassword2(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword)
  }

  function logOut() {
    setUserData(null);
    return signOut(auth);
  }
  

  const fetchUserData = async () => {
    try {
      if (user && !userData) {
        const info = {
          uid: user.uid,
        }
        const checkStudentByID = await axios.post(`${REACT_APP_MONGO_API}/api/getUserData`, info);
        const userData = checkStudentByID.data
  
          setUserData(userData);
          console.log('User Data:', userData);
          console.log('Document ID:', userData._id);
        } else {
          console.log('User not found');
        }
      } catch(error){
        console.log(error)
      }
  };
  
  

    const initLine = () => {
      if(liff.isInClient()){
        liff.init({ liffId: '2002624288-QkgWM7yy' }, () => {
          if(liff.isInClient()){
            if (liff.isLoggedIn()) {
                runApp();
            } else {
                liff.login();
            }
          }
        }, err => console.error(err));
      }
    }

    const runApp = async() => {
      if(liff.isInClient()){
        const idToken = liff.getIDToken();
        setIdToken(idToken);
        liff.getProfile().then(profile => {
            console.log(profile);
            setDisplayName(profile.displayName);
            setStatusMessage(profile.statusMessage);
            setUserId(profile.userId);
            if (profile.pictureUrl) {
            setProfile(profile.pictureUrl);
            } else {
              if(userData.gender == 'female') {
                setProfile(female);
              } else if(userData.gender == 'male') {
                setProfile(male);
              }
            }
        }).catch(err => console.error(err));
      } else {
        if(userData) {
          if(userData.gender == 'female') {
            setProfile(female);
          } else if(userData.gender == 'male') {
            setProfile(male);
          }
        }
      }
    }

    
    useEffect(() => {
      if(liff.isInClient()){
      if(!userId){
        initLine();
      }
    }
    }, []); 
    useEffect(() => {
        if (userData) {
          if(liff.isInClient()){
            console.log("get user data ID")
            a();
            console.log("update doneXDAC",userData.userID)
            
          }
        }
        
    }, [userData]);


    const a = async () => {
        const userDocRef = doc(db, 'users', userData.userID);
        await updateDoc(userDocRef, {
            userLineID: (userId),
        });
    } 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log('Auth', currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(userData);
    console.log(user);
    if (user && !userData) {
      fetchUserData();
    }
  }, [user]);
  


  return (
    <userAuthContext.Provider value={{ idToken,displayName,statusMessage,userId,profile,user, userData, logIn, signUp, logOut,resetPassword,resetPassword2,sendEmailVerify }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
