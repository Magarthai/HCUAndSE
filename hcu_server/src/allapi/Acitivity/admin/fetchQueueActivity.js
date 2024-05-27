const express = require('express');
const { collection,addDoc,doc,updateDoc,arrayUnion,getDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { runTransaction } = require('firebase/firestore');

const firebaseConfig = require('../../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();

const requestCounts = {};
const MAX_REQUESTS_PER_SECOND = 10;

function addQueue(queueList, newId,firstName,lastName,userID) {
    if (queueList.length === 0) {
        queueList.push({ id: newId, queue: 'A001', firstName: firstName, lastName: lastName,userID:userID,status:""  });
        return queueList;
    } else {
        const lastQueue = queueList[queueList.length - 1].queue;
        const queueNumber = parseInt(lastQueue.substring(1)) + 1;
        const newQueue = 'A' + queueNumber.toString().padStart(3, '0');
        queueList.push({ id: newId, queue: newQueue, firstName: firstName, lastName: lastName,userID:userID,status:""  });
        console.log(queueList,"queueListqueueListqueueListqueueListqueueListqueueListqueueListqueueListqueueListqueueListqueueListqueueList")
        return queueList;
    }
}

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



router.post('/adminGetQueueActivity', limitRequests, async (req, res) => {
    try {
        let activityInfo = {}
        activityInfo = req.body;
        console.log(activityInfo.id);
        const activityDoc = doc(db, 'activities', activityInfo.id);
        const queryActivitySnapshot = await getDoc(activityDoc);
        const activityData = queryActivitySnapshot.data(); 
        const timeSlots = activityData.timeSlots.map((slot, index) => ({
            ...slot,
            id: activityInfo.id,
            activityName: activityData.activityName,
            openQueueDate: activityData.openQueueDate,
            endQueueDate: activityData.endQueueDate,
            activityType: activityData.activityType,
            activityStatus: activityData.activityStatus,
            index: index 
        }));

        const timeSlotIndex = timeSlots[activityInfo.index]
        console.log(timeSlotIndex);

        if(timeSlotIndex.length <= 0) {
            return res.json("error");
        } else {
            return res.json(timeSlotIndex);
        }

        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});




module.exports = router;