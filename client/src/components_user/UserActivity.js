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
                const response = await axios.get('http://192.168.2.37:5000/api/fetchOpenActivity');
                setActivities(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const fetchOpenQueueActivityAndSetState = async () => {
        if (!isCheckedActivity) {
            try {
                const response = await axios.post('http://192.168.2.37:5000/api/fetchOpenQueueTodayActivity', userData, {
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

    const UserActivityGetQ = () => {
        Swal.fire({
            title: "รับคิว",
            html: "โครงการฉีดวัคซีนไข้หวัดใหญ่ตามฤดูกาล 2566<br>วันที่ 20/12/2023 (09.00-12.00)",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "รับคิว",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then((result) => {

            if (result.isConfirmed) {
                Swal.fire({
                    title: "รับคิวสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                }).then(function () {
                    navigate("/queue");
                });
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
                        <input type="radio" className="user-Activity_tab_radio" id="user-Activity_all" name="user-activity" checked />
                        <label for="user-Activity_all" className="user-Activity_label center" id="user-Activitty_tab_all">
                            <h4>ทั้งหมด</h4>
                        </label>
                        <div className="user-Activity_tab_all_content">
                            {activities && activities.length > 0 ? (
                                activities.map((activities, index) => (
                                    <div className="user-Activity_card gap-16" onClick={() => toActivityVaccine(activities)}>
                                        <h4>{activities.activityName}</h4>
                                        <p className="textBody-medium" id="user-Activity_card_date"> วันลงทะเบียน : {formatDate(activities.openQueueDate)} - {formatDate(activities.endQueueDate)}</p>
                                        <p className="textBody-medium" id="user-Activity_card_time"> {activities.timeSlots
                                            .map((timeSlot, slotIndex) => (
                                                <div>
                                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt="" /> วันกิจกรรม : {formatDate(timeSlot.date)}</p>
                                                    <img src={ClockFlat_icon} /> {timeSlot.startTime} - {timeSlot.endTime}
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

                        <input type="radio" className="user-Activity_tab_radio" id="user-Activity_registed" name="user-activity" />
                        <label for="user-Activity_registed" className="user-Activity_label center" id="user-Activitty_tab_registed">
                            <h4>ลงทะเบียนแล้ว</h4>
                        </label>
                        <div className="user-Activity_tab_all_content">
                            <div className="user-Activity_card_registed_container gap-16">
                                <div className="gap-16" id="user-Activity_card-registed">
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่ 2567</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> วันลงทะเบียน: 14/12/2023 - 16/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt="" />  วันกิจกรรม: 20/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt="" />  10:01 - 10:06</p>
                                </div>
                                <button className="user-Activity_ticket_btn" onClick={UserActivityGetQ}>
                                    <img className="gap-8" src={Ticket_icon} alt="" />
                                    <p className="textBody-small user-Activity_ticket_text">รับคิว</p>
                                </button>
                            </div>

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


                        </div>
                    </div>
                </div>
            </div>



        </div>

    );
}

export default UserActivity;