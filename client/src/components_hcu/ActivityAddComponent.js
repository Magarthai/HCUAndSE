import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import img_activity from "../picture/img-activity.png";
import calendarFlat_icon from "../picture/calendar-flat.png";
import Swal from "sweetalert2";
import { addDoc, doc } from "firebase/firestore";
import { setDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
import item4 from "../picture/close.png";
const ActivityAddComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const navigate = useNavigate();
    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "yes",
        openQueueDate: "",
        endQueueDate: "",
    });

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
            if (endQueueDate != "") {
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
            } else {
                setState({ ...state, [name]: event.target.value });
            }
        } else if (name === 'endQueueDate') {

            const openQueueDate = state.openQueueDate;

            if (event.target.value < openQueueDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date',
                    text: 'ช่วงเวลาลงทะเบียนวันสุดท้ายควรมากกว่าวันเปิด',
                });
                setState({ ...state, [name]: "" });

            } else {
                setState({ ...state, [name]: event.target.value });
            }

        } else {
            setState({ ...state, [name]: event.target.value });
        }
    };



    const { activityName, activityDetail, activityType, openQueueDate, endQueueDate } = state;

    const handleRadioChange = inputValue('activityType');

    useEffect(() => {
        console.log(openQueueDate);
    }, [openQueueDate]);


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
    const checkCurrentDate = getCurrentDate();
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            for (let index = 0; index < timeSlots.length; index++) {
                const currentTimeSlots = timeSlots[index];
                const sameDate = timeSlots.filter((timeSlot, idx) => idx !== index)
                                          .some(timeSlot => 
                                              timeSlot.date === currentTimeSlots.date &&
                                              timeSlot.startTime === currentTimeSlots.startTime &&
                                              timeSlot.endTime === currentTimeSlots.endTime
                                          );
                if (sameDate) {
                    await Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        html: `มีช่วงเวลาจัดกิจกรรมที่ซํ้ากัน ในช่วงเวลาที่ ${index+1}`,
                        showConfirmButton: true,
                        icon: 'warning',
                        confirmButtonText: 'ยืนยัน',
                        confirmButtonColor: '#263A50',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        },
                    });
                    return;
                }
            }

            for (let index = 0; index < timeSlots.length; index++) {
                const currentTimeSlots = timeSlots[index];
                const sameDate = timeSlots.filter((timeSlot, idx) => idx !== index)
                                          .some(timeSlot => 
                                              timeSlot.date === currentTimeSlots.date &&
                                              timeSlot.startTime === currentTimeSlots.startTime
                                          );
                if (sameDate) {
                    await Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        html: `มีช่วงเวลาเริ่มจัดกิจกรรมที่ซํ้ากัน ในช่วงเวลาที่ ${index+1}`,
                        showConfirmButton: true,
                        icon: 'warning',
                        confirmButtonText: 'ยืนยัน',
                        confirmButtonColor: '#263A50',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        },
                    });
                    return;
                }
            }
            
            for (let index = 0; index < timeSlots.length; index++) {
                const currentTimeSlots = timeSlots[index];
                const sameDate = timeSlots.filter((timeSlot, idx) => idx !== index)
                                          .some(timeSlot => 
                                              timeSlot.date === currentTimeSlots.date &&
                                              timeSlot.endTime === currentTimeSlots.endTime
                                          );
                if (sameDate) {
                    await Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        html: `มีช่วงเวลาสิ้นสุดจัดกิจกรรมที่ซํ้ากัน ในช่วงเวลาที่ ${index+1}`,
                        showConfirmButton: true,
                        icon: 'warning',
                        confirmButtonText: 'ยืนยัน',
                        confirmButtonColor: '#263A50',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        },
                    });
                    return;
                }
            }

            const activitiesCollection = collection(db, 'activities');
            
            const storage = getStorage();

            const fileInput = document.querySelector('.input-activity-img');
            const file = fileInput?.files[0];
            if (activityName.length > 70) {
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

                const storageRef = ref(storage, `activity_images/${file.name}`);

                try {
                    await uploadBytes(storageRef, file);
                } catch (error) {
                    console.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์:", error);
                    throw new Error("ไม่สามารถอัปโหลดไฟล์ได้");
                }

                const wrongTimeInput = timeSlots.some(item => {
                    const startTime = new Date(`2000-01-01T${item.startTime}`);
                    const endTime = new Date(`2000-01-01T${item.endTime}`);

                    return startTime >= endTime;
                });

                const wrongDateInput = timeSlots.some(item => {
                    const startDate = new Date(item.date);
                    const endRegisterActivity = new Date(endQueueDate);
                    return startDate < endRegisterActivity;
                });

                const updatedTimeSlots = timeSlots.map(item => ({
                    ...item,
                    registeredCount: parseInt(item.registeredCount)
                }));

                const wrongInput = updatedTimeSlots.some(item => {
                    const count = item.registeredCount;
                    return !Number.isInteger(count) || count <= 0;
                });
                if (wrongInput) {
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

                const downloadURL = await getDownloadURL(storageRef);
                const hasTimeSlotForCurrentDate = timeSlots.some(slot => slot.date === checkCurrentDate);
                const date1 = new Date(openQueueDate);
                const date2 = new Date(checkCurrentDate);
                date1.setHours(0, 0, 0, 0);
                date2.setHours(0, 0, 0, 0);
                
                const activityStatusForCurrentDate = date1.getDate() <= date2.getDate() && date1.getMonth() === date2.getMonth();


                console.log(activityStatusForCurrentDate, date2, date1, checkCurrentDate, openQueueDate);
                
                
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
                    editDetial: ""
                };



                Swal.fire({
                    title: 'สร้างกิจกรรม',
                    html: `ตกลงที่จะสร้างกิจกรรม : ${activityName} <br/>จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด : ${totalRegisteredCount}<br/>`,
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
                        const newActivityRef = await addDoc(activitiesCollection, activityInfo);
                        await setDoc(doc(db, 'activities', newActivityRef.id), { imageURL: downloadURL }, { merge: true });

                        Swal.fire({
                            title: 'สร้างกิจกรรมสําเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/adminActivityAllComponent')
                            }
                        });

                        //   navigate('/adminActivityAllComponent')
                    } else {
                        Swal.fire({
                            title: 'สร้างไม่สําเร็จ',
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
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาเลือกรูปภาพ',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    },
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
        { date: "", startTime: "", endTime: "", registeredCount: "", QueueOpen: "no", QueueCount: 0, Queuelist: [], userList: [], registeredCountCheck: 0, SuccessList: [] }
    ]);

    const addNewData = (event) => {
        event.preventDefault();
        setTimeSlots([...timeSlots, { date: "", startTime: "", endTime: "", registeredCount: "", QueueOpen: "no", QueueCount: 0, Queuelist: [], SuccessList: [], userList: [], registeredCountCheck: "", }]);
    };
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setDate(0)
    const handleInputChange = (index, name) => (event) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index][name] = event.target.value;
        if (name === "registeredCount") {
            newTimeSlots[index]["registeredCountCheck"] = event.target.value;
        }
        setTimeSlots(newTimeSlots);
        console.log(timeSlots, "timeSlots");
    };

    const removeData = (event, index) => {
        event.preventDefault();
        const newTimeSlots = [...timeSlots];
        newTimeSlots.splice(index, 1);
        setTimeSlots(newTimeSlots);
    };
    const handleKeyDown = (event) => {
        if (event.key === '-' || event.key === '.' || event.key === 'e') {
            event.preventDefault();
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
                    min={new Date().toISOString().split("T")[0]}
                    value={timeSlot.date}
                    onChange={handleInputChange(index, "date")}
                    style={{width:"325px"}}
                />
                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลา<span className="colorRed">*</span></label><br />
                <input
                    type="text"
                    className="form-control timeable"
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
                    onInvalid={(e) => e.target.setCustomValidity(`กรุณากรอกเวลาในรูปแบบนี้ "00:00"`)}
                    onInput={(e) => e.target.setCustomValidity("")}
                    placeholder="00:00"
                    pattern="([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}"
                />
                <span className="admin-textBody-large"> ถึง </span>
                <input
                    type="text"
                    className="form-control timeable"
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
                    onInvalid={(e) => e.target.setCustomValidity(`กรุณากรอกเวลาในรูปแบบนี้ "00:00"`)}
                    onInput={(e) => e.target.setCustomValidity("")}
                    placeholder="00:00"
                    pattern="([01]?[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}"
                />
                <br></br>
                <label className="admin-textBody-large colorPrimary-800">จำนวนผู้ลงทะเบียน<span className="colorRed">*</span></label><br></br>
                <input
                    type="number"
                    className="form-control timeable"
                    placeholder="40"
                    value={timeSlot.registeredCount}
                    onChange={handleInputChange(index, "registeredCount")}
                    onKeyDown={handleKeyDown}
                />
                <span className="admin-textBody-large"> คน</span>

            </div>
        ));
    };

    const totalRegisteredCount = timeSlots.reduce((sum, timeSlot) => {
        return sum + (parseInt(timeSlot.registeredCount, 10) || 0);
    }, 0);
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
                                        src={imgSrc || img_activity}
                                        className="admin-img-activity"
                                        alt={imgSrc ? "Selected Activity Image" : img_activity}
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
                                        <label className="admin-textBody-large colorPrimary-800">ชื่อกิจกรรม<span className="colorRed">*</span></label>
                                        <input type="text" className="form-control" value={activityName} onChange={inputValue("activityName")} placeholder="Activity" maxLength={70} />
                                        {activityName.length > 70 ? <div style={{ display: "flex", color: "red", justifyContent: "flex-end" }}>{activityName.length}/70</div> : <div style={{ display: "flex", color: "grey", justifyContent: "flex-end" }}>{activityName.length}/70</div>}
                                    </div>

                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800 acivity-detail">รายละเอียด<span className="colorRed">*</span></label>
                                        <textarea
                                            value={activityDetail}
                                            onChange={inputValue("activityDetail")}
                                            className="acivity-detail"
                                            rows="18"
                                        ></textarea>
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
                                    <label class="admin-activity-queue focus" for="option1">มีระบบคิว</label>
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
                                    <label class="admin-activity-queue" for="option2">ไม่มีระบบคิว</label>
                                </div> */}
                                <div className="admin-activity-form-register">
                                    <div className="admin-activity-form-register-box">
                                    <div>
                                        <h2 className="colorPrimary-800" style={{marginBottom:"15px"}}>รูปแบบกิจกรรม<span className="colorRed">*</span></h2>
                                        {/* <input
                                            type="radio"
                                            className="btn-check"
                                            name="options"
                                            id="option1"
                                            autoComplete="off"
                                            value="yes"
                                            checked={activityType === 'yes'}
                                            onChange={handleRadioChange}
                                        />
                                        <label class="admin-activity-queue focus" for="option1">มีระบบคิว</label>
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
                                        <label class="admin-activity-queue" for="option2">ไม่มีระบบคิว</label> */}
                                        <select
                                            className="form-select"
                                            style={{border:"1px solid #0a0f157a", width:"450px"}}
                                            value={activityType}
                                            onChange={handleRadioChange} // ใช้งานฟังก์ชันเดียวกันกับ radio buttons
                                        >
                                            <option value="yes">มีระบบคิว</option>
                                            <option value="no">ไม่มีระบบคิว</option>
                                        </select>
                                        </div>
                                        <br></br>


                                        <h2 className="colorPrimary-800">ช่วงวันเปิดกิจกรรมให้ลงทะเบียน<span className="colorRed">*</span></h2>
                                        <div>
                                            <input
                                                type="date"
                                                className="form-control admin-activity-input"
                                                placeholder="dd/mm/yyyy"
                                                onChange={(e) => {
                                                    inputValue("openQueueDate")(e);
                                                }}
                                                min={new Date().toISOString().split("T")[0]}

                                            />
                                            <span className="admin-textBody-large"> ถึง </span>
                                            <input
                                                type="date"
                                                className="form-control admin-activity-input"
                                                placeholder="dd/mm/yyyy"
                                                min={new Date().toISOString().split("T")[0]}

                                                onChange={(e) => {
                                                    inputValue("endQueueDate")(e);
                                                }}
                                            />
                                        </div>
                                        {/* <div>
                                            <label className="admin-textBody-large colorPrimary-800">จำนวนเปิดรับผู้ลงทะเบียนทั้งหมด</label><br></br>
                                            <input type="text" className="form-control timeable" placeholder="40" disabled value={totalRegisteredCount} />
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
                                <input type="submit" value="เพิ่มกิจกรรม" className="btn-primary btn-systrm" target="_parent" disabled={openQueueDate === "" || endQueueDate === "" || activityName === "" || activityDetail == "" || timeSlots.some(slot => slot.date === "" || slot.startTime === "" || slot.endTime === "" || slot.registeredCount === "")} />
                            </div>
                        </div>
                    </form>

                </div>

            </div>

        </div>

    );
}

export default ActivityAddComponent;