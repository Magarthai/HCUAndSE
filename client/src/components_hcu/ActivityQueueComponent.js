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
    const REACT_APP_API = process.env.REACT_APP_API
    const { QueueInfo } = state;
    const fetchQueueActivity = async () => {

            try {
                console.log(activityQueue)
                const response = await axios.post(`${REACT_APP_API}/api/adminGetQueueActivity`, activityQueue);
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
    const interval = setInterval(fetchQueueActivity, 10000);
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
            clearInterval(interval);
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
        Swal.fire({
            title: "ยืนยันคิว",
            html: `กดยืนยันเพื่อดําเนินการ`,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "รับคิว",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
            confirmButtonColor: '#263A50',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                            cancelButton: 'custom-cancel-button',
                        }
        }).then(async(result) => {
            if (result.isConfirmed) {
        try {
        console.log(activityQueue)
        const response = await axios.post(`${REACT_APP_API}/api/adminGetQueueActivity`, activityQueue);
        const a = response.data
        console.log(a);
        setQueueActivities(response.data);
        console.log("fetchOpenQueueActivityAndSetState",response.data);
        console.log(a.Queuelist);

        const responseUpdateQueue = await axios.post(`${REACT_APP_API}/api/adminUpdateQueueShifting`, a);
        const b = responseUpdateQueue.data
        if (b === "success") {
            Swal.fire({
                title: "อัพเดตคิวสําเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            }).then(function () {
                window.location.reload();
            });
        }
        
        } catch (error) {
            console.error('Error fetching fetchOpenQueueActivityAndSetState:', error);
        }
        }})
    }

    const ShiftQueuePass = async () => {
        try {
        console.log(activityQueue)
        const response = await axios.post(`${REACT_APP_API}/api/adminGetQueueActivity`, activityQueue);
        const a = response.data
        console.log(a);
        setQueueActivities(response.data);
        console.log("fetchOpenQueueActivityAndSetState",response.data);
        console.log(a.Queuelist);

        const responseUpdateQueue = await axios.post(`${REACT_APP_API}/api/adminUpdateQueueShiftingPass`, a);
        const b = responseUpdateQueue.data
        if (b === "success") {
            Swal.fire({
                title: "อัพเดตคิวสําเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
            }).then(function () {
                window.location.reload();
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

    const statusElements = document.querySelectorAll('.admin-queue-activity-card-status');

    function changeStatusTextColor(element) {
        if (element.textContent.trim() === 'สําเร็จ') {
            element.style.color = '#098B66';
        }
        else if (element.textContent.trim() === 'ไม่สําเร็จ') {
            element.style.color = '#C11F1F';
        }
    }

    statusElements.forEach(changeStatusTextColor);



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
        {Queueactivities && Queueactivities.Queuelist &&  (
            <div className="admin-activity-queue-flexbox-box colorPrimary-800">
                <h2 style={{overflow:"hidden", whiteSpace: "nowrap",textOverflow: "ellipsis", maxWidth: "100%", display: "inline-block",  textAlign:"initial"}}>กิจกรรม : {Queueactivities.activityName}</h2>
                <h3>คิวปัจจุบัน</h3>
                {Queueactivities && Queueactivities.Queuelist && Queueactivities.Queuelist[0] ? (
                <div className="center">
                
                    <p style={{fontSize:"60px"}}>{Queueactivities.Queuelist[0].queue}</p>
                    <p className="admin-textBody-large">{Queueactivities.Queuelist[0].userID}</p>
                    <p className="admin-textBody-huge">{Queueactivities.Queuelist[0].firstName} {Queueactivities.Queuelist[0].lastName}</p>
                </div>
                ):(<div className="center">
                    <p style={{fontSize:"60px"}}>ไม่มีคิว</p>
                    <p className="admin-textBody-large">รหัส: - </p>
                    <p className="admin-textBody-huge">ชื่อ-นามสกุล: - </p>
                </div>
                )}
                {Queueactivities && Queueactivities.Queuelist && Queueactivities.Queuelist[0] ? (
                <div className="admin-activity-queue-btn">
                    <button  onClick={() => ShiftQueuePass(Queueactivities)} className="admin-activity-queue-btn-box btn-secondary">ข้าม</button>
                    <button onClick={() => ShiftQueue(Queueactivities)} className="admin-activity-queue-btn-box btn-primary">ยืนยันสิทธ์</button>
                </div>): (
                     <div className="admin-activity-queue-btn">
                     <button disabled onClick={() => ShiftQueuePass(Queueactivities)} style={{backgroundColor:"grey",color:"white",border:"none"}} className="admin-activity-queue-btn-box btn-secondary">ข้าม</button>
                     <button disabled onClick={() => ShiftQueue(Queueactivities)}style={{backgroundColor:"grey",color:"white"}} className="admin-activity-queue-btn-box btn-primary">ยืนยันสิทธ์</button>
                 </div>
                )}
                <p className="admin-textBody-huge colorPrimary-800">คิวทั้งหมด</p>
                <div className="admin-activity-queue-cards-all">
                {Queueactivities.Queuelist.map((queue,index) => 
                     
                            <div className="admin-activity-queue-cards colorPrimary-800"> 
                                <div className="admin-activity-queue-card1"><p className="admin-textBody-small">ลำดับที่ {index+1}</p></div>
                                <div className="admin-activity-queue-card2">
                                    <p className="admin-textBody-huge" style={{width:"90%"}}>รหัส : {queue.userID} <br></br><a style={{overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "inline-block",  textAlign:"initial", maxWidth:"100%"}}>{queue.firstName} {queue.lastName}</a></p>
                                  
                                </div>
                            </div>
                        
                    )}
                 </div>
                    </div>
                    )}
                    {Queueactivities && Queueactivities.SuccessList && (
                    <div className="admin-activity-queue-flexbox-box">
                        <h2 className="center colorPrimary-800" style={{marginTop:"15px"}}>ดำเนินการเสร็จสิ้น</h2>
                        
                        <div className="admin-activity-queue-cards-all1">
                        {Queueactivities.SuccessList.map((queue,index) => 
                            <div className="admin-activity-queue-cards"> 
                                <div className="admin-activity-queue-card1 colorPrimary-800 admin-textBody-small"><p>ลำดับที่ {index+1}</p></div>
                                <div className="admin-activity-queue-card2 colorPrimary-800">
                                    <p className="admin-textBody-huge" style={{width:"70%"}}>{queue.userID} <br></br><a style={{overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",display: "inline-block",  textAlign:"initial", maxWidth:"100%"}}>{queue.firstName} {queue.lastName}</a></p>
                                    <p style={{paddingRight:"10%"}} className="admin-queue-activity-card-status admin-textBody-small">{queue.status}</p>
 
                                </div>
                            </div>
                              )}
                        </div>
                      
                    </div>
                    )}
                </div>
                
            </div>
        </div>

    );
}


export default ActivityQueueComponent;