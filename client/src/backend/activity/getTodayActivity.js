import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { db, getDocs, collection, doc, getDoc } from "../../firebase/config";

export const fetchTodayActivity = async (user, checkCurrentDate) => {
    try {
        if (user && checkCurrentDate) {
            const activitiesCollection = collection(db, 'activities');

            const querySnapshot = await getDocs(activitiesCollection);

            const activitiesData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((activity) => activity.timeSlots.some(slot => slot.date === checkCurrentDate));

            return activitiesData;
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

export const fetchOpenActivity = async (user, checkCurrentDate) => {
    try {
        if (user && checkCurrentDate) {
            const activitiesCollection = collection(db, 'activities');

            const querySnapshot = await getDocs(query(
                activitiesCollection,
                where('queenStatus', '==', 'open'),
            ));

            const activitiesData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            

            return activitiesData;
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}


export const fetchCloseActivity = async (user, checkCurrentDate) => {
    try {
        if (user && checkCurrentDate) {
            const activitiesCollection = collection(db, 'activities');

            const querySnapshot = await getDocs(query(
                activitiesCollection,
                where('queenStatus', '==', "close"),
            ));

            const activitiesData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))


            return activitiesData;
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

export const fetchAllActivity = async (user, checkCurrentDate) => {
    try {
        if (user && checkCurrentDate) {
            const activitiesCollection = collection(db, 'activities');

            const querySnapshot = await getDocs(query(
                activitiesCollection,
            ));

            const activitiesData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))


            return activitiesData;
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}