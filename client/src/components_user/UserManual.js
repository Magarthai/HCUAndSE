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
                            <h4 style={{margin:0}}>ขั้นตอนการลงทะเบียน</h4>
                        </a>
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function2" target="_parent">
                            <h4 style={{margin:0}}>ขั้นตอนการขอ/แก้ไข/ยกเลิกนัดหมาย</h4>
                        </a>
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function3" target="_parent">
                            <h4 style={{margin:0}}>ขั้นตอนการลงทะเบียนกิจกรรม</h4>
                        </a>
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function4" target="_parent">
                            <h4 style={{margin:0}}>ขั้นตอนการรับคิวกิจกรรม/ดูสถานะคิว</h4>
                        </a>
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function5" target="_parent">
                            <h4 style={{margin:0}} >ขั้นตอนดูช่วงเวลาเข้าทําการแพทย์</h4>
                        </a>
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function6" target="_parent">
                            <h4 style={{margin:0}}>ขั้นตอนดูตำแหน่งที่ตั้ง</h4>
                        </a>
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function7" target="_parent">
                            <h4 style={{margin:0}}>ขั้นตอนดูข้อมูลทั่วไป</h4>
                        </a>
                        <a className="user-Manual_list gap-16 colorNeutralBlue-50" href="/manual/function8" target="_parent">
                            <h4 style={{margin:0}}>ขั้นตอนประเมินความพึงพอใจ</h4>
                        </a>

                </div>        
            </div>
        </div>

    )
} 

export default UserManual;