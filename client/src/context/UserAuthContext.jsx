import React, { createContext, useContext, useEffect, useState } from 'react';
import {where,doc} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';

import { auth, db } from '../firebase/config';

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState(null);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
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
        const usersCollection = collection(db, 'users');
  
        const q = query(usersCollection, where('uid', '==', user.uid));
  
        const usersSnapshot = await getDocs(q);
  
        if (!usersSnapshot.empty) {
          const currentUserData = usersSnapshot.docs[0].data();
          
          // Access the document ID
          const documentId = usersSnapshot.docs[0].id;
  
          // Include the uid and document ID in the userData object
          const updatedUserData = {
            ...currentUserData,
            userID: documentId,
          };
  
          setUserData(updatedUserData);
          console.log('User Data:', updatedUserData);
          console.log('Document ID:', documentId);
        } else {
          console.log('User not found');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  

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
    <userAuthContext.Provider value={{ user, userData, logIn, signUp, logOut,resetPassword,resetPassword2 }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
