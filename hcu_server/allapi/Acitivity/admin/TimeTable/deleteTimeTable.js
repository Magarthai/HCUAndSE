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
        console.log(LINE_ACCESS_TOKEN,"LINE_ACCESS_TOKEN")
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
                                        "url": "https://i.pinimg.com/564x/8f/59/1a/8f591a8ae350cf6cbeb5c7534463c11a.jpg",
                                        "size": "full",
                                        "aspectRatio": "1.5:1"
                                    },
                                    "body": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": `การนัดหมายของคุณถูกยกเลิก จาก ${appointmentData.clinic} ณ วันที่ ${appointmentData.appointmentDate} เนื่องจากมีการเปลี่ยนแปลงเวลาทำการ โปรดตรวจสอบการนัดหมายของคุณผ่านเว็บไซต์ หากมีข้อสงสัยหรือต้องการนัดหมายใหม่ สามารถดำเนินการผ่านช่องทางเว็บไซต์ที่แนบไว้ด้านล่างด้านล่าง⬇️`,
                                                "wrap": true
                                            },
                                            
                                            {
                                                "type": "button",
                                                "height": "sm",
                                                "margin": "sm",
                                                "style": "primary",
                                                "color": "#263A50",
                                                "action": {
                                                    "type": "uri",
                                                    "label": "เว็บไซต์ HCU",
                                                    "uri": "line://app/2002624288-QkgWM7yy"
                                                }
                                            },
                                            {
                                                "type": "text",
                                                "text": "หรือ 📞ติดต่อผ่านเบอร์ : 02-470-8446"
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
                                        "url": "https://i.pinimg.com/564x/8f/59/1a/8f591a8ae350cf6cbeb5c7534463c11a.jpg",
                                        "size": "full",
                                        "aspectRatio": "1.5:1"
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
                        const nodemailer = require('nodemailer');
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'kmutthealthcareunit@gmail.com',
                                pass: 'vqos ixxk pscf bqwm'
                            }
                        })
                        const option = {
                            from: 'kmutthealthcareunit@gmail.com',
                            to: `${usersDataMap.email}`,
                            subject: `[นัดหมายคุณถูกยกเลิก]`,
                            html: `
                        
                            <img src="https://i.imgur.com/NKnMp3K.png" alt="HCU" style="width:100px;height:100px;margin-left: 10px;">
                            <h3 style="margin-left: 20px; margin-top: 0px;">สวัสดีคุณ ${usersDataMap.firstName}  ${usersDataMap.lastName}</h3>
                            <p style="margin-left: 20px; margin-bottom: 40px;">นัดหมายของคุณจากคลินิก <b>${appointmentData.clinic}</b> ในวันที่ <b> ${appointmentData.appointmentDate}</b> เนื่องจากมีการเปลี่ยนแปลงเวลาทำการ</p>
                            <p style="margin-left: 20px"> <b>📞 กรุณาติดต่อผ่านเบอร์ : 02-470-8446 เผื่อเลือกช่วงเวลานัดหมายใหม่</p>
                            <p style="margin-left: 20px; margin-bottom: 50px;">ขอบคุณที่เลือกใช้บริการของเรา และเราหวังว่าจะได้ให้บริการท่านในเร็วๆ นี้</p>
                            
                            <div style="margin: 0px 20px; margin-bottom: 60px;">
                                <p>เวลาทำการ: ช่วงเปิดภาคการศึกษา</p>
                                <ul>
                                    <li>วันจันทร์ - วันศุกร์: 08.30 - 18.00 น.</li>
                                    <li>วันเสาร์: 08.30 - 16.30 น.</li>
                                    <li>ยกเว้นวันอาทิตย์และวันหยุดนักขัตฤกษ์</li>
                                </ul>
                                <p>เวลาทำการ: ช่วงปิดภาคการศึกษา</p>
                                <ul>
                                    <li>วันจันทร์ - วันศุกร์: 08.30 - 16.30 น.</li>
                                    <li>ยกเว้นวันเสาร์, วันอาทิตย์ และวันหยุดนักขัตฤกษ์</li>
                                </ul>
                            </div>
                        
                            <div style="margin-right: 20px;">
                                <p style="margin-left: 20px">ด้วยความเคารพ,</p>
                                <p style="margin-left: 20px">Health Care Unit KMUTT</p>
                                <p style="margin-left: 20px">กลุ่มงานบริการสุขภาพและอนามัย</p>
                                <p style="margin-left: 20px">02 470 8446</p>
                                <p style="margin-left: 20px">hcu@kmutt.ac.th</p>
                            </div>
                        `
                        }
                        transporter.sendMail(option, (err, info) => {
                            if (err) {
                                console.log('err', err)
                                return res.status(200).json({
                                    RespCode: 400,
                                    RespMessage: 'bad',
                                    RespError: err
                                })
                            }
                            else {
                                console.log('Send: ' + info.response)
                                return res.status(200).json({
                                    RespCode: 200,
                                    RespMessage: 'good',
                                })
                            }
                        })
                        try{
                        if(appointmentData.type == "main"){
                            const response = await axios.post(`${LINE_BOT_API}/push`, body2, { headers });
                            console.log('Response:', response.data);
                        }
                    } catch(err) {
                        console.log(err)
                    }
                    } else {
                        const nodemailer = require('nodemailer');
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'kmutthealthcareunit@gmail.com',
                                pass: 'vqos ixxk pscf bqwm'
                            }
                        })
                        const option = {
                            from: 'kmutthealthcareunit@gmail.com',
                            to: `${usersDataMap.email}`,
                            subject: `[นัดหมายคุณถูกยกเลิก]`,
                            html: `
                        
                            <img src="https://i.imgur.com/NKnMp3K.png" alt="HCU" style="width:100px;height:100px;margin-left: 10px;">
                            <h3 style="margin-left: 20px; margin-top: 0px;">สวัสดีคุณ ${usersDataMap.firstName}  ${usersDataMap.lastName}</h3>
                            <p style="margin-left: 20px; margin-bottom: 40px;">นัดหมายของคุณจากคลินิก <b>${appointmentData.clinic}</b> ในวันที่ <b> ${appointmentData.appointmentDate}</b> เนื่องจากมีการเปลี่ยนแปลงเวลาทำการ โปรดตรวจสอบการนัดหมายของคุณผ่านเว็บไซต์ หากมีข้อสงสัยหรือต้องการนัดหมายใหม่ สามารถดำเนินการผ่านช่องทางเว็บไซต์ที่แนบไว้ด้านล่างด้านล่าง⬇️</p>
                            <p style="margin-left: 20px; margin-bottom: 40px;">นัดหมายของคุณจากคลินิก>เว็บไซต์ HCU https://hcukmutt.vercel.app/</p>
                            <p style="margin-left: 20px"> <b>หรือ 📞 ติดต่อผ่านเบอร์ : 02-470-8446 เผื่อเลือกช่วงเวลานัดหมายใหม่</p>
                            <p style="margin-left: 20px; margin-bottom: 50px;">ขอบคุณที่เลือกใช้บริการของเรา และเราหวังว่าจะได้ให้บริการท่านในเร็วๆ นี้</p>
                            
                            <div style="margin: 0px 20px; margin-bottom: 60px;">
                                <p>เวลาทำการ: ช่วงเปิดภาคการศึกษา</p>
                                <ul>
                                    <li>วันจันทร์ - วันศุกร์: 08.30 - 18.00 น.</li>
                                    <li>วันเสาร์: 08.30 - 16.30 น.</li>
                                    <li>ยกเว้นวันอาทิตย์และวันหยุดนักขัตฤกษ์</li>
                                </ul>
                                <p>เวลาทำการ: ช่วงปิดภาคการศึกษา</p>
                                <ul>
                                    <li>วันจันทร์ - วันศุกร์: 08.30 - 16.30 น.</li>
                                    <li>ยกเว้นวันเสาร์, วันอาทิตย์ และวันหยุดนักขัตฤกษ์</li>
                                </ul>
                            </div>
                        
                            <div style="margin-right: 20px;">
                                <p style="margin-left: 20px">ด้วยความเคารพ,</p>
                                <p style="margin-left: 20px">Health Care Unit KMUTT</p>
                                <p style="margin-left: 20px">กลุ่มงานบริการสุขภาพและอนามัย</p>
                                <p style="margin-left: 20px">02 470 8446</p>
                                <p style="margin-left: 20px">hcu@kmutt.ac.th</p>
                            </div>
                        `
                        }
                        transporter.sendMail(option, (err, info) => {
                            if (err) {
                                console.log('err', err)
                                return res.status(200).json({
                                    RespCode: 400,
                                    RespMessage: 'bad',
                                    RespError: err
                                })
                            }
                            else {
                                console.log('Send: ' + info.response)
                                return res.status(200).json({
                                    RespCode: 200,
                                    RespMessage: 'good',
                                })
                            }
                        })
                        try{
                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                        console.log('Response:', response.data);
                        } catch(err) {
                            console.log(err)
                        }
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