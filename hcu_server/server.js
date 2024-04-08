const express = require('express');
const { collection, getDocs,query ,where,doc,getDoc,updateDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const axios = require('axios');
const cors = require('cors');
const app = express();
const morgan = require('morgan');;
const moment = require('moment-timezone');
const dbConnect = require('./db.connector');
dbConnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
const firebaseConfig = require('./firebase');
const NotificationActivityToday = require('./allapi/Notification/activity/NotificationActivityToday');
const fetchAvailableActivities = require('./allapi/Acitivity/activityOpenerQueue');
const CloseAvailableActivities = require('./allapi/Acitivity/activityCloserQueue');
const QueueTodayAvailableActivities = require('./allapi/Acitivity/fetchActivityOpenQueueToday');
const NoQueueTodayAvailableActivities = require('./allapi/Acitivity/fetchActivityNoOpenQueueToday');
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const dataRoute = require('./allapi/dataRoute');
const fetchTodayActivity = require('./allapi/Acitivity/admin/fetchTodayActivity');
const fetchNoQueueTodayActivity = require('./allapi/Acitivity/admin/fetchNoQueueTodayActivity');
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
const UpdateToSuccessStatus = require('./mongodb_api/dashboard/appointmentSuccessStatusUpdate');
const appointmentCurrentMonthRange = require('./mongodb_api/dashboard/appointmentCurrentMonthRange');
const appointmentCurrentMonthRangeCount = require('./mongodb_api/dashboard/appointmentCurrentMonthRangeCount');
const appointmentCurrentMonthTodayCount = require('./mongodb_api/dashboard/appointmentCurrentMonthTodayCount');
const appointmentMonthCount = require('./mongodb_api/dashboard/appointmentMonthCount');
const appointmentCurrentMonthRangeCountNeedlePhysic = require('./mongodb_api/dashboard/appointmentCurrentMonthRangeCountNeedlePhysic');
const appointmentCurrentMonthTodayCountNeedlePhysic = require('./mongodb_api/dashboard/appointmentCurrentMonthTodayCountNeedlePhysic');
const appointmentCurrentMonthRangeByClinic = require('./mongodb_api/dashboard/appointmentCurrentMonthRangeByClinic');
const appointmentMonthCountByClinic = require('./mongodb_api/dashboard/appointmentMonthCountByClinic');
const appointmentCurrentMonthTodayCountSuccessByClinic = require('./mongodb_api/dashboard/appointmentCurrentMonthTodayCountSuccessByClinic');
const appointmentCurrentMonthRangeCountSuccessByClinic = require('./mongodb_api/dashboard/appointmentCurrentMonthRangeCountSuccessByClinic');
const appointmentCurrentMonthRangeCountSuccessByPhysicOrNeedle = require('./mongodb_api/dashboard/appointmentCurrentMonthRangeCountSuccessByPhysicOrNeedle');
const appointmentCurrentMonthTodayCountSuccessByPhysicOrNeedle = require('./mongodb_api/dashboard/appointmentCurrentMonthTodayCountSuccessByPhysicOrNeedle');

const NotificationAddAppointment = require('./allapi/Notification/appointment/General Special/NotificationAddAppointment');
const NotificationDeleteAppointment = require('./allapi/Notification/appointment/General Special/NotificationDeleteAppointment');
const NotificationEditAppointment = require('./allapi/Notification/appointment/General Special/NotificationEditAppointment');
const NotificationAddAppointmentV2 = require('./allapi/Notification/appointment/Physical Needle/NotificationAddAppointmentV2');
const NotificationDeleteAppointmentV2 = require('./allapi/Notification/appointment/Physical Needle/NotificationDeleteAppointmentV2');
const NotificationEditAppointmentV2 = require('./allapi/Notification/appointment/Physical Needle/NotificationEditAppointmentV2');
const NotificationAddContinueAppointmentV2 = require('./allapi/Notification/appointment/Physical Needle/NotificationAddContinueAppointmentV2');
const NotificationSuccessRequest = require('./allapi/Notification/appointment/Request/NotificationSuccessRequest');
const NotificationRejectRequest = require('./allapi/Notification/appointment/Request/NotificationRejectRequest');
const getCanceledData = require('./mongodb_api/canceledAppointment/getCanceledData')

const fetchTimeTableByClinic = require('./allapi/FetchTImeTable/fetchTimeTableByClinic');
const deleteDeletedAppointment = require('./mongodb_api/canceledAppointment/deleteDeletedAppointment')
const fetchUserDataWithAppointmentss = require('./allapi/FetchTImeTable/fetchUserDataWithAppointments');

app.use('/api', dataRoute);
app.use('/api', fetchOpenActivity);
app.use('/api', activityAddFromUser);
app.use('/api', QueueTodayAvailableActivities);
app.use('/api', NoQueueTodayAvailableActivities);
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
app.use('/api', fetchTodayActivity);
app.use('/api', fetchNoQueueTodayActivity);
app.use('/api', UpdateToSuccessStatus);
app.use('/api', appointmentCurrentMonthRange);
app.use('/api', appointmentCurrentMonthRangeCount);
app.use('/api', appointmentCurrentMonthTodayCount);
app.use('/api', appointmentMonthCount);
app.use('/api', appointmentCurrentMonthRangeCountNeedlePhysic);
app.use('/api', appointmentCurrentMonthTodayCountNeedlePhysic);
app.use('/api', appointmentCurrentMonthRangeByClinic);
app.use('/api', appointmentMonthCountByClinic);
app.use('/api', appointmentCurrentMonthTodayCountSuccessByClinic);
app.use('/api', appointmentCurrentMonthRangeCountSuccessByClinic);
app.use('/api', appointmentCurrentMonthRangeCountSuccessByPhysicOrNeedle);
app.use('/api', appointmentCurrentMonthTodayCountSuccessByPhysicOrNeedle);
app.use('/api', NotificationAddAppointment);
app.use('/api', NotificationDeleteAppointment);
app.use('/api', NotificationEditAppointment);
app.use('/api', NotificationAddContinueAppointmentV2);
app.use('/api', NotificationAddAppointmentV2);
app.use('/api', NotificationDeleteAppointmentV2);
app.use('/api', NotificationEditAppointmentV2);
app.use('/api', NotificationSuccessRequest);
app.use('/api', NotificationRejectRequest);
app.use('/api', getCanceledData);
app.use('/api',fetchTimeTableByClinic);
app.use('/api',fetchUserDataWithAppointmentss);
app.use ('/api',deleteDeletedAppointment);
let locale = 'th-TH';
let today = new Date();
today.setHours(0, 0, 0, 0);
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
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN; 
const LINE_BOT_API = "https://api.line.me/v2/bot/message"; 
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` 
}
const Dashboard = require("./model/appointmentDashboard.model");
async function createDashboardData(feedbackData) {
    try {
        const newData = await Dashboard.create(feedbackData); 
        return newData;
    } catch (error) {
        console.log(error, "createData");
        throw error;
    }
}

const fetchUserDataWithAppointments = async () => {
    try {
    const thaiTime = moment().tz('Asia/Bangkok');
    const currentDate = thaiTime.format('dddd DD/MM/YYYY');
    const currentTime = thaiTime.format('HH:mm:ss');
    const selectedDate = {
        day: thaiTime.date(),
        month: thaiTime.month() + 1,
        year: thaiTime.year(),
        dayName: thaiTime.format('dddd'),
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
                                return userDetails;
                            } else {
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
        setTimeout(fetchUserDataWithAppointments, 59000);
    } catch (error) {
        console.error('Error fetching user data with appointments:', error);
    }
};

const updateAppointmentsStatus = async () => {
    try {

    AppointmentUsersData.forEach(async (AppointmentUserData) => {
        const { timeslot, appointment } = AppointmentUserData;

        const thaiTime = moment().tz('Asia/Bangkok');
        
        const [hoursEnd, minutesEnd] = timeslot.end.split(':').map(Number);
        const [hoursStart, minutesStart] = timeslot.start.split(':').map(Number);

        const timeslotEnd = moment(thaiTime).set({ hour: hoursEnd, minute: minutesEnd, second: 0 });
        const timeslotStart = moment(thaiTime).set({ hour: hoursStart, minute: minutesStart, second: 0 });

        const docRef = doc(db, 'appointment', appointment.appointmentuid);
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointment.appointmentId)));
        const userDocuments = userQuerySnapshot.docs;
        const userData = userDocuments.length > 0 ? userDocuments[0].data() : null;
        const currentFormattedTime2 = moment(timeslotStart).subtract(15, 'minutes');


        const link = (e) => {
            if (e.appointment.clinic == "คลินิกทั่วไป"){
                return "https://hcukmutt.vercel.app/feedback/general"
            } else if (e.appointment.clinic == "คลินิกเฉพาะทาง"){
                return "https://hcukmutt.vercel.app/feedback/special"
                
            } else if (e.appointment.clinic == "คลินิกกายภาพ"){
                if(e.appointment.type == "main"){
                return "https://hcukmutt.vercel.app/feedback/physical/service"
                } else {
                    return "https://hcukmutt.vercel.app/feedback/physical"
                }
                
            } else if (e.appointment.clinic == "คลินิกฝังเข็ม"){
                if(e.appointment.type == "main"){
                return "https://hcukmutt.vercel.app/feedback/needle/service"
                } else {
                    return "https://hcukmutt.vercel.app/feedback/needle"
                }
                
            }
        
        }

        if (
            appointment.status == 'ลงทะเบียนแล้ว' &&
            thaiTime >= timeslotEnd
        ) {
            try {
                console.log(userData.userLineID);
                if (userData) {
                    if(userData.userLineID != ""){
                    const body = {
                        "to": userData.userLineID,
                        "messages": [
                          {
                            "type": "flex",
                            "altText": "‼️ อัพเดตสถานะ ‼️",
                            "contents": {
                                  "type": "bubble",
                                  "header": {
                                      "type": "box",
                                      "layout": "vertical",
                                      "contents": [
                                      {
                                          "type": "text",
                                          "text": "‼️ อัพเดตสถานะการนัดหมาย ‼️"
                                      }
                                      ]
                                  },
                                  "hero": {
                                      "type": "image",
                                      "url": "https://i.pinimg.com/564x/8f/59/1a/8f591a8ae350cf6cbeb5c7534463c11a.jpg",
                                      "size": "full",
                                      "aspectRatio": "2:1"
                                  },
                                  "body": {
                                      "type": "box",
                                      "layout": "vertical",
                                      "contents": [
                                      {
                                          "type": "text",
                                          "text": "อัพเดตสถานะการเข้าใช้บริการ : ไม่สําเร็จ"
                                      },
                                      {
                                          "type": "text",
                                          "text": `วันที่ : ${AppointmentUserData.appointment.appointmentDate}`
                                      },
                                      {
                                          "type": "text",
                                          "text": `คลินิก : ${AppointmentUserData.appointment.clinic}`
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
                            console.error('Error:', error.response.data);
                        }
                    }
                    if (appointment.clinic === "คลินิกทั่วไป" || appointment.clinic === "คลินิกเฉพาะทาง") {
                        const info = {
                            status: "ไม่สำเร็จ",
                            clinic: appointment.clinic,
                        };
                        createDashboardData(info);
                    } else {
                        const info = {
                            status: "ไม่สำเร็จ",
                            clinic: appointment.clinic,
                            type: appointment.type
                        };
                        createDashboardData(info);
                    }
                    
                    await updateDoc(docRef, { status: "ไม่สำเร็จ" });
                    console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic} to "ไม่สำเร็จ"`);
                }
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        } else if (
            appointment.status == 'ยืนยันสิทธิ์แล้ว' &&
            thaiTime >= timeslotEnd
        ) {
            try {
                console.log(userData.userLineID);
                if (userData) {
                    if(userData.userLineID != ""){
                        const body = {
                            "to": userData.userLineID,
                            "messages": [
                                {
                                    "type": "flex",
                                    "altText": "‼️ ประเมินความพึงพอใจ ‼️",
                                    "contents": {
                                        "type": "bubble",
                                        "header": {
                                            "type": "box",
                                            "layout": "vertical",
                                            "contents": [
                                                {
                                                    "type": "text",
                                                    "align" : "center",
                                                    "text": "‼️ ประเมินความพึงพอใจ ‼️"
                                                }
                                            ]
                                        },
                                        "hero": {
                                            "type": "image",
                                            "url": "https://i.pinimg.com/564x/2c/43/3e/2c433ecbb353b1a96615f57dd49803d5.jpg",
                                            "size": "full",
                                            "aspectRatio": "1.75:1"
                                        },
                                        "body": {
                                            "type": "box",
                                            "layout": "vertical",
                                            "contents": [ 
                                                {
                                                    "type": "text",
                                                    "text": "📝แบบประเมินความพึงพอใจ",
                                                    "wrap": true
                                                },
                                                {
                                                    "type": "text",
                                                    "text": "ขอขอบคุณสำหรับการใช้บริการ HCU",
                                                    "wrap": true
                                                },
                                                {
                                                    "type": "text",
                                                    "text":"เพื่อให้เราสามารถปรับปรุงและพัฒนาบริการให้ดียิ่งขึ้นต่อไป กรุณาให้คะแนนความพึงพอใจของท่านด้านล่างนี้ได้เลยครับ/ค่ะ\n",
                                                    "wrap": true
                                                },
                                                {
                                                    "type": "button",
                                                    "height": "sm",
                                                    "margin": "sm",
                                                    "style": "primary",
                                                    "color": "#263A50",
                                                    "action": {
                                                        "type": "uri",
                                                        "label": "ประเมินการใช้บรการ HCU",
                                                        "uri": link(AppointmentUserData)
                                                    }
                                                },
                                                {
                                                    "type": "text",
                                                    "align" : "center",
                                                    "text": "\n🙏🏻ขอบคุณค่ะ/คร้บ 🙏🏻",
                                                    "wrap": true
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
                            console.error('Error:', error.response.data);
                        }
                    }
                    if (appointment.clinic === "คลินิกทั่วไป" || appointment.clinic === "คลินิกเฉพาะทาง") {
                        const info = {
                            status: "เสร็จสิ้น",
                            clinic: appointment.clinic,
                        };
                        createDashboardData(info);
                    } else {
                        const info = {
                            status: "เสร็จสิ้น",
                            clinic: appointment.clinic,
                            type: appointment.type
                        };
                        createDashboardData(info);
                    }
                    
                    await updateDoc(docRef, { status: "เสร็จสิ้น" });
                    console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic} to "เสร็จสิ้น"`);
                }
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        } else if (
            appointment.status == 'รอยืนยันสิทธิ์' &&
            thaiTime >= timeslotEnd
        ) {
            try {
                if (userData) {
                    if(userData.userLineID != ""){
                        const body = {
                            "to": userData.userLineID,
                            "messages": [
                              {
                                "type": "flex",
                                "altText": "‼️ อัพเดตสถานะ ‼️",
                                "contents": {
                                      "type": "bubble",
                                      "header": {
                                          "type": "box",
                                          "layout": "vertical",
                                          "contents": [
                                          {
                                              "type": "text",
                                              "text": "‼️ อัพเดตสถานะการนัดหมาย ‼️"
                                          }
                                          ]
                                      },
                                      "hero": {
                                          "type": "image",
                                          "url": "https://i.pinimg.com/564x/8f/59/1a/8f591a8ae350cf6cbeb5c7534463c11a.jpg",
                                          "size": "full",
                                          "aspectRatio": "1.5:1"
                                      },
                                      "body": {
                                          "type": "box",
                                          "layout": "vertical",
                                          "contents": [
                                          {
                                              "type": "text",
                                              "wrap": true,
                                              "text": "อัพเดตสถานะการเข้าใช้บริการ : ไม่สําเร็จ"
                                          },
                                          {
                                              "type": "text",
                                              "text": `วันที่ : ${AppointmentUserData.appointment.appointmentDate}`
                                          },
                                          {
                                              "type": "text",
                                              "text": `คลินิก : ${AppointmentUserData.appointment.clinic}`
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
                            console.error('Error:', error.response.data);
                        }
                    }
                    if (appointment.clinic === "คลินิกทั่วไป" || appointment.clinic === "คลินิกเฉพาะทาง") {
                        const info = {
                            status: "ไม่สำเร็จ",
                            clinic: appointment.clinic,
                        };
                        createDashboardData(info);
                    } else {
                        const info = {
                            status: "ไม่สำเร็จ",
                            clinic: appointment.clinic,
                            type: appointment.type
                        };
                        createDashboardData(info);
                    }
                    await updateDoc(docRef, { status: 'ไม่สำเร็จ' });
                    console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic : ${AppointmentUserData.appointment.clinic} to "ไม่สําเร็จ"`);
                }
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        }
        
        else if (thaiTime >= currentFormattedTime2 && appointment.status == 'ลงทะเบียนแล้ว' && currentFormattedTime2 <= timeslotEnd) {
            try {
                console.log(userData.userLineID);
                if (userData) {
                    if(userData.userLineID != ""){
                        const body = {
                            "to": userData.userLineID,
                            "messages": [
                              {
                                "type": "flex",
                                "altText": "‼️ อัพเดตสถานะ ‼️",
                                "contents": {
                                      "type": "bubble",
                                      "header": {
                                          "type": "box",
                                          "layout": "vertical",
                                          "contents": [
                                          {
                                              "type": "text",
                                              "text": "‼️ อัพเดตสถานะการนัดหมาย ‼️"
                                          }
                                          ]
                                      },
                                      "hero": {
                                          "type": "image",
                                          "url": "https://i.pinimg.com/564x/8f/59/1a/8f591a8ae350cf6cbeb5c7534463c11a.jpg",
                                          "size": "full",
                                          "aspectRatio": "1.5:1"
                                      },
                                      "body": {
                                          "type": "box",
                                          "layout": "vertical",
                                          "contents": [
                                          {
                                              "type": "text",
                                              "wrap": true,
                                              "text": "อัพเดตสถานะการเข้าใช้บริการ : รอยืนยันสิทธิ์"
                                          },
                                          {
                                              "type": "text",
                                              "text": `วันที่ : ${AppointmentUserData.appointment.appointmentDate}`
                                          },
                                          {
                                              "type": "text",
                                              "text": `คลินิก : ${AppointmentUserData.appointment.clinic}`
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
                            console.error('Error:', error.response.data);
                        }
                    }
                    await updateDoc(docRef, { status: "รอยืนยันสิทธิ์" });
                    console.log(`Updated status for appointment user id : ${AppointmentUserData.id} from clinic : ${AppointmentUserData.appointment.clinic} to "รอยืนยันสิทธิ์"`);
                }
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        } else {
            console.log(`Nothing updated for appointment id : ${AppointmentUserData.id} from clinic clinic : ${AppointmentUserData.appointment.clinic}`);
        }
    });
    setTimeout(updateAppointmentsStatus, 60000);
    } catch (error) {
        console.log(error)
    }
};

const notificationUserToday = async () => {
    try {
    const thaiTime = moment().tz('Asia/Bangkok');
    const currentDate = thaiTime.format('dddd DD/MM/YYYY');
    const currentTime = thaiTime.format('HH:mm:ss');
    const selectedDate = {
        day: thaiTime.date() + 1,
        month: thaiTime.month() + 1,
        year: thaiTime.year(),
        dayName: thaiTime.format('dddd'),
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
                                if(userDetails.userLineID != ""){
                                    const body = {
                                        "to": userDetails.userLineID,
                                        "messages": [
                                            {
                                                "type": "flex",
                                                "altText": "‼️ การนัดหมายของคุณในวันพรุ่งนี้ ‼️",
                                                "contents": {
                                                    "type": "bubble",
                                                    "header": {
                                                        "type": "box",
                                                        "layout": "vertical",
                                                        "contents": [
                                                            {
                                                                "type": "text",
                                                                "size": "14px",
                                                                "weight" : "bold",
                                                                "align" : "center",
                                                                "wrap": true,
                                                                "text": "‼️ การนัดหมายของคุณในวันพรุ่งนี้ ‼️"
                                                            }
                                                        ]
                                                    },
                                                    "hero": {
                                                        "type": "image",
                                                        "url": "https://i.pinimg.com/564x/b3/62/f7/b362f7d08ef02029757e990343f86cb6.jpg",
                                                        "size": "full",
                                                    },
                                                    "body": {
                                                        "type": "box",
                                                        "layout": "vertical",
                                                        "contents": [
                                                            {
                                                                "type": "text",
                                                                "text": "🗓️รายละเอียดการนัดหมาย"
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text":` วันที่ : ${userDatas.appointment.appointmentDate}`
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": `คลินิก : ${userDatas.appointment.clinic}`
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": `เวลา : ${userDatas.timeslot.start}น. - ${userDatas.timeslot.end}น.`
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": "‼️ อย่าลืมนัดหมายของคุณ"
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": "🙏🏻 กรุณามาก่อนเวลานัดหมาย 10 นาที"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                "type": "text",
                                                "text": "สามารถดูรายละเอียดผ่านเว็บไซต์ : https://liff.line.me/2002624288-QkgWM7yy"
                                            }
                                        ]
                                    }
                                    try {
                                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                                        console.log('Response:', response.data);
                                    } catch (error) {
                                        console.error('Error:', error.response.data);
                                    }
                                }
                                return userDetails;
                            } else {
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
               
            } else {
                console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
            }
        }
        setTimeout(fetchUserDataWithAppointments, 6000000);
    } catch (error) {
        console.error('Error fetching user data with appointments:', error);
    }
};

const notificationUser3DayBefore = async () => {
    try {
    const thaiTime = moment().tz('Asia/Bangkok');
    const currentDate = thaiTime.format('dddd DD/MM/YYYY');
    const currentTime = thaiTime.format('HH:mm:ss');
    const selectedDate = {
        day: thaiTime.date() + 3,
        month: thaiTime.month() + 1,
        year: thaiTime.year(),
        dayName: thaiTime.format('dddd'),
        time: currentTime
    };
    console.log(selectedDate,day);
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
                                if(userDetails.userLineID != ""){
                                    const body = {
                                        "to": userDetails.userLineID,
                                        "messages": [
                                            {
                                                "type": "flex",
                                                "altText": "‼️ การนัดหมายของคุณในอีก 3 วัน ‼️",
                                                "contents": {
                                                    "type": "bubble",
                                                    "header": {
                                                        "type": "box",
                                                        "layout": "vertical",
                                                        "contents": [
                                                            {
                                                                "type": "text",
                                                                "size": "14px",
                                                                "weight" : "bold",
                                                                "align" : "center",
                                                                "wrap": true,
                                                                "text": "‼️ การนัดหมายของคุณในอีก 3 วัน ‼️",
                                                            }
                                                        ]
                                                    },
                                                    "hero": {
                                                        "type": "image",
                                                        "url": "https://i.pinimg.com/564x/b3/62/f7/b362f7d08ef02029757e990343f86cb6.jpg",
                                                        "size": "full",
                                                    },
                                                    "body": {
                                                        "type": "box",
                                                        "layout": "vertical",
                                                        "contents": [
                                                            {
                                                                "type": "text",
                                                                "text": "🗓️รายละเอียดการนัดหมาย"
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text":` วันที่ : ${userDatas.appointment.appointmentDate}`
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": `คลินิก : ${userDatas.appointment.clinic}`
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": `เวลา : ${userDatas.timeslot.start}น. - ${userDatas.timeslot.end}น.`
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": "‼️ อย่าลืมนัดหมายของคุณ"
                                                            },
                                                            {
                                                                "type": "text",
                                                                "text": "🙏🏻 กรุณามาก่อนเวลานัดหมาย 10 นาที"
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                "type": "text",
                                                "text": "สามารถดูรายละเอียดผ่านเว็บไซต์ : https://liff.line.me/2002624288-QkgWM7yy"
                                            }
                                        ]
                                    }
                                    try {
                                        const response = await axios.post(`${LINE_BOT_API}/push`, body, { headers });
                                        console.log('Response:', response.data);
                                    } catch (error) {
                                        console.error('Error:', error.response.data);
                                    }
                                }
                                return userDetails;
                            } else {
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
               
            } else {
                console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
            }
        }
        setTimeout(fetchUserDataWithAppointments, 6000000);
    } catch (error) {
        console.error('Error fetching user data with appointments:', error);
    }
};


let notiChecker = true;
let dayToCheck = moment().tz('Asia/Bangkok').startOf('day');

setInterval(() => {
    let thaiTime = moment().tz('Asia/Bangkok');
    let dayToChecks = moment().tz('Asia/Bangkok').startOf('day').hour(8);

    let day = moment().tz('Asia/Bangkok').startOf('day');
    const currentDate = thaiTime.format('dddd DD/MM/YYYY');
    const currentTime = thaiTime.format('HH:mm:ss');
    const selectedDate = {
        day: thaiTime.date(),
        month: thaiTime.month() + 1,
        year: thaiTime.year(),
        dayName: thaiTime.format('dddd'),
        time: currentTime
    };

    if (thaiTime.isAfter(dayToChecks) && notiChecker) {
        notiChecker = false; 
        console.log("Notification Time!");
        notificationUserToday(); 
        notificationUser3DayBefore();
        NotificationActivityToday();
    }    
    
    if (!day.isSame(dayToCheck)) {
        console.log("New day update");
        notiChecker = true;
        console.log(day.format(), dayToCheck.format());
        dayToCheck = moment().tz('Asia/Bangkok').startOf('day');
        day = moment().tz('Asia/Bangkok').startOf('day');
        fetchAvailableActivities();
        CloseAvailableActivities();
    }
    else {
        console.log("this is today");
    }
}, 5000);


app.get('/', (req, res) => {
    res.send('test')
})

app.get('/date', (req, res) => {
    const thaiTime = moment().tz('Asia/Bangkok');
    res.send(thaiTime)
})

fetchUserDataWithAppointments();
updateAppointmentsStatus();
fetchAvailableActivities();
CloseAvailableActivities();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

