const router = require('express').Router(); 
const Holiday = require("../../models/holiday.model");
const asyncHandler = require('express-async-handler');
const { collection,addDoc,doc,updateDoc,arrayUnion,getDoc,getDocs,arrayRemove,where,query} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { runTransaction } = require('firebase/firestore');
const axios = require('axios');
const firebaseConfig = require('../../config/firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


router.post('/createHoliday', asyncHandler(async (req, res) => {
    try {   
        const LINE_ACCESS_TOKEN = "WOHHQHgzpE0GbbSYHMu8yKvnmbH3b7RPBdMvCfHCojMG7A8Dm1Xn3KsPZ/w/r4Y+mm/TH11+2lBmRmASmWC59LLxt99DJKMXhFo6ydfVyrIuLNlkH1fqRIn/cTnO0635vkcqux610lMpBLDDK+ge9AdB04t89/1O/w1cDnyilFU="; 
        const LINE_BOT_API = "https://api.line.me/v2/bot/message"; 
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer WOHHQHgzpE0GbbSYHMu8yKvnmbH3b7RPBdMvCfHCojMG7A8Dm1Xn3KsPZ/w/r4Y+mm/TH11+2lBmRmASmWC59LLxt99DJKMXhFo6ydfVyrIuLNlkH1fqRIn/cTnO0635vkcqux610lMpBLDDK+ge9AdB04t89/1O/w1cDnyilFU=` 
        }
        const appointmentCollection = collection(db,"appointment");
        const snapShotAppointment = await getDocs(query(appointmentCollection, where("appointmentDate","==", `${req.body.date}`)))
        const exitsAppointment = snapShotAppointment.docs.map((doc) => {
            const appointmentData = doc.data();
            return{
                appointmentUid: doc.id,
                ...appointmentData
            }

        });
        await runTransaction(db, async (transaction) => {
        for (let i = 0; i < exitsAppointment.length; i++) {
            let appointment = exitsAppointment[i];
            console.log(appointment,"appointment")
            const timeTableCollection = doc(db, 'timeTable', appointment.appointmentTime.timetableId);
            const snapShotTimeTable = await getDoc(timeTableCollection); // Make sure to use await here
            if (snapShotTimeTable.exists()) {
                const timeTableData = snapShotTimeTable.data();
                const timeTableRemoveArray = timeTableData.appointmentList.filter(item => item.appointmentId !== appointment.appointmentUid);
                await updateDoc(timeTableCollection, { appointmentList: timeTableRemoveArray });
                const usersCollcetion = collection(db,"users");
                const userDataSnapShot = await getDocs(query(usersCollcetion,where('id', '==', appointment.appointmentId)));
                const exitUserDataSnapShot = userDataSnapShot.docs.map((doc) => {
                    const userData = doc.data();
                    return{
                        userDocId: doc.id,
                        ...userData
                    }
        
                });
                console.log(exitUserDataSnapShot[0].userLineID,"lineID")
                if(exitUserDataSnapShot[0].userLineID != ""){
                    const body = {
                        "to": exitUserDataSnapShot[0].userLineID,
                        "messages":[
                            {
                                "type":"text",
                                "text": `ขออภัยในความไม่สะดวก นักหมายของคุณวันที่ ${appointment.appointmentDate} ถูกยกเลิกเนื่องจากเหตุผล : ${req.body.note} กรุณาทํารายการใหม่อีกครั้งด้วย ครับ/ค่ะ` // Message content
                            }
                        ]
                    }
                    try {
                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                        console.log('Response:', response.data);
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                const userRef = doc(db, 'users', exitUserDataSnapShot[0].userDocId);
                transaction.update(userRef, {
                    appointments: arrayRemove('appointments', exitUserDataSnapShot[0].userDocId),
                  });
                console.log(exitUserDataSnapShot[0].appointmentUid)
                const appointmentDocRef = doc(db, 'appointment', appointment.appointmentUid);
                transaction.delete(appointmentDocRef);
            } else {
                console.log("Document does not exist"); 
            }
            
           
        }
        });
        const newHoliday = await Holiday.create(req.body);
        res.json("success");
    } catch (error) {
        console.log(error, "create user");
        res.status(500).send("Internal Server Error"); 
    }
    
}));

module.exports = router;

