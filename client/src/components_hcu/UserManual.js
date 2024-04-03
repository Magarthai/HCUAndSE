import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import Dashboard from "../user_manual/Dashboard.pdf";
import nud_maii from "../user_manual/nud_maii.pdf";
import ระบบจัดการคิว from "../user_manual/ระบบจัดการคิว.pdf";
import ระบบนัดหมาย from "../user_manual/ระบบนัดหมาย.pdf";
import ระบบเวลาเข้าทำการ from "../user_manual/ระบบเวลาเข้าทำการ.pdf";
import ระบบกิจกรรม from "../user_manual/ระบบกิจกรรม.pdf";
import ระบบข้อเสนอแนะ from "../user_manual/ระบบข้อเสนอแนะ.pdf";
import ระบบข้อมูลทั่วไป from "../user_manual/ระบบข้อมูลทั่วไป.pdf";
import "../css/AdminUserManual.css";

const  UserManual = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
  
  
    useEffect(() => {
        showUserManual("function1","btn1");
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

    function showUserManual(functionUserManual, btn){
        const elements1 = Array.from(document.querySelectorAll(".admin-userManual-btn"));
        elements1.forEach(element => {
            element.classList.remove("admin-manual-active");
        });
        
        const elements = Array.from(document.querySelectorAll(".admin-pdf"));
        elements.forEach(element => {
            element.style.display = "none";
        });

        let x = document.getElementById(functionUserManual);
        let z = document.getElementById(btn);
        if (x !== null) {
            z.classList.add("admin-manual-active")
            x.style.display = "block";
        } else {
            console.error(`Element with ID ${functionUserManual} not found.`);
        }
    }


    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">คู่มือการใช้งาน</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>

        <div className="admin">
            {/* <div className="admin-header">
                <a href="/" target="_parent" id="select">คลินิกทั่วไป</a>
                <a href="/" target="_parent" >คลินิกเฉพาะทาง</a>
                <a href="/" target="_parent" >คลินิกกายภาพ</a>
                <a href="/" target="_parent" >คลินิกฝังเข็ม</a>
            </div> */}
            
            <div className="admin-body">
                <div className="admin-userManual">
                    <div className="admin-userManual-box2">
                        <div className="admin-userManual-btn center" onClick={()=>showUserManual("function1", "btn1")} style={{borderRadius:"15px 0px 0px 0px"}} id="btn1">
                            <p className="admin-textBody-large" style={{margin:0}}>ระบบจัดการคิว</p>
                        </div>
                        <div className="admin-userManual-btn center" onClick={()=>showUserManual("function2", "btn2")} id="btn2">
                            <p className="admin-textBody-large" style={{margin:0}}>ระบบนัดหมาย</p>
                        </div>
                        <div className="admin-userManual-btn center" onClick={()=>showUserManual("function3", "btn3")} id="btn3">
                            <p className="admin-textBody-large" style={{margin:0}}>ระบบเวลาเข้าทำการ</p>
                        </div>
                        <div className="admin-userManual-btn center" onClick={()=>showUserManual("function4", "btn4")} id="btn4">
                            <p className="admin-textBody-large" style={{margin:0}}>ระบบกิจกรรม</p>
                        </div>
                        <div className="admin-userManual-btn center" onClick={()=>showUserManual("function5", "btn5")} id="btn5">
                            <p className="admin-textBody-large" style={{margin:0}}>ระบบข้อมูลทั่วไป</p>
                        </div>
                        <div className="admin-userManual-btn center" onClick={()=>showUserManual("function6", "btn6")} id="btn6">
                            <p className="admin-textBody-large" style={{margin:0}}>ระบบข้อเสนอแนะ</p>
                        </div>
                        <div className="admin-userManual-btn center" onClick={()=>showUserManual("function7", "btn7")} style={{borderRadius:"0px 0px 0px 15px"}} id="btn7">
                            <p className="admin-textBody-large" style={{margin:0}}>Dashboard</p>
                        </div>
                        
                    </div>
                    
                    <div className="admin-userManual-box1">
                        <object 
                            type="application/pdf"
                            data={ระบบจัดการคิว}
                            width={1240}
                            height={700}
                            className="admin-pdf"
                            id="function1"

                        ></object>
                         <object 
                            type="application/pdf"
                            data={ระบบนัดหมาย}
                            width={1240}
                            height={700}
                            id="function2"
                            className="admin-pdf"
                        ></object>
                         <object 
                            type="application/pdf"
                            data={ระบบเวลาเข้าทำการ}
                            width={1240}
                            height={700}
                            id="function3"
                            className="admin-pdf"
                        ></object>
                         <object 
                            type="application/pdf"
                            data={ระบบกิจกรรม}
                            width={1240}
                            height={700}
                            id="function4"
                            className="admin-pdf"
                        ></object>
                            <object 
                            type="application/pdf"
                            data={ระบบข้อมูลทั่วไป}
                            width={1240}
                            height={700}
                            id="function5"
                            className="admin-pdf"
                        ></object>
                            <object 
                            type="application/pdf"
                            data={ระบบข้อเสนอแนะ}
                            width={1240}
                            height={700}
                            id="function6"
                            className="admin-pdf"
                        ></object>
                            <object 
                            type="application/pdf"
                            data={Dashboard}
                            width={1240}
                            height={700}
                            id="function7"
                            className="admin-pdf"
                        ></object>

                    </div>
            

                </div>
                
            </div>
           
        </div>
        
    </div>

    );
}

export default UserManual;