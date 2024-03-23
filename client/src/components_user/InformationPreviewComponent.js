import { useState, useEffect } from "react";
import "../css/Login&SignupComponent.css";
import "../css/UserInformationComponent.css";
import NavbarUserComponent from './NavbarComponent';
import information from "../picture/information.jpg"
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
const InformationPreviewComponent = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { information } = location.state || {};
    useEffect(() => {
        document.title = 'Health Care Unit';
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
    
    }); 
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
                    {information &&<h3>{information.informationName}.</h3>}
                    <div className="center">
                    {information &&<img src={information.image} className="user-information-preview-img"/>}
                    </div>
                   
                    {information &&<p className="textBody-large">{information.informationDetail}</p>}
                    
                </div>
            </div>
         
           
            
        </div>

    );
}

export default InformationPreviewComponent;