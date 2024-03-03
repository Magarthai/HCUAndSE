import { useEffect, useState, useRef } from "react";
import "../css/UserActivity.css";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import NavbarUserComponent from './NavbarComponent';
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import Ticket_icon from "../picture/icon_ticket.png"
import Ticket_disabled_icon from "../picture/icon_ticket_disabled.png"
import Swal from "sweetalert2";
import { fetchOpenActivity, fetchUserAllActivity } from "../backend/activity/getTodayActivity";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const UserActivity = (props) => {
    const [isCheckedActivity, setIsCheckedActivity] = useState(false);
    const [isCheckedQueueActivity, setIsCheckedQueueActivity] = useState(false);
    const [activities, setActivities] = useState([]);
    const [Queueactivities, setQueueActivities] = useState([]);
    const checkCurrentDate = getCurrentDate();
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }


    const fetchOpenActivityAndSetState = async () => {
        if (!isCheckedActivity) {
            try {
                const response = await axios.get('http://localhost:5000/api/fetchOpenActivity');
                setActivities(response.data);
                console.log("fetchOpenQueueActivityAndSetState",response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const fetchOpenQueueActivityAndSetState = async () => {
        if (!isCheckedActivity) {
            try {
                const response = await axios.post('http://localhost:5000/api/fetchOpenQueueTodayActivity', userData, {
                        activity: userData.userActivity
                    });
                setQueueActivities(response.data);
                console.log("fetchOpenQueueActivityAndSetState",response.data);
            } catch (error) {
                console.error('Error fetching fetchOpenQueueActivityAndSetState:', error);
            }
        }
    };



    const toActivityVaccine = (activities) => {
        if (activities) {
            navigate('/activity/detail', { state: { activities: activities } });
        }
    }

    const UserActivityGetQ = (Queueactivities) => {
        Swal.fire({
            title: "รับคิว",
            html: `${Queueactivities.activityName}<br>วันที่ ${Queueactivities.data.date} (${Queueactivities.data.startTime}-${Queueactivities.data.endTime})`,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "รับคิว",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then(async(result) => {
            if (result.isConfirmed) {
                Queueactivities.userData = userData
                const response = await axios.post('http://localhost:5000/api/userGetQueueActivity', Queueactivities, {
                    Queueactivities: Queueactivities
                    });
                if (response.data == "success") {
                Swal.fire({
                    title: "รับคิวสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                }).then(function () {
                    navigate("/queue");
                });
                
            } else if (response.data == "already-exists") {
                Swal.fire({
                    title: "รับคิวไม่สำเร็จ",
                    icon: "error",
                    html: "คุณได้รับคิวกิจกรรมนี้ไปแล้ว",
                    confirmButtonText: "ตกลง",
                }).then(function () {
                    navigate("/queue");
                });
            } else {
                Swal.fire({
                    title: "รับคิวไม่สำเร็จ",
                    html: 'กรุณาทํารายการใหม่อีกครั้ง',
                    icon: "error",
                    confirmButtonText: "ตกลง",
                })
            }
            }
        })
    }
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user,"user");
        if (user) {
        console.log("userData",userData);
        
        }

        if (!isCheckedActivity) {
            fetchOpenActivityAndSetState();
            
        }
        if (userData) {
            fetchOpenQueueActivityAndSetState();
        }

    }, [user, userData,isCheckedActivity]);
    useEffect(() => {
        console.log("todayActivity", activities);
    }, [activities]);
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
    };

    function handleClick1() {
        let button1 = document.getElementById("user-Activitty_tab_all");
        let button2 = document.getElementById("user-Activitty_tab_registed");
        let elements = document.getElementsByClassName("user-Activity_card");
        let x = document.getElementById("user-Activity_tab_all_content");  
        let y = document.getElementById("user-Activity_tab_all_content2");  
        let element2 = document.getElementsByClassName("user-Activity_card_registed_container");
        if (button1) {
            button1.classList.add("focus");
            button2.classList.remove("focus");
            x.style.display = "initial";
            y.style.display = "none";
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "block";
            }
            for (var i = 0; i < element2.length; i++) {
                element2[i].style.display = "none";
            }
        }
        
    }

    function handleClick2() {
        let button1 = document.getElementById("user-Activitty_tab_registed");
        let button2 = document.getElementById("user-Activitty_tab_all");
        let x = document.getElementById("user-Activity_tab_all_content");  
        let y = document.getElementById("user-Activity_tab_all_content2");  
        let elements = document.getElementsByClassName("user-Activity_card");
        let element2 = document.getElementsByClassName("user-Activity_card_registed_container");
        if (button1) {
            button1.classList.add("focus");
            button2.classList.remove("focus");
            x.style.display = "none";
            y.style.display = "initial";
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "none";
            }
            for (var i = 0; i < element2.length; i++) {
                element2[i].style.display = "flex";
            }
        }
        
    }

    return (

        <div className="user">
            <header className="user-header">
                <div>
                    <h2>กิจกรรม</h2>
                    <h3>กิจกรรมทั้งหมด</h3>
                </div>

                <NavbarUserComponent />
            </header>

            <div className="user-body">
                <div className="user-Activity_container">
                    <div className="user-Activity_title gap-16">
                        <h3>รายการกิจกรรม</h3>
                    </div>

                    <div className="user-Activity_tab_container">
                        {/* <input type="radio" className="user-Activity_tab_radio focus" id="user-Activity_all" name="user-activity" checked /> */}
                        <button for="user-Activity_all" className="user-Activity_label center focus" id="user-Activitty_tab_all" onClick={() => handleClick1()}>
                            <h4>ทั้งหมด</h4>
                        </button>
                        <div id="user-Activity_tab_all_content">
                            {activities && activities.length > 0 ? (
                                activities.map((activities, index) => (
                                    <div className="user-Activity_card gap-16" onClick={() => toActivityVaccine(activities)}>
                                        <h4>{activities.activityName}</h4>
                                        <p className="textBody-medium" id="user-Activity_card_date"> วันลงทะเบียน : {formatDate(activities.openQueueDate)} - {formatDate(activities.endQueueDate)}</p>
                                        <p className="textBody-medium" id="user-Activity_card_time"> {activities.timeSlots
                                            .map((timeSlot, slotIndex) => (
                                                <div>
                                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt="" /> วันกิจกรรม : {formatDate(timeSlot.date)}</p>
                                                    <p className="textBody-medium" id="user-Activity_card_date"><img src={ClockFlat_icon} /> {timeSlot.startTime} - {timeSlot.endTime}</p>
                                                </div>


                                            ))}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="user-Activity_card gap-16" >
                                    <h4 style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60px" }}>ไม่มีกิจกรรมในวันนี้</h4>
                                </div>

                            )}
                        </div>
                        {/* <input type="radio" className="user-Activity_tab_radio" id="user-Activity_registed"  name="user-activity"/> */}
                        <button for="user-Activity_registed" className="user-Activity_label center" id="user-Activitty_tab_registed" onClick={() => handleClick2()}>
                            <h4>ลงทะเบียนแล้ว</h4>
                        </button>
                        <div id="user-Activity_tab_all_content2">
                        {Queueactivities && Queueactivities.length > 0 ? (
                            Queueactivities.map((Queueactivities, index) => (
                            <div className="user-Activity_card_registed_container gap-16" >
                                <div className="gap-16" id="user-Activity_card-registed">
                                    <h4>{Queueactivities.activityName}</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> วันลงทะเบียน: {Queueactivities.openQueueDate} - {formatDate(Queueactivities.endQueueDate)}</p>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt="" />  วันกิจกรรม: {Queueactivities.data.date}</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt="" />  {Queueactivities.data.startTime} - {Queueactivities.data.endTime}</p>
                                </div>
                                <button className="user-Activity_ticket_btn" onClick={() => UserActivityGetQ(Queueactivities)}>
                                    <img className="gap-8" src={Ticket_icon} alt="" />
                                    <p className="textBody-small user-Activity_ticket_text">รับคิว</p>
                                </button>
                            </div>
                        ) )): (
                            <div className="user-Activity_card_registed_container gap-16">
                                <div className="gap-16" id="user-Activity_card-registed">
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> ลงทะเบียน: 14/12/2023 - 16/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt="" /> วันกิจกรรม: 20/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt="" />  10:01 - 10:06</p>
                                </div>
                                <button className="user-Activity_ticket_btn" id="user-ticket_disabled">
                                    <img className="gap-8" src={Ticket_disabled_icon} alt="" />
                                    <p className="textBody-small user-Activity_ticket_text">รับคิว</p>
                                </button>
                            </div>
                        
                        )}
                        </div>
                    </div>
                </div>
            </div>



        </div>

    );
}

export default UserActivity;