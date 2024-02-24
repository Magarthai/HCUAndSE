import { useEffect, useState } from "react";
import "../css/UserActivityDetail.css";
import "../css/Component.css";
import activity1 from "../picture/activity1.png";
import Swal from "sweetalert2";
import NavbarUserComponent from './NavbarComponent';
import { useUserAuth } from "../context/UserAuthContext";
import { useLocation, useNavigate } from "react-router-dom";
const UserActivityDetail = (props) =>{
    const { user, userData } = useUserAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "",
        endQueenDate: "",
        id: "",
        imageURL: "",
        openQueenDate: "",
        queenStatus: "",
    });
    const [timeSlots, setTimeSlots] = useState([
        { date: "", startTime: "", endTime: "", registeredCount: "" }
    ]);
    const [imgSrc, setImgSrc] = useState(null);
    const { activities } = location.state || {};
    const { activityName, activityDetail, activityType, endQueenDate, id, imageURL, openQueenDate } = state
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
                id: activities.id || "",
                imageURL: activities.imageURL || "",
                openQueenDate: activities.openQueenDate || "",
                queenStatus: activities.queenStatus || "",
            });
            setTimeSlots(activities.timeSlots)
            setImgSrc(activities.imageURL)
            console.log(activities, "activities")
        }
    }, [user]);

    const UserActivityRegister = () => {
        Swal.fire({
            title: "ลงทะเบียน",
            html: "โครงการฉีดวัคซีนไข้หวัดใหญ่ตามฤดูกาล 2566<br>วันที่ 20/12/2023 (09.00-12.00)",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "ลงทะเบียน",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                title: "ลงทะเบียนสำเร็จ",
                icon: "success",
                confirmButtonText: "กลับ",
            }).then(function() {
                navigate("/activity");
            });
            }
        })
    }
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