import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminFeedback.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import calendarFlat_icon from "../picture/calendar-flat.png";
import axios from 'axios'
import Swal from "sweetalert2";
const FeedbackGeneralNurses = (props) => {
    const [selectedDate, setSelectedDate] = useState();
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [feedbackItems, setFeedbackItems] = useState([]);
  
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
        if(userData){
            fetchFeedbackItems();
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
    
    }, [user]); 
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
    
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        console.log(selectedDate)
    };
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const monthsInThai = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      
    const formatMonthInThai = (month, year) => {
        const thaiMonth = monthsInThai[parseInt(month, 10) - 1];
        return `${thaiMonth} ${year}`;
    };

    const REACT_APP_MONGO_API = process.env.REACT_APP_MONGO_API

    useEffect(() => {
        if(userData) {
            setFeedbackItems([]);
            handleDateSelectData(selectedDate);
        }
    },[selectedDate,userData])
    const handleDateSelectData = async(selectedDate) => {
        try{
            const info = {
                role: userData.role,
                typeFeedback: "บริการจ่ายยาโดยพยาบาล",
                selectedDate: selectedDate,
            };
            const feedback = await axios.post(`${REACT_APP_MONGO_API}/api/getNormalFeedbackQuery`,info);
            if(feedback) {
                if(feedback.data == "not found"){
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: `ไม่มีข้อเสนอแนะ!`,
                        icon: 'warning',
                        confirmButtonText: 'ย้อนกลับ',
                        confirmButtonColor: '#263A50',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                            cancelButton: 'custom-cancel-button',
                        },
                       
                    })
                    return;
                }
                setFeedbackItems(feedback.data);
                console.log(feedback);
            }
        } catch (error){
            console.error(error);
        }
    }

    const fetchFeedbackItems = async() => {
        try{
            const info = {
                role: userData.role,
                typeFeedback: "บริการจ่ายยาโดยพยาบาล",
            };
            const feedback = await axios.post(`${REACT_APP_MONGO_API}/api/getNormalFeedbackQuery`,info);
            if(feedback) {
                if(feedback.data == "not found"){
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: `ไม่มีข้อเสนอแนะ!`,
                        icon: 'warning',
                        confirmButtonText: 'ย้อนกลับ',
                        confirmButtonColor: '#263A50',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                            cancelButton: 'custom-cancel-button',
                        },
                       
                    })
                    return;
                }
                setFeedbackItems(feedback.data);
                console.log(feedback);
            }
        } catch (error){
            console.error(error);
        }
    };

    return (
        <div style={containerStyle}>
          <NavbarComponent />
          <div className="admin-topicBox colorPrimary-800">
              <div></div>
              <div>
                  <h1 className="center">ข้อเสนอแนะ</h1>
              </div>
              <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
              </div>
          </div>
          <div className="admin">
            <div className="admin-header">
              <div className="admin-hearder-item">
                    <a href="#" target="_parent" id="select">ข้อเสนอแนะทั่วไป</a>
                    <a href="/adminFeedbackServiceGeneral" target="_parent" >ข้อเสนอแนะหลังใช้บริการ</a>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="admin-header">
                <div className="admin-hearder-item2">
                <a href="/adminFeedbackGeneralAll" target="_parent" >ทั้งหมด</a>
                    <a href="/adminFeedbackGeneralDoctor" target="_parent" >บริการตรวจรักษาโรคโดยแพทย์</a>
                    <a href="#" target="_parent" id="select">บริการจ่ายยาโดยพยาบาล</a>
                    <a href="/adminFeedbackGeneralDressing" target="_parent" >บริการทำแผล-ฉีดยา</a>
                    <a href="/adminFeedbackGeneralPhysical" target="_parent" >บริการกายภาพบำบัด</a>
                    <a href="/adminFeedbackGeneralNeeddle" target="_parent" >บริการฝังเข็ม</a>
                    <a href="/adminFeedbackGeneralOther" target="_parent" >อื่นๆ</a>
                </div> 
                <div className="admin-hearder-item3 admin-right"  style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <input type="date" className="form-control" style={{width: 250}} value={selectedDate} onChange={handleDateChange} max={new Date().toISOString().split("T")[0]}/>
                </div>

            </div>
    
            <div className="admin-body">
            <h2>{selectedDate ? formatDate(selectedDate) : formatMonthInThai(month, year)}</h2>
                <div className="admin-feedback">
                {feedbackItems.map((feedback, index) => (
                    <div className="admin-feedback-item"  key={index}>
                        <div className="admin-feedback-item-header">
                            <div className="admin-feedback-item-header-box">
                                <p className="admin-textBody-large2">ประเภทบริการ: {feedback.typeFeedback}</p>
                            </div>
                            <div class="admin-rating admin-feedback-item-header-box2" style={{textAlign:"right"}}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: i < feedback.score ? '#ffcc00' : '#ddd', fontSize: '25px'}} >&#9733;</span>
                                    ))}
                            </div>

                        </div>
                        <p className="admin-textBody-big"><b>วันที่:</b> {feedback.date}</p>
                        <p className="admin-textBody-large">รายละเอียดเพิ่มเติม</p>
                        <p className="admin-textBody-big" style={{wordWrap: "break-word", width:"100%",display: "inline-block"}}>{feedback.detail}</p>
                    </div>
                   ))}

                </div>
                
            </div>
               
           
          </div>
        </div>

       
      
      

    );
}

export default FeedbackGeneralNurses;
