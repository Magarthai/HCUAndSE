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
                        <div className="user-Manual_list gap-16">
                            <h3>ขั้นตอนการลงทะเบียน</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>การขอทำนัดหมาย</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>การแก้ไขนัดหมาย</h3>
                        </div>
                        <div className="user-Manual_list gap-16">
                            <h3>การยกเลิกนัดหมาย</h3>
                        </div>
                        <div className="user-Manual_list">
                            <h3>การลงทะเบียนกิจกรรม</h3>
                        </div>
                </div>        
            </div>
        </div>

    )
} 

export default UserManual;