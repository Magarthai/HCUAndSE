
const express = require('express');
const { collection, getDocs,doc,updateDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../firebase');
const router = require('express').Router(); 
const Dashboard = require("../../model/appointmentDashboard.model");
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const axios = require('axios');
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN; 
const LINE_BOT_API = "https://api.line.me/v2/bot/message"; 
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` 
}
async function createDashboardData(feedbackData) {
    try {
        const newData = await Dashboard.create(feedbackData); 
        return newData;
    } catch (error) {
        console.log(error, "createData");
        throw error;
    }
}

const link = (e) => {
    if (e.clinic == "คลินิกทั่วไป"){
        return "https://hcukmutt.vercel.app/feedback/general"
    } else if (e.clinic == "คลินิกเฉพาะทาง"){
        return "https://hcukmutt.vercel.app/feedback/special"
        
    } else if (e.clinic == "คลินิกกายภาพ"){
        if(e.appointment.type == "main"){
        return "https://hcukmutt.vercel.app/feedback/physical/service"
        } else {
            return "https://hcukmutt.vercel.app/feedback/physical"
        }
        
    } else if (e.clinic == "คลินิกฝังเข็ม"){
        if(e.appointment.type == "main"){
        return "https://hcukmutt.vercel.app/feedback/needle/service"
        } else {
            return "https://hcukmutt.vercel.app/feedback/needle"
        }
        
    }

}
router.post('/UpdateToSuccessStatus', async (req,res) => {
    try {
        const id = req.body.id;
        const appointment = req.body.AppointmentUserData.appointment
        const LineID = req.body.AppointmentUserData.userLineID
        const userData = req.body.AppointmentUserData
        const docRef = doc(db, 'appointment', id);
        updateDoc(docRef, { status: "เสร็จสิ้น" }).catch(error => {
            console.error('Error updating timetable status:', error);
        });
        
        if (appointment.clinic === "คลินิกทั่วไป" || appointment.clinic === "คลินิกเฉพาะทาง") {
            const info = {
                status: "เสร็จสิ้น",
                clinic: appointment.clinic,
            };
            createDashboardData(info);
        } else {
            const info = {
                status: "เสร็จสิ้น",
                clinic: appointment.clinic,
                type: appointment.type
            };
            createDashboardData(info);
        }
        if(LineID != "") {
            const body = {
                "to": LineID,
                "messages": [
                    {
                        "type": "flex",
                        "altText": "‼️ ประเมินความพึงพอใจ ‼️",
                        "contents": {
                            "type": "bubble",
                            "header": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "align" : "center",
                                        "text": "‼️ ประเมินความพึงพอใจ ‼️"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://i.pinimg.com/564x/2c/43/3e/2c433ecbb353b1a96615f57dd49803d5.jpg",
                                "size": "full",
                                "aspectRatio": "1.75:1"
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [ 
                                    {
                                        "type": "text",
                                        "text": "📝แบบประเมินความพึงพอใจ",
                                        "wrap": true
                                    },
                                    {
                                        "type": "text",
                                        "text": "ขอขอบคุณสำหรับการใช้บริการ HCU",
                                        "wrap": true
                                    },
                                    {
                                        "type": "text",
                                        "text":"เพื่อให้เราสามารถปรับปรุงและพัฒนาบริการให้ดียิ่งขึ้นต่อไป กรุณาให้คะแนนความพึงพอใจของท่านด้านล่างนี้ได้เลยครับ/ค่ะ\n",
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
                                            "label": "ประเมินการใช้บรการ HCU",
                                            "uri": link(appointment)
                                        }
                                    },
                                    {
                                        "type": "text",
                                        "align" : "center",
                                        "text": "\n🙏🏻ขอบคุณค่ะ/คร้บ 🙏🏻",
                                        "wrap": true
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
            try {
                if(LineID != "") {
                const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                console.log('Response:', response.data);
                res.send("success");
                console.log("test")
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.log("test");
            res.send("success");
        }

        
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
