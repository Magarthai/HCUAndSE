const express = require('express');
const { collection,addDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = require('../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


const router = express.Router();

router.post('/addUserActivity', async (req, res) => {
    try {
        const appointmentInfo = req.body;
        appointmentInfo.timeSlots = JSON.parse(appointmentInfo.timeSlots)
        console.log(appointmentInfo);
        const appointmentRef = await addDoc(collection(db, 'userActivity'), appointmentInfo);
        res.json(appointmentRef);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;