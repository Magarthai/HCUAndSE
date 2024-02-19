import { useState, useEffect } from "react";
import axios from 'axios';
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarComponent';
import "../css/Component.css";
import "../css/UserProfileCompoment.css";
import { useUserAuth } from "../context/UserAuthContext";
import male from "../picture/male.png";
import female from "../picture/female.png";
import { collection, getDocs } from 'firebase/firestore';

const ProfileUserComponents = (props) => {
  const { user, userData } = useUserAuth();
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/data'); 
      setFetchedData(response.data); 
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
              <svg className="user-profile-waves" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                <defs>
                  <path id="user-profile-gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g className="user-profile-parallax">
                  <use href="#user-profile-gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                  <use href="#user-profile-gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                  <use href="#user-profile-gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                  <use href="#user-profile-gentle-wave" x="48" y="7" fill="#fff" />
                </g>
              </svg>
              {userData && <img className="user-profile-img" src={userData.gender === 'female' ? female : male} alt="logo health care unit" />}
            </div>
            <div className="header"></div>
          </div>
          <div className="user-profile-info colorPrimary-800">
            {/* เมื่อคลิกที่ปุ่ม จะเรียกใช้ฟังก์ชัน fetchData */}
            <button className="btn btn-primary" onClick={fetchData}>ดึงข้อมูล</button>
          </div>
          {/* แสดงข้อมูลที่ได้รับจาก API */}
          {fetchedData && (
            <div className="fetched-data">
              {fetchedData.map((item, index) => (
                <div key={index}>{/* แสดงข้อมูลตามที่ต้องการ */}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileUserComponents;
