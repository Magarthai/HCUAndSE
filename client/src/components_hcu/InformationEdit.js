import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminTimeTableComponent.css";
import img_information from "../picture/img-activity.png";
import "../css/AdminInformation.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
const InformationEdit = (props) => {
    const { user, userData } = useUserAuth();
    const location = useLocation();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const navigate = useNavigate();
    const [state, setState] = useState({
        informationName: "",
        informationDetail: "",
        image: "",
    });
    const REACT_APP_MONGO_API = process.env.REACT_APP_MONGO_API
    const { information } = location.state || {};
    const {informationName, informationDetail,image} = state
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    }
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        const responsivescreen = () => {
        const innerWidth = window.innerWidth;
        const baseWidth = 1920;
        const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
        setZoomLevel(newZoomLevel);
        };
        if (!information) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่มีข้อมูลกิจกรรม',
                confirmButtonColor: '#263A50',
                customClass: {

                    confirmButton: 'custom-confirm-button',
                }
            }).then(() => {
                navigate('/adminInformationAll');
            });
        } else {
            setState({
                informationName: information.informationName,
                informationDetail: information.informationDetail,
                image: information.image
            });
        }
        responsivescreen();
        window.addEventListener("resize", responsivescreen);
        const updateShowTime = () => {
        const newTime = getShowTime();
        if (newTime !== showTime) {
            setShowTime(newTime);
        }
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };
  
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
    
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };
    
    }, [user]); 
    const containerStyle = {
        zoom: zoomLevel,
    };

    function getShowTime() {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    }

    function formatNumber(num) {
        return num < 10 ? "0" + num : num.toString();
    }

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    const [imgSrc, setImgSrc] = useState(null);

    const submitForm = async (e) => {
        e.preventDefault();
        const fileInput = document.querySelector('.input-activity-img');
        const file = fileInput?.files[0];
        if (file) {
            const allowedMimeTypes = ["image/jpeg", "image/png"];
                if (!allowedMimeTypes.includes(file.type)) {
                    throw new Error("ไฟล์ที่อัปโหลดไม่ใช่รูปภาพ");
                }

                // ตรวจสอบ magic number
                const imageSignatures = {
                    jpeg: [0xFF, 0xD8],
                    png: [0x89, 0x50, 0x4E, 0x47]
                };

                function checkFileSignature(file, signature) {
                    const reader = new FileReader();
                    reader.onload = function () {
                        const arr = new Uint8Array(reader.result).slice(0, signature.length);
                        if (!arr.every((byte, index) => byte === signature[index])) {
                            throw new Error("Signature ของไฟล์ไม่ถูกต้อง");
                        }
                    };
                    reader.readAsArrayBuffer(file);
                }

                let fileSignature = null;
                if (file.type === "image/jpeg") {
                    fileSignature = imageSignatures.jpeg;
                } else if (file.type === "image/png") {
                    fileSignature = imageSignatures.png;
                } else {
                    throw new Error("ไฟล์ที่อัปโหลดไม่ใช่รูปภาพ");
                }

                // เช็ค signature ของไฟล์
                checkFileSignature(file, fileSignature);

                // เพิ่มการตรวจสอบขนาดไฟล์และอัปโหลดไฟล์
                const maxSize = 5 * 1024 * 1024; // 5 MB
                if (file.size > maxSize) {
                    throw new Error("ไฟล์ที่อัปโหลดมีขนาดใหญ่เกินไป");
                }
        Swal.fire({
            title: 'สร้างบทความ',
            html: `ตกลงที่จะแก้บทความ : ${information.informationName} `,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#263A50',
            reverseButtons: true,
            customClass: {
              confirmButton: 'custom-confirm-button',
              cancelButton: 'custom-cancel-button',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const timestamp = Date.now();
                const fileNameWithTimestamp = `${file.name}-${timestamp}`;
                const storage = getStorage();
                const storageRef = ref(storage, `information_images/${fileNameWithTimestamp}`);
                try {
                    await uploadBytes(storageRef, file);
                } catch (error) {
                    console.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์:", error);
                    throw new Error("ไม่สามารถอัปโหลดไฟล์ได้");
                }
                
                const downloadURL = await getDownloadURL(storageRef);
                const info = {
                    informationName:informationName,
                    informationDetail:informationDetail,
                    image:downloadURL,
                    _id: information._id

                }
                const respone = await axios.post(`${REACT_APP_MONGO_API}/api/updateInformation`,info);
                console.log()
                if( respone.data == "success") {
                console.log(downloadURL)
              Swal.fire({
                title: 'สร้างบทความสําเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                  confirmButton: 'custom-confirm-button',
                },
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/adminInformationAll')
                }
              });
            } else {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                      confirmButton: 'custom-confirm-button',
                    },
                  })
            }
            }
        });
    } else {
        Swal.fire({
            title: 'สร้างบทความ',
            html: `ตกลงที่จะแก้บทความ : ${information.informationName} `,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#263A50',
            reverseButtons: true,
            customClass: {
              confirmButton: 'custom-confirm-button',
              cancelButton: 'custom-cancel-button',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const info = {
                    informationName:informationName,
                    informationDetail:informationDetail,
                    image:imgSrc,
                    _id: information._id
                }
                const respone = await axios.post(`${REACT_APP_MONGO_API}/api/updateInformation`,info)
                if( respone.data == "success") {
              Swal.fire({
                title: 'สร้างบทความสําเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                  confirmButton: 'custom-confirm-button',
                },
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/adminInformationAll')
                }
              });
            } else {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                      confirmButton: 'custom-confirm-button',
                    },
                  })
            }
            }
        });
        
    }
    
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };


    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">แก้ไขข้อมูลทั่วไป</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <div className="admin">
          
            
            <div className="admin-body">
                <form onSubmit={submitForm}>
                        <div className="admin-activity-add">
                            <div className="admin-activity-add-hearder-flexbox">
                                <div className="admin-activity-today-hearder-box">
                                    <img
                                        src={imgSrc || image}
                                        className="admin-img-activity"
                                        alt={imgSrc ? "Selected Activity Image" : img_information}
                                    />
                                    <br />
                                    <br />
                                    <div className="admin-right">
                                        <input
                                            type="file"
                                            className="form-control input-activity-img"
                                            accept="image/png, image/jpeg"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <div className="admin-activity-today-hearder-box admin-activity-form">
                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800">ชื่อบทความ</label>
                                        <input type="text" className="form-control" value={informationName} onChange={inputValue("informationName")} placeholder="Information" maxLength={70}/>
                                        {informationName.length > 70 ? <div style={{display:"flex",color:"red",justifyContent:"flex-end"}}>{informationName.length}/70</div> : <div style={{display:"flex",color:"grey",justifyContent:"flex-end"}}>{informationName.length}/70</div>}
                                    </div>
                                    
                                    <div>
                                    <label className="admin-textBody-large colorPrimary-800 acivity-detail">รายละเอียด</label>
                                    <textarea
                                        value={informationDetail}
                                        onChange={inputValue("informationDetail")}
                                        className="acivity-detail"
                                        rows="18"
                                    ></textarea>
                                    </div>
                                </div>
                                <div className="admin-timetable-btn" style={{width:"100%"}}>
                                    <button type="button" className="btn-secondary btn-systrm" onClick={() => window.history.back()} >กลับ</button>
                                    <input type="submit" value="แก้ไขข้อมูลทั่วไป" className="btn-primary btn-systrm" target="_parent" disabled={informationName === "" || informationDetail == ""}/>
                                </div>
                            </div>
                        </div>
                </form>
                
            </div>
           
        </div>
        
    </div>

    );
}

export default InformationEdit;