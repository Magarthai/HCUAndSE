import React from "react";
import "../css/UserActivityDetail.css";
import "../css/Component.css";
import activity1 from "../picture/activity1.png";
import Swal from "sweetalert2";
import NavbarUserComponent from './NavbarComponent';

const ActivityDetail = (props) =>{

    return (

        <div className="user">

            <div >
                <div>
                    <img  className="user-activity-vaccine_image1" alt="" src={activity1}/>
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