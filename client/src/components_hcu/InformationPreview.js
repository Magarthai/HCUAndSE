import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import information from "../picture/information.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const InformationPreview = (props) => {
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { information } = location.state || {};
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        if (!information) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่มีข้อมูลกิจกรรม',
                confirmButtonColor: '#263A50',
                customClass: {

                    confirmButton: 'custom-confirm-button',
                }
            }).then(() => {
                navigate('/adminInformationAll');
            });
        }
    
    }, [user]); 
   


    return (
        
        <div className="user">
       
                <div className="user-body-infomation-preview colorPrimary-800" style={{marginTop:"20px"}}>
                    {information &&<h3>{information.informationName}</h3>}
                    <div className="center">
                    {information && <img src={information.image} className="user-information-preview-img"/>}
                    </div>
                   
                    {information && <p className="textBody-large">{information.informationDetail}</p>}
                    
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