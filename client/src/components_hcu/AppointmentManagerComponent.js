import NavbarComponent from "./NavbarComponent";
import CalendarAdminComponent from "../components_hcu/CalendarAdminComponent";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useEffect, useState, useRef } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from "sweetalert2";
import { fetchTimeTableDataFromBackend } from '../backend/backendGeneral'
import { fetchUserDataWithAppointments } from '../backend/backendGeneral'
import "../css/AdminQueueManagementSystemComponent.css";
import { DeleteAppointment } from '../backend/backendGeneral'
import { PulseLoader } from "react-spinners";
import icon_date from "../picture/datepicker.png"
import { id } from "date-fns/locale";
import axios from "axios";
const AppointmentManagerComponent = (props) => {

    const [selectedDate, setSelectedDate] = useState(null);
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [AppointmentUsersData, setAllAppointmentUsersData] = useState([]);
    const { user, userData } = useUserAuth();
    const [isChecked, setIsChecked] = useState({});
    const [timeOptions, setTimeOptions] = useState([]);
    const REACT_APP_API = process.env.REACT_APP_API;

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
        datebackup: "",
        timebackup: "",
    })

    const { appointmentDate, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, clinic, uid, timeablelist ,appointmentDater,appointmentTimer,appointmentCasuer,appointmentSymptomr,appointmentNotationr} = state
    const isSubmitEnabled =
        !appointmentDate || !appointmentTime || !appointmentId;
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const MONGO_API = process.env.REACT_APP_MONGO_API
    const fetchTimeTableData = async () => {
        try {
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
            const timeTableData = await fetchTimeTableDataFromBackend(user, selectedDate);
            
            if (timeTableData.length > 0) {
                console.log(timeTableData,"timeTableData")

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
                    const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการ กรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                    setTimeOptions([noTimeSlotsAvailableOption]);
                }

            } else {
                const noTimeSlotsAvailableOption = { label: "ไม่มีช่วงเวลาทําการ กรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true };
                setTimeOptions([noTimeSlotsAvailableOption]);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserDataWithAppointmentsWrapper = async () => {
        try {
            if (user && selectedDate && selectedDate.dayName) {
                await fetchUserDataWithAppointments(user, selectedDate, setAllAppointmentUsersData);


            } else {
                console.log("User, selectedDate, or dayName is missing");
            }
        } catch (error) {
            console.error('Error in fetchUserDataWithAppointmentsWrapper:', error);
        }
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
    const DateToCheck = `${date}/${month}/${year}`
    const [selectedCount, setSelectedCount] = useState(1);

    
    const handleSelectChange = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const timeRange = selectedOption.textContent; // Extract time range from the label
        console.log(timeRange);
        setTimeLabel(timeRange)
        setSelectedCount(selectedCount + 1);
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
                clinic: "คลินิกทั่วไป",
                status: "ลงทะเบียนแล้ว",
                status2: "เสร็จสิ้น",
                subject: "เพิ่มนัดหมาย",
                appove: "",
                appointmentSymptom2: "",
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

            const usersCollection = collection(db, 'users');

            const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
            const userDocuments = userQuerySnapshot.docs;
            const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
            const userId = userDocuments.length > 0 ? userDocuments[0].id : null;
            

                if (foundUser) {
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
                        return;
                    }
                    const selectedTimeLabel = timeOptions.find((timeOption) => {
                        const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                        return optionValue === selectedValue;
                    })?.label;
                    const userDocRef = doc(db, 'users', userId);
                    const timeTableDocRef = doc(db, 'timeTable', appointmentInfo.appointmentTime.timetableId);
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
                                                    confirmButton: 'custom-confirm-button',
                                                }
                                            });
                                            await deleteDoc(doc(db, 'appointment', appointmentRef.id));
                                            return;
                                        }
                                        const timeTableAppointment = {appointmentId: appointmentRef.id, appointmentDate: appointmentInfo.appointmentDate}
                                        await updateDoc(userDocRef, {
                                            appointments: arrayUnion(appointmentRef.id),
                                        });
                                        await updateDoc(timeTableDocRef, {
                                            appointmentList: arrayUnion(timeTableAppointment),
                                        });
                                        const info = {
                                            role: userData.role,
                                            date: appointmentInfo.appointmentDate,
                                            time: timeLabel,
                                            clinic: appointmentInfo.clinic,
                                            id: appointmentInfo.appointmentId,
                                        };

                                        try {
                                            const respone = await axios.post(`${REACT_APP_API}/api/NotificationAddAppointment`, info);
                                        } catch (err) {
                                            console.log(err);
                                        }
                                        

                                        
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
                                        
                            } catch(firebaseError) {
                                Swal.fire(
                                    {
                                        title: 'เกิดข้อผิดพลาด!',
                                        text: firebaseError,
                                        icon: 'error',
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
            const updatedTimetable = {
                appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
                appointmentTime: appointmentTime,
                appointmentId: appointmentId,
                appointmentCasue: appointmentCasue,
                appointmentSymptom: appointmentSymptom,
                appointmentNotation: appointmentNotation,
                clinic: "คลินิกทั่วไป",
                status: "ลงทะเบียนแล้ว",
            };
            const updatedTimetableRollBack = {
                appointmentDate: appointmentDater,
                appointmentTime: appointmentTimer,
                appointmentId: appointmentId,
                appointmentCasue: appointmentCasuer,
                appointmentSymptom: appointmentSymptomr,
                appointmentNotation: appointmentNotationr,
                clinic: "คลินิกทั่วไป",
                status: "ลงทะเบียนแล้ว",
            };
            const timeTableDocRef = doc(db, 'timeTable', updatedTimetable.appointmentTime.timetableId);
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
            const selectedTimeLabel = timeOptions.find((timeOption) => {
                const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                return optionValue === selectedValue;
            })?.label;
            Swal.fire({
                title: 'ยืนยันแก้นัดหมาย',
                html: `ยืนยันที่จะแก้ไขนัดหมายเป็นวันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
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
                        } else {
                            const timeTableDocRef = doc(db, 'timeTable', appointmentTimer.timetableId);
                            const timeTableDocNew = doc(db, 'timeTable', appointmentTime.timetableId);
                                getDoc(timeTableDocRef)
                                .then(async(docSnapshot) => {
                                    if (docSnapshot.exists()) {
                                    const timeTableData = docSnapshot.data();
                                    const appointmentList = timeTableData.appointmentList || [];

                                    const updatedAppointmentList = appointmentList.filter(appointment => appointment.appointmentId !== uid);

                                    await updateDoc(timeTableDocRef, { appointmentList: updatedAppointmentList });
                                    const timeTableAppointment = {appointmentId: uid, appointmentDate: updatedTimetable.appointmentDate}
                                    await updateDoc(timeTableDocNew, {
                                        appointmentList: arrayUnion(timeTableAppointment),
                                    });
                                    } else {
                                    console.log('ไม่พบเอกสาร timeTable');
                                    }
                                })
                                .then(() => {
                                    console.log('การอัปเดตข้อมูลสำเร็จ');
                                })
                                .catch((error) => {
                                    console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', error);
                                });

                        }
                        const info = {
                            role: userData.role,
                            date: updatedTimetable.appointmentDate,
                            time: timeLabel,
                            clinic: updatedTimetable.clinic,
                            id: updatedTimetable.appointmentId,
                            oldDate: updatedTimetableRollBack.appointmentDate,
                        };

                        try {
                            const respone = await axios.post(`${REACT_APP_API}/api/NotificationEditAppointment`, info);
                        } catch (error) {
                            console.log(error);
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
                            text: `การแก้ไขนัดหมายไม่สำเร็จ`,
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
                if (firebaseError === "Cannot read properties of null (reading 'role')") {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: `ไม่พบรหัสนักศึกษา ${id}`,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                }
               else {
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
        // setsaveEditId("")
        // setsaveDetailId(AppointmentUsersData.appointmentuid)
        if (window.getComputedStyle(x).display === "none") {
            if(window.getComputedStyle(z).display === "block" && saveEditId === AppointmentUsersData.appointmentuid ){
                element.stopPropagation();
            }
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveEditId("")
            setsaveDetailId(AppointmentUsersData.appointmentuid)
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
            if (saveDetailId === AppointmentUsersData.appointmentuid) {
                x.style.display = "none";
                setsaveDetailId("")
            } else {
                setsaveDetailId(AppointmentUsersData.appointmentuid)
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
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId("")
            
        } else {
            x.style.display = "none";


        }

    }

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


    const handleDateSelect = (selectedDate) => {
        setAllAppointmentUsersData([]);
        setSelectedDate(selectedDate);
        setState({
            ...state,
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: "",
        });
        let x = document.getElementById("detail-appointment");
        x.style.display = "none";
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


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = 'Health Care Unit';
        fetchTimeTableData();
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




        fetchUserDataWithAppointmentsWrapper();
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };

    }, [selectedDate,userData]);
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

    const statusElements = document.querySelectorAll('.admin-appointment-status');

    function changeStatusTextColor(element) {
        if (element.textContent.trim() === 'เสร็จสิ้น') {
            element.style.color = '#098B66';

        }
        else if (element.textContent.trim() === 'ไม่สำเร็จ') {
            element.style.color = '#C11F1F';
        }
        else if (element.textContent.trim() === 'ยืนยันสิทธิ์แล้ว') {
            element.style.color = '#D88C09';
        }
        else if (element.textContent.trim() === 'รอยืนยันสิทธิ์') {
            element.style.color = '#A1A1A1';
        }
        else if (element.textContent.trim() === 'ลงทะเบียนแล้ว') {
            element.style.color = '#A1A1A1';
        }
    }
    const [timeLabel, setTimeLabel] = useState("");
    statusElements.forEach(changeStatusTextColor);

    let statusElementDetail = document.getElementById("detail-appointment-status");

    if (statusElementDetail) {
        if (statusElementDetail.textContent.trim() === 'ยืนยันสิทธ์แล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);

            statusElementDetail.classList.add("confirmed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'เสร็จสิ้น') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("completed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'ไม่สำเร็จ') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("failed-background");
        }
        else if (statusElementDetail.textContent.trim() === 'ลงทะเบียนแล้ว') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("pending-confirmation-background");
        }
        else if (statusElementDetail.textContent.trim() === 'รอยืนยันสิทธิ์') {
            statusElementDetail.classList.remove(...statusElementDetail.classList);
            statusElementDetail.classList.add("pending-confirmation-background");
        }
    }
    useEffect(() => {
        console.log("timeLabel",timeLabel)
    },[timeLabel]);

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
                    <p className="admin-textBody-large">Time : {showTime}</p>
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
                            <a href="/AppointmentManagerComponent" target="_parent" id="select">คลินิกทั่วไป</a>
                            <a href="/AppointmentManagerComponentSpecial" target="_parent" >คลินิกเฉพาะทาง</a>
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
                                        <h2>นัดหมายคลินิกทั่วไป</h2>
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
                                            <div className="admin-appointment-card-detail" >
                                                <span className="admin-appointment-card-detail-box" onClick={(event) => openDetailAppointment(event,AppointmentUserData)}>
                                                    <div className="admin-appointment-card-time admin-textBody-small">
                                                        {AppointmentUserData.timeslot.start}-{AppointmentUserData.timeslot.end}
                                                    </div>
                                                    <div className="admin-appointment-info flex-column">
                                                        <p id="student-id" className="admin-textBody-huge">{AppointmentUserData.id}</p>
                                                        <p id="student-name" className="admin-textBody-small" style={{overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{`${AppointmentUserData.firstName} ${AppointmentUserData.lastName}`}</p>
                                                    </div>
                                                </span>
                                                <div className="admin-appointment-functon">
                                                {`${selectedDate.day}/${selectedDate.month}/${selectedDate.year}` === DateToCheck ? (
                                                     <div style={{width:"100%", height:"100%", display: "flex", justifyContent: "center",alignItems: "center"}} onClick={(event) => openDetailAppointment(event,AppointmentUserData)}>
                                                        <p style={{ justifyContent: "center", display: "flex", alignItems: "center", margin: 0, marginRight: 10 }} className="admin-appointment-status admin-textBody-small" >{`${AppointmentUserData.appointment.status}`}</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <img src={edit} className="icon_apppointment" onClick={(event) =>  openEditAppointment(event,AppointmentUserData)} />
                                                        <img src={icon_delete} className="icon_apppointment" onClick={() => DeleteAppointment(userData,AppointmentUserData.appointment.appointmentuid, AppointmentUserData.userUid, setAllAppointmentUsersData, fetchUserDataWithAppointmentsWrapper,AppointmentUserData)} />
                                                    </>
                                                )}
                                                </div>
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
                                <p id="detail-appointment-casue" className="admin-textBody-big"  ><b>สาเหตุการนัดหมาย</b>: ตรวจรักษาโรค</p>
                                <p id="detail-appointment-symptom" className="admin-textBody-big" ><b>อาการเบื้องต้น</b>: มีอาการปวดหัว อาเจียน</p>
                                <p id="detail-appointment-notation" className="admin-textBody-big" ><b>หมายเหตุ</b>: -</p>


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
                                                handleSelectChange(e);
                                                setSelectedValue(e.target.value); 
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
                                            hidden={index === 0}
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
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>สาเหตุการนัดหมาย</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentCasue.length > 135 ? 'red' : 'grey' }}>{appointmentCasue.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="เป็นไข้" maxLength="135"/>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>อาการเบื้องต้น</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentSymptom.length > 135 ? 'red' : 'grey' }}>{appointmentSymptom.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="ปวดหัว, ตัวร้อน" maxLength="135" />
                                    </div>
                                    <div>
                
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>หมายเหตุ</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentNotation.length > 135 ? 'red' : 'grey' }}>{appointmentNotation.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="เป็นไข้หวัดทั่วไป" maxLength="135" />
                                    </div>
                                    <div className="admin-timetable-btn">
                                        <button type="button" onClick={closeEditAppointment} className="btn-secondary btn-systrm">กลับ</button>
                                        <input type="submit" value="เพิ่มนัดหมาย" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
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
                                        <label className="admin-textBody-large colorPrimary-800 " id="timeslotxd"> ช่วงเวลา </label>
                                        <select
                                            name="time"
                                            value={JSON.stringify(appointmentTime)}
                                            onChange={(e) => {
                                                handleSelectChange(e);
                                                setSelectedValue(e.target.value); 
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
                                    <div>
                                        <label className="admin-textBody-large colorPrimary-800">รหัสนักศึกษา/รหัสพนักงาน</label><br></br>
                                        <input type="text" className="form-control appointment-input" value={appointmentId} disabled onChange={inputValue("appointmentId")} placeholder="64000000000" />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>สาเหตุการนัดหมาย</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentCasue.length > 135 ? 'red' : 'grey' }}>{appointmentCasue.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentCasue} onChange={inputValue("appointmentCasue")} placeholder="เป็นไข้" maxLength="135"/>
                                    </div>
                                    <div >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>อาการเบื้องต้น</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentSymptom.length > 135 ? 'red' : 'grey' }}>{appointmentSymptom.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentSymptom} onChange={inputValue("appointmentSymptom")} placeholder="ปวดหัว, ตัวร้อน" maxLength="135"/>
                                    </div>
                                    <div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <label className="admin-textBody-large colorPrimary-800" style={{ flexGrow: 1 }}>หมายเหตุ</label>
                                            <span style={{ display: 'flex', alignItems: 'center', color: appointmentNotation.length > 135 ? 'red' : 'grey' }}>{appointmentNotation.length}/135</span>
                                        </div>
                                        <input type="text" className="form-control appointment-input" value={appointmentNotation} onChange={inputValue("appointmentNotation")} placeholder="เป็นไข้หวัดทั่วไป" maxLength="135"/>
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

export default AppointmentManagerComponent;