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
                openDateFormat: new Date(activitiesData.openQueueDate),
                closeDateFormat: new Date(activitiesData.endQueueDate),
                ...activitiesData,
            };
        });
        if (activitiesToday.length > 0) {
            const filteredActivities = activitiesToday.filter(item => {
                const openQueueDate = new Date(item.openQueueDate);
                return openQueueDate.getTime() === today.getTime();
            });
            console.log(today,"todayXD")
            if (filteredActivities.length > 0) {
                console.log(filteredActivities,"filteredActivities")
                await Promise.all(filteredActivities.map(async (activity) => {
                    try {
                        const activityRef = doc(db, 'activities', activity.activitiesId);
                        await updateDoc(activityRef, { activityStatus: "open" });
                        console.log(`updated activity : ${activity.activityName} `)
                    } catch (error) {
                        console.log('something went wrong : ', error)
                    }
                }))
            } else {
                console.log('There are no activity Open')
            };
        } else {
            console.log('No any activity Open')
        }
        return activitiesToday
    } catch (error) {
        console.log(`fetch activities error : `, error)
    } finally {
        setTimeout(fetchAvailableActivities, 6000000);
    }
};

module.exports = fetchAvailableActivities;
