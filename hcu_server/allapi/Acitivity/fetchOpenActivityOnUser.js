const express = require('express');
const { initializeApp } = require('firebase/app');
const { collection, getDocs, query, where } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../firebase');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const router = express.Router();

router.get('/fetchOpenActivity', async (req,res) => {
    try {
        const activitiesCollection = collection(db, 'activities');
        const querySnapshot = await getDocs(query(
            activitiesCollection,
            where('activityStatus', '==', 'open'),
        ));
        
        const activitiesData = querySnapshot.docs
            .map((doc) => ({
                activityId: doc.id,
                ...doc.data(),
            }))
            
        res.json(activitiesData);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;