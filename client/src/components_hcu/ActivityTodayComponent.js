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
import Swal from "sweetalert2";
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
                const response = await axios.get(`${REACT_APP_API}/api/fetchTodayActivity`)
                console.log(response.data,"testxd")        
                const todayActivity = response.data;
                const activitiesData = todayActivity
                .flatMap((doc) => {
                    return doc.timeSlots.map((slot, index) => ({
                    ...slot,
                    id: doc.id,
                    activityName: doc.activityName,
                    openQueueDate: doc.openQueueDate,
                    endQueueDate: doc.endQueueDate,
                    activityType: doc.activityType,
                    activityStatus: doc.activityStatus,
                    index: index,
                    testid: doc.id + index
                    }));
                })
                .filter((slot) => slot.date === checkCurrentDate);
                console.log(activitiesData,"activitiesData")
                const initialIsChecked = activitiesData.reduce((acc, timetableItem) => {
                    acc[timetableItem.testid] = timetableItem.QueueOpen === "yes";
                    return acc;
                }, {});
                console.log(response.data,"todayActivitysss")
                setIsChecked(initialIsChecked);
                setActivities(activitiesData);
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


    const handleToggle = async (id,activityInfo) => {
        setIsChecked(prevState => {
            let updatedStatus = prevState[id];
            console.log(updatedStatus,"updatedStatus")
            if (updatedStatus) {
                Swal.fire({
                    title: 'ปิดรับคิว',
                    text: 'คุณกำลังจะปิดรับคิว คุณต้องการดำเนินการต่อหรือไม่?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: "ยืนยัน",
                    cancelButtonText: "ยกเลิก",
                    confirmButtonColor: '#263A50',
                    reverseButtons: true,
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                        cancelButton: 'custom-cancel-button',
                    },
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const docRef = doc(db, 'activities', activityInfo.id);
                        const queryActivitySnapshot = getDoc(docRef);
                        queryActivitySnapshot.then(async (doc) => {
                            const activityData = doc.data();
                            activityData.timeSlots[activityInfo.index].QueueOpen = (activityData.timeSlots[activityInfo.index].QueueOpen === 'no') ? 'yes' : 'no';
                            await updateDoc(docRef, { timeSlots: activityData.timeSlots });
                        }).catch(error => {
                            console.error('Error updating timetable status:', error);
                        });
                        updatedStatus = false
                        setIsChecked({ ...prevState, [id]: updatedStatus });
                    }
                });
            } else if (!updatedStatus) {
                Swal.fire({
                    title: 'เปิดรับคิว',
                    text: 'คุณกำลังจะเปิดรับคิว คุณต้องการดำเนินการต่อหรือไม่?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: "ยืนยัน",
                    cancelButtonText: "ยกเลิก",
                    confirmButtonColor: '#263A50',
                    reverseButtons: true,
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                        cancelButton: 'custom-cancel-button',
                    },
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const docRef = doc(db, 'activities', activityInfo.id);
            const queryActivitySnapshot = getDoc(docRef);
            queryActivitySnapshot.then(async (doc) => {
                const activityData = doc.data();
                activityData.timeSlots[activityInfo.index].QueueOpen = (activityData.timeSlots[activityInfo.index].QueueOpen === 'no') ? 'yes' : 'no';
                await updateDoc(docRef, { timeSlots: activityData.timeSlots });
                
            }).catch(error => {
                console.error('Error updating timetable status:', error);
            });
            updatedStatus = true
                setIsChecked({ ...prevState, [id]: updatedStatus });
                    }
                });
            }
            console.log(updatedStatus,"updatedStatus")
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
                            <div className="admin-activity-today" key={index}>
                                <div className="admin-activity-today-hearder-flexbox">
                                    <div className="admin-activity-today-hearder-box">
                                        <h2 className="colorPrimary-800 admin-activity-name">กิจกรรม : {activities.activityName}</h2>
                                        <p className="admin-textBody-big colorPrimary-800">
                                                <img src={calendarFlat_icon} className="icon-activity"/> : {formatDate(activities.date)}
                                        </p>
                                        <p className="admin-textBody-big colorPrimary-800">
                                            <div>
                                                <img src={clockFlat_icon} className="icon-activity" /> : {activities.startTime} - {activities.endTime} 
                                            </div>
                                        </p>
                                        <p className="admin-textBody-big colorPrimary-800">
                                            <a style={{textDecorationLine:"none"}} onClick={() => getRegisteredListActivity(activities)} target="_parent" className="colorPrimary-800">
                                                <img src={person_icon} className="icon-activity" /> :<a style={{cursor:"pointer"}}> {activities.userList.length} / {activities.registeredCount} คน </a>
                                            </a>
                                        </p>
                                    </div>
                                    <div className="admin-activity-today-hearder-box admin-right">
                                    <label className={`toggle-switch ${isChecked[activities.testid] ? 'checked' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked[activities.testid]}
                                            onChange={() => handleToggle(activities.testid,activities,activities.id)}
                                        />
                                        <div className="slider"></div>
                                        </label>

                                    </div>
                                </div>
                                <h3 className="colorPrimary-800">รายละเอียด</h3>
                                <p className="admin-textBody-huge2 colorPrimary-800" style={{
                                        overflow: 'hidden',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        maxHeight: "80px",
                                        marginBottom:"40px"
                                    }} >
                                    {activities.activityDetail}
                                </p>
                                <div className="admin-right">
                                    <a onClick={() => getRegisteredListActivity(activities)} target="_parent" className="btn-activity" style={{textDecorationLine:"none",cursor:"pointer",paddingLeft:"60px",paddingRight:"60px"}}>รายชื่อ</a>
                                    {activities.activityType === "yes" ? 
                                    <a onClick={() => OpenTimeSlotsQueue(activities)} target="_parent" className="btn-activity" style={{textDecorationLine:"none",marginLeft:"10px",cursor:"pointer"}}>จัดการคิว</a>:
                                    <a></a>
                                }
                                </div>
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

    );
}

export default ActivityTodayComponent;