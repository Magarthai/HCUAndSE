import "../css/UserNavbarComponent.css";
import { Link, useNavigate } from "react-router-dom"; // นำเข้า useNavigate มาด้วย
import Manface from "../picture/Manface.png";
import { fetchUserById } from '../firebase/firebaseUtils';
import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import { query, where,  } from 'firebase/firestore';
import male from "../picture/male.png";
import female from "../picture/female.png";
import list from "../picture/List.png";
import close from "../picture/close-w.png";
import edit from "../picture/edit-w.png";
import logout from "../picture/logout-w.png";
import login from "../picture/login-w.png";

const NavbarComponent = (props) => {
  const { user,userData, logOut,profile } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

  const openNavbar = () => {
    let x = document.getElementById("user-navbar");
    let y = document.getElementById("user-navbar-background");
    if (window.getComputedStyle(x).display === "none") {
      x.style.display = "block";
      y.style.display = "block";
    } else {
      x.style.display = "none";
      y.style.display = "none";
    }
  };
  

  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);
  }, [user]);


  return (
    <div style={{userSelect:"none"}}>
        <img className="user-navbar-icon" src={list} onClick={openNavbar}/>
        <div id="user-navbar-background"></div>
        <div id="user-navbar">
          <div className="user-navbar-body">
            <img className="user-navbar-icon-close" src={close} onClick={openNavbar}/>
            <div className="user-navbar-header">
            {userData && userData ? (
              <img className="user-navbar-profile" src={userData.gender === 'female' ? female : male} alt="logo health care unit" />
            ) : (
              <img className="user-navbar-profile" src={male} alt="logo health care unit" />
            )}
            {userData && userData ? (
              <div className="user-navbar-profile-detail">
                {userData && <div className="admin-textBody-huge" style={{ display: 'flex', alignItems: 'center' }}><a style={{overflow:"hidden", whiteSpace: "nowrap",textOverflow: "ellipsis", maxWidthwidth: "400px", display: "inline-block",  textAlign:"initial"}}>{userData.firstName} {userData.lastName}</a><a href="/profile" target="_parent"><img className="user-navbar-icon-edit"src={edit}/></a></div>}
                {userData && <div className="admin-textBody-small2">{userData.id}</div>}
              </div>
              ) : (
                <div className="user-navbar-profile-detail">
                  <a  target="_parent" className="admin-textBody-huge colorPrimary-50" style={{textDecoration:"none"}}>กรุณาล็อคอินก่อนเข้าใช้บริการ</a><br></br>
                  <a href="/" target="_parent" className="admin-textBody-small2 colorPrimary-50"  style={{textDecoration:"underline"}}>เข้าสู่ระบบ</a>
                </div>
              )}
            </div>
            <div className="user-navbar-lists">
              <a href="/home" role="button" target="_parent"><p>หน้าแรก</p></a>
              <a href="/appointment" role="button" target="_parent"><p>นัดหมาย</p></a>
              <a href="/activity" role="button"  target="_parent"><p>กิจกรรม</p></a>
              <a href="/queue" role="button"  target="_parent"><p>สถานะคิว</p></a>
              <a href="/timetable" role="button"  target="_parent"><p>ช่วงเวลาเข้าทําการแพทย์</p></a>
              <a href="/" role="button"  target="_parent"><p>ตำแหน่งที่ตั้ง</p></a>
              <a href="/information" role="button"  target="_parent"><p>ข้อมูลทั่วไป</p></a>
              <a href="/feedback" role="button"  target="_parent"><p>ประเมินความพึงพอใจ</p></a>
              <a href="/manual" role="button"  target="_parent"><p>คู่มือการใช้งาน</p></a>
            </div>
            {userData && userData ? (
            <p  className="colorPrimary-800" onClick={handleLogout} style={{cursor:"pointer"}}><img className="user-navbar-icon-logout"src={logout}/>ออกจากระบบ</p>
            ) : (
              <p  className="colorPrimary-800" onClick={handleLogout} style={{cursor:"pointer"}}><img className="user-navbar-icon-logout"src={login}/>เข้าสู่ระบบ</p>
            )}
          </div>


        </div>
    </div>
        
  );
};

export default NavbarComponent;
