import { useState, useEffect } from "react";
import CalendarUserComponent from "./CalendarUserComponent";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarUserComponent';
import NavbarComponent from '../components_user/NavbarComponent';
import function0 from "../picture/functionUser0.png";
import function1 from "../picture/functionUser1.png";
import function2 from "../picture/functionUser2.png";
import function3 from "../picture/functionUser3.png";
import function4 from "../picture/functionUser4.png";
import function5 from "../picture/functionUser5.png";
import function6 from "../picture/functionUser6.png";
import function7 from "../picture/functionUser7.png";
import function8 from "../picture/functionUser8.png";
import right from "../picture/right.png";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import home from "../picture/home-hcu.png";
import male from "../picture/male.png";
import female from "../picture/female.png";
import liff from '@line/liff';
import { useUserAuth } from "../context/UserAuthContext";
import {Link, useNavigate } from "react-router-dom";
const HomeComponent = (props) => {
    const { user, userData,idToken,displayName,statusMessage,userId,profile } = useUserAuth();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
    }, [user]);
    useEffect(() => {
        console.log(userId,"userIduserIduserIduserId");
    }, [userId]);

    return (
        
        <div className="user" style={{userSelect:"none"}}>
            <header className="user-header">
                    <div>
                        <h2>Health Care Unit</h2>
                        <h3>Home</h3>
                    </div>
                    <NavbarComponent/>
            </header>
            <div className="user-body">
                <div className="user-home">
                    <a href="#" role="button"  target="_parent" style={{width:"100%"}}><img src={home} className="user-home-hcu"/></a>
                    <h3 className="colorPrimary-800">Welcome to HCU</h3>
                    <a href="/profile" target="_parent">
                    <div className="user-home-proflie" >
                        
                        <div className="user-home-proflie-box center" style={{width:"15%", paddingLeft:"4%"}}>
                           <img className="user-home-profile-img" src={profile} alt="logo health care unit" />
                        </div>
                        
                        <div className="user-home-proflie-box colorPrimary-800" style={{width:"70%", justifyContent:"flex-start", paddingLeft:"6%"}}>
                            {userData && <div className="admin-textBody-huge" style={{overflow:"hidden", whiteSpace: "nowrap",textOverflow: "ellipsis", maxWidthwidth: "200px", display: "inline-block",  textAlign:"initial"}}>{userData.firstName} {userData.lastName}<br></br> <div className="admin-textBody-small2">{userData.id}</div></div> }
                        </div>
                        <div className="user-home-proflie-box admin-right" style={{width:"15%"}}>
                            <img src={right} style={{width:"40px", height:"40px"}} />
                        </div>  
 
                    </div>
                    </a>                 
                    <div className="user-home-list">
                    {/* <a href="#" role="button"  target="_parent" className="user-home-list-box1"><img src={function0}/><p>หน้าแรก</p></a> */}
                    <a href="/appointment" role="button"  target="_parent" className="user-home-list-box1"><img src={function1}/><p>นัดหมาย</p></a>
                    <a href="/activity" role="button"  target="_parent" className="user-home-list-box2"><img src={function2}/><p>กิจกรรม</p></a>
                    <a href="/queue" role="button"  target="_parent" className="user-home-list-box2"><img src={function3}/><p>สถานะคิว</p></a>
                    <a href="/timetable" role="button"  target="_parent" className="user-home-list-box2"><img src={function4}/><p>ช่วงเวลาเข้าทําการแพทย์</p></a>
                    <a href="#" role="button"  target="_parent" className="user-home-list-box2"><img src={function5}/><p>ตำแหน่งที่ตั้ง</p></a>
                    <a href="/information" role="button"  target="_parent" className="user-home-list-box2"><img src={function6}/><p>ข้อมูลทั่วไป</p></a>
                    <a href="/feedback" role="button"  target="_parent" className="user-home-list-box2"><img src={function7}/><p>ประเมินความพึงพอใจ</p></a>
                    <a href="#" role="button"  target="_parent" className="user-home-list-box2"><img src={function8}/><p>คู่มือการใช้งาน</p></a>
                    {/* <a href="/appointment" role="button"  target="_parent"><img src={function1}/><p>นัดหมาย</p></a>
                    <a href="#" role="button"  target="_parent"><img src={function2} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function3} /></a>
                    <a href="/timetable" role="button"  target="_parent"><img src={function4} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function5} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function6}/></a>
                    <a href="#" role="button"  target="_parent" ><img src={function7} /></a>
                    <a href="#" role="button"  target="_parent"><img src={function8} /></a> */}
                    </div>
                </div>
            </div> 
        </div>

    );
}

export default HomeComponent;