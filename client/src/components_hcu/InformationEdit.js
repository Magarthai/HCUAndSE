import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminTimeTableComponent.css";
import img_information from "../picture/img-activity.png";
import "../css/AdminInformation.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const InformationEdit = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const navigate = useNavigate();
    const [state, setState] = useState({
        informationName: "",
        informationDetail: "",
    });
    const {informationName, informationDetail} = state
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    }
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
    
    }, [user]); 
    const containerStyle = {
        zoom: zoomLevel,
    };

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
    const [imgSrc, setImgSrc] = useState(null);

    const submitForm = async (e) => {
        Swal.fire({
            title: 'สร้างบทความ',
            html: `ตกลงที่จะสร้างบทความ : ${informationName} `,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#263A50',
            reverseButtons: true,
            customClass: {
              confirmButton: 'custom-confirm-button',
              cancelButton: 'custom-cancel-button',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'สร้างบทความสําเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                  confirmButton: 'custom-confirm-button',
                },
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/adminInformationAll')
                }
              });
            }
        });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };


    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">แก้ไขข้อมูลทั่วไป</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <div className="admin">
          
            
            <div className="admin-body">
                <form onSubmit={submitForm}>
                        <div className="admin-activity-add">
                            <div className="admin-activity-add-hearder-flexbox">
                                <div className="admin-activity-today-hearder-box">
                                    <img
                                        src={imgSrc || img_information}
                                        className="admin-img-activity"
                                        alt={imgSrc ? "Selected Activity Image" : img_information}
                                    />
                                    <br />
                                    <br />
                                    <div className="admin-right">
                                        <input
                                            type="file"
                                            className="form-control input-activity-img"
                                            accept="image/png, image/jpeg"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <div className="admin-activity-today-hearder-box admin-activity-form">
                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800">ชื่อบทความ</label>
                                        <input type="text" className="form-control" value={informationName} onChange={inputValue("informationName")} placeholder="Information" maxLength={70}/>
                                        {informationName.length > 70 ? <div style={{display:"flex",color:"red",justifyContent:"flex-end"}}>{informationName.length}/70</div> : <div style={{display:"flex",color:"grey",justifyContent:"flex-end"}}>{informationName.length}/70</div>}
                                    </div>
                                    
                                    <div>
                                    <label className="admin-textBody-large colorPrimary-800 acivity-detail">รายละเอียด</label>
                                    <textarea
                                        value={informationDetail}
                                        onChange={inputValue("informationDetail")}
                                        className="acivity-detail"
                                        rows="18"
                                    ></textarea>
                                    </div>
                                </div>
                                <div className="admin-timetable-btn" style={{width:"100%"}}>
                                    <button type="button" className="btn-secondary btn-systrm" onClick={() => window.history.back()} >กลับ</button>
                                    <input type="submit" value="แก้ไขข้อมูลทั่วไป" className="btn-primary btn-systrm" target="_parent" disabled={informationName === "" || informationDetail == ""}/>
                                </div>
                            </div>
                        </div>
                </form>
                
            </div>
           
        </div>
        
    </div>

    );
}

export default InformationEdit;