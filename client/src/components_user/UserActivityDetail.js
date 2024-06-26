import { useEffect, useState } from "react";
import "../css/UserActivityDetail.css";
import "../css/Component.css";
import activity1 from "../picture/activity1.png";
import Swal from "sweetalert2";
import NavbarUserComponent from './NavbarComponent';
import { useUserAuth } from "../context/UserAuthContext";
import { json, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserActivity from "./UserActivity";
const UserActivityDetail = (props) =>{
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "",
        endQueueDate: "",
        imageURL: "",
        openQueueDate: "",
        queueStatus: "",
        activityId: "",
        editDetial:"",
    });

    const [count, setCount] = useState(0)
    const REACT_APP_API = process.env.REACT_APP_API
    const [timeSlots, setTimeSlots] = useState([
        { date: "", startTime: "", endTime: "", registeredCount: "" }
    ]);

    const [imgSrc, setImgSrc] = useState(null);
    const { activities } = location.state || {};
    const {editDetial, activityName, activityDetail, activityType, endQueueDate, imageURL, openQueueDate,activityId } = state

    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        if (!activities) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่มีข้อมูลกิจกรรม',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            }).then(() => {
                navigate('/activity');
            });
        } else {
            setState({
                activityName: activities.activityName || "",
                activityDetail: activities.activityDetail || "",
                activityType: activities.activityType || "",
                endQueueDate: activities.endQueueDate || "",
                activityId: activities.activityId || "",
                imageURL: activities.imageURL || "",
                openQueueDate: activities.openQueueDate || "",
                queueStatus: activities.queueStatus || "",
                editDetial: activities.editDetial || "",
            });


            setImgSrc(activities.imageURL);
            const today = new Date().toISOString().slice(0, 10);

            const updatedTimeSlots = activities.timeSlots
                .map((slot, index) => ({
                    ...slot,
                    index: index,
                }))
                .filter(slot => slot.date >= today);
            
            
            setTimeSlots(updatedTimeSlots);
            console.log(today, "today");
            console.log(updatedTimeSlots, "updatedTimeSlots");
            console.log(timeSlots, "timeSlots");
        }
    }, [user]);
    
    const UserActivityRegister = async (e) => {
        if(!selectedValue){
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถสร้างนัดหมายได้ กรุณาลองอีกครั้งในภายหลัง.",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
        }
        e.preventDefault();
        const selectedSlot = e.target.value;
       
        console.log(JSON.parse(selectedValue))
        const uiSelect = JSON.parse(selectedValue)
        const appointmentInfo = {
            activityName: activities.activityName || "",
            activityId: activities.activityId || "",
            timeSlots: selectedValue,
            userData: {
                userID:userData.userID,
                id:userData.id,
                email:userData.email,
                tel:userData.tel,
                firstName:userData.firstName,
                lastName:userData.lastName,
                gender:userData.gender,
                userLineID:userData.userLineID,
                userActivity:userData.userActivity
            },
        };
        Swal.fire({
            title: "ลงทะเบียน",
            html: `กิจกรรม : ${activityName}<br>วันที่ ${uiSelect.date} (${uiSelect.startTime}-${uiSelect.endTime})`,
            showConfirmButton: true,    
            showCancelButton: true,
            confirmButtonText: "ลงทะเบียน",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
            confirmButtonColor: '#263A50',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
            
        }).then(async(result) => {
            if (result.isConfirmed) {
                console.log(appointmentInfo)
                try {
                    const response = await axios.post(`${REACT_APP_API}/api/addUserActivity`, appointmentInfo, {
                        activityName: activities.activityName || "",
                        id: activities.id || "",
                        timeSlots: selectedValue,
                        activityName: activities.activityName || "",
                        activityId: activities.activityId || "",
                        timeSlots: selectedValue,
                        userData: {
                            userID:userData.userID,
                            id:userData.id,
                            email:userData.email,
                            tel:userData.tel,
                            firstName:userData.firstName,
                            lastName:userData.lastName,
                            gender:userData.gender,
                            userLineID:userData.userLineID,
                            userActivity:userData.userActivity
                        },
                    });
                    
                    if (response.data == "success") {
    
                    Swal.fire({
                        title: "ลงทะเบียนสำเร็จ",
                        icon: "success",
                        confirmButtonText: "กลับ",
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    }).then(function() {
                        window.location.href = '/activity';

                    });
                } else if (response.data == "already-exits") {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "คุณลงทะเบียนกิจกรรมนี้แล้ว",
                        icon: "error",
                        confirmButtonText: "กลับ",
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    })
                    return;
                } else if (response.data == "already-full") {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "กิจกรรมนี้ผู้เข้าร่วมเต็มแล้ว",
                        icon: "error",
                        confirmButtonText: "กลับ",
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    })
                    return;
                }
                else {
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "คุณลงทะเบียนกิจกรรมนี้แล้ว",
                        icon: "error",
                        confirmButtonText: "กลับ",
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    })
                    return;
                }
                } catch (error) {
                    console.error("Error registering activity:", error);
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถลงทะเบียนกิจกรรมได้",
                        icon: "error",
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                }
            }
        });
    }
    
    const [selectedValue, setSelectedValue] = useState([]);
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
      };

    return (

        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>รายละเอียดกิจกรรม</h2>
                       
                    </div>
                    <NavbarUserComponent/>
            </header>

            <div className="user-body" id="user-event-body">
                <div className="center">
                    <img  className="user-activity-vaccine_image" alt="" src={imgSrc}/>
                </div>

                <div className="user-body-activity-detail">
                    <div className="user-activity-vaccine_title_container">
                        <h3 style={{wordWrap: "break-word", width:"100%",display: "inline-block"}}>กิจกรรม : {activityName}</h3>
                    </div>
                    <div className="user-activity-vaccine_date_container">
                        <h5>วันที่เปิดลงทะเบียน</h5>
                        {activities &&
                        <p className="textBody-medium colorPrimary-800" >
                            {formatDate(activities.openQueueDate)} - {formatDate(activities.endQueueDate)}
                        </p>
}
                    </div>

                    <div className="user-activity-vaccine_detail_container">
                        <h5>รายละเอียด</h5>
                        <p className="textBody-medium">
                        {activityDetail}
                        </p>
                    </div>
                    {editDetial &&
                    <div className="user-activity-vaccine_detail_container">
                        <h5>รายละเอียดแก้ไข</h5>
                        <p className="textBody-medium" style={{color:"red"}}>
                        {editDetial}
                        </p>
                    </div>
                    }
                    <div className="user-activity-vaccine_date_container">
                        <h5>วันที่</h5>
                        <select 
                            onChange={(e) => {
                                setSelectedValue(e.target.value);
                                setCount(count+1)
                                console.log(e.target.value);
                            }}
                            className="user-activity-vaccine_date"
                            >
                            <option hidden>กรุณาเลือกช่วงเวลา</option>
                            {timeSlots.map((slot) => (
                                <option key={slot.id} value={JSON.stringify(slot)}>
                                    {`${slot.date} (${slot.startTime}-${slot.endTime})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="user-activity-vaccine_button_container">
                        {count && count > 0 ?
                        <button onClick={UserActivityRegister} className="user-activity-vaccine_button btn-primary">
                        ลงทะเบียน
                    </button> :
                    <button onClick={UserActivityRegister} style={{backgroundColor:"grey"}}  disabled className="user-activity-vaccine_button btn-primary">
                    ลงทะเบียน
                </button>}
                    </div>
                        
                </div>
            </div>
        </div>

    )
} 

export default UserActivityDetail;