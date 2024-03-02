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



router.post('/userGetQueueActivity', limitRequests, async (req, res) => {
    try {
        const activityInfo = req.body;
       
        console.log(activityInfo);
        const userDoc = doc(db, 'users', activityInfo.userData.userID);
        const querySnapshot = await getDoc(userDoc);
        const activityDoc = doc(db, 'activities', activityInfo.id);
        const queryActivitySnapshot = await getDoc(activityDoc);
        if (querySnapshot.exists() && queryActivitySnapshot.exists()) {

            const userData = querySnapshot.data();
            const activityData = queryActivitySnapshot.data();
            console.log(activityData)
            console.log(activityInfo.index)
            console.log(activityData.timeSlots[activityInfo.index])
            console.log(activityData.timeSlots[activityInfo.index].Queuelist,activityData.timeSlots[activityInfo.index].Queuelist.id,activityInfo.userData.userID,"activityData.timeSlots[activityInfo.index].Queuelist")
            if (activityData.timeSlots[activityInfo.index].Queuelist && activityData.timeSlots[activityInfo.index].Queuelist.length > 0) {
            if (activityData.timeSlots[activityInfo.index].Queuelist.some(activity => activity.id === activityInfo.userData.userID)) {
                console.log("Activity already exists for this user."); 
                return res.json("already-exists");
            } else if (activityData.timeSlots[activityInfo.index].SuccessList.some(activity => activity.id === activityInfo.userData.userID)) {
                console.log("Activity already exists for this user."); 
                return res.json("already-exists");
            }
            else {
                console.log("XD")
                await runTransaction(db, async (transaction) => {

                    const docSnapshot = await transaction.get(activityDoc);
                    const existingData = docSnapshot.data();
                    console.log(existingData,"existingData")
                    const Queuelist = existingData.timeSlots[activityInfo.index].Queuelist
                    console.log(Queuelist,"Queuelist",userDoc.id)
                    const newQueueList = addQueue(Queuelist, userDoc.id,userData.firstName,userData.lastName,userData.id);
                    console.log(newQueueList)
                    existingData.timeSlots[activityInfo.index].Queuelist = newQueueList

                    transaction.update(activityDoc, {
                        timeSlots: existingData.timeSlots
                    });
                    
                    console.log("userid", activityInfo.userData.userID)
                    return res.json("success");
                });
            }
        } else {
            if (activityData.timeSlots[activityInfo.index].Queuelist.some(activity => activity.id === activityInfo.userData.userID)) {
                console.log("Activity already exists for this user."); 
                return res.json("already-exists");
            }
            else if (activityData.timeSlots[activityInfo.index].SuccessList.some(activity => activity.id === activityInfo.userData.userID)) {
                console.log("Activity already exists for this user."); 
                return res.json("already-exists");
            }
            else {
                console.log(activityData.timeSlots[activityInfo.index].SuccessList)
            console.log("XD")
                await runTransaction(db, async (transaction) => {

                    const docSnapshot = await transaction.get(activityDoc);
                    const existingData = docSnapshot.data();
                    console.log(existingData,"existingData")
                    const Queuelist = existingData.timeSlots[activityInfo.index].Queuelist
                    console.log(Queuelist,"Queuelist",userDoc.id)
                    const newQueueList = addQueue(Queuelist, userDoc.id,userData.firstName,userData.lastName,userData.id);
                    console.log(newQueueList)
                    existingData.timeSlots[activityInfo.index].Queuelist = newQueueList

                    transaction.update(activityDoc, {
                        timeSlots: existingData.timeSlots
                    });
                    
                    console.log("userid", activityInfo.userData.userID)
                    return res.json("success");
                });
            }
        }
        } 
        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});




module.exports = router;