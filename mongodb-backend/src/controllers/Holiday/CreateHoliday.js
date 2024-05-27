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
        const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN; 
        const LINE_BOT_API = "https://api.line.me/v2/bot/message"; 
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` 
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
                        to: `${exitUserDataSnapShot[0].email}`,
                        subject: `[นัดหมายคุณถูกยกเลิก]`,
                        html: `
                    
                        <img src="https://i.imgur.com/NKnMp3K.png" alt="HCU" style="width:100px;height:100px;margin-left: 10px;">
                        <h3 style="margin-left: 20px; margin-top: 0px;">สวัสดีคุณ ${exitUserDataSnapShot[0].firstName}  ${exitUserDataSnapShot[0].lastName}</h3>
                        <p style="margin-left: 20px; margin-bottom: 40px;">🗓️ รายละเอียดการนัดที่ถูกยกเลิก</b></p>
                        <p style="margin-left: 20px; margin-bottom: 40px;">นัดหมาย <b>${appointment.clinic}</b> ในวันที่ <b> ${appointment.appointmentDate}</b> ถูกยกเลิกเนื่องจากเหตุผล : <b> ${req.body.note}</b> กรุณาทํารายการใหม่อีกครั้งด้วย ครับ/ค่ะ</p>
                        <p style="margin-left: 20px"> <b>🙏🏻 ขออภัยในความไม่สะดวก กรุณาลงทะเบียนนัดหมายใหม่อีกครั้ง!</p>
                        <p style="margin-left: 20px">หากท่านต้องการนัดหมายใหม่, กรุณานัดหมายผ่านทางเว็บไซต์ https://hcukmutt.vercel.app/ หรือติดต่อเราผ่านเบอร์โทร 02 470 8446 อย่างน้อย 24 ชั่วโมงก่อนเวลานัดหมาย</p>
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

