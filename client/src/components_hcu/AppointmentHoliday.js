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
    })

    const { appointmentDate} = state

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


    const handleSubmit = () => {
       
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
                <div style={{zoom:"0.8", margin:"0",padding:"0",scale:"0.9",marginTop:"-20px"}} className="admin-holiday">
                    
                <CalendarAdminComponent
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onDateSelect={handleDateSelect}
                            className="admin-holiday"
                            
                        />
                        </div>
                        <button onClick={handleSubmit} className="admin-activity-queue-btn-box btn-primary">ยืนยันวันหยุด</button>
                    </div>
                    
                    <div className="admin-activity-queue-flexbox-box">
                        <h2 className="center colorPrimary-800" style={{marginTop:"15px"}}>รายการวันหยุด</h2>
                        <div className="admin-activity-queue-cards-all1">
                            <div className="admin-activity-queue-cards"> 
                                <div className="admin-holiday-card1 colorPrimary-800 admin-textBody-small"><p>วันที่ : 24/1/2024 </p></div>
                                <div className="admin-holiday-card2 colorPrimary-800">
                                    <p className="admin-textBody-huge">หมายเหตุ :</p>
                                    <p style={{paddingRight:"10%"}} className="admin-queue-activity-card-status admin-textBody-small"></p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>
        </div>

    );
}


export default AppointmentHoliday;