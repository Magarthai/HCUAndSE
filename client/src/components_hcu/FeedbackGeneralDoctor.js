import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminFeedback.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import calendarFlat_icon from "../picture/calendar-flat.png";

const FeedbackGeneralDoctor = (props) => {
    const [selectedDate, setSelectedDate] = useState();
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
  
  
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

    const feedbackItems = [
        {
            "serviceType": "บริการตรวจรักษาโรคโดยแพทย์",
            "date": "2024-03-15",
            "score": 3,
            "details": "บริการดี แต่ยังมีความจำเป็นในการปรับปรุง",
        },
        {
            "serviceType": "บริการจ่ายยาโดยพยาบาล",
            "date": "2024-03-16",
            "score": 4,
            "details": "บริการดีมาก พนักงานเป็นมิตรและเป็นประโยชน์",
           
        }
    ]

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
                    <a href="/adminFeedbackGeneralAll" target="_parent">ทั้งหมด</a>
                    <a href="#" target="_parent" id="select">บริการตรวจรักษาโรคโดยแพทย์</a>
                    <a href="/adminFeedbackGeneralNurses" target="_parent" >บริการจ่ายยาโดยพยาบาล</a>
                    <a href="/adminFeedbackGeneralDressing" target="_parent" >บริการทำแผล-ฉีดยา</a>
                    <a href="/adminFeedbackGeneralPhysical" target="_parent" >บริการกายภาพบำบัด</a>
                    <a href="/adminFeedbackGeneralNeeddle" target="_parent" >บริการฝังเข็ม</a>
                    <a href="/adminFeedbackGeneralOther" target="_parent" >อื่นๆ</a>
                </div> 
                <div className="admin-hearder-item3 admin-right"  style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <input type="date" className="form-control" style={{width: 250}} value={selectedDate} onChange={handleDateChange}/>
                </div>

            </div>
    
            <div className="admin-body">
                <h2>{selectedDate ? formatDate(selectedDate) : "ทั้งหมด"}</h2>
                <div className="admin-feedback">
                {feedbackItems.map((feedback, index) => (
                    <div className="admin-feedback-item"  key={index}>
                        <div className="admin-feedback-item-header">
                            <div className="admin-feedback-item-header-box">
                                <p className="admin-textBody-large2">ประเภทบริการ: {feedback.serviceType}</p>
                            </div>
                            <div class="admin-rating admin-feedback-item-header-box2" style={{textAlign:"right"}}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: i < feedback.score ? '#ffcc00' : '#ddd', fontSize: '25px'}} >&#9733;</span>
                                    ))}
                            </div>

                        </div>
                        <p className="admin-textBody-big"><b>วันที่:</b> {formatDate(feedback.date)}</p>
                        <p className="admin-textBody-large">รายละเอียดเพิ่มเติม</p>
                        <p className="admin-textBody-big" style={{wordWrap: "break-word", width:"100%",display: "inline-block"}}>{feedback.details}</p>
                    </div>
                   ))}

                </div>
                
            </div>
               
           
          </div>
        </div>

       
      
      

    );
}

export default FeedbackGeneralDoctor;



