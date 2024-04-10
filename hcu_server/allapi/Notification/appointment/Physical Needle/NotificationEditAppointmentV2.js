const express = require('express');
const { collection,getDocs,query,where} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
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



router.post('/NotificationEditAppointmentV2', limitRequests, async (req, res) => {
    try {
        const data = req.body;
        const studentID = req.body.id;
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', studentID)));
        const userDocuments = userQuerySnapshot.docs;
        const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
        let type = "";
        if (data.type === "talk"){
            type = "ปรึกษาแพทย์";
        } else if (data.type === "physic"){
            type = "บริการทํากายภาพ"
        } else {
            type = "บริการฝังเข็ม"
        }
        const body = {
            "to": `${userData.userLineID}`,
            "messages": [
                {
                    "type": "flex",
                    "altText": "‼️ เลื่อนการนัดหมาย ‼️",
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
                            "text": "‼️ เลื่อนการนัดหมาย ‼️"
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
                                "text": `🗓️จากเดิม`
                            },
                          {
                              "type": "text",
                              "text": `วันที่ : ${data.oldDate}`
                          },
                          {
                              "type": "text",
                              "text": `คลินิก : ${data.clinic}`
                          },
                          {
                          
                              "type": "text",
                              "text": "🗓️เป็น"
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
                            "text": `ประเภทนัดหมาย : ${type}`
                        },
                          {
                              "type": "text",
                              "text": `เวลา : ${data.time}`
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