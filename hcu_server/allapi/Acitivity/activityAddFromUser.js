const express = require('express');
const { collection,addDoc,doc,updateDoc,arrayUnion,getDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { runTransaction } = require('firebase/firestore');

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
                await runTransaction(db, async (transaction) => {
                    const docSnapshot = await transaction.get(activitiesDocRef);
                    const existingData = docSnapshot.data();
                    const checkLength = existingData.timeSlots[appointmentInfo.timeSlots.index].userList

                    console.log(checkLength.length, "XD")
                    if (checkLength.length < parseInt(existingData.timeSlots[appointmentInfo.timeSlots.index].registeredCount)){
                    existingData.timeSlots[appointmentInfo.timeSlots.index].userList.push(appointmentInfo.userData.userID);

                    transaction.update(activitiesDocRef, {
                        timeSlots: existingData.timeSlots
                    });
                    await updateDoc(userDocRef, {
                        userActivity: arrayUnion(appointmentInfo.activityId),
                    });
                    res.json("success");
                } else {
                    res.json("already-full");
                }
                });
                
            }
        } 
        
       
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;