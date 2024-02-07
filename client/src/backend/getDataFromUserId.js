import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { query, where } from 'firebase/firestore';

export const getUserDataFromUserId = async (appointment, userId, timeslot, appointmentuid) => {
    const usersCollection = collection(db, 'users');
    const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

    if (userQuerySnapshot.empty) {
        console.log("No user found with id:", userId);
        return null;
    }

    const userUid = userQuerySnapshot.docs[0].id;
    const userDatas = userQuerySnapshot.docs[0].data();
    userDatas.timeslot = timeslot;
    userDatas.appointment = appointment;
    userDatas.appointmentuid = appointmentuid;
    userDatas.userUid = userUid;
    console.log("User Data for userId", userId, ":", userDatas);
    console.log("userDatas", userDatas)
    console.log("testxd", userDatas.timeslot.start)
    return userDatas;
};