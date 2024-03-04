import React from "react";
import "../css/UserQueue.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarComponent';
import { useEffect, useState, useRef } from "react";
import "../css/UserActivity.css";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import Ticket_icon from "../picture/icon_ticket.png"
import Ticket_disabled_icon from "../picture/icon_ticket_disabled.png"
import Swal from "sweetalert2";
import { fetchOpenActivity, fetchUserAllActivity } from "../backend/activity/getTodayActivity";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const UserQueue = (props) => {
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
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const fetchOpenQueueActivityAndSetState = async () => {
    if (!isCheckedActivity) {
        try {
            const response = await axios.post('http://localhost:5000/api/fetchUserQueueTodayActivity', userData, {
                activity: userData.userActivity
            });
            setQueueActivities(response.data);
            console.log("fetchOpenQueueActivityAndSetState", response.data);
        } catch (error) {
            console.error('Error fetching fetchOpenQueueActivityAndSetState:', error);
        }
    }
    setTimeout(fetchOpenQueueActivityAndSetState, 600000);
};


    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user, "user");
        if (user) {
            console.log("userData", userData);

        }

        if (!isCheckedActivity) {
            fetchOpenActivityAndSetState();
        }
        if (userData) {
            fetchOpenQueueActivityAndSetState();
        }
        const interval = setInterval(fetchOpenQueueActivityAndSetState, 3000);

        
        return () => clearInterval(interval);
    }, [user, userData, isCheckedActivity]);
    
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
                    <h2>ติดตามคิว</h2>
                </div>

                <NavbarUserComponent />
            </header>

            <div className="user-body">
                <div className="user-queue_container">
                    <div className="user-queue_title gap-16">
                        <h3>กิจกรรม</h3>
                    </div>
                    {Queueactivities && Queueactivities.length > 0 ? (
                Queueactivities.map((activities, index) => (
                    <div className="user-queue_ticket_container">
                        <div className="user-queue_ticket_waitingQ_container">
                            <div className="user-queue_ticket_waitingQ_text center">
                                <h4>{activities.activityName}</h4>
                                <p className="textBody-big" id="user-queue_waitingQ_text">จำนวนคิวที่รอ</p>
                                <p className="textQ" id="user-queue_waitingQ_number">{activities.queueIndex == -1 ? 0 :activities.queueIndex}</p>
                                <p className="textBody-big">คิว</p>
                            </div>
                        </div>

                        <div className="user-queue_ticket_myQ_container center">
                            <div className="user-queue_ticket_myQ_text center">
                                <h5 className="myQ_text">คิวของฉัน</h5>
                                {activities.queueIndex ==-1 ? <p style={{fontSize:22}} className="textQ2 myQ_text">เสร็จสิ้นแล้ว</p> : <p className="textQ2 myQ_text"> {activities.userQueue}</p>}
                            </div>

                            <div className="user-queue_ticket_myQ_circle"></div>
                        </div>
                    </div>
                ))) : (
                    <div className="user-queue_ticket_container"></div>
                )}
                </div>
            </div>



        </div>

    );
}

export default UserQueue;