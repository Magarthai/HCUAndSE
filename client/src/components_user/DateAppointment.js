import { useEffect, useState, useRef } from "react";
import "../css/UserDateAppointment.css";
import "../css/Component.css";
import CalendarUserComponentDate from "../components_user/CalendarUserComponentDate";
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import Delete_icon from "../picture/icon_delete.jpg";
import Edit_icon from "../picture/icon_edit.jpg";
import { useUserAuth } from "../context/UserAuthContext";
import NavbarUserComponent from '../components_user/NavbarComponent';
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const UserDateAppointment = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
const [state, setState] = useState({
    appointmentDate: "",
    userID:"",
})

const { user, userData } = useUserAuth();

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

const inputValue = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
};
const { appointmentDate, userID } = state
const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
const [timeOptionss, setTimeOptionss] = useState([]);
const [isChecked, setIsChecked] = useState({});
const [selectedDate, setSelectedDate] = useState(null);
const selectedDateFromLocation = location.state?.selectedDate || null;



useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);
    
    fetchMainTimeTableData();

    if (userData) {
        setState((prevState) => ({
            ...prevState,
            userID: userData.id,
        }));
    }

    if (!selectedDateFromLocation) {
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'กรุณาเลือกวันก่อน!',
        }).then(() => {
            navigate('/appointment');
        });}
}, [userData, selectedDate]);

useEffect(() => {
    console.log("Updated selectedDate:", selectedDate);
    fetchUserDataWithAppointments();
    console.log(selectedDate);
}, [selectedDate, userData]);

useEffect(() => {
    console.log("Updated Appointment:", AppointmentUsersData);
    if (!selectedDateFromLocation) {
      console.log("check");
    } else if (!isInitialRender) {
      console.log("hello world");
    } else {
      setSelectedDate(selectedDateFromLocation);
      console.log("date check", selectedDateFromLocation);
      fetchUserDataWithAppointments();
      setIsInitialRender(false);
    }
  }, [AppointmentUsersData]);
