import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import "../css/AdminInformation.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import information from "../picture/information.jpg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import preview from "../picture/preview.png";
import axios from 'axios';
const InformationAll = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const navigate = useNavigate();
    const [information, setInformation] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        document.title = 'Health Care Unit';

        console.log(user);
        console.log(userData)
        const responsivescreen = () => {
        const innerWidth = window.innerWidth;
        const baseWidth = 1920;
        const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
        setZoomLevel(newZoomLevel);
        };
        if(userData){
        fetchData();
        console.log("XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
        }
        responsivescreen();
        window.addEventListener("resize", responsivescreen);
        const updateShowTime = () => {
        const newTime = getShowTime();
        if (newTime !== showTime) {
            setShowTime(newTime);
        }
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };
  
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
    
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };
    
    }, [user,userData]); 
    const containerStyle = {
        zoom: zoomLevel,
    };

    const REACT_APP_MONGO_API = process.env.REACT_APP_MONGO_API
    const fetchData = async() => {
        console.log("XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
        const respone = await axios.get(`${REACT_APP_MONGO_API}/api/getAllInformation`)
        if(respone.data) {
            setInformation(respone.data)
            console.log(respone.data,"dataaaaaaa");
        }
    }


    function getShowTime() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    }

    function formatNumber(num) {
        return num < 10 ? "0" + num : num.toString();
    }

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;


    const EditInformation = (informations) => {
            navigate('/adminInformationEdit', { state: { information: informations } });
    }

    const PreviewInformation = (informations) => {
        if (informations) {
        navigate('/adminInformationPreview', { state: { information: informations } });
        }
    }

    const deletedInformation = (informations) => {
        if (informations) {
            Swal.fire({
                title: 'ลบบทความ',
                text: `คุณแน่ใจว่าจะลบบทความ : ${informations.informationName} ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#DC2626',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'custom-confirm-button',
                    cancelButton: 'custom-cancel-button',
                }
            }).then(async(result) => {
                if (result.isConfirmed) {
                        const deleteRespone = await axios.post(`${REACT_APP_MONGO_API}/api/deleteInformation`,informations);
                        if (deleteRespone.data == "success"){
                        Swal.fire(
                            {
                                title: 'การลบการบทความสำเร็จ!',
                                text: `การบทความถูกลบเรียบร้อยแล้ว!`,
                                icon: 'success',
                                confirmButtonText: 'ตกลง',
                                confirmButtonColor: '#263A50',
                                customClass: {
                                    confirmButton: 'custom-confirm-button',
                                }
                            }
                        ).then((result) => {
                            if (result.isConfirmed) {
                              window.location.reload();
                            }
                          });
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'เกิดข้อผิดพลาด',
                            text: 'กรุณาทํารายการใหม่อีกครั้ง',
                            confirmButtonColor: '#263A50',
                            customClass: {
            
                                confirmButton: 'custom-confirm-button',
                            }
                        });
                    }
                    })
        }}
        
    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">ระบบการจัดการข้อมูลทั่วไป</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <div className="admin">
            <div className="admin-header">
                    <div className="admin-hearder-item">
                       
                    </div>
                    <div className="admin-hearder-item admin-right">
                        <a href="/adminInformationAdd" target="_parent">เพิ่มข้อมูลทั่วไป</a>
                    </div>
                </div>
            <div className="admin-body">
                <div className="admin-information">
                {information.map((information, index) => (
                    <div className="admin-information-item" >
                        <div className="admin-information-item-hearder">
                            <div className="admin-information-item-hearder-box1">
                                <p className="admin-textBody-large2 colorPrimary-800" style={{textDecoration: "underline", cursor:"pointer", width:"auto"}} onClick={() => PreviewInformation(information)}>{information.informationName}</p>
                            </div>
                            <div className="admin-information-item-hearder-box2">
                                    <a href="/adminInformationEdit" target="_parent"><img src={edit} className="icon" onClick={() => EditInformation(information)} /></a>
                                    <img onClick={() => deletedInformation(information)} src={icon_delete} className="icon" />
                            </div>
                        </div>

                        <div className="admin-information-img-box">
                            <img src={information.image} className="admin-information-img"/>
                        </div>
                        
                    </div>
                ))}
            
                </div>
                
            </div>
           
        </div>
        
    </div>

    );
}

export default InformationAll;