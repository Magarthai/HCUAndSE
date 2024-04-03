import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import "../css/AdminAppointmentRequestManagementComponent.css";
import { useUserAuth } from "../context/UserAuthContext";
import NavbarComponent from "../components_hcu/NavbarComponent";
import Close_icon from "../picture/close.png";
import Tick_icon from "../picture/tick-circle.png";
import arrow_icon from "../picture/arrow.png";
import { db, getDocs, collection, doc, getDoc, firestore } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CanceledListPeopleAppointment = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [data, setData] = useState([]);
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
        if(userData) {
            fetchDeletedData();
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
    
    }, [user,userData]); 

    useEffect(() => {
        console.log(data.length,"data.lenght");
        console.log(data);
    },[data])
    const containerStyle = {
        zoom: zoomLevel,
    };
    const REACT_APP_API = process.env.REACT_APP_API
    const fetchDeletedData = async() => {
        const info = {
            role: userData.role,
        };
        try {
            const respone = await axios.post(`${REACT_APP_API}/api/getCanceledData`,info)
            if(respone.data) {
                console.log("dataXDDDDDDDDDDDDDDDDDD",respone.data);
                setData(respone.data);
            }
        } catch (e) {
            console.error(e);
        }
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
    const navigate = useNavigate();
    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    const handleNavigate = (item) => {
        navigate('/adminAddAppointment', { state: { data: item } });
    };
    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">รายชื่อที่ถูกยกเลิกการทำกายภาพและฝังเข็ม</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <a href="/AppointmentManagerComponent"><img src={arrow_icon} className="admin-back-arrow"/></a>
        <div className="admin">
            <div className="admin-header">
                <p className="admin-hearder-item admin-textBody-large colorPrimary-800">รายการนัดหมาย</p>
                
            </div>
            
            <div className="admin-body">
                
                <table class="table table-striped">
                    <thead>
                        
                        <tr className="center colorPrimary-800">
                            <th className="admin-textBody-large colorPrimary-800" id="th_id">รหัสนักศึกษา/รหัสพนักงาน</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_name">ชื่อ</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_tel">เบอร์โทร</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_clinic">คลินิก</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_dateOld">วันนัดหมายเดิม</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_timeNew">เวลาเดิม</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_symptom">อาการ</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_notation">หมายเหตุ</th>
                            <th className="admin-textBody-large colorPrimary-800" id="th_approve">อนุมัติ</th>
                        </tr>
                    </thead>
                    <tbody >
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.appointmentId}>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.appointmentId}</td>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.name}</td>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.tel}</td>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.clinic}</td>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.appointmentDate}</td>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.time.start} - {item.time.end}</td>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.appointmentSymptom}</td>
                                    <td className="admin-textBody-huge2 colorPrimary-800">{item.appointmentCasue}</td>
                                    <td>
                                        <a target="_parent" className="colorPrimary-50 btn btn-primary" style={{margin:0}} onClick={() => handleNavigate(item)}>เพิ่มนัดหมาย +</a>
                                    </td>
                                </tr>
                            ))
                            
                        ): (
                        <tr>
                            <td className="admin-textBody-huge2 colorPrimary-800" >-</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">-</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">-</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">-</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">-</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">-</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">-</td>
                            <td className="admin-textBody-huge2 colorPrimary-800">-</td>
                            <td>
                                <a target="_parent" className="colorPrimary-50 btn btn-primary"   style={{margin:0,backgroundColor:"grey"}}>เพิ่มนัดหมาย +</a>
                            </td>
                        </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
           
        </div>
        
    </div>


    );
}

export default CanceledListPeopleAppointment;