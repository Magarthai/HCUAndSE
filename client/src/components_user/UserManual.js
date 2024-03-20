import React from "react";
import "../css/UserManual.css";
import "../css/Component.css";
import NavbarUserComponent from '../components_user/NavbarComponent';


const UserManual = (props) =>{

    return (

        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>คู่มือการใช้งาน</h2>
                    
                    </div>
                    <NavbarUserComponent/>
            </header>

            <div className="user-body">
                <div className="user-Manual_container colorNeutralBlue-50">
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function1" target="_parent">
                            <h3>ขั้นตอนการลงทะเบียน</h3>
                        </a>
                        <div className="user-Manual_list gap-16">
                            <h3>ขั้นตอนการขอ/แก้ไข/ยกเลิกนัดหมาย</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>ขั้นตอนการลงทะเบียนกิจกรรม</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>ขั้นตอนการรับคิวกิจกรรม/ดูสถานะคิว</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>ขั้นตอนดูช่วงเวลาเข้าทําการแพทย์</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>ขั้นตอนดูตำแหน่งที่ตั้ง</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>ขั้นตอนดูข้อมูลทั่วไป</h3>
                        </div>
                        <div className="user-Manual_list">
                            <h3>ขั้นตอนประเมินความพึงพอใจ</h3>
                        </div>

                </div>        
            </div>
        </div>

    )
} 

export default UserManual;