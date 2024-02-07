import { useEffect, useState, useRef } from "react";
import "../css/UserEditAppointment.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarComponent';
import CalendarUserComponentDate from "./CalendarUserComponentDate";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { useUserAuth } from "../context/UserAuthContext";
const UserEditAppointmentSpecial = (props) => {
    const [selectedDate, setSelectedDate] = useState();
    const { user, userData } = useUserAuth();
    const [isChecked, setIsChecked] = useState({});
    const [timeOptions, setTimeOptions] = useState([]);
    const navigate = useNavigate();
    const [state, setState] = useState({
        appointmentDate: "",
        appointmentTime: "",
        appointmentId: "",
        appointmentCasue: "",
        appointmentSymptom: "",
        appointmentNotation: "",
        clinic: "",
        uid: "",
        timeablelist: "",
        userID: "",
    })
    const [selectedValue, setSelectedValue] = useState("");
    const fetchTimeTableData = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                const timeTableCollection = collection(db, 'timeTable');
                const querySnapshot = await getDocs(query(
                    timeTableCollection,
                    where('addDay', '==', selectedDate.dayName),
                    where('clinic', '==', 'คลินิกเฉพาะทาง')
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
                            console.log(`Appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);
                        } else {
                            console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
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
                        setTimeOptions(timeOptionsFromTimetable);
                        console.log("After setTimeOptions", timeOptions);
                        console.log(timeOptions)
                    } else {
                        console.log("Time table not found for selected day and clinic");
                        const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                        setTimeOptions([noTimeSlotsAvailableOption]);
                        console.log("notime", timeOptions)
                    }

                } else {
                    const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptions([noTimeSlotsAvailableOption]);
                    console.log("Time table not found", timeOptions);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic, uid, timeablelist, userID } = state
    const handleDateSelect = (selectedDate) => {
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
    };

    const location = useLocation();
    const { AppointmentUserData } = location.state || {};

    useEffect(() => {
        console.log('Data from state:', AppointmentUserData);
        fetchTimeTableData();
        if (!AppointmentUserData) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Appointment data is missing!',
            }).then(() => {
                navigate('/appointment');
            });
        } else {
            setState({
                appointmentDate: AppointmentUserData.appointment.appointmentDate || "",
                appointmentTime: AppointmentUserData.appointment.appointmentTime || "",
                appointmentId: AppointmentUserData.appointment.appointmentId || "",
                appointmentCasue: AppointmentUserData.appointment.appointmentCasue || "",
                appointmentSymptom: AppointmentUserData.appointment.appointmentSymptom || "",
                appointmentNotation: AppointmentUserData.appointment.appointmentNotation || "",
                clinic: AppointmentUserData.appointment.clinic || "",
                uid: AppointmentUserData.appointmentuid || "",
                timeablelist: AppointmentUserData.appointment.timeablelist || "",
                userID: AppointmentUserData.appointment.userID || "",
            });
        }
    }, [AppointmentUserData, navigate,selectedDate]);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const selectedDateFromLocation = location.state?.selectedDate || null;

    useEffect(() => {
        console.log("Updated selectedDate:", selectedDate);
        console.log(selectedDate);
        setCalendarSelectedDate(selectedDate);
      }, [selectedDate, userData]);
    
      useEffect(() => {
        console.log("Updated Appointment:", AppointmentUserData);
        console.log(AppointmentUserData);
        if (!selectedDateFromLocation) {
          console.log("check");
        } else if (!isInitialRender) {
          console.log("hello world");
        } else {
            setSelectedDate(selectedDateFromLocation);
            console.log("date check", selectedDate);
            setIsInitialRender(false);
            
        }
        
      }, [AppointmentUserData]);
    
    const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
    
    const submitEditForm = async (e) => {
        e.preventDefault();
        try {
            const timetableRef = doc(db, 'appointment', uid);
            const updatedTimetable = {
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime: appointmentTime,
                appointmentId: appointmentId,
                appointmentCasue: appointmentCasue,
                appointmentSymptom: appointmentSymptom,
                appointmentNotation: appointmentNotation,
                clinic: clinic,
                status: "ลงทะเบียนแล้ว",
                status2: "เสร็จสิ้น",
                subject: "ขอเลื่อนนัดหมาย",
            };

            const selectedTimeLabel = timeOptions.find((timeOption) => {
                const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                return optionValue === selectedValue;
            })?.label;
            if (selectedTimeLabel === undefined) {
                Swal.fire({
                    title: "แก้ไขไม่สําเร็จ กรุณาเลือกช่วงเวลา",
                    icon: "error",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: '#263A50',
                    customClass: {
                        cancelButton: 'custom-cancel-button',
                    }
                });
                return;
            }
            Swal.fire({
                title: "ขอแก้ไขนัดหมาย",
                html:  `อัพเดตเป็นวันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} <br/> เวลา ${selectedTimeLabel}`,
                showConfirmButton: true,
                showCancelButton: true,
                icon: 'warning',
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
                confirmButtonColor: '#263A50',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'custom-confirm-button',
                    cancelButton: 'custom-cancel-button',
                }
            }).then(async(result) => {
                if (result.isConfirmed) {
                    await updateDoc(timetableRef, updatedTimetable);
                Swal.fire({
                    title: "ส่งคำขอแก้ไขนัดหมายสำเร็จ",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }

                });  
                navigate('/appointment');
                }
                else {
                    Swal.fire({
                        title: "แก้ไขไม่สําเร็จ",
                        icon: "error",
                        confirmButtonText: "ตกลง",
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                }
            });
            
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
        }
    };
    const [selectedCount, setSelectedCount] = useState(1);
    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
    };
    const [selectedTimeLabel, setSelectedTimeLabel] = useState(""); // Add this state
    return (

        <div className="user">
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>แก้ไขนัดหมาย</h3>
                </div>

                <NavbarUserComponent />
            </header>

            <div className="user-body">
                <div className="user-EditAppointment-Calendar_container">
                    <div className="user-EditAppointment-Canlendar_title">
                        <h3>ปฏิทิน</h3>
                        {AppointmentUserData && <p className="textBody-huge">{AppointmentUserData.appointment.clinic}</p>}
                    </div>
                </div>
                <div className="user-EditAppointment-Calendar">
                <CalendarUserComponentDate
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    onDateSelect={handleDateSelect}
                    
                    />

                </div>
                <form onSubmit={submitEditForm}>
                    <div className="user-EditAppointment-Dropdown_container gap-32" style={{ marginTop: 36 }}>
                        <div className="user-EditAppointment-Dropdown_title">
                            <h4>ช่วงเวลา</h4>
                        </div>
                        <select
                            name="time"
                            value={JSON.stringify(appointmentTime)}
                            onChange={(e) => {
                                setSelectedValue(e.target.value); 
                                handleSelectChange();
                                const selectedValue = JSON.parse(e.target.value);

                                if (selectedValue && typeof selectedValue === 'object') {
                                    const { timetableId, timeSlotIndex, label } = selectedValue;
                                    
                                    inputValue("appointmentTime")({
                                        target: {
                                            value: selectedValue,
                                        },
                                    });
                                    setSelectedTimeLabel(label || "");
                                    console.log(label)
                                    handleSelectChange();
                                } else if (e.target.value === "") {
                                    inputValue("appointmentTime")({
                                        target: {
                                            value: {},
                                        },
                                    });

                                    setSelectedTimeLabel("");

                                    handleSelectChange();
                                } else {
                                    console.error("Invalid selected value:", selectedValue);
                                }
                            }}
                            className={selectedCount >= 2 ? 'selected' : ''}
                        >
                            {timeOptions.map((timeOption, index) => (
                                <option
                                    key={`${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}`}
                                    value={index === 0 ? 0 : JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}
                                    hidden={index===0}
                                >
                                    {timeOption.label}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="user-EditAppointment-Reason_container gap-32">
                        <h4 className="user-EditAppointment-Reason_title">สาเหตุการนัดหมาย</h4>
                        <p className="user-EditAppointment-Reason">ตรวจรักษาโรค</p>
                    </div>

                    <div className="user-EditAppointment-Symptom_container gap-32">
                        <h4 className="user-EditAppointment-Symptom_title">อาการเบื้องต้น</h4>
                        <textarea
                            placeholder="อาการเบื้องต้น"
                            className="user-EditAppointment-Symptom"
                            value={appointmentSymptom}
                            onChange={inputValue("appointmentSymptom")}
                        ></textarea>
                    </div>
                    <div className="user-EditAppointment-Button_container gap-32">
                    <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary btn-systrm" target="_parent"/>
                    </div>
                                </form>
            </div>

        </div>

    )
}

export default UserEditAppointmentSpecial;