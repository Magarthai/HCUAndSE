import "../css/UserNavbarComponent1.css";
import { Link, useNavigate } from "react-router-dom"; // นำเข้า useNavigate มาด้วย
import Manface from "../picture/Manface.png";
import { fetchUserById } from '../firebase/firebaseUtils';
import { useEffect, useState, useRef } from "react";
import "../css/AdminHomeComponent.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import { query, where,  } from 'firebase/firestore';
import male from "../picture/male.png";
import female from "../picture/female.png";

const NavbarUserComponent = (props) => {
  const { user,userData, logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

  
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  

  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);


  }, [user]);

  const locale = 'en';
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const currentDate = `${day} ${month}/${date}/${year}`;

  return (
    <div className="navbaruser">
      <div className="navbars">
        <input
          className="menu-icons"
          type="checkbox"
          id="menu-icons"
          name="menu-icons"
          checked={showNav}
          onChange={toggleNav}
        />
        <label htmlFor="menu-icons"></label>
        <div className="navs" style={{ display: showNav ? 'block' : 'none' }}>
          <ul>
            <li className="profiles">
              <Link to="/profile">
                <div className="profilecontainer">
                  <div className="profilebox">
                    <div className="profile-picture">
                    {userData &&<img className="logo" src={userData.gender === 'female' ? female : male} alt="logo health care unit" />}
                    </div>
                    <div className="profile-info">
                      <div className="profilename">
                        {userData && <div className="profileinfos">{userData.firstName} {userData.lastName}</div>}
                      </div>
                      <div className="profileid">
                        {userData && <div className="profileinfos">{userData.id}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
            <li><a><div className="textss"><Link to="/appointment">นัดหมาย</Link></div></a></li>
            <li><a><div className="textss"><Link to="/">กิจกรรม</Link></div></a></li>
            <li><a><div className="textss"><Link to="/">สถานะคิว</Link></div></a></li>
            <li><a><div className="textss"><Link to="/timetable">ช่วงเวลาเข้าทําการแพทย์</Link></div></a></li>
            <li><a><div className="textss"><Link to="/">ตำแหน่งที่ตั้ง</Link></div></a></li>
            <li><a><div className="textss"><Link to="/">ข้อมูลทั่วไป</Link></div></a></li>
            <li><a><div className="textss"><Link to="/">ประเมินความพึงพอใจ</Link></div></a></li>
            <li><a><div className="textss"><Link to="/">คู่มือการใช้งาน</Link></div></a></li>
            <li style={{height:60}}><button className="navbtn" onClick={handleLogout}>LOG OUT</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavbarUserComponent;
