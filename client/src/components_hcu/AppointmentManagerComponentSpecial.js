import NavbarComponent from "./NavbarComponent";
import CalendarAdminComponent from "./CalendarAdminComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection, doc} from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion ,deleteDoc,arrayRemove } from 'firebase/firestore';
import { PulseLoader } from "react-spinners";
import { GetTimeOptionsFromTimetable } from "../backend/timeOptions";
import 'react-datepicker/dist/react-datepicker.css';
import Swal from "sweetalert2";
import { availableTimeSlotsSpecial, fetchAppointmentUsersDataSpecial, fetchTimeTableDataFromSpecial, fetchTimeTableDataSpecial, fetchUserDataWithAppointmentsSpecial } from "../backend/backendSpecial";
import ClockComponent from "../utils/ClockComponent";
import icon_date from "../picture/datepicker.png"
import DatePicker from "react-datepicker";

const AppointmentManagerComponentSpecial = (props) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const { user, userData } = useUserAuth();
    const [isChecked, setIsChecked] = useState({});
    const [timeOptions, setTimeOptions] = useState([]);
    
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
        appointmentDater: "",
        appointmentTimer: "",
        appointmentIdr: "",
        appointmentCasuer: "",
        appointmentSymptomr: "",
        appointmentNotationr: "",
        clinicr: "",
        uidr: "",
        timeablelistr: "",
    })

    

    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic, uid, timeablelist ,appointmentDater,appointmentTimer,appointmentCasuer,appointmentSymptomr,appointmentNotationr} = state
    const isSubmitEnabled =
    !appointmentDate || !appointmentTime || !appointmentId;
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const fetchTimeTableData = async () => {
        try {

            const timeTableData = await fetchTimeTableDataFromSpecial(user, selectedDate);
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
                       
                    } else {

                    }

                    const availableTimeSlots = allTimeableLists.filter((timeSlot) =>
                        !existingAppointments.some(existingSlot =>
                            existingSlot.timetableId === timeSlot.timeTableId && existingSlot.timeSlotIndex === timeSlot.timeSlotIndex
                        )
                    );


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
                        const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการ กรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                        setTimeOptions([noTimeSlotsAvailableOption]);
                    } else {
                        setTimeOptions(timeOptionsFromTimetable);
                    }
                } else {
                    const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptions([noTimeSlotsAvailableOption]);
                }

            } else {
                const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการกรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                setTimeOptions([noTimeSlotsAvailableOption]);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserDataWithAppointments = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                const existingAppointments = await fetchUserDataWithAppointmentsSpecial(user, selectedDate);
                console.log("existingAppointments", existingAppointments);
                if (existingAppointments.length > 0) {
                    const AppointmentUsersDataArray = await fetchAppointmentUsersDataSpecial(existingAppointments);
                    console.log("AppointmentUsersDataArray",AppointmentUsersDataArray)
                    if (AppointmentUsersDataArray.length > 0) {
                        setAllAppointmentUsersData(AppointmentUsersDataArray);
                        console.log("AppointmentUsersData", AppointmentUsersDataArray);
                    } else {
                        console.log("No user details found for any appointmentId");
                    }
                    console.log("AppointmentUsersDataArray", AppointmentUsersDataArray);
                    setAllAppointmentUsersData(AppointmentUsersDataArray);
                    console.log("AppointmentUsersData", AppointmentUsersDataArray);
                } else {
                    console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data with appointments:', error);
        }
    };

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    const DateToCheck = `${date}/${month}/${year}`
    const [selectedCount, setSelectedCount] = useState(1);

    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
        console.log(selectedCount)
    };
    const [selectedValue, setSelectedValue] = useState("");
    const submitForm = async (e) => {
        e.preventDefault();

        try {

            const appointmentInfo = {
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime,
                appointmentId: appointmentId || null,
                appointmentCasue,
                appointmentSymptom,
                appointmentNotation,
                clinic: "คลินิกเฉพาะทาง",
                status: "ลงทะเบียนแล้ว",
                status2: "เสร็จสิ้น",
                subject: "เพิ่มนัดหมาย",
                appove: "",
                appointmentSymptom2: "",
                appointmentDate2: "",
                postPone: "",
                appointmentTime2: [],
            };

            const usersCollection = collection(db, 'users');

            const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
            const userDocuments = userQuerySnapshot.docs;
            const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
            const userId = userDocuments.length > 0 ? userDocuments[0].id : null;
            if (foundUser.role === "admin") {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด!",
                    text: "ไม่สามารถสร้างนัดหมายสําหรับ Admin ได้!",
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                })
            } else {
                if (foundUser) {
                    const userDocRef = doc(db, 'users', userId);
                   
                    const selectedTimeLabel = timeOptions.find((timeOption) => {
                        const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                        return optionValue === selectedValue;
                    })?.label;
                    
                    Swal.fire({
                        title: 'ยืนยันเพิ่มนัดหมาย',
                        html: `ยืนยันที่จะนัดหมายวันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
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
                            try {
                                    if (result.isConfirmed) {
                                        const appointmentRef = await addDoc(collection(db, 'appointment'), appointmentInfo);
                                        
                                        const appointmentsCollection = collection(db, 'appointment');
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
                                        await updateDoc(userDocRef, {
                                            appointments: arrayUnion(appointmentRef.id),
                                        });
                                        Swal.fire(
                                            {
                                                title: 'สําเร็จ!',
                                                text: `การเพิ่มนัดหมายสำเร็จ!`,
                                                icon: 'success',
                                                confirmButtonText: 'ตกลง',
                                                confirmButtonColor: '#263A50',
                                                customClass: {
                                                    confirmButton: 'custom-confirm-button',
                                                }
                                            }
                                        )
                                        window.location.reload();
                                    }

                            } catch(firebaseError) {
                                Swal.fire(
                                    {
                                        title: 'เกิดข้อผิดพลาด!',
                                        text: firebaseError,
                                        icon: 'success',
                                        confirmButtonText: 'ตกลง',
                                        confirmButtonColor: '#263A50',
                                        customClass: {
                                            confirmButton: 'custom-confirm-button',
                                        }
                                    }
                                )
                            }

                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            Swal.fire(
                                {
                                    title: 'เกิดข้อผิดพลาด!',
                                    text: `การเพิ่มนัดหมายไม่สำเร็จ`,
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

                else {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ไม่พบรหัสนักศึกษา!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                }
            }

        } catch (firebaseError) {
            console.error('Firebase submit error:', firebaseError);

            console.error('Firebase error response:', firebaseError);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถสร้างนัดหมายได้ กรุณาลองอีกครั้งในภายหลัง.",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
        }
    };


    const submitEditForm = async (e) => {
        e.preventDefault();
        try {
            const timetableRef = doc(db, 'appointment', uid);
            console.log(uid);
    
            const updatedTimetable = {
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime: appointmentTime,
                appointmentId: appointmentId,
                appointmentCasue: appointmentCasue,
                appointmentSymptom: appointmentSymptom,
                appointmentNotation: appointmentNotation,
                clinic: "คลินิกเฉพาะทาง",
                status: "ลงทะเบียนแล้ว",
            };
            const updatedTimetableRollBack = {
                appointmentDate: appointmentDater,
                appointmentTime: appointmentTimer,
                appointmentId: appointmentId,
                appointmentCasue: appointmentCasuer,
                appointmentSymptom: appointmentSymptomr,
                appointmentNotation: appointmentNotationr,
                clinic: "คลินิกเฉพาะทาง",
                status: "ลงทะเบียนแล้ว",
            };
            const selectedTimeLabel = timeOptions.find((timeOption) => {
                const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                return optionValue === selectedValue;
            })?.label;
            Swal.fire({
                title: 'ยืนยันแก้นัดหมาย',
                html: `ยืนยันที่จะแก้ไข้นัดหมายเป็นวันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
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
                    try {
                        const appointmentsCollection = collection(db, 'appointment');
                        await updateDoc(timetableRef, updatedTimetable);
                        const existingAppointmentsQuerySnapshot2 = await getDocs(query(
                            appointmentsCollection,
                            where('appointmentDate', '==', updatedTimetable.appointmentDate),
                            where('appointmentTime.timetableId', '==', updatedTimetable.appointmentTime.timetableId),
                            where('appointmentTime.timeSlotIndex', '==', updatedTimetable.appointmentTime.timeSlotIndex)
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
                            await updateDoc(timetableRef, updatedTimetableRollBack);
                            return;
                        }
                        Swal.fire({
                            icon: "success",
                            title: "การอัปเดตการนัดหมายสำเร็จ!",
                            text: "การนัดหมายถูกอัปเดตเรียบร้อยแล้ว!",
                            confirmButtonText: 'ตกลง',
                            confirmButtonColor: '#263A50',
                            customClass: {
                                confirmButton: 'custom-confirm-button',
                            }
                        }
                        ).then(async (result) => {
                            if (result.isConfirmed) {
                                
                                window.location.reload();
                            }
                        });
                    } catch(firebaseError) {
                        Swal.fire(
                            {
                                title: 'เกิดข้อผิดพลาด!',
                                text: firebaseError,
                                icon: 'success',
                                confirmButtonText: 'ตกลง',
                                confirmButtonColor: '#263A50',
                                customClass: {
                                    confirmButton: 'custom-confirm-button',
                                }
                            }
                        )
                    }

                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Swal.fire(
                        {
                            title: 'เกิดข้อผิดพลาด!',
                            text: `การแก้ไข้นัดหมายไม่สำเร็จ`,
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
            catch (firebaseError) {
                console.error('Firebase submit error:', firebaseError);

                console.error('Firebase error response:', firebaseError);
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด!",
                    text: "ไม่สามารถสร้างนัดหมายได้ กรุณาลองอีกครั้งในภายหลัง.",
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#263A50',
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }
                });
            }
        }

    const getDayName = (date) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    };
    
    const [saveDetailId, setsaveDetailId] = useState([])
    const [saveEditId, setsaveEditId] = useState([])

    const openDetailAppointment = (element,AppointmentUsersData) => {
        let x = document.getElementById("detail-appointment");
        let y = document.getElementById("add-appointment");
        let z = document.getElementById("edit-appointment");
        
        if (window.getComputedStyle(x).display === "none") {
            if(window.getComputedStyle(z).display === "block" && saveEditId === AppointmentUsersData.appointmentuid ){
                element.stopPropagation();
            }
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveEditId("")
            setsaveDetailId(AppointmentUsersData.appointmentuid)
            console.log(AppointmentUsersData.timeslot.start)
            const statusElement = document.getElementById("detail-appointment-status");
            if (statusElement) {
                statusElement.innerHTML = `${AppointmentUsersData.appointment.status}`;
            }
            document.getElementById("detail-appointment-date").innerHTML = `<b>วันที่</b> : ${AppointmentUsersData.appointment.appointmentDate}`
            document.getElementById("detail-appointment-time").innerHTML = `<b>เวลา</b> : ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
            document.getElementById("detail-appointment-id").innerHTML = `<b>รหัสนักศึกษา</b> : ${AppointmentUsersData.id}`
            document.getElementById("detail-appointment-name").innerHTML = `<b>ชื่อ</b> :  ${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`
            document.getElementById("detail-appointment-casue").innerHTML = `<b>สาเหตุการนัดหมาย</b> : ${AppointmentUsersData.appointment.appointmentCasue}`
            document.getElementById("detail-appointment-symptom").innerHTML = `<b>อาการเบื้องต้น</b> : ${AppointmentUsersData.appointment.appointmentSymptom}`
            document.getElementById("detail-appointment-notation").innerHTML = `<b>หมายเหตุ</b> : ${AppointmentUsersData.appointment.appointmentNotation}`
            
        } else {
            if(saveDetailId === AppointmentUsersData.appointmentuid){
                x.style.display = "none";
                setsaveDetailId("")
            }else{
                setsaveDetailId(AppointmentUsersData.appointmentuid)
                console.log(AppointmentUsersData.timeslot.start)
                const statusElement = document.getElementById("detail-appointment-status");
                if (statusElement) {
                    statusElement.innerHTML = `${AppointmentUsersData.appointment.status}`;
                }
                document.getElementById("detail-appointment-date").innerHTML = `<b>วันที่</b> : ${AppointmentUsersData.appointment.appointmentDate}`
                document.getElementById("detail-appointment-time").innerHTML = `<b>เวลา</b> : ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
                document.getElementById("detail-appointment-id").innerHTML = `<b>รหัสนักศึกษา</b> : ${AppointmentUsersData.id}`
                document.getElementById("detail-appointment-name").innerHTML = `<b>ชื่อ</b> :  ${AppointmentUsersData.firstName} ${AppointmentUsersData.lastName}`
                document.getElementById("detail-appointment-casue").innerHTML = `<b>สาเหตุการนัดหมาย</b> : ${AppointmentUsersData.appointment.appointmentCasue}`
                document.getElementById("detail-appointment-symptom").innerHTML = `<b>อาการเบื้องต้น</b> : ${AppointmentUsersData.appointment.appointmentSymptom}`
                document.getElementById("detail-appointment-notation").innerHTML = `<b>หมายเหตุ</b> : ${AppointmentUsersData.appointment.appointmentNotation}`
            }

        }
    }

    const openAddAppointment = () => {
        setState((prevState) => ({
            ...prevState,
            appointmentTime: "",
            appointmentId: "",
            appointmentCasue: "",
            appointmentSymptom: "",
            appointmentNotation: "",
            clinic: "",
            uid: "",
        }));
        adminCards.forEach(card => card.classList.remove('focused'));
        let x = document.getElementById("add-appointment");
        let y = document.getElementById("detail-appointment");
        let z = document.getElementById("edit-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId("")

        } else {
            x.style.display = "none";


        }

    }

    const openEditAppointment = async (element,AppointmentUsersData) => {
        console.log("Edit appointment data:", AppointmentUsersData.appointment.appointmentuid);
        console.log(AppointmentUsersData.appointment.appointmentuid)
        let x = document.getElementById("edit-appointment");
        let y = document.getElementById("add-appointment");
        let z = document.getElementById("detail-appointment");

        setState((prevState) => ({
            ...prevState,
            appointmentDate: AppointmentUsersData.appointment.appointmentDate,
            appointmentTime: null,
            appointmentId: AppointmentUsersData.appointment.appointmentId,
            appointmentCasue: AppointmentUsersData.appointment.appointmentCasue,
            appointmentSymptom: AppointmentUsersData.appointment.appointmentSymptom,
            appointmentNotation: AppointmentUsersData.appointment.appointmentNotation,
            clinic: AppointmentUsersData.appointment.clinic,
            uid: AppointmentUsersData.appointment.appointmentuid,
            typecheck: AppointmentUsersData.appointment.type
        }));
        setState((prevState) => ({
            ...prevState,
            appointmentDater: AppointmentUsersData.appointment.appointmentDate,
            appointmentTimer: AppointmentUsersData.appointment.appointmentTime,
            appointmentCasuer: AppointmentUsersData.appointment.appointmentCasue,
            appointmentSymptomr: AppointmentUsersData.appointment.appointmentSymptom,
            appointmentNotationr: AppointmentUsersData.appointment.appointmentNotation,
            typecheckr: AppointmentUsersData.appointment.type
        }));
        let [day, month, year] = AppointmentUsersData.appointment.appointmentDate.split("/");
        setDatePicker(new Date(year, month-1, day))
        if (window.getComputedStyle(x).display === "none") {
            if(window.getComputedStyle(z).display === "block" && saveDetailId === AppointmentUsersData.appointment.appointmentuid){
                element.stopPropagation();
            }
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId(AppointmentUsersData.appointmentuid)
            document.getElementById("timeslotxd").innerHTML = `ช่วงเวลาเดิม: ${AppointmentUsersData.timeslot.start}-${AppointmentUsersData.timeslot.end}`
        } else {
            if (saveEditId === AppointmentUsersData.appointmentuid) {
                x.style.display = "none";
                setsaveEditId("")
                document.getElementById("timeslotxd").innerHTML = `ช่วงเวลาเดิม: ${AppointmentUsersData.timeslot.start} - ${AppointmentUsersData.timeslot.end}`
            } else {
                setsaveEditId(AppointmentUsersData.appointmentuid)
                document.getElementById("timeslotxd").innerHTML = `ช่วงเวลาเดิม: ${AppointmentUsersData.timeslot.start} - ${AppointmentUsersData.timeslot.end}`
            }
        }
    }

    const DeleteAppointment = async (appointmentuid, uid,AppointmentUserData) => {
        const timetableRef = doc(db, 'appointment', appointmentuid);
    
        Swal.fire({
            title: 'ลบนัดหมาย',
            text: `วันที่ ${AppointmentUserData.appointment.appointmentDate} เวลา ${AppointmentUserData.timeslot.start}-${AppointmentUserData.timeslot.end}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#DC2626',
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
                            
                            title: 'การลบการนัดหมายสำเร็จ!',
                            text: `การนัดหมายถูกลบเรียบร้อยแล้ว!`,
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
                        title: 'เกิดข้อผิดพลาด!',
                        text: `ไม่สามารถลบการนัดหมายได้ กรุณาลองอีกครั้งในภายหลัง`,
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

    const handleDateSelect = (selectedDate) => {
        console.log("Selected Date in AppointmentManager:", selectedDate);
        setAllAppointmentUsersData([]);
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
        let x = document.getElementById("edit-appointment");
        let z = document.getElementById("detail-appointment");

        setState((prevState) => ({
            ...prevState,
            appointmentTime: "",
            appointmentId: "",
            appointmentCasue: "",
            appointmentSymptom: "",
            appointmentNotation: "",
            clinic: "",
            uid: "",
            typecheck: ""
        }));
        x.style.display = "none";
        z.style.display = "none";

    };

    const formatDateForDisplay = (isoDate) => {
        const dateParts = isoDate.split("-");
        if (dateParts.length === 3) {
            const [year, month, day] = dateParts;

            const formattedMonth = parseInt(month, 10).toString();
            const formattedDay = parseInt(day, 10).toString();

            const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

            const dayName = getDayName(new Date(isoDate)).toLowerCase();
            const formattedSelectedDate = {
                day: formattedDay,
                month: formattedMonth,
                year: year,
                dayName: dayName,
            };

            setAllAppointmentUsersData([]);
            setSelectedDate(formattedSelectedDate);
            setState({
                ...state,
                appointmentDate: `${formattedDay}/${formattedMonth}/${year}`,
                appointmentTime: "",
            });

            return formattedDate;
        }
        return isoDate;
    }

    const [datePicker, setDatePicker] = useState(null);
    const handleChange = (e) => {
        const date1 =  `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`
        console.log("Formatted Date:", `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`);
        if (!isNaN(e)) {
          setDatePicker(e);
          const formattedDate = formatDateForDisplay(date1);
          console.log("Formatted Date:", formattedDate);
        }else {
          console.error("Invalid date value:", e);
        }
    };
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    const closeEditAppointment = () => {
        setState((prevState) => ({
            ...prevState,
            appointmentTime: "",
            appointmentId: "",
            appointmentCasue: "",
            appointmentSymptom: "",
            appointmentNotation: "",
            clinic: "",
            uid: "",
            appointmentDater: "",
            appointmentTimer: "",
            appointmentCasuer:"",
            appointmentSymptomr: "",
            appointmentNotationr: "",
            typecheckr: "",
        }));
        adminCards.forEach(card => card.classList.remove('focused'));
        let x = document.getElementById("add-appointment");
        let y = document.getElementById("detail-appointment");
        let z = document.getElementById("edit-appointment");
        if (window.getComputedStyle(x).display === "none") {
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId("")
            setSelectedCount(1)
        } else {
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId("")
            setSelectedCount(1)
        }
    }
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        fetchTimeTableData();
        console.log("timeoption", timeOptions)
        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };
        console.log(selectedDate)
        responsivescreen();
        window.addEventListener("resize", responsivescreen);

            fetchUserDataWithAppointments();
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 500);
        console.log("AppointmentUsersData XD", AppointmentUsersData)
        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };

    }, [selectedDate]);
    const containerStyle = {
        zoom: zoomLevel,
    };

    const adminCards = document.querySelectorAll('.admin-appointment-card');

    function handleCardClick(event) {
        let currentCard = event.currentTarget
        let isFocused = currentCard.classList.contains('focused')
        if(isFocused){
            currentCard.classList.remove('focused');

        }else{
            adminCards.forEach(card => card.classList.remove('focused'));
            currentCard.classList.add('focused');
        }
    }

    const statusClassMap = {
        'ยืนยันสิทธิ์แล้ว': 'confirmed-background',
        'เสร็จสิ้น': 'completed-background',
        'ไม่สำเร็จ': 'failed-background',
        'ลงทะเบียนแล้ว': 'pending-confirmation-background',
        'รอยืนยันสิทธิ์': 'pending-confirmation-background'
    };

    function changeStatusTextColor(element) {
        const trimmedStatusText = element.textContent.trim();
        const colorMap = {
            'เสร็จสิ้น': '#098B66',
            'ไม่สำเร็จ': '#C11F1F',
            'ยืนยันสิทธิ์แล้ว': '#D88C09',
            'ลงทะเบียนแล้ว': '#A1A1A1',
            'รอยืนยันสิทธิ์': '#A1A1A1'
        };

        if (colorMap.hasOwnProperty(trimmedStatusText)) {
            element.style.color = colorMap[trimmedStatusText];
        }   
    }

    const statusElements = document.querySelectorAll('.admin-appointment-status');
    statusElements.forEach(changeStatusTextColor);

    const statusElementDetail = document.getElementById("detail-appointment-status");

    if (statusElementDetail) {
        const trimmedStatusTextDetail = statusElementDetail.textContent.trim();
        const statusClassDetail = statusClassMap[trimmedStatusTextDetail];

        if (statusClassDetail) {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add(statusClassDetail);
        }
    }
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setDate(0)

    return (
        <div className="appointment" style={containerStyle}>
            <NavbarComponent />
            <div className="admin-topicBox colorPrimary-800">
                <div></div>
                <div>
                    <h1 className="center">ระบบการจัดการนัดหมาย</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large admin-time">Time : <ClockComponent/></p>
                </div>
            </div>
            {isLoading ? (
        <div className="loading-spinner">

          <PulseLoader size={15} color={"#54B2B0"} loading={isLoading} />
        </div>
      ) : (
            <div className="admin">
            <div className="admin-header">
                <div className="admin-hearder-item">
                        <a href="/AppointmentManagerComponent" target="_parent" >คลินิกทั่วไป</a>
                        <a href="/AppointmentManagerComponentSpecial" target="_parent" id="select">คลินิกเฉพาะทาง</a>
                        <a href="/AdminAppointmentManagerPhysicalComponent" target="_parent">คลินิกกายภาพ</a>
                        <a href="/adminAppointmentManagerNeedleComponent" target="_parent" >คลินิกฝังเข็ม</a>
                </div>
                <div className="admin-hearder-item admin-right">
                    <a href="/adminAppointmentRequestManagementComponent" target="_parent">รายการขอนัดหมาย</a>
                </div>
            </div>
            <div className="admin-appointment-flex">
                <CalendarAdminComponent
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    onDateSelect={handleDateSelect}
                />
                <div className="admin-appointment-box">
                    <div >
                        <div className="appointment-hearder">
                            <div className="colorPrimary-800 appointment-hearder-item">
                                <h2>นัดหมายคลินิกเฉพาะทาง</h2>
                                <p className="admin-textBody-large">
                                    {selectedDate
                                        ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                        : `${date}/${month}/${year}`}
                                </p>

                            </div>
                            <button type="button" className="appointment-hearder-item" onClick={openAddAppointment}>เพิ่มนัดหมาย +</button>
                        </div>
                        <div className="admin-appointment-box-card">
                        {AppointmentUsersData.sort((a, b) => a.timeslot.start.localeCompare(b.timeslot.start)).map((AppointmentUserData, index) => (
                            <div className="admin-appointment-card colorPrimary-800" key={index} onClick={handleCardClick}>
                                <div className="admin-appointment-card-detail" onClick={(event) => openDetailAppointment(event,AppointmentUserData)}>
                                    <div className="admin-appointment-card-time admin-textBody-small">
                                        {AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}
                                    </div>
                                    <div className="admin-appointment-info flex-column">
                                        <p id="student-id" className="admin-textBody-huge">{AppointmentUserData.id}</p>
                                        <p id="student-name" className="admin-textBody-small">{`${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`}</p>
                                    </div>
                                </div>
                                <div className="admin-appointment-functon">
                                    {`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}` === DateToCheck ? (
                                        <p style={{justifyContent:"center",display:"flex",alignItems:"center",margin:0,marginRight:10}} className="admin-appointment-status admin-textBody-small">{`${AppointmentUserData.appointment.status}`}</p>
                                    ) : (
                                        <>
                                            <img src={edit} className="icon_apppointment" onClick={(event) =>  openEditAppointment(event,AppointmentUserData)} />
                                            <img src={icon_delete} className="icon_apppointment" onClick={() => DeleteAppointment(AppointmentUserData.appointment.appointmentuid, AppointmentUserData.userUid,AppointmentUserData)} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                </div>
                <div className="admin-appointment-box">
                    <div id="detail-appointment" className="colorPrimary-800">
                        {selectedDate && `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}` === DateToCheck ? (
                            <div className="admin-appointment-detail-header">
                                <div className="admin-appointment-detail-header-items2"></div>
                                <h2 className="admin-appointment-detail-header-items1 center">รายละเอียดนัดหมาย</h2>
                                <div className="admin-appointment-detail-header-items2 admin-right" ><span id="detail-appointment-status">ยืนยันสิทธ์แล้ว</span></div>
                            </div>
                            ) : (<h2 className="center">รายละเอียดนัดหมาย</h2>)}
                        <p id="detail-appointment-date" className="admin-textBody-big"></p>
                        <p id="detail-appointment-time" className="admin-textBody-big"><b>เวลา</b> : 13:01 - 13:06</p>
                        <p id="detail-appointment-id" className="admin-textBody-big"><b>รหัสนักศึกษา</b>: 64090500301</p>
                        <p id="detail-appointment-name" className="admin-textBody-big"><b>ชื่อ</b>: อรัญญา พุ่มสนธิ</p>
                        <p id="detail-appointment-casue" className="admin-textBody-big"><b>สาเหตุการนัดหมาย</b>: ตรวจรักษาโรค</p>
                        <p id="detail-appointment-symptom" className="admin-textBody-big"><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                        <p id="detail-appointment-notation" className="admin-textBody-big"><b>หมายเหตุ</b>: -</p>
                    </div>
                    <div id="add-appointment" className="colorPrimary-800">
                        <form onSubmit={submitForm}>
                            <h2 className="center">เพิ่มนัดหมาย</h2>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                                <p className="admin-textBody-big">{selectedDate
                                    ? `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
                                    : "Select a date"}</p>
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลา</label>
                                <select
                                    name="time"
                                    value={JSON.stringify(appointmentTime)}
                                    onChange={(e) => {
                                        setSelectedValue(e.target.value);
                                        handleSelectChange();
                                        const selectedValue = JSON.parse(e.target.value);

                                        if (selectedValue && typeof selectedValue === 'object') {
                                            const { timetableId, timeSlotIndex } = selectedValue;
                                            console.log("timetableId:", timetableId);
                                            console.log("timeSlotIndex:", timeSlotIndex);

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
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา/รหัสพนักงาน</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId} onChange={inputValue("appointmentId")} placeholder="64000000000 หรือ 00000" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดหมาย</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="เป็นไข้" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="ปวดหัว, ตัวร้อน" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="เป็นไข้หวัดทั่วไป" />
                            </div>
                            <div className="admin-timetable-btn">
                                <button type="button" onClick={closeEditAppointment} className="btn-secondary btn-systrm">กลับ</button>
                                <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled}  />
                            </div>
                        </form>
                    </div>
                    <div id="edit-appointment" className="colorPrimary-800">
                        <form onSubmit={submitEditForm}>
                            <h2 className="center">แก้ไขนัดหมาย</h2>
                            <label className="admin-textBody-large colorPrimary-800">วันที่</label>
                            <div className="date-picker-container">
                                {selectedDate && (
                                            <input
                                                type="date"
                                                className="form-control"
                                                min={new Date().toISOString().split("T")[0]}
                                                value={`${selectedDate.year}-${('' + selectedDate.month).padStart(2, '0')}-${('' + selectedDate.day).padStart(2, '0')}`}
                                                max={maxDate.toISOString().split("T")[0]} 
                                                onChange={async (e) => {
                                                    inputValue("appointmentDate")(e);
                                                    const formattedDate = formatDateForDisplay(e.target.value);
                                                    console.log("Formatted Date:", formattedDate);
                                                }}
                                            />
           
                                    )}
                                    {/* <DatePicker selected={datePicker} onChange={async (e) => {handleChange(e);setIsOpen(false);}} dateFormat="dd/MM/yyyy"   className="datepicker" calendarClassName="custom-calendar"
                                    wrapperClassName="custom-datepicker-wrapper" placeholderText="dd/mm/yyyy"    closeOnSelect={true}  open={isOpen} onClickOutside={() => setIsOpen(false)}    minDate={new Date()} maxDate={maxDate} 
                                    popperPlacement="bottom-end" popperModifiers={[
                                        {
                                          name: 'preventOverflow',
                                          options: {
                                            padding: -235, // ระยะห่างจากขอบของ viewport
                                          },
                                        },
                                      ]}/>
                                    <button type="button" onClick={handleToggle} className="icon-datepicker" style={{ top:"-1px"}}><img src={icon_date} /></button> */}
                                               
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800" id="timeslotxd">ช่วงเวลา</label>
                                <select
                                    name="time"
                                    value={JSON.stringify(appointmentTime)}
                                    onChange={(e) => {
                                        handleSelectChange();
                                        setSelectedValue(e.target.value);
                                        const selectedValue = JSON.parse(e.target.value);

                                        if (selectedValue && typeof selectedValue === 'object') {
                                            const { timetableId, timeSlotIndex } = selectedValue;
                                            console.log("timetableId:", timetableId);
                                            console.log("timeSlotIndex:", timeSlotIndex);

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
                                    <option key={`${timeOption.value.timetableId}-${timeOption.value.timeSlotIndex}`} value={JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex })}>
                                        {timeOption.label}
                                    </option>
                                ))}

                                </select>
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา/รหัสพนักงาน</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentId}  disabled onChange={inputValue("appointmentId")} placeholder="64000000000" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">สาเหตุการนัดหมาย</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="เป็นไข้" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">อาการเบื้องต้น</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="ปวดหัว, ตัวร้อน" />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">หมายเหตุ</label><br></br>
                                <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="เป็นไข้หวัดทั่วไป" />
                            </div>
                            <div className="admin-timetable-btn">
                                <button type="button" onClick={closeEditAppointment} className="btn-secondary btn-systrm">กลับ</button>
                                <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            </div>
      )}
        </div>
    );
}

export default AppointmentManagerComponentSpecial;