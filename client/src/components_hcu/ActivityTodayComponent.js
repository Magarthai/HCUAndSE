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
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, addDoc, deleteDoc ,getDoc} from 'firebase/firestore';
import axios from "axios";
const ActivityTodayComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState({});
    const [isCheckedActivity, setIsCheckedActivity] = useState(false);
    const [activities, setActivities] = useState([])
    const REACT_APP_API = process.env.REACT_APP_API
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
            fetchTodayActivityAndSetState();
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
    const containerStyle = {
        zoom: zoomLevel,
    };
    useEffect(() => {
        console.log("todayActivity", activities);
    }, [activities]);
    const [Queueactivities, setQueueActivities] = useState([]);
    const fetchTodayActivityAndSetState = async () => {
        if (!isCheckedActivity) {
            try {
                const todayActivity = await fetchTodayActivity(user, checkCurrentDate);
                const initialIsChecked = todayActivity.reduce((acc, timetableItem) => {
                    acc[timetableItem.id] = timetableItem.timeSlots[0].QueueOpen === "yes";
                    return acc;
                }, {});
                setIsChecked(initialIsChecked);
                setActivities(todayActivity);
                setIsCheckedActivity(true);
            } catch (error) {
                console.error('Error fetching today activity:', error);
            }
        }
    };

    const OpenTimeSlotsQueue = (timeSlots) =>  {
        if (timeSlots) {
            console.log(timeSlots,"timeSlot")
            navigate('/adminActivityQueueComponent',{state: {activityQueue:timeSlots}})
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

    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }
    const checkCurrentDate = getCurrentDate();


    const handleToggle = async (id, activityInfo) => {
        setIsChecked(prevState => {
            const updatedStatus = !prevState[id];
            const docRef = doc(db, 'activities', id);
            const queryActivitySnapshot = getDoc(docRef);
            queryActivitySnapshot.then(async (doc) => {
                const activityData = doc.data();
                console.log(activityData.timeSlots[activityInfo.timeSlots[0].index],activityInfo.timeSlots[0].index)
                activityData.timeSlots[activityInfo.timeSlots[0].index].QueueOpen = (activityData.timeSlots[activityInfo.timeSlots[0].index].QueueOpen === 'no') ? 'yes' : 'no';
    
                await updateDoc(docRef, { timeSlots: activityData.timeSlots });
            }).catch(error => {
                console.error('Error updating timetable status:', error);
            });
    
            return { ...prevState, [id]: updatedStatus };
        });
    };
    
    const getRegisteredListActivity = async (activities) => {

        try {
            console.log(activities)
            const response = await axios.post(`${REACT_APP_API}/api/adminGetRegisteredListActivity`, activities);
            const a = response.data
            console.log(response.data,"response.data")
            setQueueActivities(response.data);
            console.log("ActivityOpenRegisterComponent",response.data);
            navigate("/adminActivityListOfPeopleComponent", {state: {data: response.data}})
        } catch (error) {
            console.error('Error fetching fetchOpenQueueActivityAndSetState:', error);
        }
        
    };

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
                        <a href="#" target="_parent" id="select">กิจกรรมวันนี้</a>
                        <a href="/adminActivityOpenRegisterComponent" target="_parent" >เปิดลงทะเบียน</a>
                        <a href="/adminActivityNoOpenRegisterComponent" target="_parent" >ยังไม่เปิดลงทะเบียน</a>
                        <a href="/adminActivityAllComponent" target="_parent" >ทั้งหมด</a>
                    </div>
                    <div className="admin-hearder-item admin-right">
                        <a href="/adminActivityAddComponent" target="_parent">เพิ่มกิจกรรม </a>
                    </div>
                </div>

                <div className="admin-body">
                    {activities && activities.length > 0 ? (
                        activities.map((activities, index) => (
                            activities.timeSlots
                                .map((timeSlot, slotIndex) => (
                            <div className="admin-activity-today" key={index}>
                                <div className="admin-activity-today-hearder-flexbox">
                                    <div className="admin-activity-today-hearder-box">
                                        <h2 className="colorPrimary-800">กิจกรรม : {activities.activityName}</h2>
                                        <p className="admin-textBody-big colorPrimary-800">
                                <img src={calendarFlat_icon} className="icon-activity"/> : {formatDate(activities.openQueueDate)}
                                </p>
                                        <p className="admin-textBody-big colorPrimary-800">

                                                    <div>
                                                        <img src={clockFlat_icon} className="icon-activity" /> : {timeSlot.startTime} - {timeSlot.endTime} 
                                                        </div>
                                             </p>
                                        <p className="admin-textBody-big colorPrimary-800">
                                            <a style={{textDecorationLine:"none"}} onClick={() => getRegisteredListActivity(activities)} target="_parent" className="colorPrimary-800">
                                                <img src={person_icon} className="icon-activity" /> : {activities.timeSlots[0].userList.length} / {activities.totalRegisteredCount} คน <img src={annotaion_icon} className="icon-activity" />
                                            </a>
                                        </p>
                                    </div>
                                    <div className="admin-activity-today-hearder-box admin-right">
                                    <label className={`toggle-switch ${isChecked[activities.id] ? 'checked' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked[activities.id]}
                                            onChange={() => handleToggle(activities.id,activities)}
                                        />
                                        <div className="slider"></div>
                                        </label>

                                    </div>
                                </div>
                                <h3 className="colorPrimary-800">รายละเอียด</h3>
                                <p className="admin-textBody-huge2 colorPrimary-800">
                                    {activities.activityDetail}
                                </p>
                                <div className="admin-right">
                                    <a onClick={() => OpenTimeSlotsQueue(timeSlot)} target="_parent" className="btn-activity" style={{textDecorationLine:"none"}}>จัดการคิว</a>
                                </div>
                            </div>
                       ))))
                    ) : (
                        <div className="admin-queue-card-activity" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <p  className="admin-textBody-large colorPrimary-800" >ไม่มีกิจกรรม</p>
                        </div>
                    )}


                </div>

            </div>

        </div>

    );
}

export default ActivityTodayComponent;