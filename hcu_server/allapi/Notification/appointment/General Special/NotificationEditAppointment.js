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



router.post('/NotificationEditAppointment', limitRequests, async (req, res) => {
    const role = req.body.role;
    if(role != "admin") {
        console.error(`Error sending data: ${error}`);
        return res.status(500).json({ error: 'Internal server error' }); 
    };
    try {
        const data = req.body;
        const studentID = req.body.id;
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', studentID)));
        const userDocuments = userQuerySnapshot.docs;
        const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
        
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
                              "text": "‼️ เลื่อนการนัดหมาย ‼️"
                          }
                          ]
                      },
                      "hero": {
                          "type": "image",
                          "url": "https://i.pinimg.com/564x/b3/62/f7/b362f7d08ef02029757e990343f86cb6.jpg",
                          "size": "full",
                          "aspectRatio": "2:1"
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