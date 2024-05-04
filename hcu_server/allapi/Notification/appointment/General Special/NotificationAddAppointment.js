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



router.post('/NotificationAddAppointment', limitRequests, async (req, res) => {
    const data = req.body;
        const studentID = req.body.id;
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', studentID)));
        const userDocuments = userQuerySnapshot.docs;
        const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
        const nodemailer = require('nodemailer');
        console.log(userData.email)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'kmutthealthcareunit@gmail.com',
            pass: 'vqos ixxk pscf bqwm'
        }
    })
    const option = {
        from: 'kmutthealthcareunit@gmail.com',
        to: `${userData.email}`,
        subject: `[แจ้งเตื่อนนัดหมาย]`,
        html: `
    
        <img src="https://i.imgur.com/NKnMp3K.png" alt="HCU" style="width:100px;height:100px;margin-left: 10px;">
        <h3 style="margin-left: 20px; margin-top: 0px;">สวัสดีคุณ ${userData.firstName}  ${userData.lastName}</h3>
        <p style="margin-left: 20px; margin-bottom: 40px;">คุณมีนัดหมายการตรวจสุขภาพที่ Health Care Unit KMUTT <b>${data.clinic}</b> ในวันที่ <b> ${data.date}</b>, เวลา <b>${data.time}</b></p>
        <p style="margin-left: 20px"> <b>กรุณามาถึงอย่างน้อย 15 นาทีก่อนเวลานัดหมาย</b> เพื่อทำการลงทะเบียนและเตรียมตัวสำหรับการตรวจสุขภาพ หากท่านมีประวัติการแพ้ยาหรือมีข้อมูลทางการแพทย์สำคัญอื่นๆ กรุณานำมาให้เราทราบในวันนัดหมาย</p>
        <p style="margin-left: 20px">หากท่านต้องการเปลี่ยนแปลงหรือยกเลิกนัดหมาย, กรุณาเปลี่ยนแปลงนัดหมายผ่านทางเว็บไซต์ https://hcukmutt.vercel.app/ หรือติดต่อเราผ่านเบอร์โทร 02 470 8446 อย่างน้อย 24 ชั่วโมงก่อนเวลานัดหมาย</p>
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
    try {

            


        const body =  {
            "to": `${userData.userLineID}`,
            "messages": [
              {
                  "type": "flex",
                  "altText": "‼️ การนัดหมายใหม่ ‼️",
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
                          "text": "‼️ การนัดหมายใหม่ ‼️"
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
                              "text": "🗓️ รายละเอียดการนัดหมายใหม่"
                          },
                          {
                              "type": "text",
                              "text": `วันที่ : ${data.date}`
                          },
                          {
                              "type": "text",
                              "text": `คลินิก : ${data.clinic}`
                          },
                          {
                              "type": "text",
                              "text": `เวลา : ${data.time}`
                          },
                          {
                              "type": "text",
                              "text": "🙏🏻 กรุณามาก่อนเวลานัดหมาย 10 นาที"
                          }
                          ]
                      }
                      }
                }
              
            ]
          }
        try {
            if(userData.userLineID != "") {
        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
        console.log('Response:', response.data);
            }
        } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' }); 
        }
        return res.json("success");


        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    }
});




module.exports = router;