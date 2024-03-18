import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminFeedback.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import calendarFlat_icon from "../picture/calendar-flat.png";

const FeedbackServiceNeedle = (props) => {
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
            "Type": "ปรึกษาแพทย์",
            "date": "2024-03-15",
            "serviceType": "บริการตรวจรักษาโรคโดยแพทย์",
            "score": 3,
            "details": "บริการดี แต่ยังมีความจำเป็นในการปรับปรุง",
        },
        {
            "Type": "ทำฝังเข็ม",
            "date": "2024-03-15",
            "serviceType": "บริการฝังเข็ม",
            "score": 5,
            "details": "บริการดี แต่ยังมีความจำเป็นในการปรับปรุง",
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
                    <a href="/adminFeedbackGeneralAll" target="_parent">ข้อเสนอแนะทั่วไป</a>
                    <a href="#" target="_parent" id="select" >ข้อเสนอแนะหลังใช้บริการ</a>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="admin-header">
                <div className="admin-hearder-item2">
                    <a href="/adminFeedbackServiceGeneral" target="_parent" >คลินิกทั่วไป</a>
                    <a href="/adminFeedbackServiceSpecial" target="_parent" >คลินิกเฉพาะทาง</a>
                    <a href="/adminFeedbackServicePhysical" target="_parent" >คลินิกกายภาพ</a>
                    <a href="#" target="_parent" id="select">คลินิกฝังเข็ม</a>

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
                                <p className="admin-textBody-large2">บริการ : {feedback.Type}</p>
                                <p className="admin-textBody-big"><b>ประเภทบริการ: </b>{feedback.serviceType}</p>
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

export default FeedbackServiceNeedle;