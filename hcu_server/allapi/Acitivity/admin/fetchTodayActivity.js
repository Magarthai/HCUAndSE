const express = require('express');
const { initializeApp } = require('firebase/app');
const { collection, getDoc, query, where,doc,getDocs } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../../firebase');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();
const today = new Date();
today.setHours(0, 0, 0, 0); 

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
const checkCurrentDate = getCurrentDate();

router.get('/fetchTodayActivity', async (req,res) => {
    try {
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
            console.log(activitiesData,"activitiesDataactivitiesDataactivitiesData")
            res.json(activitiesData);
        
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
});


module.exports = router;