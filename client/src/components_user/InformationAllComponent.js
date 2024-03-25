import { useState, useEffect } from "react";
import "../css/Login&SignupComponent.css";
import "../css/UserInformationComponent.css";
import NavbarUserComponent from './NavbarComponent';
import HCU from "../picture/HCU.jpg"
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const InformationAllComponent = (props) => {
    const navigate = useNavigate();
    const [information, setInformation] = useState([]);
    const [check,setChcek] = useState(false);
    useEffect(() => {
        if(!check) {
        fetchData();
        setChcek(true);
        }
    })

    const REACT_APP_MONGO_API = process.env.REACT_APP_MONGO_API
    const fetchData = async() => {
        console.log("XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
        const respone = await axios.get(`${REACT_APP_MONGO_API}/api/getAllInformation`)
        if(respone.data) {
            setInformation(respone.data)
            console.log(respone.data,"dataaaaaaa");
        }
    }

    const PreviewInformation = (informations) => {
        if (informations) {
        navigate('/information/preview', { state: { information: informations } });
        }
    }

    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>ข้อมูลทั่วไป</h2>
                        {/* <h3>รายการนัดหมาย</h3> */}
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="user-body-infomation colorPrimary-800">
                    <h3>ข้อมูลทั่วไป</h3>
                    {information.map((information, index) => (
                    <a onClick={() => PreviewInformation(information)} className="user-card-infornation-flexbox" style={{textDecoration:"none", cursor:"pointer"}}>
                        <div className="user-card-infornation-box-img">
                            <img src={information.image}/>
                        </div>
                        <div className="user-card-infornation-box-name">
                            <p>{information.informationName}</p>
                        </div>
                    </a>
                    ))}
                </div>
                
                
            </div>
         
           
            
        </div>

    );
}

export default InformationAllComponent;