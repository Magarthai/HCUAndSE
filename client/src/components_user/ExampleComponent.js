import { useState, useEffect } from "react";

import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarComponent';


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

            </div>
         
           
            
        </div>

    );
}

export default ExampleComponent;