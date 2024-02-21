import { useState, useEffect } from "react";
import "../css/Login&SignupComponent.css";
import "../css/UserInformationComponent.css";
import NavbarUserComponent from './NavbarComponent';
import HCU from "../picture/HCU.jpg"

const InformationAllComponent = (props) => {


    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>ข้อมูลทั่วไป</h2>
                        {/* <h3>รายการนัดหมาย</h3> */}
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="user-body-infomation colorPrimary-800">
                    <h3>ข้อมูลทั่วไป</h3>
                    <a href="/information/preview" className="user-card-infornation-flexbox">
                        <div className="user-card-infornation-box-img">
                            <img src={HCU}/>
                        </div>
                        <div className="user-card-infornation-box-name">
                            <p>รถฉุกเฉินในมจธ.</p>
                        </div>
                    </a>
                    <a href="/information/preview" className="user-card-infornation-flexbox">
                        <div className="user-card-infornation-box-img">
                            <img src={HCU}/>
                        </div>
                        <div className="user-card-infornation-box-name">
                            <p>รถฉุกเฉินในมจธ.</p>
                        </div>
                    </a>
                </div>
                
                
            </div>
         
           
            
        </div>

    );
}

export default InformationAllComponent;