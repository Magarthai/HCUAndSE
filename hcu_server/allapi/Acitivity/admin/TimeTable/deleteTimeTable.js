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



router.post('/adminDeletTimetable', limitRequests, async (req, res) => {
    try {
        timeable = req.body;
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
            const isNewDateAfterCurrentDate = newDate > currentDate;
            if(isNewDateAfterCurrentDate) {
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
                    const body = {
                        "to": usersDataMap.userLineID,
                        "messages": [
                            {
                                "type": "flex",
                                "altText": "‼️ แจ้งเตือนเปลี่ยนแปลง ‼️",
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
                                                "text": "‼️ แจ้งเตือนเปลี่ยนแปลง ‼️"
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
                                                "text": `การนัดหมายของคุณถูกยกเลิก จาก ${appointmentData.clinic} ณ วันที่ ${appointmentData.appointmentDate} เนื่องจากมีการเปลี่ยนแปลงเวลาทำการ โปรดตรวจสอบการนัดหมายของคุณผ่านช่องทาง : *LINK* ‼️ หากมีข้อสงสัยหรือต้องการนัดหมายใหม่ สามารถนัดหมายได้ใหม่ผ่านลิ้งค์ด้านล่าง`,
                                                "wrap": true
                                            },
                                            {
                                                "type": "text",
                                                "text": "📞ติดต่อผ่านเบอร์ : 02-470-8446"
                                            },
                                            
                                            {
                                                "type": "button",
                                                "style": "link",
                                                "action": {
                                                    "type": "uri",
                                                    "label": "นัดหมายใหม่ได้ผ่านลิงค์นี้",
                                                    "uri": "line://app/2002624288-QkgWM7yy"
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                    const body2 = {
                        "to": usersDataMap.userLineID,
                        "messages": [
                            {
                                "type": "flex",
                                "altText": "‼️ แจ้งเตือนเปลี่ยนแปลง ‼️",
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
                                                "text": "‼️ แจ้งเตือนเปลี่ยนแปลง ‼️"
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
                                                "text": `การนัดหมายของคุณถูกยกเลิก จาก ${appointmentData.clinic} ณ วันที่ ${appointmentData.appointmentDate} เนื่องจากมีการเปลี่ยนแปลงเวลาทำการ`,
                                                "wrap": true
                                            },
                                            {
                                                "type": "text",
                                                "text": "📞 กรุณาติดต่อผ่านเบอร์ : 02-470-8446 เผื่อเลือกช่วงเวลานัดหมายใหม่"
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                    if(appointmentData.clinic == "คลินิกกายภาพ" || appointmentData.clinic == "คลินิกฝั่งเข็ม"){
                        if(appointmentData.type == "main"){
                            const response = await axios.post(`${LINE_BOT_API}/push`, body2, { headers });
                            console.log('Response:', response.data);
                        }
                    } else {
                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                        console.log('Response:', response.data);
                    }
                    return {
                        userDocId: userId,
                        ...usersDataMap,
                    };
                    
                    });
                    
                    
            }})};
          }
        }
         
        await updateDoc(timetableRef, { status : "Disabled" ,isDelete : "Yes"});
        return res.json("success");


        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});




module.exports = router;