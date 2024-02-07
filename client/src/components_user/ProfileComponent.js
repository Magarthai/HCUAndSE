import { useState, useEffect } from "react";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarComponent';
import "../css/Component.css";
import "../css/UserProfileCompoment.css";
import { db, getDocs, collection } from "../firebase/config";
import { query, where, } from 'firebase/firestore';
import { useUserAuth } from "../context/UserAuthContext";
import male from "../picture/male.png";
import female from "../picture/female.png";


const ProfileUserComponent = (props) => {
  const { user, userData } = useUserAuth();
  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);

  }, [user]);

  return (

    <div className="user">
      <header className="user-header">
        <div>
          <h2>โปรไฟล์</h2>
          <h3>รายละเอียดบัญชี</h3>
        </div>

        <NavbarUserComponent />
      </header>
      <div className="user-body">

        <div className="user-profile">
          <div className="center user-profile-header-box">
            <div className="user-profile-wave-container">
              <svg class="user-profile-waves" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <defs>
                  <path id="user-profile-gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g class="user-profile-parallax">
                  <use href="#user-profile-gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                  <use href="#user-profile-gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                  <use href="#user-profile-gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                  <use href="#user-profile-gentle-wave" x="48" y="7" fill="#fff" />
                </g>
              </svg>
              {userData &&<img className="user-profile-img" src={userData.gender === 'female' ? female : male} alt="logo health care unit" />}
            </div>
            <div class="header">
            </div>
          </div>

          <div className="user-profile-info colorPrimary-800">
            {/* <h2 className="colorPrimary-800" style={{marginTop:"-5px",marginBottom:"20px"}}>ข้อมูลทั่วไป</h2> */}
            {userData &&<p className="textButton-Normal user-profile-header-user-name center">{userData.firstName} {userData.lastName}</p>}
            <p className="textButton-Normal colorPrimary-800">รหัสนักศึกษา/รหัสพนักงาน</p>
            {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.id}</p>}
            <p className="textButton-Normal colorPrimary-800">email</p>
            {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{user.email}</p>}
            <p className="textButton-Normal colorPrimary-800">เบอร์โทร</p>
            {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.tel}</p>}
            <p className="textButton-Normal colorPrimary-800">เพศ</p>
            {userData && <p className="colorPrimary-800 user-profile-detail textBody-big">{userData.gender}</p>}
            <a a className="btn btn-primary" href="/profile/edit" role="button" target="_parent">แก้ไขข้อมูลส่วนตัว</a>
          </div>


        </div>
      </div>



    </div>

  );
}

export default ProfileUserComponent;