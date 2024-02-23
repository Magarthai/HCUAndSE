const express = require('express');
const { collection,addDoc,doc,updateDoc,arrayUnion,getDoc} = require('firebase/firestore');
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
        
        const userDocRef = doc(db, 'users', appointmentInfo.userData.userID);
        const activitiesDocRef = doc(db, 'activities', appointmentInfo.activityId);

        const userDoc = doc(db, 'users', appointmentInfo.userData.userID);
        const querySnapshot = await getDoc(userDoc);

        if (querySnapshot.exists()) {
            const userData = querySnapshot.data();
            if (userData.userActivity && userData.userActivity.includes(appointmentInfo.activityId)) {
                console.log("Activity already exists for this user.");
                res.json("already-exits");
                return;
            } else {
                const appointmentRef = await addDoc(collection(db, 'userActivity'), appointmentInfo);
                await updateDoc(activitiesDocRef, {
                    userActivity: arrayUnion(appointmentInfo.userData),
                });
        
                await updateDoc(userDocRef, {
                    userActivity: arrayUnion(appointmentInfo.activityId),
                });
                console.log("Activity does not exist for this user.");
                res.json("success");
            }
        } 
        
       
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;