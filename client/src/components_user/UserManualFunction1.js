import React, { useState } from 'react';
import "../css/UserManual.css";
import "../css/Component.css";
import { Document, Page, pdfjs } from 'react-pdf';
import NavbarUserComponent from './NavbarComponent';
import user_manual from "../user_manual/HCU_Admin_Manual.pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const UserManualFunction1 = (props) =>{

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
                        <h3 className="center">ขั้นตอนการลงทะเบียน</h3>
                        {/* <object 
                            type="application/pdf"
                            data={user_manual}
                            width={"100%"}
                            height={500}
                          
                        ></object> */}
                         {/* <Document
                            file={user_manual}
                            onLoadSuccess={onDocumentLoadSuccess}
                            width={"100%"}
                            className="pdf-document"
                          
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={400}
                                    height={100}
                                    
                                    
                                />
                            ))}
                        </Document> */}


                        <iframe src="https://drive.google.com/file/d/1uqK8uWdra5w_Aja390tOPd45WhZhXLX8/preview" width="100%" height="500px" />
                    

                </div>        
            </div>
        </div>

    )
} 

export default UserManualFunction1;