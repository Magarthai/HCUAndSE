const express = require('express');
const { collection, getDocs, query, where, doc, getDoc, updateDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = require('../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const locale = 'en';
const today = new Date();
today.setHours(0, 0, 0, 0); 


const CloseAvailableActivities = async () => {
    try {
        const activitiesCollection = collection(db, 'activities');
        const activitiesCollectionSnapshot = await getDocs(query(activitiesCollection, where('activityStatus', '==', 'open')));
        const activitiesToday = activitiesCollectionSnapshot.docs.map((doc) => {
            const activitiesData = doc.data();
            const closeDate = new Date(activitiesData.endQueueDate);
            closeDate.setHours(0, 0, 0, 0); 
            return {
                activitiesId: doc.id,
                openDateFormat: new Date(activitiesData.openQueueDate),
                closeDateFormat: closeDate,
                ...activitiesData,
            };
        });
        console.log(activitiesToday);
        if (activitiesToday.length > 0) {
            const filteredActivities = activitiesToday.filter(activity => activity.closeDateFormat < today);
            if (filteredActivities.length > 0) {
                await Promise.all(filteredActivities.map(async (activity) => {
                    try {
                        const activityRef = doc(db, 'activities', activity.activitiesId);
                        await updateDoc(activityRef, { activityStatus: "close" });
                        console.log(`updated activity : ${activity.activityName} to close`)
                    } catch (error) {
                        console.log('something went wrong : ', error)
                    }
                }))
            } else {
                console.log('There are no activity Close')
            };
        } else {
            console.log('No any activity opening')
        }
        return activitiesToday
    } catch (error) {
        console.log(`fetch activities error : `, error)
    } finally {
        setTimeout(CloseAvailableActivities, 6000000);
    }
};

module.exports = CloseAvailableActivities;  