import { useEffect, useState, useRef } from "react";
import "../css/AddAppointmentUser.css";
import NavbarUserComponent from './NavbarComponent';
import CalendarAddUserComponent from "./CalendarAddUserComponent";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import Swal from "sweetalert2";
import { runTransaction } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const AddAppointmentUser = () => {
    const [selectedDate, setSelectedDate] = useState();
    const handleDateSelect = (selectedDate) => {
        setSelectedValue("");
        setTimeOptions([]);
        setSelectedCount(1);
        setState((prevState) => ({
            ...prevState,
            appointmentTime: "",
          }));
        setAllAppointmentUsersData([]);
        setSelectedDate(selectedDate);
        
    };

    const REACT_APP_API = process.env.REACT_APP_API;
    const [timeLabel, setTimeLabel] = useState("");
    const handleSelectChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const timeRange = selectedOption.textContent; // Extract time range from the label
        setTimeLabel(timeRange)
        setSelectedCount(selectedCount + 1);
    };
    const MONGO_API = process.env.REACT_APP_MONGO_API
    const [selectedValue, setSelectedValue] = useState("");
    
    const navigate = useNavigate();
    const { user, userData } = useUserAuth();
    const [timeOptions, setTimeOptions] = useState([]);
    const [selectedCount, setSelectedCount] = useState(1);
    const [isChecked, setIsChecked] = useState({});
    const [AllAppointmentUsersData, setAllAppointmentUsersData] = useState([]);
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
        userID:"",
    })

    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic, uid, timeablelist,userID } = state
    const isSubmitEnabled =
        !appointmentTime
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const fetchTimeTableData = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                const info = {
                    date: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                }
                const checkDate = await axios.post(`${MONGO_API}/api/checkDateHoliday`, info); 
                if(checkDate.data == "Date exits!") {
                    console.log("Date exits!");
                    const noTimeSlotsAvailableOption = { label: "วันหยุดทําการ กรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptions([noTimeSlotsAvailableOption]);
                    return
                }
                const timeTableCollection = collection(db, 'timeTable');
                const querySnapshot = await getDocs(query(
                    timeTableCollection,
                    where('addDay', '==', selectedDate.dayName),
                    where('clinic', '==', 'คลินิกทั่วไป'),
                    where('status', '==', 'Enabled')
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

                        if (timeOptionsFromTimetable.length <= 1) {
                            console.log("Time table not found for selected day and clinic");
                            const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                            setTimeOptions([noTimeSlotsAvailableOption]);
                            console.log("notime",timeOptions)
                        }else {
                        console.log("Before setTimeOptions", timeOptionsFromTimetable);
                        setTimeOptions(timeOptionsFromTimetable);
                        console.log("After setTimeOptions", timeOptions);
                        console.log(timeOptions)
                        }
                    } else {
                        console.log("Time table not found for selected day and clinic");
                        const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                        setTimeOptions([noTimeSlotsAvailableOption]);
                        console.log("notime",timeOptions)
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

    useEffect(() => {
        document.title = 'Health Care Unit';
        fetchTimeTableData();
        if (userData) {
            setState((prevState) => ({
              ...prevState,
              appointmentId: userData.id,
            }));
          }

        
    }, [selectedDate,userData]);

    useEffect(() => {
        console.log("Updated timeOptions:", timeOptions);
        console.log(appointmentTime)
    }, [timeOptions]);
    
let isLoading = false;

const submitForm = async (e) => {
    e.preventDefault();
    console.log(appointmentId);

    if (isLoading) {
        return;
    }

    try {
        isLoading = true;

        const isTimeSlotAvailable = checkTimeSlotAvailability();
        if (!isTimeSlotAvailable) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่เหลือช่วงเวลาว่างสําหรับวันนี้ โปรดเลือกวันอื่น",
                confirmButtonText: "ตกลง",
                confirmButtonColor: '#263A50',
                customClass: {
                    cancelButton: 'custom-cancel-button',
                }
            });
            return;
        }
        const selectedTimeLabel = timeOptions.find((timeOption) => {
            const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
            return optionValue === selectedValue;
        })?.label;
        Swal.fire({
            title: 'ยืนยันนัดหมาย',
            html: `ยืนยันที่จะนัดหมายเป็นวันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#263A50',
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then(async(result) => {
            if (result.isConfirmed) {
        const appointmentInfo = {
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime,
            appointmentId: appointmentId || null,
            appointmentCasue: "ตรวจรักษาโรค",
            appointmentSymptom: appointmentSymptom,
            clinic: "คลินิกทั่วไป",
            status: "ลงทะเบียนแล้ว",
            status2: "เสร็จสิ้น",
            subject: "เพิ่มนัดหมาย",
            appove: "",
            appointmentSymptom2: "",
            appointmentNotation: "",
            appointmentDate2: "",
            postPone: "",
            appointmentTime2: [],
        };
        const timeTableDocRef = doc(db, 'timeTable', appointmentInfo.appointmentTime.timetableId);
            const querySnapshot = await getDoc(timeTableDocRef);
            if (querySnapshot.exists()){
                const timeTableData = querySnapshot.data();
                if (timeTableData.isDelete === "Yes" || timeTableData.status === "Disabled") {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        html: `เวลาถูกปิดไม่ให้ไม่สามารถนัดหมายได้แล้ว!`,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    }).then((result) => {
                        window.location.reload();
                    });
                    return;
                }
            }
        await runTransaction(db, async (transaction) => {
            const appointmentsCollection = collection(db, 'appointment');
            const usersCollection = collection(db, 'users');
            const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
            const userDocuments = userQuerySnapshot.docs;
            const timeTableDocRef = doc(db, 'timeTable', appointmentInfo.appointmentTime.timetableId);

            
        
            console.log("userDocuments", userDocuments, appointmentId)
            const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
            const userId = userDocuments.length > 0 ? userDocuments[0].id : null;

            if (foundUser) {
                const appointmentRef = await addDoc(collection(db, 'appointment'), appointmentInfo);
                const existingAppointmentsQuerySnapshot2 = await getDocs(query(
                    appointmentsCollection,
                    where('appointmentDate', '==', appointmentInfo.appointmentDate),
                    where('appointmentTime.timetableId', '==', appointmentInfo.appointmentTime.timetableId),
                    where('appointmentTime.timeSlotIndex', '==', appointmentInfo.appointmentTime.timeSlotIndex)
                ));

                const b = existingAppointmentsQuerySnapshot2.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                
                if (b.length > 1) { 
                    console.log('มีเอกสาร');
                    console.log('XD');
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        text: "มีคนเลือกเวลานี้แล้วโปรดเลือกเวลาใหม่!",
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: '#263A50',
                        customClass: {
                            cancelButton: 'custom-cancel-button',
                        }
                    });
                    await deleteDoc(doc(db, 'appointment', appointmentRef.id));
                    return;
                }

                const userDocRef = doc(db, 'users', userId);

                const timeTableAppointment = {appointmentId: appointmentRef.id, appointmentDate: appointmentInfo.appointmentDate}
                await updateDoc(userDocRef, {
                    appointments: arrayUnion(appointmentRef.id),
                });
                await updateDoc(timeTableDocRef, {
                    appointmentList: arrayUnion(timeTableAppointment),
                });

                Swal.fire({
                    icon: "success",
                    title: "การนัดหมายสําเร็จ!",
                    text: "การนัดหมายของคุณถูกสร้างเรียบร้อยแล้ว!",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: '#263A50',
                    customClass: {
                        cancelButton: 'custom-cancel-button',
                    }
                });
                const info = {
                    role: userData.role,
                    date: appointmentInfo.appointmentDate,
                    time: timeLabel,
                    clinic: appointmentInfo.clinic,
                    id: appointmentInfo.appointmentId,
                };
                const respone = await axios.post(`${REACT_APP_API}/api/NotificationAddAppointment`, info);
                
                await fetchTimeTableData();

                const encodedInfo = encodeURIComponent(JSON.stringify(appointmentInfo));
                navigate(`/appointment/detail/${appointmentRef.id}?info=${encodedInfo}`);
            }
        });}else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            Swal.fire(
                {
                    title: 'เกิดข้อผิดพลาด!',
                    text: `นัดหมายไม่สําเร็จ`,
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                }
            )
        }});
    } 
    catch (firebaseError) {
        console.error('Firebase submit error:', firebaseError);
        console.error('Firebase error response:', firebaseError);
        return;
    } finally {
        isLoading = false; 
    }
};


    const checkTimeSlotAvailability = () => {
        try {
            if (timeOptions.length === 0) {
                return false;
            }
    
            const selectedTimeSlot = appointmentTime;
            const existingAppointments = AllAppointmentUsersData.map(appointment => appointment.appointmentTime);
    
            const isSlotAvailable = timeOptions.some(timeSlot => {
                if (JSON.stringify(timeSlot.value) === JSON.stringify(selectedTimeSlot)) {
                    return !existingAppointments.includes(JSON.stringify(selectedTimeSlot));
                }
                return false;
            });
    
            return isSlotAvailable;
        } catch (error) {
            console.error('Error checking time slot availability:', error);
            return false;
        }
    };
    
    

    return (
        <div className="user">
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>ขอนัดหมาย</h3>
                </div>

                <NavbarUserComponent />
            </header>

            <body className="user-body">
                <h3 className="user-head-context">ปฏิทิน</h3>
                <label className="user-head-clinicname">คลินิกทั่วไป</label>

                <div className="CalendarUser">
                    <CalendarAddUserComponent
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onDateSelect={handleDateSelect}
                    />
                </div>
                <form onSubmit={submitForm}>
                    <div className="user-EditAppointment-Dropdown_container gap-32" style={{ marginTop: 36 }}>
                        <div className="user-EditAppointment-Dropdown_title">
                            <h4>ช่วงเวลา</h4>
                        </div>
                        <select
                            name="time"
                            value={JSON.stringify(appointmentTime)}
                            onChange={(e) => {
                                setSelectedValue(e.target.value);
                                handleSelectChange(e);
                                const selectedValue = JSON.parse(e.target.value);

                                if (selectedValue && typeof selectedValue === 'object') {
                                    const { timetableId, timeSlotIndex } = selectedValue;
                                    inputValue("appointmentTime")({
                                        target: {
                                            value: { timetableId, timeSlotIndex },
                                        },
                                    });

                                    handleSelectChange(e);
                                } else if (e.target.value === "") {
                                    inputValue("appointmentTime")({
                                        target: {
                                            value: {},
                                        },
                                    });

                                    handleSelectChange(e);
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h4 className="user-EditAppointment-Symptom_title" style={{ flexGrow: 1 }}>อาการเบื้องต้น</h4>
                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentSymptom.length > 135 ? 'red' : 'grey' }}>{appointmentSymptom.length}/135</span>
                        </div>
                        <textarea placeholder="อาการเบื้องต้น" className="user-EditAppointment-Symptom" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} maxLength={135}></textarea>
                    </div>
                    <div className="user-EditAppointment-Button_container gap-32">
                    <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                    </div>
                </form>
            </body>
        </div>

    )
}

export default AddAppointmentUser;
