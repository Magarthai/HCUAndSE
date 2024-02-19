import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";


const ErrorPage = (props) => {
    

    return (
        <div className="errorpage colorPrimary-800">
            <p style={{fontSize:"100px", padding:0,margin:0}}>404</p>
            <p style={{fontSize:"30px"}}> OOPS! NOTHING WAS FOUND</p>
            <p>The page you are might have been removed had its name changed or is temporarily unavaible. <a style={{textDecoration:"underline", cursor:"pointer"}}>Return to login</a></p>
        </div>

    );
}

export default ErrorPage;