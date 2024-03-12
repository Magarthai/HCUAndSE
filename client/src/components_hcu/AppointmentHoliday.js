import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminActivityComponent.css";
import calendarFlat_icon from "../picture/calendar-flat.png";
import clockFlat_icon from "../picture/clock-flat.png";
import person_icon from "../picture/person-dark.png";
import annotaion_icon from "../picture/annotation-dark.png";
import { fetchTodayActivity } from "../backend/activity/getTodayActivity";
import { doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from "react-router-dom";
import arrow_icon from "../picture/arrow.png";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import axios from 'axios';
import Swal from "sweetalert2";
import icon_delete from "../picture/icon_delete.jpg";
const AppointmentHoliday = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const REACT_APP_API = process.env.REACT_APP_API
    const [selectedDate, setSelectedDate] = useState(null);
    const handleDateSelect = (selectedDate) => {
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
        });
    };
    

    const [state, setState] = useState({
        appointmentDate: "",
        note:"",
    })
    const [holidays, setHolidays]= useState({})
    const { appointmentDate,note} = state

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
        fetchHoliday();
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
        
    }, [user]); 
    const containerStyle = {
        zoom: zoomLevel,
    };

    useEffect(() => {
        if(selectedDate){
        console.log(selectedDate)
        console.log(`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`)
        }
    },[selectedDate])

    useEffect(() => {
        console.log("holidays",holidays)
    },[holidays])
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

    const statusElements = document.querySelectorAll('.admin-queue-activity-card-status');


    const handleSubmit = async() => {
        const info = {
            date: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            note: note
        }
        const checkDate = await axios.post(`http://localhost:4000/api/checkDateHoliday`, info); 
        if(checkDate.data == "Date exits!") {
            console.log("Date exits!");
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                html: `มีวันหยุดที่ ${`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`} ในระบบอยู่แล้ว!`,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            })
            return;
        }
        const response = await axios.post(`http://localhost:4000/api/createHoliday`, info);
        console.log(response.data)
        fetchHoliday();
        Swal.fire({
            icon: "success",
            title: "สําเร็จ!",
            html: `คุณได้สร้างรายการวันหยุดที่ ${`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`}!`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#263A50',
            customClass: {
                confirmButton: 'custom-confirm-button',
            }
        })
    };

    const handledelete = async(holiday) => {
        const response = await axios.post(`http://localhost:4000/api/deleteHoliday`,holiday);
        console.log(response.data,"delete")
        fetchHoliday();
    };

    const fetchHoliday = async() => {
        const response = await axios.get(`http://localhost:4000/api/getHoliday`);
        console.log(response.data,"fetchHoliday")
        setHolidays(response.data);
    };
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };
    return (

        <div style={containerStyle}>
            <NavbarComponent />
            <div className="admin-topicBox colorPrimary-800" style={{marginBottom:"20px"}}>
                <div></div>
                <div>
                    <h1 className="center">ระบบการจัดการวันหยุด</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large">Time : {showTime}</p>
                </div>
            </div>
            <a onClick={() => window.history.back()}><img src={arrow_icon} className="approval-icon admin-back-arrow"/></a>
            
    <div className="admin">
        <div className="admin-activity-queue-flexbox">
            
            <div className="admin-activity-queue-flexbox-box colorPrimary-800" style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",}}>
            <h2 className="center colorPrimary-800" style={{marginTop:"15px"}}>เลือกวันหยุด</h2>
                <div style={{zoom:"0.8", margin:"0",padding:"0",scale:"0.8",marginTop:"-50px",marginBottom:"-40px"}} className="admin-holiday">
                    
                <CalendarAdminComponent
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onDateSelect={handleDateSelect}
                            className="admin-holiday"
                            
                        />
                        </div>
                        <div className="user-holiday-text">
                        <h4 className="user-EditAppointment-Symptom_title">หมายเหตุ</h4>
                        <textarea placeholder="หมายเหตุ" className="user-holiday-textarea" value={note} onChange={inputValue("note")}></textarea>
                    </div>
                        <button onClick={handleSubmit} className="admin-holiday-btn-box btn-primary-holiday">ยืนยันวันหยุด</button>
                    </div>
                    
                    <div className="admin-activity-queue-flexbox-box">
                        <h2 className="center colorPrimary-800" style={{marginTop:"15px"}}>รายการวันหยุด</h2>
                        <div className="admin-activity-queue-cards-all1">
                        {holidays && holidays.length > 0 ? (
                                holidays.map((holiday, index) => (
                                    <div className="admin-holiday-main-card" key={index}> 
                                        <div className="admin-holiday-card1 colorPrimary-800 admin-textBody-small">
                                            <p>วันที่ : {holiday.date} </p>
                                        </div>
                                        <div className="admin-holiday-card2 colorPrimary-800">
                                            <p className="admin-textBody-huge holiday">หมายเหตุ : {holiday.note} </p>
                                            <p style={{ paddingRight: "10%" }} className="admin-queue-activity-card-status admin-textBody-small"></p>
                                            <img src={icon_delete} className="icon_holidays" onClick={() => handledelete(holiday)} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div></div>
                            )}

                        </div>
                    </div>

                </div>
                
            </div>
        </div>

    );
}


export default AppointmentHoliday;