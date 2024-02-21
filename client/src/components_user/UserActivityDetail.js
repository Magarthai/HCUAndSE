import { useEffect, useState } from "react";
import "../css/UserActivityDetail.css";
import "../css/Component.css";
import activity1 from "../picture/activity1.png";
import Swal from "sweetalert2";
import NavbarUserComponent from './NavbarComponent';
import { useUserAuth } from "../context/UserAuthContext";
import { json, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const UserActivityDetail = (props) =>{
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "",
        endQueenDate: "",
        imageURL: "",
        openQueenDate: "",
        queenStatus: "",
        activityId: "",
    });
    const [timeSlots, setTimeSlots] = useState([
        { date: "", startTime: "", endTime: "", registeredCount: "" }
    ]);
    const [imgSrc, setImgSrc] = useState(null);
    const { activities } = location.state || {};
    const { activityName, activityDetail, activityType, endQueenDate, imageURL, openQueenDate,activityId } = state
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
                navigate('/adminActivityNoOpenRegisterComponent');
            });
        } else {
            setState({
                activityName: activities.activityName || "",
                activityDetail: activities.activityDetail || "",
                activityType: activities.activityType || "",
                endQueenDate: activities.endQueenDate || "",
                activityId: activities.activityId || "",
                imageURL: activities.imageURL || "",
                openQueenDate: activities.openQueenDate || "",
                queenStatus: activities.queenStatus || "",
            });
            setImgSrc(activities.imageURL);
            const updatedTimeSlots = activities.timeSlots.map((slot, index) => ({
                ...slot,
                index: index ,
                activityId: activityId || "",
            }));
            setTimeSlots(updatedTimeSlots);
            console.log(activities, "activities");
            console.log(timeSlots, "timeSlots");
        }
    }, [user]);
    
    const UserActivityRegister = async (e) => {
        e.preventDefault();
        console.log(selectedValue)
        const selectedSlot = e.target.value;
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
            },
        };
        Swal.fire({
            title: "ลงทะเบียน",
            html: "โครงการฉีดวัคซีนไข้หวัดใหญ่ตามฤดูกาล 2566<br>วันที่ 20/12/2023 (09.00-12.00)",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "ลงทะเบียน",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
            
        }).then(async(result) => {
            if (result.isConfirmed) {
                console.log(appointmentInfo)
                try {
                    const response = await axios.post('http://localhost:5000/api/addUserActivity', appointmentInfo, {
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
                        },
                    });
                    
                    console.log(response.data);
    
                    Swal.fire({
                        title: "ลงทะเบียนสำเร็จ",
                        icon: "success",
                        confirmButtonText: "กลับ",
                    }).then(function() {
                        navigate("/activity");
                    });
                } catch (error) {
                    console.error("Error registering activity:", error);
                    Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถลงทะเบียนกิจกรรมได้",
                        icon: "error",
                        confirmButtonText: "ตกลง"
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
                        <h2>รายการกิจกรรม</h2>
                       
                    </div>
                    <NavbarUserComponent/>
            </header>

            <div className="user-body" id="user-event-body">
                <div>
                    <img  className="user-activity-vaccine_image" alt="" src={imgSrc}/>
                </div>

                <div className="user-body-activity-detail">
                    <div className="user-activity-vaccine_title_container">
                        <h3>รายการกิจกรรม : {activityName}</h3>
                    </div>
                    <div className="user-activity-vaccine_date_container">
                        <h5>วันที่เปิดลงทะเบียน</h5>
                        <p className="textBody-medium colorPrimary-800" >
                            {formatDate(activities.openQueenDate)} - {formatDate(activities.endQueenDate)}
                        </p>
                    </div>

                    <div className="user-activity-vaccine_detail_container">
                        <h5>รายละเอียด</h5>
                        <p className="textBody-medium">
                        {activityDetail}
                        </p>
                    </div>
                    

                    <div className="user-activity-vaccine_date_container">
                        <h5>วันที่</h5>
                        <select 
                            onChange={(e) => {
                                setSelectedValue(e.target.value);
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
                        <button onClick={UserActivityRegister} className="user-activity-vaccine_button btn-primary">
                            ลงทะเบียน
                        </button>
                    </div>
                        
                </div>
            </div>
        </div>

    )
} 

export default UserActivityDetail;