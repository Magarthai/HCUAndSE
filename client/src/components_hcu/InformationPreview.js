import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import information from "../picture/information.jpg";

const InformationPreview = (props) => {
    const { user, userData } = useUserAuth();

  
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        
    
    }, [user]); 
   


    return (
        
        <div className="user">
       
                <div className="user-body-infomation-preview colorPrimary-800" style={{marginTop:"20px"}}>
                    <h3>รถฉุกเฉินในมจธ.</h3>
                    <div className="center">
                        <img src={information} className="user-information-preview-img"/>
                    </div>
                   
                    <p className="textBody-large">dsgdddddddddddddddasfaaaffsgdddddddddddddddasfaaaff</p>
                    
                </div>
                <div className="user-activity-vaccine_button_container">
                        <a href="/adminInformationAll" role="button"  target="_parent" className="btn btn-primary">
                            ย้อนกลับ
                        </a>
                    </div>
         
           
            
        </div>

    );
}

export default InformationPreview;