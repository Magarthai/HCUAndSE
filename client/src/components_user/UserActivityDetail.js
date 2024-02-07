import React from "react";
import "../css/UserActivityDetail.css";
import "../css/Component.css";
import activity1 from "../picture/activity1.png";
import Swal from "sweetalert2";
import NavbarUserComponent from './NavbarComponent';

const UserActivityDetail = (props) =>{

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
                window.location = "http://localhost:3000/activity";
            });
            }
        })
    }

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
                    <img  className="user-activity-vaccine_image" alt="" src={activity1}/>
                </div>

                <div className="user-body-activity-detail">
                    <div className="user-activity-vaccine_title_container">
                        <h3>รายการกิจกรรม</h3>
                    </div>

                    <div className="user-activity-vaccine_detail_container">
                        <h5>รายละเอียด</h5>
                        <p className="textBody-medium">
                            รายละเอียดกิจกรรมฉีดวัคซีน
                        </p>
                    </div>

                    <div className="user-activity-vaccine_date_container">
                        <h5>วันที่</h5>
                        <select className="user-activity-vaccine_date" >
                            <option hidden>กรุณาเลือกช่วงเวลา</option>
                            <option>20/12/2023 (9:00-12:00)</option>
                            <option>20/12/2023 (13:00-16:00)</option>
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