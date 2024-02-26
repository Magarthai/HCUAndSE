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
            .map((activity) => ({
                ...activity,
                timeSlots: activity.timeSlots.map((slot, index) => ({
                    ...slot,
                    id: activity.id,
                    activityName: activity.activityName,
                    openQueueDate: activity.openQueueDate,
                    endQueueDate: activity.endQueueDate,
                    activityType: activity.activityType,
                    activityStatus: activity.activityStatus,
                    index: index 
                })),
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
                where('activityStatus', '==', 'open'),
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

export const fetchUserAllActivity = async (user, checkCurrentDate) => {
    try {
        if (user && checkCurrentDate) {
            const activitiesCollection = collection(db, 'activities');

            const querySnapshot = await getDocs(query(
                activitiesCollection,
                where('openQueueDate', '<=', checkCurrentDate),
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
                where('activityStatus', '==', "close"),
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