import NavbarComponent from "./NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from "sweetalert2";
import { fetchTimeTableDataFromBackend } from '../backend/backendGeneral'
import { fetchUserDataWithAppointments } from '../backend/backendGeneral'
import "../css/AdminQueueManagementSystemComponent.css";
import { DeleteAppointment } from '../backend/backendGeneral'
import { PulseLoader } from "react-spinners";
import icon_date from "../picture/datepicker.png"
import { id } from "date-fns/locale";
import axios from "axios";
import arrow_icon from "../picture/arrow.png";

const AddAppointment = (props) => {

    const [selectedDate, setSelectedDate] = useState(null);
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const { user, userData } = useUserAuth();
    const [isChecked, setIsChecked] = useState({});
    const [timeOptions, setTimeOptions] = useState([]);
    const REACT_APP_API = process.env.REACT_APP_API;

    const [isLoading, setIsLoading] = useState(true);
    const [saveDetailId, setsaveDetailId] = useState([])
    const [selectedValue, setSelectedValue] = useState("");

    const [state, setState] = useState({
        appointmentDate: "",
        appointmentTime: "",
        appointmentId: "",
        appointmentCasue: "",
        appointmentSymptom: "",
        appointmentNotation: "",
        clinic: "",
        uid: "",
        timeablelist: "",
        appointmentDater: "",
        appointmentTimer: "",
        appointmentIdr: "",
        appointmentCasuer: "",
        appointmentSymptomr: "",
        appointmentNotationr: "",
        clinicr: "",
        uidr: "",
        timeablelistr: "",
        datebackup: "",
        timebackup: "",
    })

    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic, uid, timeablelist ,appointmentDater,appointmentTimer,appointmentCasuer,appointmentSymptomr,appointmentNotationr} = state
    const isSubmitEnabled =
        !appointmentDate || !appointmentTime || !appointmentId;
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
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
        
      
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };
    
    }, [selectedDate,userData]); 
    const containerStyle = {
        zoom: zoomLevel,
    };

 
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setDate(0)

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
    const DateToCheck = `${date}/${month}/${year}`
    const [selectedCount, setSelectedCount] = useState(1);
    
    const handleDateSelect = (selectedDate) => {
        setAllAppointmentUsersData([]);
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
        let x = document.getElementById("detail-appointment");
        x.style.display = "none";
    };

    const openDetailAppointment = (element,AppointmentUsersData) => {
        let x = document.getElementById("detail-appointment");
        let y = document.getElementById("add-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            setsaveDetailId(AppointmentUsersData.appointmentuid)
            const statusElement = document.getElementById("detail-appointment-status");
            if (statusElement) {
                statusElement.innerHTML = `${AppointmentUsersData.appointment.status}`;
            }
            document.getElementById("detail-appointment-date").innerHTML = `<b>วันที่</b> : ${AppointmentUsersData.appointment.appointmentDate}`
            document.getElementById("detail-appointment-time").innerHTML = `<b>เวลา</b> : ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
            document.getElementById("detail-appointment-id").innerHTML = `<b>รหัสนักศึกษา</b> : ${AppointmentUsersData.id}`
            document.getElementById("detail-appointment-name").innerHTML = `<b>ชื่อ</b> :  ${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`
            document.getElementById("detail-appointment-casue").innerHTML = `<b>สาเหตุการนัดหมาย</b> : ${AppointmentUsersData.appointment.appointmentCasue}`
            document.getElementById("detail-appointment-symptom").innerHTML = `<b>อาการเบื้องต้น</b> : ${AppointmentUsersData.appointment.appointmentSymptom}`
            document.getElementById("detail-appointment-notation").innerHTML = `<b>หมายเหตุ</b> : ${AppointmentUsersData.appointment.appointmentNotation}`

        } else {
            if (saveDetailId === AppointmentUsersData.appointmentuid) {
                x.style.display = "none";
                setsaveDetailId("")
            } else {
                setsaveDetailId(AppointmentUsersData.appointmentuid)
                const statusElement = document.getElementById("detail-appointment-status");
                if (statusElement) {
                    statusElement.innerHTML = `${AppointmentUsersData.appointment.status}`;
                }
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

    const openAddAppointment = () => {
        setState((prevState) => ({
            ...prevState,
            appointmentTime: "",
            appointmentId: "",
            appointmentCasue: "",
            appointmentSymptom: "",
            appointmentNotation: "",
            clinic: "",
            uid: "",
            appointmentDater: "",
            appointmentTimer: "",
            appointmentCasuer:"",
            appointmentSymptomr: "",
            appointmentNotationr: "",
            typecheckr: "",
        }));
        adminCards.forEach(card => card.classList.remove('focused'));
        let x = document.getElementById("add-appointment");
        let y = document.getElementById("detail-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            setsaveDetailId("")
   
            
        } else {
            x.style.display = "none";
        }

    }

    const submitForm = async (e) => {
        e.preventDefault();
    }

    const closeEditAppointment = () => {
        setState((prevState) => ({
            ...prevState,
            appointmentTime: "",
            appointmentId: "",
            appointmentCasue: "",
            appointmentSymptom: "",
            appointmentNotation: "",
            clinic: "",
            uid: "",
            appointmentDater: "",
            appointmentTimer: "",
            appointmentCasuer:"",
            appointmentSymptomr: "",
            appointmentNotationr: "",
            typecheckr: "",
        }));
        adminCards.forEach(card => card.classList.remove('focused'));
        let x = document.getElementById("add-appointment");
        let y = document.getElementById("detail-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "none";
            y.style.display = "none";
            setsaveDetailId("")
            setSelectedCount(1)
        } else {
            x.style.display = "none";
            y.style.display = "none";
            setsaveDetailId("")
            setSelectedCount(1)
        }
    }


    const handleSelectChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        setSelectedCount(selectedCount + 1);
    };
    
    const adminCards = document.querySelectorAll('.admin-appointment-card');

    function handleCardClick(event) {
        let currentCard = event.currentTarget
        let isFocused = currentCard.classList.contains('focused')
        if(isFocused){
            currentCard.classList.remove('focused');

        }else{
            adminCards.forEach(card => card.classList.remove('focused'));
            currentCard.classList.add('focused');
        }
    }

    const statusElements = document.querySelectorAll('.admin-appointment-status');

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
        else if (element.textContent.trim() === 'รอยืนยันสิทธิ์') {
            element.style.color = '#A1A1A1';
        }
        else if (element.textContent.trim() === 'ลงทะเบียนแล้ว') {
            element.style.color = '#A1A1A1';
        }
    }


    statusElements.forEach(changeStatusTextColor);

    let statusElementDetail = document.getElementById("detail-appointment-status");

    if (statusElementDetail) {
        if (statusElementDetail.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);

            statusElementDetail.classList.add("confirmed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'เสร็จสิ้น') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("completed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'ไม่สำเร็จ') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("failed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'ลงทะเบียนแล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("pending-confirmation-background");
        }
        else if (statusElementDetail.textContent.trim() === 'รอยืนยันสิทธิ์') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("pending-confirmation-background");
        }
    }


    return (
        <div className="appointment" style={containerStyle}>
            <NavbarComponent />
            <div className="admin-topicBox colorPrimary-800">
                <div></div>
                <div>
                    <h1 className="center">ระบบการจัดการนัดหมายรายชื่อที่โดนยกเลิก</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large">Time : {showTime}</p>
                </div>
            </div>
            <a href="/adminCanceledListPeopleAppointment"><img src={arrow_icon} className="admin-back-arrow"/></a>
            {isLoading ? (
                <div className="loading-spinner">

                    <PulseLoader size={15} color={"#54B2B0"} loading={isLoading} />
                </div>
            ) : (
                <div className="admin">
                    {/* <div className="admin-header">
                        <div className="admin-hearder-item">
                            <a href="/AppointmentManagerComponent" target="_parent" id="select">คลินิกทั่วไป</a>
                            <a href="/AppointmentManagerComponentSpecial" target="_parent" >คลินิกเฉพาะทาง</a>
                            <a href="/AdminAppointmentManagerPhysicalComponent" target="_parent">คลินิกกายภาพ</a>
                            <a href="/adminAppointmentManagerNeedleComponent" target="_parent" >คลินิกฝังเข็ม</a>
                        </div>
                        <div className="admin-hearder-item admin-right">
                            <a href="/adminAppointmentRequestManagementComponent" target="_parent">รายการขอนัดหมาย</a>
                        </div>
                    </div> */}
                    <div className="admin-appointment-flex">
                        <CalendarAdminComponent
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onDateSelect={handleDateSelect}
                        />
                        <div className="admin-appointment-box">
                            <div >
                                <div className="appointment-hearder">
                                    <div className="colorPrimary-800 appointment-hearder-item1" >
                                        <h2>นัดหมายคลินิกกายภาพ/ฝังเข็ม</h2>
                                        <p className="admin-textBody-large">
                                            {selectedDate
                                                ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                                : `${date}/${month}/${year}`}
                                        </p>

                                    </div>
                                    <button type="button" className="appointment-hearder-item2" onClick={openAddAppointment}>เพิ่มนัดหมาย +</button>
                                </div>
                                <div className="admin-appointment-box-card">
                                    {AppointmentUsersData.sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start)).map((AppointmentUserData, index) => (
                                        <div className="admin-appointment-card colorPrimary-800" key={index} onClick={handleCardClick}>
                                            <div className="admin-appointment-card-detail" >
                                                <span className="admin-appointment-card-detail-box" onClick={(event) => openDetailAppointment(event,AppointmentUserData)}>
                                                    <div className="admin-appointment-card-time admin-textBody-small">
                                                        {AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}
                                                    </div>
                                                    <div className="admin-appointment-info flex-column">
                                                        <p id="student-id" className="admin-textBody-huge">{AppointmentUserData.id}</p>
                                                        <p id="student-name" className="admin-textBody-small" style={{overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{`${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`}</p>
                                                    </div>
                                                </span>
          
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className="admin-appointment-box">
                            <div id="detail-appointment" className="colorPrimary-800">
                                {selectedDate && `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}` === DateToCheck ? (
                                    <div className="admin-appointment-detail-header">
                                        <div className="admin-appointment-detail-header-items2"></div>
                                        <h2 className="admin-appointment-detail-header-items1 center">รายละเอียดนัดหมาย</h2>
                                        <div className="admin-appointment-detail-header-items2 admin-right" ><span id="detail-appointment-status">ยืนยันสิทธ์แล้ว</span></div>
                                    </div>
                                ) : (<h2 className="center">รายละเอียดนัดหมาย</h2>)}
                                <p id="detail-appointment-date" className="admin-textBody-big"></p>
                                <p id="detail-appointment-time" className="admin-textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                                <p id="detail-appointment-id" className="admin-textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                                <p id="detail-appointment-name" className="admin-textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                                <p id="detail-appointment-casue" className="admin-textBody-big"  ><b>สาเหตุการนัดหมาย</b>: ตรวจรักษาโรค</p>
                                <p id="detail-appointment-symptom" className="admin-textBody-big" ><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                                <p id="detail-appointment-notation" className="admin-textBody-big" ><b>หมายเหตุ</b>: -</p>


                            </div>
                            <div id="add-appointment" className="colorPrimary-800">
                                <form onSubmit={submitForm}>
                                    <h2 className="center">เพิ่มนัดหมาย</h2>
                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                                        <p className="admin-textBody-big">{selectedDate
                                            ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                            : "Select a date"}</p>
                                    </div>
                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800">ช่วงเวลา</label>
                                        <select
                                            name="time"
                                            value={JSON.stringify(appointmentTime)}
                                            onChange={(e) => {
                                                handleSelectChange(e);
                                                setSelectedValue(e.target.value); 
                                                const selectedValue = JSON.parse(e.target.value);

                                                if (selectedValue && typeof selectedValue === 'object') {
                                                    const { timetableId, timeSlotIndex } = selectedValue;

                                                    inputValue("appointmentTime")({
                                                        target: {
                                                            value: { timetableId, timeSlotIndex },
                                                        },
                                                    });

                                                    handleSelectChange(e);
                                                } else if (e.target.value === "") {
                                                    inputValue("appointmentTime")({
                                                        target: {
                                                            value: {},
                                                        },
                                                    });

                                                    handleSelectChange(e);
                                                } else {
                                                    console.error("Invalid selected value:", selectedValue);
                                                }
                                            }}
                                            className={selectedCount >= 2 ? 'selected' : ''}
                                        >
                                            {timeOptions.map((timeOption, index) => (

                                            <option  
                                            key={`${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}`}
                                            value={index === 0 ? 0 : JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}
                                            hidden={index === 0}
                                            >
                                            {timeOption.label}
                                            </option>

                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา/รหัสพนักงาน</label><br></br>
                                        <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000 หรือ 00000" />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>สาเหตุการนัดหมาย</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentCasue.length > 135 ? 'red' : 'grey' }}>{appointmentCasue.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="เป็นไข้" maxLength="135"/>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>อาการเบื้องต้น</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentSymptom.length > 135 ? 'red' : 'grey' }}>{appointmentSymptom.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="ปวดหัว, ตัวร้อน" maxLength="135" />
                                    </div>
                                    <div>
                
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>หมายเหตุ</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentNotation.length > 135 ? 'red' : 'grey' }}>{appointmentNotation.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="เป็นไข้หวัดทั่วไป" maxLength="135" />
                                    </div>
                                    <div className="admin-timetable-btn">
                                        <button type="button" onClick={closeEditAppointment} className="btn-secondary btn-systrm">กลับ</button>
                                        <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                                    </div>
                                </form>
                            </div>
                        
                        
                        </div>

                    </div>
                </div>

            )}



        </div>
    );
}

export default AddAppointment;