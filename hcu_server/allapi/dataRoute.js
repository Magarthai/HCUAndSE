const express = require('express');
const { collection, getDocs } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../firebase');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const router = express.Router();

router.get('/data', async (req,res) => {
    try {
        const dataRef = collection(db,'users');
        const dataSnapShot = await getDocs(dataRef);
        const data = [];
        dataSnapShot.forEach(doc => {
            data.push(doc.data());
        })
        res.json(data);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
