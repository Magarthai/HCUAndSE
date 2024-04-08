import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection, doc, getDoc, firestore } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import NavbarComponent from "./NavbarComponent";
import "../css/AdminQueueManagementSystemComponent.css";
import verify_rights_icon from "../picture/verify_rights_icon.png";
import { getUserDataFromUserId } from '../backend/getDataFromUserId'
import Swal from "sweetalert2";
import axios from "axios"
import { ScaleLoader } from "react-spinners";
import 'react-loading-skeleton/dist/skeleton.css'
const QueueManagementSystemComponentSpecial = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [selectedDate, setSelectedDate] = useState(null);
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        document.title = 'Health Care Unit';
        setTimeout(()=> {
            setLoading(false)
        },1000)
        fetchUserDataWithAppointments();
        console.log("AppointmentUsersData",AppointmentUsersData)
        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };
        setSelectedDate(formattedSelectedDate)
        console.log("Appointment",formattedSelectedDate)
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

        
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };

        


    }, [user,userData]);
    const containerStyle = {
        zoom: zoomLevel,
    };
    function timeToCheck() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return `${formatNumber(hours)}:${formatNumber(minutes)}`;
    }

    function formatNumber(num) {
        return num < 10 ? "0" + num : num.toString();
    }
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
    const formattedSelectedDate = {
        day: date,
        month: month,
        year: year,
        dayName: day,
    };

    const handleToggle = async (id, AppointmentUserData) => {
        let x = document.getElementById("detail-appointment");
        Swal.fire({
            title: 'Confirm',
            text: `ยืนยันคิว ${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'เสร็จสิ้น',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#263A50',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    const info = {
                        id: id,
                        AppointmentUserData: AppointmentUserData,
                    }
                    const updateStatus = await axios.post(`${process.env.REACT_APP_API}/api/UpdateToSuccessStatus`,info)
                    if(updateStatus.data == "success"){
                    Swal.fire(
                        {
                            title: 'การอัปเดตคิวสำเร็จ!',
                            text: `คิวถูกอัปเดตเรียบร้อยแล้ว!`,
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            }
                        }
                    ).then((result) => {
                        if (result.isConfirmed) {
                            fetchUserDataWithAppointments();
                            if (window.getComputedStyle(x).display === "block") {
                                x.style.display = "none";
                                adminQueueCards.forEach(card => card.classList.remove('focused'));
                            }
                        }
                    });
                }
                } catch (error){
                    console.log(error);
                }

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    {
                        title: 'การอัปเดตคิวไม่สำเร็จ!',
                        text: `ไม่สามารถอัปเดตคิวได้ กรุณาลองอีกครั้งในภายหลัง`,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    }
                )
            }
        })



    };


    const adminQueueCards = document.querySelectorAll('.admin-queue-card');

    function handleCardClick(event) {
        let currentCard = event.currentTarget
        let isFocused = currentCard.classList.contains('focused')
        if(isFocused){
            currentCard.classList.remove('focused');

        }else{
            adminQueueCards.forEach(card => card.classList.remove('focused'));
            currentCard.classList.add('focused');
        }
    }
    // adminQueueCards.forEach(card => {
    //     card.addEventListener('click', handleCardClick);
    // });

    const statusElements = document.querySelectorAll('.admin-queue-card-status p');

    function changeStatusTextColor(element) {
        if (element.textContent.trim() === 'เสร็จสิ้น') {
            element.style.color = '#098B66';
        }
        else if (element.textContent.trim() === 'ไม่สำเร็จ') {
            element.style.color = '#C11F1F';
        }
        else if (element.textContent.trim() === 'ยืนยันสิทธิ์แล้ว') {
            element.style.color = '#D88C09';
        }
        else if (element.textContent.trim() === 'ลงทะเบียนแล้ว') {
            element.style.color = '#A1A1A1';
        }
        else if (element.textContent.trim() === 'รอยืนยันสิทธิ์') {
            element.style.color = '#A1A1A1';
        }
    }


    statusElements.forEach(changeStatusTextColor);

    const fetchUserDataWithAppointments = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                const appointmentsCollection = collection(db, 'appointment');
                const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==',
                    `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
                    where('clinic', '==', 'คลินิกกายภาพ')));

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
                    const AppointmentUsersDataArray = [];

                    for (const appointment of existingAppointments) {
                        const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
                        const timeTableId = appointment.appointmentTime.timetableId;

                        try {
                            const timetableDocRef = doc(timeTableCollection, timeTableId);
                            const timetableDocSnapshot = await getDoc(timetableDocRef);

                            if (timetableDocSnapshot.exists()) {
                                const timetableData = timetableDocSnapshot.data();
                                const timeslot = timetableData.timeablelist[timeSlotIndex];

                                const userDetails = await getUserDataFromUserId(appointment, appointment.appointmentId, timeslot, appointment.appointmentuid);

                                if (userDetails) {
                                    AppointmentUsersDataArray.push(userDetails);
                                
                                } else {
                                  
                                }
                            } else {

                            }
                        } catch (error) {
                            console.error('Error fetching timetable data:', error);
                        }
                    }

                    if (AppointmentUsersDataArray.length > 0) {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);
                        
                    } else {
 
                    }

                  
                    setAllAppointmentUsersData(AppointmentUsersDataArray);
                   
                } else {
                    console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data with appointments:', error);
        }
    };

    const [saveDetailId, setsaveDetailId] = useState([])
    const [saveEditId, setsaveEditId] = useState([])
    const openDetailAppointment = (AppointmentUsersData) => {
        let x = document.getElementById("detail-appointment");
        let statusElementDetail = document.getElementById("detail-appointment-status");
        if (AppointmentUsersData.appointment.status === 'ยืนยันสิทธิ์แล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("confirmed-background");
        } else if (AppointmentUsersData.appointment.status === 'เสร็จสิ้น') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("completed-background");
        } else if (AppointmentUsersData.appointment.status === 'ไม่สำเร็จ') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("failed-background");
        } else if (AppointmentUsersData.appointment.status === 'ลงทะเบียนแล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("pending-confirmation-background");
        }else if (AppointmentUsersData.appointment.status === 'รอยืนยันสิทธิ์') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("pending-confirmation-background");
        }
        setsaveEditId("")
        setsaveDetailId(AppointmentUsersData.appointmentuid)
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            console.log(AppointmentUsersData.timeslot.start)
            document.getElementById("detail-appointment-status").innerHTML = `${AppointmentUsersData.appointment.status}`
            document.getElementById("detail-appointment-date").innerHTML = `<b>วันที่</b> : ${AppointmentUsersData.appointment.appointmentDate}`
            document.getElementById("detail-appointment-time").innerHTML = `<b>เวลา</b> : ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
            document.getElementById("detail-appointment-id").innerHTML = `<b>รหัสนักศึกษา</b> : ${AppointmentUsersData.id}`
            document.getElementById("detail-appointment-name").innerHTML = `<b>ชื่อ</b> :  ${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`
            document.getElementById("detail-appointment-casue").innerHTML = `<b>สาเหตุการนัดหมาย</b> : ${AppointmentUsersData.appointment.appointmentCasue}`
            document.getElementById("detail-appointment-symptom").innerHTML = `<b>อาการเบื้องต้น</b> : ${AppointmentUsersData.appointment.appointmentSymptom}`
            document.getElementById("detail-appointment-notation").innerHTML = `<b>หมายเหตุ</b> : ${AppointmentUsersData.appointment.appointmentNotation}`
            
        } else {
            if(saveDetailId === AppointmentUsersData.appointmentuid){
                x.style.display = "none";
                setsaveEditId("")
            }else{
                let x = document.getElementById("detail-appointment");
                setsaveEditId(AppointmentUsersData.appointmentuid)
                console.log(AppointmentUsersData.timeslot.start)
                document.getElementById("detail-appointment-status").innerHTML = `${AppointmentUsersData.appointment.status}`
                document.getElementById("detail-appointment-date").innerHTML = `<b>วันที่</b> : ${AppointmentUsersData.appointment.appointmentDate}`
                document.getElementById("detail-appointment-time").innerHTML = `<b>เวลา</b> : ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
                document.getElementById("detail-appointment-id").innerHTML = `<b>รหัสนักศึกษา</b> : ${AppointmentUsersData.id}`
                document.getElementById("detail-appointment-name").innerHTML = `<b>ชื่อ</b> :  ${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`
                document.getElementById("detail-appointment-casue").innerHTML = `<b>สาเหตุการนัดหมาย</b> : ${AppointmentUsersData.appointment.appointmentCasue}`
                document.getElementById("detail-appointment-symptom").innerHTML = `<b>อาการเบื้องต้น</b> : ${AppointmentUsersData.appointment.appointmentSymptom}`
                document.getElementById("detail-appointment-notation").innerHTML = `<b>หมายเหตุ</b> : ${AppointmentUsersData.appointment.appointmentNotation}`
            }

        }
    }

    return (

        <div style={containerStyle}>
            <NavbarComponent />
            <div className="admin-topicBox colorPrimary-800">
                <div></div>
                <div>
                    <h1 className="center">ระบบการจัดการคิว</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large">Time : {showTime}</p>
                </div>
            </div>
            <div className="admin">
                <div className="admin-header">
                <div className="admin-hearder-item">
                        <a href="/adminQueueManagementSystemComponent" target="_parent" >คลินิกทั่วไป</a>
                        <a href="/adminQueueManagementSystemComponentSpecial" target="_parent">คลินิกเฉพาะทาง</a>
                        <a href="/adminQueueManagementSystemComponentPhysic" target="_parent" id="select">คลินิกกายภาพ</a>
                        <a href="/adminQueueManagementSystemComponentNeedle" target="_parent" >คลินิกฝังเข็ม</a>
                    </div>
                </div>

                <div className="admin-body">
                    <div className="admin-queue-flexbox">
                        <div className="admin-queue-box">
                            <h2 className="colorPrimary-800">นัดหมายคลินิกกายภาพ</h2>
                            <div className="admin-queue-card-box">
                            {AppointmentUsersData && AppointmentUsersData.length > 0 ? (
                                AppointmentUsersData.sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start)).map((AppointmentUserData, index) => (
                                    <>
                                    {loading ? (<div className="admin-queue-card" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><ScaleLoader color={"#54B2B0"} size={25} /></div>) :( 
                                    <div className="admin-queue-card" onClick={(event) => {openDetailAppointment(AppointmentUserData);handleCardClick(event)}} key={index}>
                                    <div className="admin-queue-card-time colorPrimary-800">
                                        <p className="admin-textBody-small">{AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}</p>
                                    </div>
                                    <div className="admin-queue-card-info colorPrimary-800">
                                        <p className="admin-textBody-huge">{AppointmentUserData.id}</p>
                                        <p className="admin-textBody-small" style={{overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{`${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`}</p>
                                    </div>
                                    <div className="admin-queue-card-status">
                                        <p className="admin-textBody-small">{AppointmentUserData.appointment.status}</p>
                                    </div>
                                    {AppointmentUserData.appointment.status === 'ยืนยันสิทธิ์แล้ว' ? (
                                        <div className="admin-queue-card-function-succeed" onClick={() => handleToggle(AppointmentUserData.appointment.appointmentuid, AppointmentUserData)}>
                                        <img src={verify_rights_icon} className="admin-queue-card-icon" alt="verify_rights_icon" />
                                        </div>
                                    ) : (
                                        <div className="admin-queue-card-function">
                                        <img src={verify_rights_icon} className="admin-queue-card-icon" alt="verify_rights_icon" />
                                        </div>
                                    )}
                                    </div>
                                    )}</>
                                ))
                                ) : (
                                    <div className="admin-queue-card colorPrimary-800 admin-textBody-huge" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        ไม่มีนัดหมาย
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="admin-queue-box border-L colorPrimary-800">
                            <div id="detail-appointment">
                            <div className="admin-queue-detail-header">
                                <div className="admin-queue-detail-header-items"></div>
                                <h2 className="admin-queue-detail-header-items center">รายละเอียดนัดหมาย</h2>
                                <div className="admin-queue-detail-header-items admin-right" ><span id="detail-appointment-status" className="">ยืนยันสิทธ์แล้ว</span></div>
                            </div>
                            <br></br>
                            <p id="detail-appointment-date" className="admin-textBody-big"><b>วันที่</b> : 13/12/2023</p>
                            <p id="detail-appointment-time" className="admin-textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                            <p id="detail-appointment-id" className="admin-textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                            <p id="detail-appointment-name" className="admin-textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                            <p id="detail-appointment-casue" className="admin-textBody-big"><b>สาเหตุการนัดหมาย</b>: ตรวจรักษาโรค</p>
                            <p id="detail-appointment-symptom" className="admin-textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                            <p id="detail-appointment-notation" className="admin-textBody-big"><b>หมายเหตุ</b>: -</p>
                            </div>
                        </div>

                    </div>


                </div>

            </div>

        </div>

    );
}

export default QueueManagementSystemComponentSpecial;