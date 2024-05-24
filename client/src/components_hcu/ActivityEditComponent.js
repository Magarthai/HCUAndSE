import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import img_activity from "../picture/img-activity.png";
import calendarFlat_icon from "../picture/calendar-flat.png";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Swal from "sweetalert2";
import { addDoc,doc, updateDoc } from "firebase/firestore";
import axios from "axios";
import { setDoc } from 'firebase/firestore';
import { ref, uploadBytes,getStorage, getDownloadURL } from 'firebase/storage';
import item4 from "../picture/close.png";
const ActivityEditComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const REACT_APP_API = process.env.REACT_APP_API
    const navigate = useNavigate();
    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "",
        endQueueDate: "",
        id: "",
        imageURL: "",
        openQueueDate: "",
        timeSlots: "",
        totalRegisteredCount: "",
        editDetial: "",
        checkEndDate: "",
    });
    const checkCurrentDate = getCurrentDate();
    const location = useLocation();
    const { activities } = location.state || {};
    const { editDetial,activityName, activityDetail, activityType, endQueueDate, id, imageURL, openQueueDate } = state

    const inputValue = (name) => (event) => {
        if (name === 'activityDetail') {
          const value = event.target.value;
          if (value.length <= 10 * 1024 * 1024) {
            setState({ ...state, [name]: value });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Limit Exceeded',
              text: 'Activity detail should not exceed 10 MB',
            });
          }
        } else if (name === 'openQueueDate') {
            const endQueueDate = state.endQueueDate;
        if(endQueueDate != ""){
            if (event.target.value > endQueueDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date',
                    text: 'ช่วงเวลาเปิดลงทะเบียนควรอยู่ก่อนวันเปิด',
                });
                setState({ ...state, [name]: "" });
                
            } else {
                setState({ ...state, [name]: event.target.value });
            }
        }
        } else if (name === 'endQueueDate') {

            const checkEndDate = state.checkEndDate;
            
            if (event.target.value < checkEndDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date',
                    text: 'ขยายเวลาเปิดกิจกรรมได้อย่างเดียว',
                });
                setState({ ...state, [name]: "" });
                
            } else {
                setState({ ...state, [name]: event.target.value });
            }
        
        } else {
          setState({ ...state, [name]: event.target.value });
        }
      };
    
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        console.log(checkCurrentDate,"checkCurrentDate")
        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };
        if (!activities) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่มีข้อมูลกิจกรรม',
                confirmButtonColor: '#263A50',
                customClass: {

                    confirmButton: 'custom-confirm-button',
                }
            }).then(() => {
                navigate('/adminActivityAllComponent');
            });
        } else {
            setState({
                activityName: activities.activityName || "",
                activityDetail: activities.activityDetail || "",
                activityType: activities.activityType || "",
                endQueueDate: activities.endQueueDate || "",
                id: activities.id || "",
                imageURL: activities.imageURL || "",
                openQueueDate: activities.openQueueDate || "",
                queueStatus: activities.queueStatus || "",
                checkEndDate: activities.endQueueDate || "",
            });
            setTimeSlots(activities.timeSlots)
            setImgSrc(activities.imageURL)
            console.log(activities, "activities")
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
    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            if(activityName.length > 70) {
                Swal.fire({
                    title: 'สร้างไม่สําเร็จ',
                    html: 'ห้ามใส่ชื่อกิจกรรมเกิน 70 ตัวอักษร!',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        cancelButton: 'custom-cancel-button',
                    },
                });
                return;
            }
            const activitiesCollection = doc(db, 'activities', id);
            const activityStatusForCurrentDate = timeSlots.some(slot => slot.date >= checkCurrentDate);
            console.log(activityStatusForCurrentDate,checkCurrentDate)
            const storage = getStorage();
          
            const fileInput = document.querySelector('.input-activity-img');
            const file = fileInput?.files[0];
            const wrongTimeInput = timeSlots.some(item => {
                const startTime = new Date(`2000-01-01T${item.startTime}`);
                const endTime = new Date(`2000-01-01T${item.endTime}`);
        
                return startTime >= endTime;
              })
              
              const lowerChecker = timeSlots.some(item => {
                const a = parseInt(item.registeredCountCheck)
                const b = parseInt(item.registeredCount)
                return b < a
              });
              console.log(timeSlots)
              
              const wrongDateInput = timeSlots.some(item => {
                const startDate = new Date(item.date);
                const EndRegisterActivity = new Date(endQueueDate);
                return startDate < EndRegisterActivity;
              })
              if (lowerChecker) {
                Swal.fire({
                    title: 'สร้างไม่สําเร็จ',
                    html: 'แก้จํานวนคนในกิจกรรมน้อยกว่าเดิม บางจุด',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                      cancelButton: 'custom-cancel-button',
                    },
                  });
                  return;
              }
              if (wrongTimeInput) {
                Swal.fire({
                    title: 'สร้างไม่สําเร็จ',
                    html: 'ใส่ช่วงเวลาจัดกิจกรรมผิด',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                      cancelButton: 'custom-cancel-button',
                    },
                  });
                  return;
              }
              if (wrongDateInput) {
                Swal.fire({
                    title: 'สร้างไม่สําเร็จ',
                    html: 'ใส่ช่วงวันจัดกิจกรรมผิด',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                      cancelButton: 'custom-cancel-button',
                    },
                  });
                  return;
              }
              const updatedTimeSlotsInput = timeSlots.map(item => ({
                ...item,
                registeredCount: parseInt(item.registeredCount)
            }));
                const wrongInput = updatedTimeSlotsInput.some(item => {
                    const count = item.registeredCount;
                    return !Number.isInteger(count) || count <= 0;
                });
                if(wrongInput) {
                    Swal.fire({
                        title: 'สร้างไม่สําเร็จ',
                        html: 'ต้องใส่จํานวนผู้ลงทะเบียนมากกว่า 0 คน',
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            cancelButton: 'custom-cancel-button',
                        },
                    });
                    return;
                }

            if (file) {
                
                const fileType = file.type.split("/")[0];
                if (fileType !== "image") {
                  throw new Error("ไฟล์ที่อัปโหลดไม่ใช่รูปภาพ");
                }
                const allowedExtensions = ["jpg", "jpeg", "png"];
                const fileExtension = file.name.split(".").pop().toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    throw new Error("ไฟล์ที่อัปโหลดมีนามสกุลไม่ถูกต้อง");
                }
    
                const maxSize = 5242880; // รูปขนาดไม่เกิน 5 mb
                if (file.size > maxSize) {
                    throw new Error("ไฟล์ที่อัปโหลดมีขนาดใหญ่เกินไป");
                }
                
    
                const newFileName = `${uuidv4()}.${fileExtension}`;
                const storageRef = ref(storage, `activity_images/${newFileName}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                if (!downloadURL.startsWith("https://firebasestorage.googleapis.com/")) {
                    throw new Error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
                }
                const hasTimeSlotForCurrentDate = updatedTimeSlotsInput.some(slot => slot.date === checkCurrentDate);
                const date1 = new Date(endQueueDate)
                const date2 = new Date(checkCurrentDate)
                if (date1 >= date2) {
                    console.log(`${date1} is greater than or equal to ${date2}`);
                } else {
                    console.log(`${date1} is less than ${date2}`);
                }
                const activityStatusForCurrentDate = date1 >= date2;
                console.log(activityStatusForCurrentDate)
                const updatedTimeSlots = updatedTimeSlotsInput.map(item => ({
                    ...item,
                    registeredCountCheck: item.registeredCount
                }));
                const activityInfo = {
                    activityName: activityName,
                    activityDetail: activityDetail,
                    activityType: activityType,
                    openQueueDate: openQueueDate,
                    endQueueDate: endQueueDate,
                    timeSlots: updatedTimeSlots,
                    totalRegisteredCount: totalRegisteredCount,
                    imageURL: downloadURL,
                    queueStatus: hasTimeSlotForCurrentDate ? "open" : "close",
                    activityStatus: activityStatusForCurrentDate ? "open" : "close",
                };
              
                Swal.fire({
                    title: 'ขอแก้ไขนัดหมาย',
                    html: `ตกลงที่จะแก้ไขกิจกรรม : ${activityName} <br/>จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด : ${totalRegisteredCount}<br/>`,
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
                        await updateDoc(activitiesCollection, activityInfo);
                        await setDoc(doc(db, 'activities', id), { imageURL: downloadURL, activityType: activityType }, { merge: true });
                        try {
                            const data = {
                                id:id,
                                editDetial:editDetial,
                            }
                            const respone = axios.post(`${REACT_APP_API}/api/NotificationEditActivity`,data);
                        } catch(err) {
                            console.error(err)
                        }
                        Swal.fire({
                            title: 'แก้ไขกิจกรรมสําเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            },
                        });
                        
                        navigate('/adminActivityOpenRegisterComponent', { replace: true, state: {} });
                    } else {
                        Swal.fire({
                            title: 'แก้ไขไม่สําเร็จ',
                            icon: 'error',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                cancelButton: 'custom-cancel-button',
                            },
                        });
                    }
                });
            } else {
                const updatedTimeSlots = timeSlots.map(item => ({
                    ...item,
                    registeredCountCheck: item.registeredCount
                }));
                const hasTimeSlotForCurrentDate = timeSlots.some(slot => slot.date === checkCurrentDate);
        const date1 = new Date(openQueueDate);
        const date2 = new Date(checkCurrentDate);
        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);

        const activityStatusForCurrentDate = date1.getDate() <= date2.getDate() && date1.getMonth() === date2.getMonth();


        console.log(activityStatusForCurrentDate, date2, date1,checkCurrentDate,openQueueDate);
                console.log(activityStatusForCurrentDate)
                    const activityInfo = {
                    activityName: activityName,
                    activityDetail: activityDetail,
                    activityType: activityType,
                    openQueueDate: openQueueDate,
                    endQueueDate: endQueueDate,
                    timeSlots: updatedTimeSlots,
                    totalRegisteredCount: totalRegisteredCount,
                    imageURL: imageURL,
                    queueStatus: hasTimeSlotForCurrentDate ? "open" : "close",
                    activityStatus: activityStatusForCurrentDate ? "open" : "close",
                    };
                Swal.fire({
                    title: 'ขอแก้ไขนัดหมาย',
                    html: `ตกลงที่จะแก้ไขกิจกรรม : ${activityName} <br/>จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด : ${totalRegisteredCount}<br/>`,
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
                        await updateDoc(activitiesCollection, activityInfo);
                        try {
                            const data = {
                                id:id,
                                editDetial:editDetial,
                            }
                            const respone = axios.post(`${REACT_APP_API}/api/NotificationEditActivity`,data);
                        } catch(err) {
                            console.error(err)
                        }
                        Swal.fire({
                            title: 'แก้ไขกิจกรรมสําเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            },
                        }).then(() => {
                            window.location.href = '/adminActivityTodayComponent';
                        });
                        
                    } else {
                        Swal.fire({
                            title: 'แก้ไขไม่สําเร็จ',
                            icon: 'error',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                cancelButton: 'custom-cancel-button',
                            },
                        });
                    }
                });
            }
        } catch (firebaseError) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: firebaseError,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                },
            });
            console.error('Firebase signup error:', firebaseError);
        }
    };
    
      

    let adminActivityQueueElements = document.querySelectorAll('.admin-activity-queue');

    function handleCardClick(event) {
        adminActivityQueueElements.forEach(btn => btn.classList.remove('focus'));
        event.currentTarget.classList.add('focus');
    }

    adminActivityQueueElements.forEach(btn => {
        btn.addEventListener('click', handleCardClick);
    });


    const [timeSlots, setTimeSlots] = useState([
        { date: "", startTime: "", endTime: "", registeredCount: "" ,queueOpen: "no",SuccessList:[], queueCount: 0,checkEndDate: "",}
    ]);

    const addNewData = (event) => {
        event.preventDefault();
        setTimeSlots([...timeSlots, { date: "", startTime: "", endTime: "", registeredCount: "" ,SuccessList:[],queueOpen: "no", queueCount: 0,checkEndDate: "",}]);
    };

    const handleInputChange = (index, name) => (event) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index][name] = event.target.value;
        setTimeSlots(newTimeSlots);
    };

    const removeData = (event, index) => {
        event.preventDefault();
        const newTimeSlots = [...timeSlots];
        newTimeSlots.splice(index, 1);
        setTimeSlots(newTimeSlots);
    };

    const [imgSrc, setImgSrc] = useState(null);

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
    const renderTimeSlots = () => {
        return timeSlots.map((timeSlot, index) => (
            <div key={index} className="cardAddActivity">
                <div style={{display:"flex"}}>
                    <label className="admin-textBody-large colorPrimary-800">วันที่<span className="colorRed">*</span>
                    </label>
                    <div className="admin-right" style={{ flex: 1, justifyContent: 'flex-end'}}>
                        <img className="PopupCloseBtn" src={item4} alt="icon-close" onClick={(event) => removeData(event, index)} style={{cursor:"pointer"}}/>
                    </div>
                </div>
                <input
                    type="date"
                    className="form-control"
                    placeholder="dd/mm/yyyy"
                    value={timeSlot.date}
                    onChange={handleInputChange(index, "date")}
                    style={{width:"325px"}}
                />
                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลา<span className="colorRed">*</span></label><br />
                <input
                    type="text"
                    className="form-control timeable"
                    placeholder="00:00"
                    pattern="([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}"
                    value={timeSlot.startTime}
                    // onChange={handleInputChange(index, "startTime")}
                    onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, ""); 
                        if (input.length <= 4) { 
                            let formattedValue = input;
                            if (input.length > 1) {
                                const hours = input.slice(0, 2);
                                const minutes = input.slice(2);
                                const parsedHours = parseInt(hours, 10);
                                const parsedMinutes = parseInt(minutes, 10);
                                if (parsedHours < 24 && parsedMinutes < 60) {
                                    formattedValue = `${hours}:${minutes}`;
                                } else if (parsedHours >= 24) {
                                    formattedValue = '23:';
                                } else if (parsedMinutes >= 60) {
                                    formattedValue = `${hours}:59`;
                                }
                            }
                            const updatedTimeSlots = timeSlots.map((slot, idx) => idx === index ? { ...slot, startTime: formattedValue } : slot);
                            setTimeSlots(updatedTimeSlots);
                            handleInputChange(index, "startTime")
                        }
                    }}
                />
                <span className="admin-textBody-large"> ถึง </span>
                <input
                    type="text"
                    className="form-control timeable"
                    placeholder="00:00"
                    pattern="([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}"
                    value={timeSlot.endTime}
                    // onChange={handleInputChange(index, "endTime")}
                    onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, ""); 
                        if (input.length <= 4) { 
                            let formattedValue = input;
                            if (input.length > 1) {
                                const hours = input.slice(0, 2);
                                const minutes = input.slice(2);
                                const parsedHours = parseInt(hours, 10);
                                const parsedMinutes = parseInt(minutes, 10);
                                if (parsedHours < 24 && parsedMinutes < 60) {
                                    formattedValue = `${hours}:${minutes}`;
                                } else if (parsedHours >= 24) {
                                    formattedValue = '23:';
                                } else if (parsedMinutes >= 60) {
                                    formattedValue = `${hours}:59`;
                                }
                            }
                            const updatedTimeSlots = timeSlots.map((slot, idx) => idx === index ? { ...slot, endTime: formattedValue } : slot);
                            setTimeSlots(updatedTimeSlots);
                            handleInputChange(index, "endTime")
                        }
                    }}
                />
                <br></br>
                <label className="admin-textBody-large colorPrimary-800">จำนวนผู้ลงทะเบียน<span className="colorRed">*</span></label><br></br>
                <input
                    type="number"
                    className="form-control timeable"
                    placeholder="40"
                    value={timeSlot.registeredCount}
                    onChange={handleInputChange(index, "registeredCount")}
                />
                <span className="admin-textBody-large"> คน</span>
                {/* <div className="admin-right">
                    <button onClick={(event) => removeData(event, index)} className="admin-activity-remove-btn">ลบช่วงเวลา</button>
                </div> */}

            </div>
        ));
    };


    const handleRadioChange = inputValue('activityType');
    const totalRegisteredCount = timeSlots.reduce((sum, timeSlot) => {
        return sum + (parseInt(timeSlot.registeredCount, 10) || 0);
      }, 0);
    return (

        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">ระบบการจัดการกิจกรรม</h1>
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
                                 <div className="admin-img-activity-box">
                                <img
                                    src={imgSrc || imageURL}
                                    className="admin-img-activity"
                                    alt={imgSrc ? "Selected Activity Image" : imageURL}
                                />
                                 </div>
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
                                        <label className="admin-textBody-large colorPrimary-800">ชื่อกิจกรรม</label>
                                        <input type="text" className="form-control" value={activityName} onChange={inputValue("activityName")} placeholder="Activity" />
                                        {activityName.length > 70 ? <div style={{display:"flex",color:"red",justifyContent:"flex-end"}}>{activityName.length}/70</div> : <div style={{display:"flex",color:"grey",justifyContent:"flex-end"}}>{activityName.length}/70</div>}
                                    </div>
                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800 acivity-detail">รายละเอียด</label>
                                        <textarea value={activityDetail} onChange={inputValue("activityDetail")} className="acivity-detail" rows="18"></textarea>
                                    </div>
                                </div>

                                {/* <div>
                                    <label className="admin-textBody-large colorPrimary-800">รูปแบบกิจกรรม</label>
                                    <input
                                    type="radio"
                                    className="btn-check"
                                    name="options"
                                    id="option1"
                                    autoComplete="off"
                                    value="yes"
                                    checked={activityType === 'yes'}
                                    onChange={handleRadioChange}
                                    />
                                    <label className={`admin-activity-queue ${activityType === 'yes' ? 'focus' : ''}`} htmlFor="option1">มีระบบคิว</label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="options"
                                        id="option2"
                                        autoComplete="off"
                                        value="no"
                                        checked={activityType === 'no'}
                                        onChange={handleRadioChange}
                                    />
                                    <label className={`admin-activity-queue ${activityType === 'no' ? 'focus' : ''}`} htmlFor="option2">ไม่มีระบบคิว</label>
                                </div> */}
                                <div className="admin-activity-form-register">
                                    <div className="admin-activity-form-register-box">
                                        <h2 className="colorPrimary-800" style={{marginBottom:"15px"}}>รูปแบบกิจกรรม<span className="colorRed">*</span></h2>
                                        <select
                                            className="form-select"
                                            style={{border:"1px solid #0a0f157a", width:"450px"}}
                                            value={activityType}
                                            onChange={handleRadioChange} // ใช้งานฟังก์ชันเดียวกันกับ radio buttons
                                        >
                                            <option value="yes">มีระบบคิว</option>
                                            <option value="no">ไม่มีระบบคิว</option>
                                        </select>
                                        <h2 className="colorPrimary-800">ช่วงวันเปิดกิจกรรมให้ลงทะเบียน<span className="colorRed">*</span></h2>
                                        <div>
                                            <input
                                                type="date"
                                                className="form-control admin-activity-input"
                                                placeholder="dd/mm/yyyy"
                                                onChange={(e) => {
                                                    inputValue("openQueueDate")(e);
                                                }}
                                                value={openQueueDate}
                                            />
                                            <span className="admin-textBody-large"> ถึง </span>
                                            <input
                                                type="date"
                                                className="form-control admin-activity-input"
                                                placeholder="dd/mm/yyyy"
                                                onChange={(e) => {
                                                    inputValue("endQueueDate")(e);
                                                }}
                                                value={endQueueDate}
                                            />
                                        </div>
                                        {/* <div>
                                            <label className="admin-textBody-large colorPrimary-800">จำนวนเปิดรับผู้ลงทะเบียนทั้งหมด</label><br></br>
                                            <input type="number" className="form-control timeable" placeholder="40" disabled value={totalRegisteredCount}/>
                                            <span className="admin-textBody-large"> คน</span>
                                        </div> */}
                                    </div>
                                    <div className="admin-activity-form-register-box border-L">
                                        <div className="admin-activity-container">
                                            <h2 className="colorPrimary-800 admin-activity-container-item">ช่วงเวลาจัดกิจกรรม</h2>
                                            <div className="admin-activity-container-item admin-right">
                                                <button className="admin-activity-container-btn" onClick={addNewData}>เพิ่มช่วงเวลา +</button>
                                            </div>
                                        </div>

                                        <br></br>

                                        <div id="container">
                                            {renderTimeSlots()}
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="admin-timetable-btn">
                                <button type="button" className="btn-secondary btn-systrm" onClick={() => window.history.back()} >กลับ</button>
                                <input type="submit" value="แก้ไขกิจกรรม" className="btn-primary btn-systrm" target="_parent" disabled={openQueueDate === "" || endQueueDate === "" || activityName === "" || activityDetail == "" ||timeSlots.some(slot => slot.date === "" || slot.startTime === "" || slot.endTime === "" || slot.registeredCount === "")}/>
                            </div>
                        </div>
                    </form>

                </div>

            </div>

        </div>

    );
}

export default ActivityEditComponent;