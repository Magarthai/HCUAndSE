import React from "react";
import "../css/UserActivity.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarComponent';
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import Ticket_icon from "../picture/icon_ticket.png"
import Ticket_disabled_icon from "../picture/icon_ticket_disabled.png"
import Swal from "sweetalert2";


const UserActivity = (props) => {

    function toActivityVaccine(){
        window.location = "http://localhost:3000/activitty/detail";
    }

    const UserActivityGetQ = () => {
        Swal.fire({
            title: "รับคิว",
            html: "โครงการฉีดวัคซีนไข้หวัดใหญ่ตามฤดูกาล 2566<br>วันที่ 20/12/2023 (09.00-12.00)",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "รับคิว",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
            Swal.fire({
                title: "รับคิวสำเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง",
            }).then(function() {
                window.location = "http://localhost:3000/queue";
            });
            }
        })
    }

    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>กิจกรรม</h2>
                        <h3>กิจกรรมทั้งหมด</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>

            <div className="user-body">
                <div className="user-Activity_container">
                    <div className="user-Activity_title gap-16">
                        <h3>รายการกิจกรรม</h3>
                    </div>

                    <div className="user-Activity_tab_container">
                            <input type="radio" className="user-Activity_tab_radio" id="user-Activity_all" name="user-activity" checked/> 
                            <label for="user-Activity_all" className="user-Activity_label center" id="user-Activitty_tab_all">
                                <h4>ทั้งหมด</h4>
                            </label>
                            <div className="user-Activity_tab_all_content">
                                <div className="user-Activity_card gap-16" onClick={toActivityVaccine}>
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                </div>

                                <div className="user-Activity_card gap-16" onClick={toActivityVaccine}>
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                </div>

                                <div className="user-Activity_card gap-16" onClick={toActivityVaccine}>
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                </div>

                                <div className="user-Activity_card gap-16" onClick={toActivityVaccine}>
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                </div>

                                <div className="user-Activity_card gap-16" onClick={toActivityVaccine}>
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                </div>

                                <div className="user-Activity_card gap-16" onClick={toActivityVaccine}>
                                    <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                    <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                    <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                </div>
                            </div>

                            <input type="radio" className="user-Activity_tab_radio" id="user-Activity_registed" name="user-activity"/> 
                            <label for="user-Activity_registed" className="user-Activity_label center" id="user-Activitty_tab_registed">
                                <h4>ลงทะเบียนแล้ว</h4>
                            </label>
                            <div className="user-Activity_tab_all_content">
                                <div className="user-Activity_card_registed_container gap-16">
                                    <div className="gap-16" id="user-Activity_card-registed">
                                        <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่ 2567</h4>
                                        <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                        <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                    </div>
                                    <button className="user-Activity_ticket_btn" onClick={UserActivityGetQ}>
                                        <img className="gap-8" src={Ticket_icon} alt=""/>
                                        <p className="textBody-small user-Activity_ticket_text">รับคิว</p>
                                    </button>
                                </div>

                                <div className="user-Activity_card_registed_container gap-16">
                                    <div className="gap-16" id="user-Activity_card-registed">
                                        <h4>โครงการฉีดวัคชีนไข้หวัดใหญ่</h4>
                                        <p className="textBody-medium" id="user-Activity_card_date"> <img src={CalendarFlat_icon} alt=""/>  14/12/2023</p>
                                        <p className="textBody-medium" id="user-Activity_card_time"> <img src={ClockFlat_icon} alt=""/>  10:01 - 10:06</p>
                                    </div>
                                    <button className="user-Activity_ticket_btn" id="user-ticket_disabled">
                                        <img className="gap-8" src={Ticket_disabled_icon} alt=""/>
                                        <p className="textBody-small user-Activity_ticket_text">รับคิว</p>
                                    </button>
                                </div>


                            </div>
                    </div>
                </div>
            </div>
         
           
            
        </div>

    );
}

export default UserActivity;