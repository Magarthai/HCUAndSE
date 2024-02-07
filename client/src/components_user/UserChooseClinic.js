import React from 'react';
import '../css/UserChooseClinic.css';
import { Link } from 'react-router-dom';
import NavbarUserComponent from '../components_user/NavbarComponent';
import logo1 from '../picture/logo-clinic1.png';
import logo2 from '../picture/logo-clinic2.png';
import logo3 from '../picture/logo-clinic3.png';
import logo4 from '../picture/logo-clinic4.png';

const UserChooseClinic = () => {

  return (

    
    <div className="user">
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>เลือกคลินิก</h3>
                </div>

                <NavbarUserComponent/>
            </header>
            <div className='user-body' style={{padding:0}}>
            <h2 className='userrheader' >คลินิก</h2>
            <div className="clinic-function">
                <Link to="/appointment/add" className="clinic-card" style={{marginTop:10}}>
                    <p>
                    <p className= "user-choose-button-main-text">คลินิกทั่วไป</p>
                    </p>
                    <img className="clinic" src={logo1} alt="คลินิกทั่วไป" />
                </Link>

                <Link to="/appointment/addSpecial" className="clinic-card">
                    <p>
                    <p className= "user-choose-button-main-text">คลินิกเฉพาะทาง</p>
                    </p>
                    <txt>(หู คอ จมูก)</txt>
                    <img className="clinic" src={logo2} alt="คลินิกเฉพาะทาง" />
                </Link>

                <Link to="/appointment/addPhysic" className="clinic-card">
                    <p>
                    <p className= "user-choose-button-main-text">คลินิกกายภาพ</p>
                    </p>
                    <img className="clinic" src={logo3} alt="คลินิกกายภาพ" />
                </Link>

                <Link to="/appointment/addNeedle" className="clinic-card">
                    <p>
                    <p className= "user-choose-button-main-text">คลินิกฝังเข็ม</p>
                    </p>
                    <img className="clinic" src={logo4} alt="คลินิกฝังเข็ม" />
                </Link>
            </div>
            </div>

        </div>
    
  );
};

export default UserChooseClinic;