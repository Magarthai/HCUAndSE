const express = require('express');
const { initializeApp } = require('firebase/app');
const { collection, getDoc, query, where,doc } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../firebase');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();
const today = new Date();
today.setHours(0, 0, 0, 0); 

function isSameDay(date1, date2) {
    console.log(date1,date2)
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

router.post('/fetchOpenQueueTodayActivity', async (req,res) => {
    try {
        const userInfo = req.body;
        const userActivityList = userInfo.userActivity;
        console.log(userActivityList);
        const promises = userActivityList.map(activity => getDoc(doc(db, 'activities', activity.activityId)));
        const activityDocs = await Promise.all(promises);
        const formattedDocs = activityDocs.map((docSnapshot, index) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                data.timeSlots = JSON.stringify(data.timeSlots)
                data.timeSlots = JSON.parse(data.timeSlots)
                console.log(data.timeSlots)
                let hasMatch = false;
                for (const timeSlot of data.timeSlots) { 
                    console.log(timeSlot.date,"const timeSlot of data.timeSlotsXD");
                    const activityDate = new Date(timeSlot.date);
                    if (isSameDay(activityDate, today)) {
                        data.openQueueStatus = data.timeSlots[userActivityList[index].index].QueueOpen
                        hasMatch = true; 
                        break; 
                        }
                    }
                
                if (hasMatch) {
                    return {openQueueStatus:data.openQueueStatus, id: docSnapshot.id, index: userActivityList[index].index, openQueueDate: data.openQueueDate,activityName: data.activityName, endQueueDate: data.endQueueDate, data: data.timeSlots[userActivityList[index].index], };
                } else {
                    return null;
                }
            } else {
                return null; 
            }
        }).filter(doc => doc !== null);
        if (formattedDocs.length > 0) {
            console.log(`user have ${formattedDocs.length} activity`)
            console.log(formattedDocs,"formattedDocsssssssssssssssss")
            res.json(formattedDocs);
        } else {
            console.log("no activity registered")
        }

    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;