const express = require('express');
const { initializeApp } = require('firebase/app');
const { collection, getDoc, query, where, doc } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../firebase');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();
const today = new Date();
today.setHours(0, 0, 0, 0);


function isNotSameDay(date1, date2) {
    console.log(date1, date2)
    return date1 >= date2;
}

router.post('/fetchActivityNotTodayQueue', async (req, res) => {
    try {
        const userInfo = req.body;
        const userActivityList = userInfo.userActivity;
        console.log(userActivityList);
        const promises = userActivityList.map(activity => getDoc(doc(db, 'activities', activity.activityId)));
        const activityDocs = await Promise.all(promises);
        const formattedDocs = activityDocs.map((docSnapshot, index) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log(data, "XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
                data.timeSlots = JSON.stringify(data.timeSlots)
                data.timeSlots = JSON.parse(data.timeSlots)
                console.log(data.timeSlots, "data.timeSlotsdata.timeSlotsdata.timeSlotsdata.timeSlots")
                let hasMatch = false;
                if (data.activityType === "yes") {
                    for (const timeSlot of data.timeSlots) {
                        console.log(timeSlot.QueueOpen);
                        console.log(timeSlot.endTime);
                        console.log(timeSlot.SuccessList);
                        console.log(timeSlot.date, "const timeSlot of data.timeSlots CHECK");
                        const activityDate = new Date(timeSlot.date);
                        activityDate.setHours(0, 0, 0, 0);
                        if (data.timeSlots[userActivityList[index].index].QueueOpen == 'no' && isNotSameDay(activityDate, today)) {
                            console.log("is same day")
                            hasMatch = true;
                            break;
                        } else {
                            console.log("is not same day", isNotSameDay(activityDate, today))
                        }

                    }
                    if (hasMatch) {
                        return { id: docSnapshot.id, index: userActivityList[index].index, openQueueDate: data.openQueueDate, activityName: data.activityName, endQueueDate: data.endQueueDate, data: data.timeSlots[userActivityList[index].index] };
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }).filter(doc => doc !== null);
        if (formattedDocs.length > 0) {
            console.log(`user has ${formattedDocs.length} activity`);
            console.log(formattedDocs, "filteredDocssss");
            if (formattedDocs == [undefined]) {
                console.log("test [ undefined ]")
            }

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