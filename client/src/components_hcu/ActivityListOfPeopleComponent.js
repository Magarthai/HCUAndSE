import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminActivityComponent.css";
import arrow_icon from "../picture/arrow.png";
import { useLocation,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const ActivityListOfPeopleComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [isChecked, setIsChecked] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state || {};
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
        if (!data){
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่มีข้อมูลกิจกรรม',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            }).then(() => {
                navigate('/adminActivityOpenRegisterComponent');
            });
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
        console.log("activityData",data)
    
    }, [user,data]); 
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

    const handleToggle = () => {
        setIsChecked(!isChecked);
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
        <a onClick={() => window.history.back()}><img src={arrow_icon} className="approval-icon admin-back-arrow"/></a>
        <div className="admin">
    {data && data.length > 0 ? (
        data.map((item, index) => (
            <div key={index} className="admin-body">
                <p className="admin-textBody-large colorPrimary-800">กิจกรรม : {item.activityName} วันที่ : {item.date} เวลา : {item.startTime} - {item.endTime}<br /> รายชื่อ: {item.userList.length}</p>
                
                <table className="table table-striped">
                
                    <thead>
                        <tr className="center colorPrimary-800">
                            <th className="admin-textBody-large colorPrimary-800" id="th_id_acticity">รหัสนักศึกษา/รหัสพนักงาน</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_name_acticity">ชื่อ</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_tel_acticity">เบอร์โทร</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_email_acticity">Email</th>
                        </tr>
                    </thead>
                    {item.userList.map((item, index) => (
                    <tbody>
                        <tr key={item.id}>
                            <td className="admin-textBody-huge2 colorPrimary-800">{item.id}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{item.firstName} {item.lastName}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{item.tel}</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">{item.email}</td>
                        </tr>
                    </tbody>
                    ))}
                </table>
               
            </div>
        ))
    ) : (
        <div className="admin-body"></div>
    )}
</div>

    </div>

    );
}

export default ActivityListOfPeopleComponent;