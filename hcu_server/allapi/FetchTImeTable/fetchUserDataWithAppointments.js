const express = require('express');
const { initializeApp } = require('firebase/app');
const { collection, getDoc, query, where, doc, getDocs } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../firebase');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();
const today = new Date();
today.setHours(0, 0, 0, 0);

function isSameDay(date1, date2) {
    console.log(date1, date2);
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

router.post('/fetchUserDataWithAppointments', async (req, res) => {
    if (req.body.role != 'admin') {
        res.status(500).json({ error: 'Internal server error' });
        return; // Added to exit the function after sending the response
    }
    try {
        
        const clinic = req.body.clinic;
        const selectedDate = req.body.selectedDate;
        const appointmentsCollection = collection(db, 'appointment');
        const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==',
            `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
            where('clinic', '==', clinic)));

        const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
            const appointmentData = doc.data();
            return {
                appointmentId: doc.id,
                appointmentuid: doc.id,
                ...appointmentData,
            };
        });

        if (existingAppointments.length > 0) {
            const timeTableCollection = collection(db, 'timeTable');
            console.log(existingAppointments, "test1")
            const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
                console.log("test2", existingAppointments);
                const userId = appointment.appointmentId;
                const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
                const timeTableId = appointment.appointmentTime.timetableId;
                console.log(timeTableId, "timeTableIdtimeTableIdtimeTableIdtimeTableIdtimeTableIdtimeTableIdtimeTableId")
                try {
                    const timetableDocRef = doc(timeTableCollection, timeTableId);
                    const timetableDocSnapshot = await getDoc(timetableDocRef);

                    if (timetableDocSnapshot.exists()) {
                        const timetableData = timetableDocSnapshot.data();
                        const timeslot = timetableData.timeablelist[timeSlotIndex];
                        const usersCollection = collection(db, 'users');
                        console.log(userId, "userId");
                        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

                        if (userQuerySnapshot.empty) {
                            return null;
                        }

                        const userUid = userQuerySnapshot.docs[0].id;
                        const userDatas = userQuerySnapshot.docs[0].data();
                        userDatas.timeslot = timeslot;
                        userDatas.appointment = appointment;
                        userDatas.appointmentuid = appointment.appointmentuid;
                        userDatas.userUid = userUid;
                        const userDetails = userDatas

                        if (userDetails) {
                            console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                            return userDetails;
                        } else {
                            console.log("No user details found for appointmentId", appointment.appointmentId);
                            return null;
                        }
                    } else {
                        console.log("No such document with ID:", timeTableId);
                        return null;
                    }
                } catch (error) {
                    console.error('Error fetching timetable data:', error);
                    return null;
                }
            }));
            if (AppointmentUsersDataArray.length > 0) {
                res.send(AppointmentUsersDataArray);
            } else {
                res.send(`No appointments found`);
            }
        } else {
            res.send(`No appointments found`);
        }

    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
