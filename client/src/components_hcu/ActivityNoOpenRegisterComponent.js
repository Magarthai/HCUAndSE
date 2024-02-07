import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminActivityComponent.css";
import { doc, deleteDoc } from "firebase/firestore";
import calendarFlat_icon from "../picture/calendar-flat.png";
import clockFlat_icon from "../picture/clock-flat.png";
import person_icon from "../picture/person-dark.png";
import annotaion_icon from "../picture/annotation-dark.png";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { fetchCloseActivity, fetchOpenActivity } from "../backend/activity/getTodayActivity";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
const ActivityNoOpenRegisterComponent = (props) => {
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [isChecked, setIsChecked] = useState({});
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

    const fetchOpenActivityAndSetState = async () => {
        try {
            const openActivity = await fetchCloseActivity(user, checkCurrentDate);
            if (openActivity) {
                setActivities(openActivity);
                setIsCheckedActivity(true);
                const initialIsChecked = openActivity.reduce((acc, activities) => {
                    acc[activities.id] = activities.status === "open";
                    return acc;
                }, {});
                setIsChecked(initialIsChecked);
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

    const EditActivity = (activities) => {
        if (activities) {
            navigate('/adminActivityEditComponent', { state: { activities: activities } });
        }
    }

    const deletedActivity = (activities) => {
        if (activities) {
            Swal.fire({
                title: 'ลบกิจกรรม',
                text: `คุณแน่ใจว่าจะลบกิจกรรม : ${activities.activityName} ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#DC2626',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'custom-confirm-button',
                    cancelButton: 'custom-cancel-button',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        const activitiesRef = doc(db, 'activities', `${activities.id}`);
                        deleteDoc(activitiesRef, `${activities.id}`)
                        console.log(`${activities.id}`);
                        Swal.fire(
                            {
                                title: 'การลบการนัดหมายสำเร็จ!',
                                text: `การนัดหมายถูกลบเรียบร้อยแล้ว!`,
                                icon: 'success',
                                confirmButtonText: 'ตกลง',
                                confirmButtonColor: '#263A50',
                                customClass: {
                                    confirmButton: 'custom-confirm-button',
                                }
                            }
                        )
                        fetchOpenActivityAndSetState();
                    } catch (firebaseError) {
                        throw new Error(firebaseError);
                    }

                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Swal.fire(
                        {
                            title: 'ลบช่วงเวลาไม่สำเร็จ!',
                            text: `ไม่สามารถลบช่วงเวลาได้ กรุณาลองอีกครั้งในภายหลัง`,
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

        }
    }
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
                        <a href="#" target="_parent" id="select">ยังไม่เปิดลงทะเบียน</a>
                        <a href="/adminActivityAllComponent" target="_parent" >ทั้งหมด</a>
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
                                        <div className="admin-activity-today-hearder-box">
                                            <h2 className="colorPrimary-800">กิจกรรม : {activities.activityName}</h2>
                                            <p className="admin-textBody-big colorPrimary-800">
                                                <img src={calendarFlat_icon} className="icon-activity" /> : {formatDate(activities.openQueenDate)}
                                            </p>
                                            <p className="admin-textBody-big colorPrimary-800">
                                                {activities.timeSlots
                                                    .map((timeSlot, slotIndex) => (
                                                        <div>
                                                            <img src={clockFlat_icon} className="icon-activity" /> : {timeSlot.startTime} - {timeSlot.endTime}
                                                        </div>
                                                    ))}
                                            </p>
                                            <p className="admin-textBody-big colorPrimary-800"><a href="/adminActivityListOfPeopleComponent" target="_parent" className="colorPrimary-800"><img src={person_icon} className="icon-activity" /> : {activities.totalRegisteredCount} คน <img src={annotaion_icon} className="icon-activity" /></a></p>
                                        </div>
                                        <div className="admin-activity-today-hearder-box admin-right">
                                            <a href="/adminActivityEditComponent" target="_parent"><img src={edit} className="icon" onClick={() => EditActivity(activities)} /></a>
                                            <img onClick={() => deletedActivity(activities)} src={icon_delete} className="icon" />
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
                                    <div className="admin-right">
                                        <a href="/" target="_parent" className="btn btn-primary">รายชื่อ</a>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <div className="admin-queue-card" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {/* Content for the case when activities are not available */}
                            </div>
                        )}

                    </div>



                </div>

            </div>

        </div>

    );
}

export default ActivityNoOpenRegisterComponent;