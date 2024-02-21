const express = require('express');
const { collection, getDocs,query ,where,doc,getDoc,updateDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const firebaseConfig = require('./firebase');
const fetchAvailableActivities = require('./allapi/Acitivity/activityOpenerQueen');
const CloseAvailableActivities = require('./allapi/Acitivity/activityCloserQueen');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const dataRoute = require('./allapi/dataRoute');
const fetchOpenActivity = require('./allapi/Acitivity/fetchOpenActivityOnUser');
const activityAddFromUser = require('./allapi/Acitivity/activityAddFromUser');
app.use('/api', dataRoute);
app.use('/api', fetchOpenActivity);
app.use('/api', activityAddFromUser);
let AppointmentUsersData = [];



const fetchUserDataWithAppointments = async () => {
    try {
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
                console.log("existingAppointments", existingAppointments);
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

                AppointmentUsersData = AppointmentUsersDataArray;
               
            } else {
                console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
            }
        }
    } catch (error) {
        console.error('Error fetching user data with appointments:', error);
    }finally {
        setTimeout(fetchUserDataWithAppointments, 600000);
    }
};

const updateAppointmentsStatus = async () => {
    try {
    const currentFormattedTime = new Date(); 

    AppointmentUsersData.forEach(async (AppointmentUserData) => {
        const { timeslot, appointment } = AppointmentUserData;
        const currentDate = new Date();
        const [hoursEnd, minutesEnd] = timeslot.end.split(':').map(Number);
        const [hoursStart, minutesStart] = timeslot.start.split(':').map(Number);

        const timeslotEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hoursEnd, minutesEnd, 0);
        const timeslotStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hoursStart, minutesStart, 0);

        const currentFormattedTime2 = new Date(timeslotStart.getTime() - 15 * 600000);

        console.log(";-;", currentFormattedTime, currentFormattedTime2, timeslotEnd, timeslotStart);

        if (
            appointment.status == 'ลงทะเบียนแล้ว' &&
            currentFormattedTime >= timeslotEnd
        ) {
            try {
                const docRef = doc(db, 'appointment', appointment.appointmentuid);
                await updateDoc(docRef, { status: "ไม่สำเร็จ" });

                console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic} to "ไม่สำเร็จ"`);
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        } else if (currentFormattedTime >= currentFormattedTime2 && appointment.status == 'ลงทะเบียนแล้ว' && currentFormattedTime2 <= timeslotEnd) {
            try {
                const docRef = doc(db, 'appointment', appointment.appointmentuid);
                await updateDoc(docRef, { status: "รอยืนยันสิทธิ์" });

                console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic} to "รอยืนยันสิทธิ์"`);
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        } else {
            console.log(`Nothing updated for appointment id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic}`);
        }
    });
    }finally {
        setTimeout(updateAppointmentsStatus, 600000);
    }}; 

const dateUpdate = async () => {
    try {
        console.log('Data updated:', selectedDate);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    } finally {
        setTimeout(dateUpdate, 600000);
    }
};

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
dateUpdate();
// fetchUserDataWithAppointments();
// updateAppointmentsStatus();
// fetchAvailableActivities();
CloseAvailableActivities();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

