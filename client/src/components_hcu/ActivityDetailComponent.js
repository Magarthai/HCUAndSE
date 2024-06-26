import { useEffect, useState } from "react";
import "../css/UserActivityDetail.css";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import activity1 from "../picture/activity1.png";
import Swal from "sweetalert2";
import NavbarUserComponent from './NavbarComponent';
import { useLocation, useNavigate } from "react-router-dom";


const ActivityDetail = (props) =>{
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "",
        endQueueDate: "",
        id: "",
        imageURL: "",
        openQueueDate: "",
        queueStatus: "",
        editDetial: "",
    });
    const [timeSlots, setTimeSlots] = useState([
        { date: "", startTime: "", endTime: "", registeredCount: "" }
    ]);
    const [imgSrc, setImgSrc] = useState(null);
    const { activities } = location.state || {};
    const { editDetial,activityName, activityDetail, activityType, endQueueDate, id, imageURL, openQueueDate } = state
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
                endQueueDate: activities.endQueueDate || "",
                id: activities.id || "",
                imageURL: activities.imageURL || "",
                openQueueDate: activities.openQueueDate || "",
                queueStatus: activities.queueStatus || "",
                editDetial:activities.editDetial || "",
            });
            setTimeSlots(activities.timeSlots)
            setImgSrc(activities.imageURL)
            console.log(activities, "activities")
        }
    }, [user]);
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-GB', options);
        return formattedDate;
      };

    return (

        <div className="user">

            <div >
                <div>
                    <img  className="user-activity-vaccine_image1" alt="" src={imgSrc}/>
                </div>
                <div className="user-body-activity-detail">
                    <div className="user-activity-vaccine_title_container">
                        <h3 className="admin-activity-name1">รายการกิจกรรม :&nbsp;{activityName}</h3>
                    </div>

                    <div className="user-activity-vaccine_date_container">
                        <h5>วันที่เปิดลงทะเบียน</h5>
                        <p className="textBody-medium colorPrimary-800" >
                            {formatDate(activities.openQueueDate)} - {formatDate(activities.endQueueDate)}
                        </p>
                    </div>

                    <div className="user-activity-vaccine_detail_container">
                        <h5>รายละเอียด</h5>
                        <p className="textBody-medium" style={{width:"100%"}}>
                            {activityDetail}
                        </p>
                    </div>
                {editDetial && 
                    <div className="user-activity-vaccine_detail_container">
                        <h5>รายละเอียดที่แก้ไขเพิ่มเติม</h5>
                        <p className="textBody-medium" style={{color:"red"}}>
                            {editDetial}
                        </p>
                    </div>
                    }
                    <div className="user-activity-vaccine_date_container">
                        <h5>วันที่</h5>
                        <select className="user-activity-vaccine_date">
                        <option hidden>กรุณาเลือกช่วงเวลา</option>
                        {timeSlots.map((slot, index) => (
                            <option key={index} value={index}>
                                {`${slot.date} (${slot.startTime}-${slot.endTime})`}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div className="user-activity-vaccine_button_container">
                        <a href="/adminActivityAllComponent" role="button"  target="_parent" className="btn btn-primary">
                            ย้อนกลับ
                        </a>
                    </div>
                        
                </div>
            </div>
        </div>

    )
} 

export default ActivityDetail;