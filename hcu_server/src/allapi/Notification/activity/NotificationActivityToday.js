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
                    to: `${user.email}`,
                    subject: `[แจ้งเตือนกิจกรรม]`,
                    html: `
                
                    <img src="https://i.imgur.com/NKnMp3K.png" alt="HCU" style="width:100px;height:100px;margin-left: 10px;">
                    <h3 style="margin-left: 20px; margin-top: 0px;">สวัสดีคุณ ${user.firstName}  ${user.lastName}</h3>
                    <p style="margin-left: 20px; margin-bottom: 40px;">🗓️ รายละเอียดกิจกรรม ${item.activityName}</b></p>
                    <p style="margin-left: 20px; margin-bottom: 40px;">วันที่ : ${item.date} เวลา : ${item.startTime} น. - ${item.endTime} น.</p>
                    <p style="margin-left: 20px"> <b>🙏🏻 กรุณามาตามรายละเอียดวัน เวลาที่ได้แจ้งไว้</p>
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
                                        "url": "https://i.pinimg.com/564x/26/58/74/2658743727a84f478760f363864f1a17.jpg",
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
