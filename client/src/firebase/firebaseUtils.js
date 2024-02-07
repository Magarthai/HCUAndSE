import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './config';

export const fetchUserById = async (userId) => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return {
        id: userSnapshot.id,
        ...userSnapshot.data(),
      };
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
