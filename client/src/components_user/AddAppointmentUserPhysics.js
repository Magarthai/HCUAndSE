import { useEffect, useState, useRef } from "react";
import "../css/AddAppointmentUser.css";
import NavbarUserComponent from './NavbarComponent';
import CalendarAddUserComponent from "./CalendarAddUserComponent";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import Swal from "sweetalert2";
import { useUserAuth } from "../context/UserAuthContext";
import { runTransaction } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const AddAppointmentUser = () => {
    const [selectedDate, setSelectedDate] = useState();
    const handleDateSelect = (selectedDate) => {
        setTimeOptions([]);
        setSelectedCount(1);
        setState((prevState) => ({
            ...prevState,
            appointmentTime: "",
          }));
        setAllAppointmentUsersData([]);
        setSelectedDate(selectedDate);
    };
    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
    };

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
                const timeTableCollection = collection(db, 'timeTable');
                const querySnapshot = await getDocs(query(
                    timeTableCollection,
                    where('addDay', '==', selectedDate.dayName),
                    where('clinic', '==', 'คลินิกกายภาพ'),
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
                        const appointmentQuerySnapshot2 = await getDocs(query(appointmentsCollection, where('appointmentDate2', '==', `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`)));
                        const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => doc.data().appointmentTime);
                        const existingAppointments2 = appointmentQuerySnapshot2.docs.map((doc) => doc.data().appointmentTime2);
                        
                        const availableTimeSlots = allTimeableLists.filter((timeSlot) =>
                            !existingAppointments.some(existingSlot =>
                                existingSlot.timetableId === timeSlot.timeTableId && existingSlot.timeSlotIndex === timeSlot.timeSlotIndex
                            ) && !existingAppointments2.some(existingSlot =>
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
                                .filter(timeSlot => timeSlot.type === 'talk')
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
    let isLoading = false;
    useEffect(() => {
        console.log("Updated timeOptions:", timeOptions);
    }, [timeOptions]);

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

            const appointmentInfo = {
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime:appointmentTime,
                appointmentId: appointmentId || null,
                appointmentCasue: "ตรวจรักษาโรค",
                appointmentSymptom: appointmentSymptom,
                clinic: "คลินิกกายภาพ",
                status: "ลงทะเบียนแล้ว",
                status2: "เสร็จสิ้น",
                subject: "เพิ่มนัดหมาย",
                appove: "",
                type: "talk",
                appointmentSymptom2: "",
                appointmentDate2: "",
                postPone: "",
                appointmentNotation: "",
                appointmentTime2: [],
                appointmentTimeOld: appointmentTime,
                appointmentDateOld: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            };
            await runTransaction(db, async (transaction) => {
                const appointmentsCollection = collection(db, 'appointment');

                const usersCollection = collection(db, 'users');
                const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
                const userDocuments = userQuerySnapshot.docs;

                console.log("userDocuments", userDocuments, appointmentId)
                const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
                const userId = userDocuments.length > 0 ? userDocuments[0].id : null;

                if (foundUser) {
                    const appointmentRef = await addDoc(collection(db, 'appointment'), appointmentInfo);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    const existingAppointmentsQuerySnapshot2 = await getDocs(query(
                        appointmentsCollection,
                        where('appointmentDate', '==', appointmentInfo.appointmentDate),
                        where('appointmentTime.timetableId', '==', appointmentInfo.appointmentTime.timetableId),
                        where('appointmentTime.timeSlotIndex', '==', appointmentInfo.appointmentTime.timeSlotIndex)
                    ));

                    const existingAppointmentsQuerySnapshot3 = await getDocs(query(
                        appointmentsCollection,
                        where('appointmentDate2', '==', appointmentInfo.appointmentDate),
                        where('appointmentTime2.timetableId', '==', appointmentInfo.appointmentTime.timetableId),
                        where('appointmentTime2.timeSlotIndex', '==', appointmentInfo.appointmentTime.timeSlotIndex)
                    ));
    
                    const b = existingAppointmentsQuerySnapshot2.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    const c = existingAppointmentsQuerySnapshot3.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    console.log(c,appointmentInfo.appointmentTime.timetableId,appointmentInfo.appointmentTime.timeSlotIndex,"XAFFASFASASFSAFSFA")
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

                    if (c.length > 0) { 
                        console.log('มีเอกสาร');
                        console.log('XD');
                        Swal.fire({
                            icon: "error",
                            title: "เกิดข้อผิดพลาด",
                            text: "มีคนเลื่อนนัดหมายโดยใช้เวลานี้แล้วโปรดเลือกเวลาใหม่!",
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

                    await updateDoc(userDocRef, {
                        appointments: arrayUnion(appointmentRef.id),
                    });


                    console.log(appointmentRef)
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
                    await fetchTimeTableData();

                    const encodedInfo = encodeURIComponent(JSON.stringify(appointmentInfo));
                    navigate(`/appointment/detail/${appointmentRef.id}?info=${encodedInfo}`);
                }
            });
        } catch (firebaseError) {
            console.error('Firebase submit error:', firebaseError);
            console.error('Firebase error response:', firebaseError);
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
                <label className="user-head-clinicname">คลินิกกายภาพ</label>

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
                                handleSelectChange();
                                const selectedValue = JSON.parse(e.target.value);

                                if (selectedValue && typeof selectedValue === 'object') {
                                    const { timetableId, timeSlotIndex } = selectedValue;
                                    inputValue("appointmentTime")({
                                        target: {
                                            value: { timetableId, timeSlotIndex },
                                        },
                                    });

                                    handleSelectChange();
                                } else if (e.target.value === "") {
                                    inputValue("appointmentTime")({
                                        target: {
                                            value: {},
                                        },
                                    });

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
                        <textarea placeholder="อาการเบื้องต้น" className="user-EditAppointment-Symptom" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")}></textarea>
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