const [isInitialRender, setIsInitialRender] = useState(true);
const fetchUserDataWithAppointments = async () => {
    try {
      if (user && selectedDate && selectedDate.dayName) {
        const appointmentsCollection = collection(db, 'appointment');
        const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==',
          `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
          where('appointmentDate', '==', `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
          where('appointmentId', '==', userData.id)));

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
                console.log("Timetable Data:", timetableData);
                const timeslot = timetableData.timeablelist[timeSlotIndex];
                console.log("Timeslot info", timeslot);

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

          const filteredAppointmentUsersDataArray = AppointmentUsersDataArray.filter(userDetails => userDetails !== null);

          if (filteredAppointmentUsersDataArray.length > 0) {
            setAllAppointmentUsersData(filteredAppointmentUsersDataArray);
            console.log("AppointmentUsersData", filteredAppointmentUsersDataArray);
          } else {
            console.log("No user details found for any appointmentId");
          }

          console.log("AppointmentUsersDataArray", filteredAppointmentUsersDataArray);
          setAllAppointmentUsersData(filteredAppointmentUsersDataArray);
          console.log("AppointmentUsersData", filteredAppointmentUsersDataArray);
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

    <u></u>
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

const fetchMainTimeTableData = async () => {
    try {
        if (user && selectedDate && selectedDate.dayName) {
            const timeTableCollection = collection(db, 'timeTable');
            const querySnapshot = await getDocs(query(
                timeTableCollection,
                where('addDay', '==', selectedDate.dayName),
                where('clinic', '==', 'คลินิกทั่วไป')
            ));
            const timeTableData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("timeTableData selectedDate", selectedDate)
            console.log("timeTableData", timeTableData)

            if (timeTableData.length > 0) {
                const filteredTimeTableData = timeTableData
                if (filteredTimeTableData.length > 0) {
                    const allTimeableLists = filteredTimeTableData.reduce((acc, item) => {
                        if (item.timeablelist && Array.isArray(item.timeablelist)) {
                            acc.push(
                                ...item.timeablelist.map((timeSlot, index) => ({
                                    ...timeSlot,
                                    timeTableId: item.id,
                                    timeSlotIndex: index
                                }))
                            );
                        }
                        return acc;
                    }, []);

                    const appointmentsCollection = collection(db, 'appointment');
                    const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`)));

                    const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => doc.data().appointmentTime);

                    if (existingAppointments.length > 0) {
                        console.log(`timetalbe found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);
                    } else {
                        console.log(`No timetalbe found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                    }

                    const availableTimeSlots = allTimeableLists.filter((timeSlot) =>
                        !existingAppointments.some(existingSlot =>
                            existingSlot.timetableId === timeSlot.timeTableId && existingSlot.timeSlotIndex === timeSlot.timeSlotIndex
                        )
                    );



                    console.log("availableTimeSlots", availableTimeSlots)
                    const initialIsChecked = availableTimeSlots.reduce((acc, timetableItem) => {
                        acc[timetableItem.id] = timetableItem.status === "Enabled";
                        return acc;
                    }, {});

                    setIsChecked(initialIsChecked);

                    const timeOptionsFromTimetable = [
                        { label: "กรุณาเลือกช่วงเวลา", value: "", disabled: true, hidden: true },
                        ...availableTimeSlots
                            .filter(timeSlot => timeSlot.type === 'main')
                            .sort((a, b) => {
                                const timeA = new Date(`01/01/2000 ${a.start}`);
                                const timeB = new Date(`01/01/2000 ${b.start}`);
                                return timeA - timeB;
                            })
                            .map((timeSlot) => ({
                                label: `${timeSlot.start} - ${timeSlot.end}`,
                                value: { timetableId: timeSlot.timeTableId, timeSlotIndex: timeSlot.timeSlotIndex },
                            })),
                    ];


                    console.log("Before setTimeOptions", timeOptionsFromTimetable);
                    setTimeOptionss(timeOptionsFromTimetable);
                    console.log("After setTimeOptions", timeOptionsFromTimetable);
                    console.log(timeOptionss)
                } else {
                    console.log("Time table not found for selected day and clinic");
                    const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptionss([noTimeSlotsAvailableOption]);
                    console.log(timeOptionss)
                }

            } else {
                const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                setTimeOptionss([noTimeSlotsAvailableOption]);
                console.log("Time table not found", timeOptionss);
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

const getDayName = (date) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
};

const formatDateForDisplay = (isoDate) => {
    const dateParts = isoDate.split("-");
    if (dateParts.length === 3) {
      setAllAppointmentUsersData([]);
      const [year, month, day] = dateParts;
      const formattedMonth = parseInt(month, 10);
      const formattedDay = parseInt(day, 10);
      const formattedYear = parseInt(year, 10);
      const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

      const dayName = getDayName(new Date(isoDate)).toLowerCase();
      const formattedSelectedDate = {
        day: formattedDay,
        month: formattedMonth,
        year: formattedYear,
        dayName: dayName,
      };
      setAllAppointmentUsersData([]);
      setSelectedDate(formattedSelectedDate);
      setState({
        ...state,
        appointmentDate: `${formattedSelectedDate.day}/${formattedSelectedDate.month}/${formattedSelectedDate.year}`,
        appointmentTimes: "",
      });
      console.log("formattedSelectedDate", formattedSelectedDate);
      return formattedDate;
    }
    return isoDate;
  };

    const deleteAppointment = () => {
        Swal.fire({
            title: "ยกเลิกนัดหมาย",
            html: "วันที่ 14 ธันวาคม 2023 <br> เวลา 10:01 - 10:06",
            showConfirmButton: false,
            showCancelButton: true,
            showDenyButton: true,
            icon: 'warning',
            denyButtonText: "ยกเลิกนัดหมาย",
            cancelButtonText: "กลับ",
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then((result) => {
            if (result.isDenied) {
                Swal.fire({
                    title: "ยกเลิกนัดหมายสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                });
            }
        });
    }

    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setAllAppointmentUsersData([]);
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
    };

    const EditAppointment = (AppointmentUserData) => {
        if (AppointmentUserData.appointment.clinic === "คลินิกกายภาพ"){
            navigate('/appointment/editPhysic', { state: { AppointmentUserData: AppointmentUserData,selectedDate } });
        } else if (AppointmentUserData.appointment.clinic === "คลินิกเฉพาะทาง") {
            navigate('/appointment/editSpecial', { state: { AppointmentUserData: AppointmentUserData,selectedDate } });
        } else if (AppointmentUserData.appointment.clinic === "คลินิกฝังเข็ม") {
            navigate('/appointment/editNeedle', { state: { AppointmentUserData: AppointmentUserData,selectedDate } });}
        else{

        navigate('/appointment/edit', { state: { AppointmentUserData: AppointmentUserData,selectedDate } });}
      }
      
    
    return (

        
        <div className="user">
            <div style={{display:"none"}}>
            <div className="CalendarUser">
                    <CalendarUserComponentDate
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onDateSelect={handleDateSelect}
                    />
                </div>
            </div>
            
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>รายการนัดหมาย</h3>
                </div>

                <NavbarUserComponent />
            </header>
            <div className="user-body">
                <div className="user-DateAppointment-Date_container gap-32">

                    <div className="user-DateAppointment-Date_title">
                        <h4 className="colorPrimary-800">เลือกดูวันที่</h4>
                    </div>
                    <div className="center-container">
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => {
                                    inputValue("appointmentDate")(e);
                                    const formattedDate = formatDateForDisplay(e.target.value);
                                    console.log("Formatted Date:", formattedDate);
                                    fetchMainTimeTableData();
                                }}
                            />
                        </div>
                </div>
                <div className="user-DateAppointment-AppointmentList_container ">
                    {selectedDate &&<h4 className="colorPrimary-800 user-DateAppointment-card-h4">นัดหมายวันที่ {selectedDate.day}/{selectedDate.month}/{selectedDate.year}</h4>}
                    
                    <div className="user-DateAppointment-cardList_container">
                    {AppointmentUsersData.filter(AppointmentUserData => AppointmentUserData.appointment.status === "ลงทะเบียนแล้ว").length > 0 ? 
    AppointmentUsersData.filter(AppointmentUserData => AppointmentUserData.appointment.status === "ลงทะเบียนแล้ว").sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start)).map((AppointmentUserData, index) => (
                            <div className="user-DateAppointment-card gap-16" style={{ marginTop: 25 }}>
                                <div className="user-DateAppointment-card_header">
                                    <h4 className="textButton-Normal2">{AppointmentUserData.appointment.clinic}</h4>
                                    <div className="user-DateAppointment-icon">
                                        <a onClick={() => EditAppointment(AppointmentUserData)}><img className="user-DateAppointment-icon_edit" src={Edit_icon} alt="" /></a>
                                        <a onClick={() => DeleteAppointment(AppointmentUserData, AppointmentUserData.appointment.appointmentuid, AppointmentUserData.userUid)}><img className="user-DateAppointment-icon_delete" src={Delete_icon} alt="" /></a>
                                    </div>
                                </div>
                                <p className="textBody-big" style={{ marginBottom: 8, marginTop: 5 }}> <img src={CalendarFlat_icon} alt="" /> {AppointmentUserData.appointment.appointmentDate} </p>
                                <p className="textBody-big" style={{ marginBottom: 0 }}> <img src={ClockFlat_icon} alt="" /> {AppointmentUserData.timeslot.start} - {AppointmentUserData.timeslot.end}</p>
                                <div className="user-appointment-description2" style={{marginTop:5}}>
                                                <label style={{marginTop:5}}><b className='user-appointment-Bold-letter' >สาเหตุการนัดหมาย</b></label> <br></br>
                                                <label style={{marginTop:5}}>: {AppointmentUserData.appointment.appointmentCasue}</label>
                                            </div>

                                            <div className="user-appointment-description2">
                                                <label style={{marginTop:5}}><b className='user-appointment-Bold-letter'>อาการ</b></label> <br></br>
                                                <label style={{marginTop:5}}>: {AppointmentUserData.appointment.appointmentSymptom}</label>
                                            </div>
                            </div>
                        )) :
                        <div className="user-DateAppointment-card_noAppointment gap-16">
                            <h3 className="user-DateAppointment-noAppointment center">ไม่มีการนัดหมาย</h3>
                        </div>
                    }

                    </div>
                </div>
            </div>
        </div>

    )
}

export default UserDateAppointment;