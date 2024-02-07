import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import img_activity from "../picture/img-activity.png";
import calendarFlat_icon from "../picture/calendar-flat.png";
import Swal from "sweetalert2";
import { addDoc,doc } from "firebase/firestore";
import { setDoc } from 'firebase/firestore';
import { ref, uploadBytes,getStorage, getDownloadURL } from 'firebase/storage';
const ActivityAddComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();

    const [state, setState] = useState({
        activityName: "",
        activityDetail: "",
        activityType: "yes",
        openQueenDate: "",
        endQueenDate: "",
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
        } else if (name === 'openQueenDate') {
            // Handle openQueenDate
            setState({ ...state, [name]: event.target.value });
        } else if (name === 'endQueenDate') {
            // Handle endQueenDate
            const openQueenDate = state.openQueenDate;
    
            if (event.target.value < openQueenDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date',
                    text: 'End date should be greater than or equal to start date',
                });
            } else {
                setState({ ...state, [name]: event.target.value });
            }
        
        } else {
          setState({ ...state, [name]: event.target.value });
        }
      };
    

    
    const { activityName, activityDetail, activityType, openQueenDate , endQueenDate } = state;

    const handleRadioChange = inputValue('activityType');

    useEffect(() => {
        console.log(openQueenDate);
    }, [openQueenDate]);


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
    const activitiesCollection = collection(db, 'activities');

    const storage = getStorage();

    const fileInput = document.querySelector('.input-activity-img');
    const file = fileInput?.files[0];

    if (file) {
      const storageRef = ref(storage, `activity_images/${file.name}`);

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);
      const hasTimeSlotForCurrentDate = timeSlots.some(slot => slot.date === checkCurrentDate);

        const activityInfo = {
        activityName: activityName,
        activityDetail: activityDetail,
        activityType: activityType,
        openQueenDate: openQueenDate,
        endQueenDate: endQueenDate,
        timeSlots: timeSlots,
        totalRegisteredCount: totalRegisteredCount,
        imageURL: downloadURL,
        queenStatus: hasTimeSlotForCurrentDate ? "open" : "close",
        };

      const newActivityRef = await addDoc(activitiesCollection, activityInfo);

      Swal.fire({
        title: 'ขอแก้ไขนัดหมาย',
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
          await setDoc(doc(db, 'activities', newActivityRef.id), { imageURL: downloadURL }, { merge: true });

          Swal.fire({
            title: 'สร้างกิจกรรมสําเร็จ',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#263A50',
            customClass: {
              confirmButton: 'custom-confirm-button',
            },
          });
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
        { date: "", startTime: "", endTime: "", registeredCount: "" }
    ]);

    const addNewData = (event) => {
        event.preventDefault();
        setTimeSlots([...timeSlots, { date: "", startTime: "", endTime: "", registeredCount: "" }]);
    };

    const handleInputChange = (index, name) => (event) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index][name] = event.target.value;
        setTimeSlots(newTimeSlots);
        console.log(timeSlots, "timeSlots")
    };

    const removeData = (event, index) => {
        event.preventDefault();
        const newTimeSlots = [...timeSlots];
        newTimeSlots.splice(index, 1);
        setTimeSlots(newTimeSlots);
    };

    const renderTimeSlots = () => {
        return timeSlots.map((timeSlot, index) => (
            <div key={index}>
                <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                <input
                    type="date"
                    className="form-control"
                    placeholder="dd/mm/yyyy"
                    value={timeSlot.date}
                    onChange={handleInputChange(index, "date")}
                />
                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลา</label><br />
                <input
                    type="text"
                    className="form-control timeable"
                    placeholder="00:00"
                    pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                    value={timeSlot.startTime}
                    onChange={handleInputChange(index, "startTime")}
                />
                <span className="admin-textBody-large"> ถึง </span>
                <input
                    type="text"
                    className="form-control timeable"
                    placeholder="00:00"
                    pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                    value={timeSlot.endTime}
                    onChange={handleInputChange(index, "endTime")}
                />
                <br></br>
                <label className="admin-textBody-large colorPrimary-800">จำนวนผู้ลงทะเบียน</label><br></br>
                <input
                    type="text"
                    className="form-control timeable"
                    placeholder="40"
                    value={timeSlot.registeredCount}
                    onChange={handleInputChange(index, "registeredCount")}
                />
                <span className="admin-textBody-large"> คน</span>
                <div className="admin-right">
                    <button onClick={(event) => removeData(event, index)} className="admin-activity-remove-btn">ลบช่วงเวลา</button>
                </div>

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
                                    <img
                                        src={imgSrc || img_activity}
                                        className="admin-img-activity"
                                        alt={imgSrc ? "Selected Activity Image" : img_activity}
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
                                        <label className="admin-textBody-large colorPrimary-800">ชื่อกิจกรรม</label>
                                        <input type="text" className="form-control" value={activityName} onChange={inputValue("activityName")} placeholder="Activity" />
                                    </div>
                                    <div>
                                    <label className="admin-textBody-large colorPrimary-800 acivity-detail">รายละเอียด</label>
                                    <textarea
                                        value={activityDetail}
                                        onChange={inputValue("activityDetail")}
                                        className="acivity-detail"
                                        rows="18"
                                    ></textarea>
                                    </div>
                                </div>

                                <div>
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
                                </div>
                                <div className="admin-activity-form-register">
                                    <div className="admin-activity-form-register-box">
                                        <h2 className="colorPrimary-800">ช่วงเวลาลงทะเบียน</h2>
                                        <br></br>
                                        <div>
                                            <label className="admin-textBody-large colorPrimary-800">ช่วงวันที่</label><br />
                                            <input
                                                type="date"
                                                className="form-control admin-activity-input"
                                                placeholder="dd/mm/yyyy"
                                                onChange={(e) => {
                                                    inputValue("openQueenDate")(e);
                                                }}
                                            />
                                            <span className="admin-textBody-large"> ถึง </span>
                                            <input
                                                type="date"
                                                className="form-control admin-activity-input"
                                                placeholder="dd/mm/yyyy"
                                                onChange={(e) => {
                                                    inputValue("endQueenDate")(e);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-textBody-large colorPrimary-800">จำนวนเปิดรับผู้ลงทะเบียนทั้งหมด</label><br></br>
                                            <input type="text" className="form-control timeable" placeholder="40" disabled value={totalRegisteredCount}/>
                                            <span className="admin-textBody-large"> คน</span>
                                        </div>
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
                                <input type="submit" value="เพิ่มกิจกรรม" className="btn-primary btn-systrm" target="_parent" />
                            </div>
                        </div>
                    </form>

                </div>

            </div>

        </div>

    );
}

export default ActivityAddComponent;