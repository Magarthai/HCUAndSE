import React from "react";
import "../css/UserManual.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarComponent';
import user_manual from "../user_manual/HCU_Admin_Manual.pdf";

const UserManualFunction2 = (props) =>{

    return (

        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>คู่มือการใช้งาน</h2>
                    
                    </div>
                    <NavbarUserComponent/>
            </header>

            <div className="user-body"> 
                <div className="user-Manual_container colorPrimary-800">
                        <h3 className="center">ขั้นตอนการขอ/แก้ไข/ยกเลิกนัดหมาย</h3>
                        <object 
                            type="application/pdf"
                            data={user_manual}
                            width={"100%"}
                            height={500}
                          
                        ></object>
                    

                </div>        
            </div>
        </div>

    )
} 

export default UserManualFunction2;