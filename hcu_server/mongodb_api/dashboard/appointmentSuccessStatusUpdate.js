
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
                "messages":[
                    {
                        "type":"text",
                        "text": `Updated status ${userData.firstName} ${userData.lastName} appointment date ${appointment.appointmentDate} from clinic : ${appointment.clinic} to เสร็จสิ้น`
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

        res.send("success");
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
