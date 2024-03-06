const express = require('express');
const { collection,addDoc,doc,updateDoc,arrayUnion,getDoc,deleteDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { runTransaction } = require('firebase/firestore');
const { FieldValue } = require('firebase/firestore');
const firebaseConfig = require('../../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();

const requestCounts = {};
const MAX_REQUESTS_PER_SECOND = 10;

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

router.post('/adminDeleteActivity', limitRequests, async (req, res) => {
    try {
        activityInfo = req.body;
        console.log(activityInfo,"activityInfo")
        console.log(activityInfo.timeSlots.length,"length")
        for (let i = 0; i < activityInfo.timeSlots.length; i++) {
            let timeSlot = activityInfo.timeSlots[i];
            for (let i = 0; i < timeSlot.userList.length; i++) {
                let user = timeSlot.userList[i];
                const userDocRef = doc(db, 'users', user.userID);

                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    const updatedUserActivity = userData.userActivity.filter(item => item.activityId !== activityInfo.id);
                    await updateDoc(userDocRef, { userActivity: updatedUserActivity });
                    
                }
                console.log(user)
            }
            console.log(timeSlot); 
          }
          
          

        const activitiesRef = doc(db, 'activities', `${activityInfo.id}`);
        deleteDoc(activitiesRef, `${activityInfo.id}`)
        
        return res.json("success");


        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});




module.exports = router;