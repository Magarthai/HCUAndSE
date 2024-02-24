const express = require('express');
const { collection,addDoc,doc,updateDoc,arrayUnion,getDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { runTransaction } = require('firebase/firestore');

const firebaseConfig = require('../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();

const requestCounts = {};
const MAX_REQUESTS_PER_SECOND = 1;

const limitRequests = (req, res, next) => {
    if (req.ip in requestCounts && requestCounts[req.ip] >= MAX_REQUESTS_PER_SECOND) {
        return res.status(429).send('Too Many Requests (Per Second)');
    }
    
    requestCounts[req.ip] = (requestCounts[req.ip] || 0) + 1;

    setTimeout(() => {
        requestCounts[req.ip] = (requestCounts[req.ip] || 0) - 1;
    }, 1000);

    next();
};

router.post('/addUserActivity', limitRequests, async (req, res) => {
    try {
        const appointmentInfo = req.body;
        appointmentInfo.timeSlots = JSON.parse(appointmentInfo.timeSlots);
        console.log(appointmentInfo);
        const userDocRef = doc(db, 'users', appointmentInfo.userData.userID);
        const activitiesDocRef = doc(db, 'activities', appointmentInfo.activityId);
        const userDoc = doc(db, 'users', appointmentInfo.userData.userID);
        const querySnapshot = await getDoc(userDoc);

        if (querySnapshot.exists()) {
            const userData = querySnapshot.data();
            console.log(userData)
            if (userData.userActivity.some(activity => activity.activityId === appointmentInfo.activityId)) {
                console.log("Activity already exists for this user.");
                return res.json("already-exists");
            } else {
                await runTransaction(db, async (transaction) => {
                    const docSnapshot = await transaction.get(activitiesDocRef);
                    const existingData = docSnapshot.data();
                    const checkLength = existingData.timeSlots[appointmentInfo.timeSlots.index].userList;

                    console.log(checkLength.length, "XD");
                    if (checkLength.length < parseInt(existingData.timeSlots[appointmentInfo.timeSlots.index].registeredCount)) {
                        existingData.timeSlots[appointmentInfo.timeSlots.index].userList.push(appointmentInfo.userData.userID);

                        transaction.update(activitiesDocRef, {
                            timeSlots: existingData.timeSlots
                        });
                        await updateDoc(userDocRef, {
                            userActivity: arrayUnion({activityId: appointmentInfo.activityId, index: appointmentInfo.timeSlots.index}),
                        });
                        return res.json("success"); // ให้คืนค่าและหยุดการทำงานที่นี่
                    } else {
                        return res.json("already-full"); // ให้คืนค่าและหยุดการทำงานที่นี่
                    }
                });
            }
        } 
        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});




module.exports = router;