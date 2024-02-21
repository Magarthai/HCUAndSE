const express = require('express');
const { collection,addDoc,doc,updateDoc,arrayUnion} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = require('../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


const router = express.Router();

router.post('/addUserActivity', async (req, res) => {
    try {
        const appointmentInfo = req.body;
        appointmentInfo.timeSlots = JSON.parse(appointmentInfo.timeSlots)
        console.log(appointmentInfo);
        const appointmentRef = await addDoc(collection(db, 'userActivity'), appointmentInfo);
        const userDocRef = doc(db, 'users', appointmentInfo.userData.userID);
        const activitiesDocRef = doc(db, 'activities', appointmentInfo.activityId);

        await updateDoc(activitiesDocRef, {
            userActivity: arrayUnion(appointmentInfo.userData),
        });

        await updateDoc(userDocRef, {
            userActivity: arrayUnion(appointmentInfo.activityId),
        });
        
        res.json(appointmentRef);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;