const express = require('express');
const { collection, getDocs,query ,where,doc,getDoc,updateDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const firebaseConfig = require('./firebase');
const fetchAvailableActivities = require('./allapi/Acitivity/activityOpenerQueue');
const CloseAvailableActivities = require('./allapi/Acitivity/activityCloserQueue');
const QueueTodayAvailableActivities = require('./allapi/Acitivity/fetchActivityOpenQueueToday');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const dataRoute = require('./allapi/dataRoute');
const fetchOpenActivity = require('./allapi/Acitivity/fetchOpenActivityOnUser');
const userGetQueueActivity = require('./allapi/Acitivity/userGetQueueActivity');
const activityAddFromUser = require('./allapi/Acitivity/activityAddFromUser');
const fetchUserActivityQueue = require('./allapi/Acitivity/fetchUserActivityQueue');
const getRegisteredListActivity = require('./allapi/Acitivity/admin/GetRegisteredListActivity');
const fetchQueueActivity = require('./allapi/Acitivity/admin/fetchQueueActivity');
const adminUpdateQueueShifting = require('./allapi/Acitivity/admin/updateQueueShifting');
const adminUpdateQueueShiftingPass = require('./allapi/Acitivity/admin/updateQueueShiftingPass');
const deleteActivity = require('./allapi/Acitivity/admin/deleteActivity');
const deleteTimeTable = require('./allapi/Acitivity/admin/TimeTable/deleteTimeTable');
const toggleTimeTable = require('./allapi/Acitivity/admin/TimeTable/toggleTimeTable');
const QueueNotTodayAvailableActivities = require('./allapi/Acitivity/fetchActivityNotTodayQueue');
app.use('/api', dataRoute);
app.use('/api', fetchOpenActivity);
app.use('/api', activityAddFromUser);
app.use('/api', QueueTodayAvailableActivities);
app.use('/api', QueueNotTodayAvailableActivities);
app.use('/api', userGetQueueActivity);
app.use('/api', fetchUserActivityQueue);
app.use('/api', fetchQueueActivity);
app.use('/api', adminUpdateQueueShifting);
app.use('/api', adminUpdateQueueShiftingPass);
app.use('/api', getRegisteredListActivity);
app.use('/api', deleteActivity);
app.use('/api', deleteTimeTable);
app.use('/api', toggleTimeTable);
let locale = 'th-TH';
let today = new Date();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let date = today.getDate();
let day = today.toLocaleDateString(locale, { weekday: 'long' });
let currentDate = `${day} ${month}/${date}/${year}`;
let selectedDate = {
    day: date,
    month: month,
    year: year,
    dayName: day,
};
let AppointmentUsersData = [];
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN; // Retrieves the LINE access token from environment variables
const LINE_BOT_API = "https://api.line.me/v2/bot/message"; // LINE Messaging API endpoint
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` // Authorization header with the access token
}

const fetchUserDataWithAppointments = async () => {
    try {
        const locale = 'en';
            const today = new Date();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            const date = today.getDate();
            const hours = today.getHours().toString().padStart(2, '0');
            const minutes = today.getMinutes().toString().padStart(2, '0');
            const day = today.toLocaleDateString(locale, { weekday: 'long' });
            const currentDate = `${day} ${month}/${date}/${year}`;
            const currentTime = `${hours}:${minutes}`;
            const selectedDate = {
                day: date,
                month: month,
                year: year,
                dayName: day,
                time: currentTime
            };
        if (selectedDate && selectedDate.dayName) {
            const appointmentsCollection = collection(db, 'appointment');
            const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==',
                `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`)));

            const timeTableCollection = collection(db, 'timeTable');
            const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
                const appointmentData = doc.data();
                return {
                    appointmentId: doc.id,
                    appointmentuid: doc.id,
                    ...appointmentData,
                };
            });

            if (existingAppointments.length > 0) {
                // console.log("existingAppointments", existingAppointments);
                console.log(`Appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);

                const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
                    const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
                    const timeTableId = appointment.appointmentTime.timetableId;

                    try {
                        const timetableDocRef = doc(timeTableCollection, timeTableId);
                        const timetableDocSnapshot = await getDoc(timetableDocRef);

                        if (timetableDocSnapshot.exists()) {
                            const timetableData = timetableDocSnapshot.data();
                            console.log("Timetable Data:", timetableData);
                            const timeslot = timetableData.timeablelist[timeSlotIndex];
                            console.log("Timeslot info", timeslot);

                           const usersCollection = collection(db, 'users');
                            const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointment.appointmentId)));
                        
                            if (userQuerySnapshot.empty) {
                                console.log("No user found with id:", appointment.appointmentId);
                                return null;
                            }
                        
                            const userUid = userQuerySnapshot.docs[0].id;
                            const userDatas = userQuerySnapshot.docs[0].data();
                            userDatas.timeslot = timeslot;
                            userDatas.appointment = appointment;
                            userDatas.appointmentuid = appointment.appointmentuid;
                            userDatas.userUid = userUid;
                            const userDetails = userDatas;

                            if (userDetails) {
                                // console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                                return userDetails;
                            } else {
                                // console.log("No user details found for appointmentId", appointment.appointmentId);
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

                AppointmentUsersData = AppointmentUsersDataArray;
               
            } else {
                console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
            }
        }
        setTimeout(fetchUserDataWithAppointments, 31000);
    } catch (error) {
        console.error('Error fetching user data with appointments:', error);
    }
};

