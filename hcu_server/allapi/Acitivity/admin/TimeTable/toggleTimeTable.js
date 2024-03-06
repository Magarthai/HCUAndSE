const express = require('express');
const { collection,addDoc,doc,updateDoc,arrayUnion,arrayRemove,getDoc,deleteDoc,getDocs,query,where} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { runTransaction } = require('firebase/firestore');
const { FieldValue } = require('firebase/firestore');
const firebaseConfig = require('../../../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();
const axios = require('axios');
const requestCounts = {};
const MAX_REQUESTS_PER_SECOND = 10;
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN; 
const LINE_BOT_API = "https://api.line.me/v2/bot/message"; 
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` 
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



router.post('/adminToggleTimetable', limitRequests, async (req, res) => {
    try {
        timeable = req.body;
        console.log(timeable.id)
        const timetableRef = doc(db, 'timeTable', `${timeable.id}`);
        console.log(timeable,"timetable");
        console.log(timeable.appointmentList.length,"length")
        const querySnapshot = await getDoc(timetableRef);
        if (querySnapshot.exists()){
        const timeTableData = querySnapshot.data();
        console.log(timeTableData,"console.log(timeTableData)")
        for (let i = 0; i < timeTableData.appointmentList.length; i++) {
            let timeAppointmentSlot = timeTableData.appointmentList[i];
            const appointmentDocRef = doc(db, 'appointment', timeAppointmentSlot.appointmentId);
            console.log(timeAppointmentSlot.appointmentId,"timeAppointmentSlot.appointmentId")
            const appointmentDocSnapshot = await getDoc(appointmentDocRef);
            const appointmentData = appointmentDocSnapshot.data();
            console.log("timeAppointmentSlot.date",timeAppointmentSlot.appointmentDate)
            const [day, month, year] = timeAppointmentSlot.appointmentDate.split('/');
            const currentDate = new Date();
            const newDate = new Date(year, month - 1, day); 
            const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            const isToday = newDate.getDate() === currentDate.getDate() &&
                newDate.getMonth() === currentDate.getMonth() &&
                newDate.getFullYear() === currentDate.getFullYear();
            console.log(isToday,"isToday")
            if(isToday) {
                console.log("check555")
            await runTransaction(db, async (transaction) => {
            if (appointmentDocSnapshot.exists()){
                const usersCollection = collection(db, 'users');
                    const usersQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', `${appointmentData.appointmentId}`)));
                    const existingUsers = usersQuerySnapshot.docs.map(async(docs) => {
                    const usersDataMap = docs.data();
                    console.log(usersDataMap,"usersDataMap")
                    const userId = docs.id; 
                    console.log(userId)
                    const appointmentsRef = doc(db, 'users', userId);
                    transaction.update(appointmentsRef, {
                        appointments: arrayRemove('appointments', timeAppointmentSlot.appointmentId),
                      });
                    console.log("check1")
                    transaction.delete(appointmentDocRef);
                    console.log("check2")
                    const timetableRef2 = doc(db, 'timeTable', `${timeable.id}`);
                    const querySnapshot2 = await getDoc(timetableRef2);
                    if (querySnapshot2.exists()){
                    console.log("querySnapshot2.exists()")
                    const timetable2 = querySnapshot2.data();
                    const timeTableRemoveArray = timetable2.appointmentList.filter(item => item.appointmentId !== timeAppointmentSlot.appointmentId);
                    console.log("check3",timeTableRemoveArray)
                    await updateDoc(timetableRef, { appointmentList: timeTableRemoveArray });
                    }
                    const body = {
                        "to": usersDataMap.userLineID,
                        "messages":[
                            {
                                "type":"text",
                                "text": `นัดหมาย${timeable.clinic}คุณ ณ. วันที่${formattedDate} ถูกยกเลิกกรุณาลงทะเบียนใหม่` // Message content
                            }
                        ]
                    }
                    try {
                    const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                    console.log('Response:', response.data);
                    } catch (error) {
                    console.error('Error:', error);
                    }
                    return {
                        userDocId: userId,
                        ...usersDataMap,
                    };
                    
                    });
                    
                    
            }})};
          }
        }
         
        updateDoc(timetableRef, { status: "Disabled" }).catch(error => {
            console.error('Error updating timetable status:', error);
        });
        return res.json("success");


        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});




module.exports = router;