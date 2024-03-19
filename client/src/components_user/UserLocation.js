import { useState, useEffect } from "react";

import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarComponent';


const UserLocation = (props) => {
    const openGoogleMaps = () => {
        const latitude = 13.65155719244393;
        const longitude = 100.49312760270885;
        const label = "KMUTT+Health+Care+Unit+(HCU)";
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate&destination_place_id=${label}`, '_blank');
    };


    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>ตำแหน่งที่ตั้ง</h2>
                        <h3>KMUTT HCU</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d969.2760972726214!2d100.4932708!3d13.6514135!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a300219a7cbd%3A0x10d775055da1e4a8!2sKMUTT%20Health%20Care%20Unit%20(HCU)!5e0!3m2!1sth!2sth!4v1710829828765!5m2!1sth!2sth" 
                    width="90%" 
                    height="450" 
                    style={{ border: "0" , margin:"0 5%"}} 
                    allowFullScreen 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
                <button onClick={openGoogleMaps} role="button"  target="_parent" className="btn btn-primary" style={{margin:"0 5%", width:"90%"}}>นำทาง</button>
            </div>
         
           
            
        </div>

    );
}

export default UserLocation;