const updateAppointmentsStatus = async () => {
    try {

    AppointmentUsersData.forEach(async (AppointmentUserData) => {
        const { timeslot, appointment } = AppointmentUserData;
        const todays = new Date();
        const [hoursEnd, minutesEnd] = timeslot.end.split(':').map(Number);
        const [hoursStart, minutesStart] = timeslot.start.split(':').map(Number);
        const timeslotEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hoursEnd, minutesEnd, 0);
        const timeslotStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hoursStart, minutesStart, 0);
        const docRef = doc(db, 'appointment', appointment.appointmentuid);
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointment.appointmentId)));
        const userDocuments = userQuerySnapshot.docs;
        const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
        const currentFormattedTime2 = new Date(timeslotStart.getTime() - 15 * 600000);

        // console.log(";-;", currentFormattedTime, currentFormattedTime2, timeslotEnd, timeslotStart);

        if (
            appointment.status == 'ลงทะเบียนแล้ว' &&
            todays >= timeslotEnd
        ) {
            try {
                const docRef = doc(db, 'appointment', appointment.appointmentuid);
                const usersCollection = collection(db, 'users');
                const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointment.appointmentId)));
                const userDocuments = userQuerySnapshot.docs;
                const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
                console.log(userData.userLineID);
                if (userData) {
                    
                    if(userData.userLineID != ""){
                        const body = {
                            "to": userData.userLineID,
                            "messages":[
                                {
                                    "type":"text",
                                    "text": `Updated status ${userData.firstName} ${userData.lastName} appointment date ${appointment.appointmentDate} to รอยืนยันสิทธิ์` // Message content
                                }
                            ]
                        }
                        try {
                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                        console.log('Response:', response.data);
                        } catch (error) {
                        console.error('Error:', error.response.data);
                        }
                   
                };
                await updateDoc(docRef, { status: "ไม่สำเร็จ" });

                console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic} to "ไม่สำเร็จ"`);
                }
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        }else if (
            appointment.status == 'รอยืนยันสิทธิ์' &&
            todays >= timeslotEnd
        ) {
            try {
                const docRef = doc(db, 'appointment', appointment.appointmentuid);
                const usersCollection = collection(db, 'users');
                const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointment.appointmentId)));
                const userDocuments = userQuerySnapshot.docs;
                const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
                console.log(userData.userLineID);
                if (userData) {
                    
                    if(userData.userLineID != ""){
                        const body = {
                            "to": userData.userLineID,
                            "messages":[
                                {
                                    "type":"text",
                                    "text": `Updated status ${userData.firstName} ${userData.lastName} appointment date ${appointment.appointmentDate} to เสร็จสิ้น` // Message content
                                }
                            ]
                        }
                        try {
                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                        console.log('Response:', response.data);
                        } catch (error) {
                        console.error('Error:', error.response.data);
                        }
                };
                await updateDoc(docRef, { status: "เสร็จสิ้น" });

                console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic} to "ไม่สำเร็จ"`);
                }
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        }
         else if (todays >= currentFormattedTime2 && appointment.status == 'ลงทะเบียนแล้ว' && currentFormattedTime2 <= timeslotEnd) {
            try {
                
                const docRef = doc(db, 'appointment', appointment.appointmentuid);
                const usersCollection = collection(db, 'users');
                const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointment.appointmentId)));
                const userDocuments = userQuerySnapshot.docs;
                const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
                console.log(userData.userLineID);
                if (userData) {
                    if(userData.userLineID != ""){
                        const body = {
                            "to": userData.userLineID,
                            "messages":[
                                {
                                    "type":"text",
                                    "text": `Updated status ${userData.firstName} ${userData.lastName} appointment date ${appointment.appointmentDate} to ไม่สําเร็จ` // Message content
                                }
                            ]
                        }
                        try {
                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                        console.log('Response:', response.data);
                        } catch (error) {
                        console.error('Error:', error.response.data);
                        }
                };
                await updateDoc(docRef, { status: "รอยืนยันสิทธิ์" });

                console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic} to "รอยืนยันสิทธิ์"`);
            }
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        
        } else {
            console.log(`Nothing updated for appointment id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic}`);
        }
    });
    setTimeout(updateAppointmentsStatus, 30000);
    }catch (error) {{
        console.log(error)
    }}}; 


    setInterval(() => {
        locale = 'th-TH';
        today = new Date();
        month = today.getMonth() + 1;
        year = today.getFullYear();
        date = today.getDate();
        hours = today.getHours().toString().padStart(2, '0');
        minutes = today.getMinutes().toString().padStart(2, '0');
        const second = today.getSeconds().toString().padStart(2, '0');
        day = today.toLocaleDateString(locale, { weekday: 'long' });
        currentDate = `${day} ${month}/${date}/${year}`;
        const currentTime = `${hours}:${minutes}:${second}`;
        selectedDate = {
            day: date,
            month: month,
            year: year,
            dayName: day,
            time: currentTime
        };
        console.log('Data updated:', selectedDate);
    }, 1000);


app.get('/', (req, res) => {
    res.send('test')
})

fetchUserDataWithAppointments();
updateAppointmentsStatus();
fetchAvailableActivities();
CloseAvailableActivities();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

