import { useState, useEffect } from "react";
import CalendarUserComponent from "./CalendarUserComponent";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarUserComponent';


const ExampleComponent = (props) => {


    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>การนัดหมาย</h2>
                        <h3>รายการนัดหมาย</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="profile">
                    <CalendarUserComponent/>
                </div>
            </div>
         
           
            
        </div>

    );
}

export default ExampleComponent;