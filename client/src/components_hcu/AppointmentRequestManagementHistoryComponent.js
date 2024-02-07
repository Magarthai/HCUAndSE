import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import "../css/AdminAppointmentRequestManagementComponent.css";
import { useUserAuth } from "../context/UserAuthContext";
import NavbarComponent from "../components_hcu/NavbarComponent";
import Close_icon from "../picture/close.png";
import Tick_icon from "../picture/tick-circle.png";
import arrow_icon from "../picture/arrow.png";
import { db, getDocs, collection, doc, getDoc, firestore } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const AppointmentRequestManagementHistoryComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [selectedDate, setSelectedDate] = useState(null);
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const [isChecked, setIsChecked] = useState({});
    const [timeOptions, setTimeOptions] = useState([]);
    

    const [state, setState] = useState({
        appointmentDate: "",
        appointmentTime: "",
        appointmentId: "",
        appointmentCasue: "",
        appointmentSymptom: "",
        appointmentNotation: "",
        clinic: "",
        uid:"",
        timeablelist:"",
    })

    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic,uid,timeablelist } = state
    const isSubmitEnabled =
    !appointmentDate || !appointmentTime || !appointmentId;
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };


    const fetchUserDataWithAppointments = async () => {
        try {
            if (user) {
                const appointmentsCollection = collection(db, 'appointment');
                const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection,
                where('postPone', '==', 'yes')));
    
                const timeTableCollection = collection(db, 'timeTable');
                const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
                    const appointmentData = doc.data();
                    return {
                        appointmentId: doc.id,
                        appointmentuid: doc.id,
                        ...appointmentData,
                    };
                });
                
    
                console.log("existingAppointments", existingAppointments);
    
                if (existingAppointments.length > 0) {
    
                    const AppointmentUsersDataArray = [];
    
                    for (const appointment of existingAppointments) {
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
    
                                const userDetails = await getUserDataFromUserId(appointment,appointment.appointmentId, timeslot,appointment.appointmentuid);
    
                                if (userDetails) {
                                    AppointmentUsersDataArray.push(userDetails);
                                    console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                                } else {
                                    console.log("No user details found for appointmentId", appointment.appointmentId);
                                }
                            } else {
                                console.log("No such document with ID:", timeTableId);
                            }
                        } catch (error) {
                            console.error('Error fetching timetable data:', error);
                        }
                    }
    
                    if (AppointmentUsersDataArray.length > 0) {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);
                        console.log("AppointmentUsersData", AppointmentUsersDataArray);
                    } else {
                        console.log("No user details found for any appointmentId");
                    }
    
                    console.log("AppointmentUsersDataArray", AppointmentUsersDataArray);
                    setAllAppointmentUsersData(AppointmentUsersDataArray);
                    console.log("AppointmentUsersData", AppointmentUsersDataArray);
                } else {
                    console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data with appointments:', error);
        }
    };



    

    const getUserDataFromUserId = async (appointment,userId,timeslot,appointmentuid) => {
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

        if (userQuerySnapshot.empty) {
            console.log("No user found with id:", userId);
            return null;
        }
        const userUid = userQuerySnapshot.docs[0].id;
        const userDatas = userQuerySnapshot.docs[0].data();
        userDatas.timeslot = timeslot;
        userDatas.appointment = appointment;
        userDatas.appointmentuid = appointmentuid;
        userDatas.userUid = userUid;
        console.log("User Data for userId", userId, ":", userDatas);
        console.log("userDatas",userDatas)
        console.log("testxd",userDatas.timeslot.start)
        return userDatas;
    };
  
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        const responsivescreen = () => {
        const innerWidth = window.innerWidth;
        const baseWidth = 1920;
        const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
        setZoomLevel(newZoomLevel);
        };

        responsivescreen();
        window.addEventListener("resize", responsivescreen);
        const updateShowTime = () => {
        const newTime = getShowTime();
        if (newTime !== showTime) {
            setShowTime(newTime);
        }
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };
  
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
        fetchUserDataWithAppointments();
        console.log("AppointmentUsersData",AppointmentUsersData)
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };
    
    }, [user]); 
    const containerStyle = {
        zoom: zoomLevel,
    };

    function getShowTime() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    }

    function formatNumber(num) {
        return num < 10 ? "0" + num : num.toString();
    }

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    const navigate = useNavigate();

    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">ประวัติการจัดการคำขอเลื่อนนัดหมาย</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <a href="/adminAppointmentRequestManagementComponent"><img src={arrow_icon} className="approval-icon admin-back-arrow"/></a>
        <div className="admin">
            <div className="admin-header">
                <p className="admin-hearder-item admin-textBody-large colorPrimary-800">รายการนัดหมาย</p>            
            </div>
            
            <div className="admin-body">
                
                <table class="table table-striped">
                    <thead>
                        <tr className="center colorPrimary-800">
                            <th className="admin-textBody-large colorPrimary-800" id="th_id">รหัสนักศึกษา/รหัสพนักงาน</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_name">ชื่อ</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_tel">เบอร์โทร</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_clinic">คลินิก</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_dateOld">วันนัดหมายเดิม</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_dateNew">วันนัดหมายที่ขอเปลี่ยน</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_symptom">อาการ</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_notation">หมายเหตุ</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_approve">การอนุมัติ</th>
                        </tr>
                    </thead>
                    <tbody >
                    {AppointmentUsersData && AppointmentUsersData.length > 0 ? (
                        <>
                            {AppointmentUsersData
                                .filter(AppointmentUserData => AppointmentUserData.appointment.postPone === "yes")
                                .sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start))
                                .map((AppointmentUserData, index) => (
                        <tr >
                            <td className="admin-textBody-huge2 colorPrimary-800" >{AppointmentUserData.appointment.appointmentId}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.firstName} {AppointmentUserData.lastName}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.tel}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.appointment.clinic}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.appointment.appointmentDate}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.appointment.appointmentDate2}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.appointment.appointmentSymptom}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.appointment.appointmentNotation}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{AppointmentUserData.appointment.appove}</td>

                        </tr>
             ))
            }
        </>
    ) : (<tr >
        <td className="admin-textBody-huge2 colorPrimary-800" >64090500444</td>
        <td className="admin-textBody-huge2 colorPrimary-800">รวิษฎา อนุรุตติกุล</td>
        <td className="admin-textBody-huge2 colorPrimary-800">0630810573</td>
        <td className="admin-textBody-huge2 colorPrimary-800">คลินิกกายภาพ</td>
        <td className="admin-textBody-huge2 colorPrimary-800">07/12/2023</td>
        <td className="admin-textBody-huge2 colorPrimary-800">22/12/2023</td>
        <td className="admin-textBody-huge2 colorPrimary-800">ป่วย</td>
        <td className="admin-textBody-huge2 colorPrimary-800">-</td>
        <td className="admin-textBody-huge2 colorPrimary-800">อนุมัติ</td>

    </tr>
    )}
                    </tbody>
                </table>
            </div>
           
        </div>
        
    </div>

    );
}

export default AppointmentRequestManagementHistoryComponent;