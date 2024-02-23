import { useState, useEffect } from "react";
import "../css/Login&SignupComponent.css";
import "../css/UserInformationComponent.css";
import NavbarUserComponent from './NavbarComponent';
import information from "../picture/information.jpg"

const InformationPreviewComponent = (props) => {


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
                <div className="user-body-infomation-preview colorPrimary-800">
                    <h3>รถฉุกเฉินในมจธ.</h3>
                    <div className="center">
                        <img src={information} className="user-information-preview-img"/>
                    </div>
                   
                    <p className="textBody-large">dsgdddddddddddddddasfaaaffsgdddddddddddddddasfaaaff</p>
                    
                </div>
            </div>
         
           
            
        </div>

    );
}

export default InformationPreviewComponent;