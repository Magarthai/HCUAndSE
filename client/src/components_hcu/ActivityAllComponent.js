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
import preview from "../picture/preview.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { fetchAllActivity } from "../backend/activity/getTodayActivity";
const ActivityAllComponent = (props) => {
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    const [Queueactivities, setQueueActivities] = useState([]);
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [isCheckedActivity, setIsCheckedActivity] = useState(false);
    const [activities, setActivities] = useState([])
    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }
    const checkCurrentDate = getCurrentDate();
    const getRegisteredListActivity = async (activities) => {

        try {
            console.log(activities)
            const response = await axios.post('http://localhost:5000/api/adminGetRegisteredListActivity', activities);
            const a = response.data
            console.log(response.data,"response.data")
            setQueueActivities(response.data);
            console.log("ActivityOpenRegisterComponent",response.data);
            navigate("/adminActivityListOfPeopleComponent", {state: {data: response.data}})
        } catch (error) {
            console.error('Error fetching fetchOpenQueueActivityAndSetState:', error);
        }
        
    };
    const fetchOpenActivityAndSetState = async () => {
        try {
            const openActivity = await fetchAllActivity(user, checkCurrentDate);
            if (openActivity) {
                setActivities(openActivity);
                setIsCheckedActivity(true);
            }
        } catch (error) {
            console.error('Error fetching today activity:', error);
        }
    };

    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData);

        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };

        if (!isCheckedActivity) {
            fetchOpenActivityAndSetState();
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
    }, [user, isCheckedActivity]);
    useEffect(() => {
        console.log("todayActivity", activities);
    }, [activities]);

    const containerStyle = {
        zoom: zoomLevel,
    };
    const PreviewActivity = (activities) => {
        if (activities) {
            navigate('/adminActivityDetail', { state: { activities: activities } });
        }
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

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
    };

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
            <div className="admin">
                <div className="admin-header">
                    <div className="admin-hearder-item">
                        <a href="/adminActivityTodayComponent" target="_parent">กิจกรรมวันนี้</a>
                        <a href="/adminActivityOpenRegisterComponent" target="_parent">เปิดลงทะเบียน</a>
                        <a href="/adminActivityNoOpenRegisterComponent" target="_parent">ยังไม่เปิดลงทะเบียน</a>
                        <a href="#" target="_parent" id="select" >ทั้งหมด</a>
                    </div>
                    <div className="admin-hearder-item admin-right">
                        <a href="/adminActivityAddComponent" target="_parent">เพิ่มกิจกรรม </a>
                    </div>
                </div>

                <div className="admin-body">
                    <div className="admin-activity">
                        {activities && activities.length > 0 ? (
                            activities.map((activities, index) => (
                                <div className="admin-activity-item">
                                    <div className="admin-activity-today-hearder-flexbox">
                                        <div className="admin-activity-today-hearder-box1">
                                            <h2 className="colorPrimary-800">กิจกรรม : {activities.activityName}</h2>
                                            <p className="admin-textBody-big colorPrimary-800" >
                                                ช่วงวันที่เปิดลงทะเบียน : {formatDate(activities.openQueueDate)} - {formatDate(activities.endQueueDate)}
                                            </p>
                                            <p className="admin-textBody-big colorPrimary-800">
                                                {activities.timeSlots
                                                    .map((timeSlot, slotIndex) => (
                                                        <div>
                                                             <p className="admin-textBody-big colorPrimary-800" >
                                                                <img src={calendarFlat_icon} className="icon-activity" /> วันที่เปิดกิจกรรม : {formatDate(timeSlot.date)}
                                                            </p>
                                                            <img src={clockFlat_icon} className="icon-activity" /> : {timeSlot.startTime} - {timeSlot.endTime}
                                                        </div>
                                                    ))}
                                            </p>
                                            <p className="admin-textBody-big colorPrimary-800"><a onClick={() => getRegisteredListActivity(activities)} style={{textDecorationLine:"none"}} target="_parent" className="colorPrimary-800"><img src={person_icon} className="icon-activity" /> : {activities.totalRegisteredCount} คน <img src={annotaion_icon} className="icon-activity" /></a></p>
                                        </div>
                                        <div className="admin-activity-today-hearder-box2 admin-right">
                                            <a className="admin-activity-preview" onClick={() => PreviewActivity(activities)} role="button"  target="_parent">Preview <img src={preview} className="icon icon_preview" /></a>

                                        </div>
                                    </div>
                                    <h3 className="colorPrimary-800">รายละเอียด</h3>
                                    <p style={{
                                        maxWidth: '794.91px',
                                        overflow: 'hidden',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word'
                                    }} className="admin-textBody-huge2 colorPrimary-800">
                                        {activities.activityDetail}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="admin-queue-card-activity" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <p  className="admin-textBody-large colorPrimary-800" >ไม่มีกิจกรรม</p>
                            </div>
                        )}

                    </div>



                </div>

            </div>

        </div>

    );
}

export default ActivityAllComponent;