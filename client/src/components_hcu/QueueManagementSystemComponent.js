import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection, doc, getDoc, firestore } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import NavbarComponent from "./NavbarComponent";
import "../css/AdminQueueManagementSystemComponent.css";
import { getUserDataFromUserId } from '../backend/getDataFromUserId'
import verify_rights_icon from "../picture/verify_rights_icon.png";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
const QueueManagementSystemComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [selectedDate, setSelectedDate] = useState(null);
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    useEffect(() => {
        document.title = 'Health Care Unit';
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

        const updateAppointmentsStatus = async () => {
            const currentFormattedTime = new Date(); 
            console.log("currentFormattedTime", currentFormattedTime);
        
            AppointmentUsersData.forEach(async (AppointmentUserData) => {
                const { timeslot, appointment } = AppointmentUserData;
                const currentDate = new Date();
                const [hoursEnd, minutesEnd] = timeslot.end.split(':').map(Number);
                const [hoursStart, minutesStart] = timeslot.start.split(':').map(Number);
        
                const timeslotEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hoursEnd, minutesEnd, 0);
                const timeslotStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hoursStart, minutesStart, 0);
        
                const currentFormattedTime2 = new Date(timeslotStart.getTime() - 15 * 60000);
        
                console.log(";-;", currentFormattedTime, currentFormattedTime2, timeslotEnd, timeslotStart);
        
                if (
                    appointment.status == 'ลงทะเบียนแล้ว' &&
                    currentFormattedTime >= timeslotEnd
                ) {
                    try {
                        const docRef = doc(db, 'appointment', appointment.appointmentuid);
                        await updateDoc(docRef, { status: "ไม่สำเร็จ" });
        
                        setAllAppointmentUsersData((prevData) => {
                            const updatedData = prevData.map((data) => {
                                if (data.appointment.appointmentuid === appointment.appointmentuid) {
                                    return { ...data, appointment: { ...data.appointment, status: "ไม่สำเร็จ" } };
                                }
                                return data;
                            });
                            return updatedData;
                        });
        
                        console.log(`Updated status for appointment ${appointment.appointmentuid} to "ไม่สำเร็จ"`);
                    } catch (error) {
                        console.error('Error updating appointment status:', error);
                    }
                } else if (currentFormattedTime >= currentFormattedTime2 && appointment.status == 'ลงทะเบียนแล้ว' && currentFormattedTime2 <= timeslotEnd) {
                    try {
                        const docRef = doc(db, 'appointment', appointment.appointmentuid);
                        await updateDoc(docRef, { status: "รอยืนยันสิทธิ์" });
        
                        setAllAppointmentUsersData((prevData) => {
                            const updatedData = prevData.map((data) => {
                                if (data.appointment.appointmentuid === appointment.appointmentuid) {
                                    return { ...data, appointment: { ...data.appointment, status: "รอยืนยันสิทธิ์" } };
                                }
                                return data;
                            });
                            return updatedData;
                        });
        
                        console.log(`Updated status for appointment ${appointment.appointmentuid} to "รอยืนยันสิทธิ์"`);
                    } catch (error) {
                        console.error('Error updating appointment status:', error);
                    }
                }
            });
        }; 
        const updateAppointments = async () => {
            updateAppointmentsStatus();
        };
    
        updateAppointments();
    
        const intervalId = setInterval(updateAppointments, 6000);
    
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
            clearInterval(intervalId);
        };

    }, [user,userData]);
    const containerStyle = {
        zoom: zoomLevel,
    };


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
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const docRef = doc(db, 'appointment', id);
                    updateDoc(docRef, { status: "เสร็จสิ้น" }).catch(error => {
                        console.error('Error updating timetable status:', error);
                    });

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
                        }
                    });
                } catch {

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
        adminQueueCards.forEach(card => card.classList.remove('focused'));
        event.currentTarget.classList.add('focused');
    }

    adminQueueCards.forEach(card => {
        card.addEventListener('click', handleCardClick);
    });

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
                    where('clinic', '==', 'คลินิกทั่วไป')));

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
    
                                const userDetails = await getUserDataFromUserId(appointment, appointment.appointmentId, timeslot, appointment.appointmentuid);
    
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
                        setAllAppointmentUsersData(AppointmentUsersDataArray);   
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
                        <a href="/adminQueueManagementSystemComponent" target="_parent" id="select">คลินิกทั่วไป</a>
                        <a href="/adminQueueManagementSystemComponentSpecial" target="_parent" >คลินิกเฉพาะทาง</a>
                        <a href="/adminQueueManagementSystemComponentPhysic" target="_parent" >คลินิกกายภาพ</a>
                        <a href="/adminQueueManagementSystemComponentNeedle" target="_parent" >คลินิกฝังเข็ม</a>
                    </div>
                </div>

                <div className="admin-body">
                    <div className="admin-queue-flexbox">
                        <div className="admin-queue-box">
                            <h2 className="colorPrimary-800">นัดหมายคลินิกทั่วไป</h2>
                            {AppointmentUsersData && AppointmentUsersData.length > 0 ? (
                                AppointmentUsersData.sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start)).map((AppointmentUserData, index) => (
                                    <div className="admin-queue-card" onClick={() => openDetailAppointment(AppointmentUserData)} key={index}>
                                    <div className="admin-queue-card-time colorPrimary-800">
                                        <p className="admin-textBody-small">{AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}</p>
                                    </div>
                                    <div className="admin-queue-card-info colorPrimary-800">
                                        <p className="admin-textBody-huge">{AppointmentUserData.id}</p>
                                        <p className="admin-textBody-small">{`${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`}</p>
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
                                ))
                                ) : (
                                    <div className="admin-queue-card" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <ScaleLoader color={"#54B2B0"} size={25} />
                                </div>
                                )}


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

export default QueueManagementSystemComponent;