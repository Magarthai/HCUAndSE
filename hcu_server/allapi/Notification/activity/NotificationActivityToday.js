const express = require('express');
const { initializeApp } = require('firebase/app');
const { collection, getDoc, query, where,doc,getDocs } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../../firebase');
const { use } = require('../../dataRoute');
const axios = require('axios');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();
const today = new Date();
today.setHours(0, 0, 0, 0); 
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN; 
const LINE_BOT_API = "https://api.line.me/v2/bot/message"; 
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` 
}
function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}
const checkCurrentDate = getCurrentDate();

const NotificationActivityToday = async () => {
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
        
        const FilteredData = activitiesData
                .flatMap((doc) => {
                    return doc.timeSlots.map((slot, index) => ({
                    ...slot,
                    id: doc.id,
                    activityName: doc.activityName,
                    openQueueDate: doc.openQueueDate,
                    endQueueDate: doc.endQueueDate,
                    activityType: doc.activityType,
                    activityStatus: doc.activityStatus,
                    index: index,
                    testid: doc.id + index
                    }));
                })
                .filter((slot) => slot.date === checkCurrentDate);
        console.log(FilteredData);
        FilteredData.forEach(async(item) => {
            const userList = item.userList;
            userList.forEach(async(user) => {
                 if(user.userLineID != ""){
                    const body = {
                        "to": user.userLineID,
                        "messages": [
                            {
                                "type": "flex",
                                "altText": "‼️ แจ้งเตือนกิจกรรม ‼️",
                                "contents": {
                                    "type": "bubble",
                                    "header": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "size": "lg",
                                                "weight" : "bold",
                                                "align" : "center",
                                                "text": "‼️ แจ้งเตือนกิจกรรม ‼️"
                                            }
                                        ]
                                    },
                                    "hero": {
                                        "type": "image",
                                        "url": "https://i.pinimg.com/564x/b3/62/f7/b362f7d08ef02029757e990343f86cb6.jpg",
                                        "size": "full",
                                    },
                                    "body": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": `🗓️รายละเอียดกิจกรรม ${item.activityName}`
                                            },
                                            {
                                                "type": "text",
                                                "text": `วันที่ : ${item.date}`
                                            },
                                            {
                                                "type": "text",
                                                "text": `เวลา : ${item.startTime} น. - ${item.endTime} น.`
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                    try {
                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                        console.log('Response:', response.data);
                    } catch (error) {
                        console.error(error);
                    }
                 }
            });
        })


    } catch (error) {
        console.log(`fetch activities error : `, error)
    }
};

module.exports = NotificationActivityToday;
