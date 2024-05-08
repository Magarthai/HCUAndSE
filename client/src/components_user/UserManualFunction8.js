import React, { useState } from 'react';
import "../css/UserManual.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarComponent';
import user_manual from "../user_manual/HCU_Admin_Manual.pdf";
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const UserManualFunction8 = (props) =>{

    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    
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
                        <h3 className="center">ขั้นตอนประเมินความพึงพอใจ</h3>
               

                        <iframe src="https://drive.google.com/file/d/1qoDQHymz5INQ0fDoCw4G4LPcDtoAL3gG/preview" width="100%" height="500px" />
                    

                </div>        
            </div>
        </div>

    )
} 

export default UserManualFunction8;