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
import arrow_icon from "../picture/arrow.png";
const ActivityQueueComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
  
  
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


    return (

        <div style={containerStyle}>
            <NavbarComponent />
            <div className="admin-topicBox colorPrimary-800">
                <div></div>
                <div>
                    <h1 className="center">ระบบการจัดการกิจกรรม</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large">Time : {showTime}</p>
                </div>
            </div>
            <a onClick={() => window.history.back()}><img src={arrow_icon} className="approval-icon admin-back-arrow"/></a>
            <div className="admin">
                <div className="admin-activity-queue-flexbox">
                    <div className="admin-activity-queue-flexbox-box colorPrimary-800">
                        <h2>กิจกรรม : </h2>
                        <h3>คิวปัจจุบัน</h3>
                        <div className="center">
                            <p style={{fontSize:"60px"}}>1</p>
                            <p className="admin-textBody-large">64090500444</p>
                            <p className="admin-textBody-huge">Rawisada Anruttikun</p>
                        </div>
                        <div className="admin-activity-queue-btn">
                            <button className="admin-activity-queue-btn-box btn-secondary">ข้าม</button>
                            <button className="admin-activity-queue-btn-box btn-primary">ยืนยันสิทธ์</button>
                        </div>
                        <p className="admin-textBody-huge">คิวทั้งหมด</p>
                        <div className="admin-activity-queue-cards-all">
                            <div className="admin-activity-queue-cards"> 
                                <div className="admin-activity-queue-card1"><p>ลำดับที่ 1</p></div>
                                <div className="admin-activity-queue-card2">
                                    <p>64090500444 <br></br>Rawisada Anruttikun</p>
                                  
                                </div>
                            </div>
                            <div className="admin-activity-queue-cards"> 
                                <div className="admin-activity-queue-card1"><p>ลำดับที่ 1</p></div>
                                <div className="admin-activity-queue-card2">
                                    <p>64090500444 <br></br>Rawisada Anruttikun</p>
                                  
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="admin-activity-queue-flexbox-box">
                        <h2 className="center" style={{marginTop:"15px"}}>ดำเนินการเสร็จสิ้น</h2>
                        <div className="admin-activity-queue-cards-all1">
                            <div className="admin-activity-queue-cards"> 
                                <div className="admin-activity-queue-card1"><p>ลำดับที่ 1</p></div>
                                <div className="admin-activity-queue-card2">
                                    <p>64090500444 <br></br>Rawisada Anruttikun</p>
                                  
                                </div>
                            </div>
                            <div className="admin-activity-queue-cards"> 
                                <div className="admin-activity-queue-card1"><p>ลำดับที่ 1</p></div>
                                <div className="admin-activity-queue-card2">
                                    <p>64090500444 <br></br>Rawisada Anruttikun</p>
                                  
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}


export default ActivityQueueComponent;