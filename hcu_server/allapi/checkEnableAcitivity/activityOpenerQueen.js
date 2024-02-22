const express = require('express');
const { collection, getDocs, query, where, doc, getDoc, updateDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = require('../../firebase');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const locale = 'en';
const today = new Date();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const date = today.getDate();
const day = today.toLocaleDateString(locale, { weekday: 'long' });
const currentDate = `${day} ${month}/${date}/${year}`;
const selectedDate = {
    day: date,
    month: month,
    year: year,
    dayName: day,
};


const fetchAvailableActivities = async () => {
    try {
        const activitiesCollection = collection(db, 'activities');
        const activitiesCollectionSnapshot = await getDocs(query(activitiesCollection, where('activityStatus', '==', 'close')));
        const activitiesToday = activitiesCollectionSnapshot.docs.map((doc) => {
            const activitiesData = doc.data();
            return {
                activitiesId: doc.id,
                openDateFormat: new Date(activitiesData.openQueenDate),
                closeDateFormat: new Date(activitiesData.endQueenDate),
                ...activitiesData,
            };
        });
        if (activitiesToday.length > 0) {
            const filteredActivities = activitiesToday.filter(activity => activity.openDateFormat <= today);
            if (filteredActivities.length > 0) {
                await Promise.all(filteredActivities.map(async (activity) => {
                    try {
                        const activityRef = doc(db, 'activities', activity.activitiesId);
                        await updateDoc(activityRef, { activityStatus: "open" });
                        console.log(`updated activity : ${activity.activityName}`)
                    } catch (error) {
                        console.log('something went wrong : ', error)
                    }
                }))
            } else {
                console.log('There are no activity updated')
            };
        } else {
            console.log('No any activity closed')
        }
        return activitiesToday
    } catch (error) {
        console.log(`fetch activities error : `, error)
    } finally {
        setTimeout(fetchAvailableActivities, 6000);
    }
};

module.exports = fetchAvailableActivities;
