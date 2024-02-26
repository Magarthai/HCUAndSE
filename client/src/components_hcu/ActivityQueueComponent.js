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
import axios from 'axios';
import Swal from "sweetalert2";
const ActivityQueueComponent = (props) => {
    const [isCheckedActivity, setIsCheckedActivity] = useState(false);
    const [Queueactivities, setQueueActivities] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const { activityQueue } = location.state || {};
    const [state, setState] = useState({
        QueueInfo: "",
    });
    const { QueueInfo } = state;
    const fetchQueueActivity = async () => {

            try {
                console.log(activityQueue)
                const response = await axios.post('http://localhost:5000/api/adminGetQueueActivity', activityQueue);
                const a = response.data
                setQueueActivities(response.data);
                console.log("fetchOpenQueueActivityAndSetState",response.data);
            } catch (error) {
                console.error('Error fetching fetchOpenQueueActivityAndSetState:', error);
            }
        
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
        if (!activityQueue) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่มีข้อมูลกิจกรรม',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            }).then(() => {
                
                navigate('/activity');
            });
        } else {
            fetchQueueActivity();
            console.log(activityQueue,"activityQueue");
        }

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
    useEffect(() => {
        console.log(Queueactivities,"Queueactivities")
    },[Queueactivities])

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
    const ShiftQueue = async () => {
        try {
        console.log(activityQueue)
        const response = await axios.post('http://localhost:5000/api/adminGetQueueActivity', activityQueue);
        const a = response.data
        console.log(a);
        setQueueActivities(response.data);
        console.log("fetchOpenQueueActivityAndSetState",response.data);
    
        a.Queuelist.shift();
        console.log(a);
        console.log(a.Queuelist);

        const responseUpdateQueue = await axios.post('http://localhost:5000/api/adminUpdateQueueShifting', a);
        const b = responseUpdateQueue.data
        if (b === "success") {
            Swal.fire({
                title: "อัพเดตคิวสําเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
            }).then(function () {
            });
        }

    } catch (error) {
        console.error('Error fetching fetchOpenQueueActivityAndSetState:', error);
    }
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
    {Queueactivities && Queueactivities.Queuelist && Queueactivities.Queuelist[0] && (
        <div className="admin-activity-queue-flexbox">
            <div className="admin-activity-queue-flexbox-box colorPrimary-800">
                <h2>กิจกรรม : {Queueactivities.activityName}</h2>
                <h3>คิวปัจจุบัน</h3>
                <div className="center">
                    <p style={{fontSize:"60px"}}>{Queueactivities.Queuelist[0].queue}</p>
                    <p className="admin-textBody-large">{Queueactivities.Queuelist[0].userID}</p>
                    <p className="admin-textBody-huge">{Queueactivities.Queuelist[0].firstName} {Queueactivities.Queuelist[0].lastName}</p>
                </div>
                <div className="admin-activity-queue-btn">
                    <button onClick={() => ShiftQueue(Queueactivities)} className="admin-activity-queue-btn-box btn-secondary">ข้าม</button>
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
                )}
            </div>
        </div>

    );
}


export default ActivityQueueComponent;