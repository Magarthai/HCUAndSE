import { useEffect, useState, useRef } from "react";
import "../css/UserAllAppointment.css";
import { Link } from "react-router-dom";
import NavbarUserComponent from '../components_user/NavbarComponent';
import CalendarUserComponent from "./CalendarUserComponent";
import icon1 from '../picture/calendar-flat.png';
import icon2 from '../picture/clock-flat.png';
import Popup from 'reactjs-popup';
import { useUserAuth } from "../context/UserAuthContext";
import icon_submit from '../picture/tick-circle.png';
import icon_cancel from '../picture/close-circle.jpg';
import { db, getDocs, collection, doc, getDoc, firestore } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { startOfWeek, endOfWeek, parse, isWithinInterval } from 'date-fns';
import { PulseLoader } from "react-spinners";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
const UserAllAppointment = () => {
    const navigate = useNavigate();
    const { user, userData } = useUserAuth();
    const [selectedDate, setSelectedDate] = useState();
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    const formattedSelectedDate = {
        day: date,
        month: month,
        year: year,
        dayName: day,
    };

    const [isInitialRender, setIsInitialRender] = useState(true);

const handleDateSelect = (selectedDate) => {
    console.log("Selected Date in AppointmentManager:", selectedDate);
    setAllAppointmentUsersData([]);
    setSelectedDate(selectedDate);
    
    if (!isInitialRender) {
        console.log("location",selectedDate)
      navigate('/appointment/date', { state: { selectedDate } });
    }
  };
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'Health Care Unit';
  
    if (AppointmentUsersData.length <= 0) {
      fetchUserDataWithAppointments();
    }
  
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    setIsInitialRender(false); 
    console.log("AppointmentUsersData", AppointmentUsersData);
  
    return () => clearTimeout(timeout);
  }, [user, userData, AppointmentUsersData, selectedDate]);


    const handleApprove = async (id, AppointmentUserData) => {
        Swal.fire({
            title: `ยืนยันสิทธิ์`,
            html: `วันที่ ${AppointmentUserData.appointment.appointmentDate} </br>` + `เวลา ${AppointmentUserData.timeslot.start} - ${AppointmentUserData.timeslot.end}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันสิทธ์',
            cancelButtonText: '<span style="color: #444444;">ยกเลิก</span>',
            confirmButtonColor: '#263A50',
            cancelButtonColor: `rgba(68, 68, 68, 0.13)`,
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const docRef = doc(db, 'appointment', id);
                    updateDoc(docRef, { status: "ยืนยันสิทธิ์แล้ว" }).catch(error => {
                        console.error('Error updating timetable status:', error);
                    });

                    Swal.fire(
                        {
                            title: 'ยืนยันสิทธิ์สำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            }
                        }
                    ).then((result) => {
                        if (result.isConfirmed) {
                            fetchUserDataWithAppointments();
                        }
                    });
                } catch {

                }

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    {
                        title: 'ยืนยันสิทธิ์ไม่สำเร็จ',
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    }
                )
            }
        })



    };

    const renderStatusClass = (status) => {
        switch (status) {
            case 'ยืนยันสิทธิ์แล้ว':
                return 'user-appointment-status2';
            case 'เสร็จสิ้น':
                return 'user-appointment-status';
            case 'ไม่สำเร็จ':
                return 'user-appointment-status1';
            case 'ลงทะเบียนแล้ว':
                return 'user-appointment-status3';
            case 'ลงทะเบียนแล้ว':
                return 'user-appointment-status3';
            case 'ยื่นแก้ไข้':
            return 'user-appointment-status2';
            default:
                return 'user-appointment-status3 ';
        }
    };



    const statusElements = document.querySelectorAll('.admin-queue-card-status p');

    function changeStatusTextColor(element) {
        if (element.textContent.trim() === 'เสร็จสิ้น') {
            element.style.color = '#098B66';
        }
        else if (element.textContent.trim() === 'ไม่สำเร็จ') {
            element.style.color = '#C11F1F';
        }
        else if (element.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
            element.style.color = '#D88C09';
        }
        else if (element.textContent.trim() === 'รอยืนยันสิทธ์') {
            element.style.color = '#A1A1A1';
        }
        else if (element.textContent.trim() === 'ยื่นแก้ไข้') {
            element.style.color = '#D88C09';
        }
    }

    statusElements.forEach(changeStatusTextColor);

    const DeleteAppointment = async (AppointmentUserData, appointmentuid, uid) => {
        const timetableRef = doc(db, 'appointment', appointmentuid);

        Swal.fire({
            title: 'ยกเลิกสิทธิ์',
            html: `วันที่ ${AppointmentUserData.appointment.appointmentDate} </br>` + `เวลา ${AppointmentUserData.timeslot.start} - ${AppointmentUserData.timeslot.end}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยกเลิกสิทธิ์',
            cancelButtonText: '<span style="color: #444444;">ยกเลิก</span>',
            confirmButtonColor: '#DC2626',
            cancelButtonColor: `rgba(68, 68, 68, 0.13)`,
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoc(timetableRef);

                    console.log("Appointment deleted:", appointmentuid);

                    const userRef = doc(db, "users", uid);

                    await updateDoc(userRef, {
                        "appointments": arrayRemove("appointments", appointmentuid)
                    });




                    console.log(appointmentuid);
                    setAllAppointmentUsersData([])
                    fetchUserDataWithAppointments();
                    Swal.fire(
                        {

                            title: 'ยกเลิกสิทธิ์สำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            }
                        })
                        .then((result) => {
                            if (result.isConfirmed) {

                            }

                        });
                } catch {

                }

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    {
                        title: 'ยกเลิกสิทธิ์ไม่สำเร็จ',
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    }
                )
            }
        })

    }
    const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 });  // 0 means Sunday
    const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 0 });

    const fetchUserDataWithAppointments = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {

                const appointmentsCollection = collection(db, 'appointment');
                const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection,
                    where('appointmentId', '==', userData.id),
                ));



                const timeTableCollection = collection(db, 'timeTable');
                const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
                    const appointmentData = doc.data();
                    return {
                        appointmentId: doc.id,
                        appointmentuid: doc.id,
                        ...appointmentData,
                    };
                });


                if (existingAppointments.length > 0) {
                    console.log("existingAppointments", existingAppointments);
                    console.log(`Appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);
    
                    const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
                        const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
                        const timeTableId = appointment.appointmentTime.timetableId;
    
                        try {
                            const timetableDocRef = doc(timeTableCollection, timeTableId);
                            const timetableDocSnapshot = await getDoc(timetableDocRef);
    
                            if (timetableDocSnapshot.exists()) {
                                const timetableData = timetableDocSnapshot.data();
                                const timeslot = timetableData.timeablelist[timeSlotIndex];
    
                                const userDetails = await getUserDataFromUserId(appointment, appointment.appointmentId, timeslot, appointment.appointmentuid);
    
                                if (userDetails) {
                                    console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                                    return userDetails;
                                } else {
                                    console.log("No user details found for appointmentId", appointment.appointmentId);
                                    return null;
                                }
                            } else {
                                console.log("No such document with ID:", timeTableId);
                                return null;
                            }
                        } catch (error) {
                            console.error('Error fetching timetable data:', error);
                            return null;
                        }
                    }));

                    if (AppointmentUsersDataArray.length > 0) {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);

                    } else {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);
                    }

                    setAllAppointmentUsersData(AppointmentUsersDataArray);

                } else {
                    console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data with appointments:', error);
        }
    };

    const getUserDataFromUserId = async (appointment, userId, timeslot, appointmentuid) => {
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

        if (userQuerySnapshot.empty) {
            console.log("No user found with id:", userId);
            return null;
        }

        const userUid = userQuerySnapshot.docs[0].id;
        const userDatas = userQuerySnapshot.docs[0].data();
        userDatas.timeslot = timeslot;
        userDatas.appointment = appointment;
        userDatas.appointmentuid = appointmentuid;
        userDatas.userUid = userUid;
        console.log("User Data for userId", userId, ":", userDatas);
        console.log("userDatas", userDatas)
        console.log("testxd", userDatas.timeslot.start)
        return userDatas;
    };


    return (
        <div className="user">
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>รายการ</h3>
                </div>

                <NavbarUserComponent />
            </header>

            <body className="user-body">
                <h3 className='User-appointmentmenu-headbar colorPrimary-800'>ปฏิทิน</h3>
                <div className="CalendarUser-appointment">
                    <CalendarUserComponent
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onDateSelect={handleDateSelect}
                    />
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:""}}>
                <p style={{marginTop:10,marginBottom:-10}} className="user-appointment-warn">*คลิกเลือกวันที่ต้องการแก้ไขหรือยกเลิกนัดหมาย*</p>
                </div>
                <div className="user-appointment-bar-btn">
                    <h3 className='User-appointmentmenu-headbar'>นัดหมายสัปดาห์นี้</h3>
                    <button className="user-appointment-btn-add"><Link to="/appointment/clinic"><x>เพิ่มนัดหมาย +</x></Link></button>
                </div>
                {isLoading ? (
        <div style={{display:"flex", justifyContent:"center",alignItems:"center" , marginBottom:50}}>

          <PulseLoader size={15} color={"#54B2B0"} loading={isLoading} />
        </div>
      ) : (
                <div className="user-appointment-funtion">

                    
                    {AppointmentUsersData && AppointmentUsersData.length > 0 ? (
                        <>
                            {AppointmentUsersData
                                .filter(AppointmentUserData => AppointmentUserData.appointment.status === "รอยืนยันสิทธิ์")
                                .sort((a, b) => { const dateA = new Date(a.appointment.appointmentDate.split('/').reverse().join('-'));
                                const dateB = new Date(b.appointment.appointmentDate.split('/').reverse().join('-'));
                            
                            
                                if (dateA < dateB) return -1;
                                if (dateA > dateB) return 1;
                            
                            
                                const timeA = new Date(`2000-01-01T${a.timeslot.start}`);
                                const timeB = new Date(`2000-01-01T${b.timeslot.start}`);
                                return timeA - timeB;})
                                .map((AppointmentUserData, index) => (
                                    <div key={index}>
                                        <div className="user-appointment-card">
                                            <label><b className='textButton-Normal2'>{AppointmentUserData.appointment.clinic}</b></label>

                                            <div className="user-appointment-description1">
                                                <img className="user-appointment-icon-card" src={icon1} alt="icon-calendar" />
                                                <label className="textBody-big">{AppointmentUserData.appointment.appointmentDate}</label>
                                            </div>

                                            <div className="user-appointment-description1">
                                                <img className="user-appointment-icon-card" src={icon2} alt="icon-clock" />
                                                <label className="textBody-big">{AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}</label>
                                            </div>

                                            <div className="user-appointment-description2">
                                                <label><b className='user-appointment-Bold-letter'>สาเหตุการนัดหมาย</b></label> <br></br>
                                                <label>: {AppointmentUserData.appointment.appointmentCasue}</label>
                                            </div>

                                            <div className="user-appointment-description2">
                                                <label><b className='user-appointment-Bold-letter'>อาการ</b></label> <br></br>
                                                <label>: {AppointmentUserData.appointment.appointmentSymptom}</label>
                                            </div>

                                            <label className="user-appointment-warn">หมายเหตุ</label> <br></br>
                                            <label className="user-appointment-warn">: กรุณายืนยันสิทธิ์ก่อน 15 นาที</label>

                                            <div className="user-appointment-btn-submit-set">
                                                <button onClick={() => DeleteAppointment(AppointmentUserData, AppointmentUserData.appointment.appointmentuid, AppointmentUserData.userUid)} className="user-appointment-btn-cancel">ยกเลิกสิทธิ์</button>
                                                <button onClick={() => handleApprove(AppointmentUserData.appointment.appointmentuid, AppointmentUserData)} className="user-appointment-btn-submit">ยืนยันสิทธิ์</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            } 
                    
                                     {AppointmentUsersData
                               .filter(AppointmentUserData => AppointmentUserData.appointment.status == "ลงทะเบียนแล้ว")
                                .sort((a, b) => { const dateA = new Date(a.appointment.appointmentDate.split('/').reverse().join('-'));
                                const dateB = new Date(b.appointment.appointmentDate.split('/').reverse().join('-'));
                            
                            
                                if (dateA < dateB) return -1;
                                if (dateA > dateB) return 1;
                            
                            
                                const timeA = new Date(`2000-01-01T${a.timeslot.start}`);
                                const timeB = new Date(`2000-01-01T${b.timeslot.start}`);
                                return timeA - timeB;})
                                .map((AppointmentUserData, index) => (
                                    <div key={index}>
                                        <div className="user-appointment-card">

                                            <div className="user-header-appointment-card">
                                                <label><b className='textButton-Normal2'>{AppointmentUserData.appointment.clinic}</b></label>
                                                <div className={`${renderStatusClass(AppointmentUserData.appointment.status)}`}>
                                                    {AppointmentUserData.appointment.status}
                                                </div>
                                            </div>

                                            {/* ข้อมูลการนัดหมาย */}
                                            <div className="user-appointment-description1">
                                                <img className="user-appointment-icon-card" src={icon1} alt="icon-calendar" />
                                                <label className="textBody-big">{AppointmentUserData.appointment.appointmentDate}</label>
                                            </div>

                                            <div className="user-appointment-description1">
                                                <img className="user-appointment-icon-card" src={icon2} alt="icon-clock" />
                                                <label className="textBody-big">{AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}</label>
                                            </div>

                                            <div className="user-appointment-description2">
                                                <label><b className='user-appointment-Bold-letter'>สาเหตุการนัดหมาย</b></label> <br></br>
                                                <label>: {AppointmentUserData.appointment.appointmentCasue}</label>
                                            </div>

                                            <div className="user-appointment-description2">
                                                <label><b className='user-appointment-Bold-letter'>อาการ</b></label> <br></br>
                                                <label>: {AppointmentUserData.appointment.appointmentSymptom}</label>
                                            </div>
                                        </div>
                                        </div>
                                        ))
                                    }
                                
                                </>
                            ) : (
                                <div className="user-non-appointment-card">
                                    <h3 className="user-non-appointmaent">ไม่มีการนัดหมายในสัปดาห์นี้</h3>
                                </div>
                            )}
      


                        </div>
                        )}
            </body>
            <footer className="UserAllAppointmet-footermenu">
                <lable class="user-appointment-vertical"><Link to="/appointment/list"><y>นัดหมายทั้งหมด</y></Link></lable>
                <div className="user-appointment-middle">
                    <div className="user-appointment-middle-line"></div>
                </div>
                <lable class="user-appointment-vertical"><Link to="/appointment/history"><y>ประวัติการดำเนิน<br></br>การนัดหมาย</y></Link></lable>
            </footer>
        </div>

    )
}

export default UserAllAppointment;
