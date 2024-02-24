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
        const userActivityList = userInfo.userActivity
        const promises = userActivityList.map(id => getDoc(doc(db, 'activities', id)));
        const activityDocs = await Promise.all(promises);

        const formattedDocs = activityDocs.map(docSnapshot => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                data.timeSlots = JSON.stringify(data.timeSlots)
                data.timeSlots = JSON.parse(data.timeSlots)
                console.log(data.timeSlots)
                let hasMatch = false; // สร้างตัวแปรเพื่อตรวจสอบว่ามีวันที่ตรงกับวันปัจจุบันหรือไม่
                for (const timeSlot of data.timeSlots) { // วนลูปเช็คทุก index ใน timeSlots
                    console.log(timeSlot.date);
                    const activityDate = new Date(timeSlot.date);
                    if (data.activityType === "yes" && isSameDay(activityDate, today)) {
                        hasMatch = true; // ถ้าพบวันที่ตรงกับวันปัจจุบันให้กำหนดให้ hasMatch เป็น true
                        break; // ออกจากลูปเมื่อพบวันที่ตรงกับวันปัจจุบัน
                    }
                }
                if (hasMatch) {
                    return { id: docSnapshot.id, data: data };
                } else {
                    return null;
                }
            } else {
                return null; 
            }
        }).filter(doc => doc !== null);
        
        

        if (formattedDocs.length > 0) {

            console.log(`user have ${formattedDocs.length} activity`)
            res.json(formattedDocs);
        } else {
            console.log("no activivity registered")
        }

    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;