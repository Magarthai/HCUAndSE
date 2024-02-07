import React from "react";
import "../css/UserQueue.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarComponent';

const UserQueue = (props) => {

    

    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>ติดตามคิว</h2>
                    </div>

                    <NavbarUserComponent/>
            </header>

            <div className="user-body">
                <div className="user-queue_container">
                    <div className="user-queue_title gap-16">
                        <h3>กิจกรรม</h3>
                    </div>

                    <div className="user-queue_ticket_container">
                        <div className="user-queue_ticket_waitingQ_container">
                            <div className="user-queue_ticket_waitingQ_text center">
                                <h4>โครงการฉีดวัคซีน</h4>
                                <p className="textBody-big" id="user-queue_waitingQ_text">จำนวนคิวที่รอ</p>
                                <p className="textQ" id="user-queue_waitingQ_number">2</p>
                                <p className="textBody-big">คิว</p>
                            </div>
                        </div>

                        <div className="user-queue_ticket_myQ_container center">
                            <div className="user-queue_ticket_myQ_text center">
                                <h5 className="myQ_text">คิวของฉัน</h5>
                                <p className="textQ2 myQ_text">A012</p>
                            </div>

                            <div className="user-queue_ticket_myQ_circle"></div>
                        </div>
                    </div>
                </div>
            </div>
         
           
            
        </div>

    );
}

export default UserQueue;