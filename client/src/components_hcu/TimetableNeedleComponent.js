import React, { useEffect, useState, useRef } from "react";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminTimeTableComponent.css";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import Swal from "sweetalert2";
import { auth } from '../firebase/config';
import { doc, updateDoc,where,query, addDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { PulseLoader } from "react-spinners";
const TimetablePhysicalComponent = (props) => {
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1); 
    const animationFrameRef = useRef();
    const { user , userData} = useUserAuth();
    const [timetable, setTimetable] = useState([])
    const { id } = useParams();
    const [state, setState] = useState({
        addDay: "",
        timeStart: "",
        timeEnd: "",
        timeAppointmentStart: "",
        timeAppointmentEnd: "",
        numberAppointment: "",
        timeAppointmentMainStart: "",
        timeAppointmentMainEnd: "",
        numberMainAppointment: "",
        clinic: "",
        timetableId: id || "", 
    })


    const { addDay, timeStart, timeEnd, timeAppointmentStart, timeAppointmentEnd, numberAppointment, clinic ,timetableId,timeAppointmentMainStart,timeAppointmentMainEnd,numberMainAppointment} = state

    const isSubmitEnabled =
        !addDay || !timeStart || !timeEnd || !timeAppointmentStart || !timeAppointmentEnd || !numberAppointment || !timeAppointmentMainStart || ! timeAppointmentMainEnd || !numberMainAppointment;


    const [isChecked, setIsChecked] = useState({});
    const inputValue = (name) => (event) => {
        if (name === "addDay") {
            setState({ ...state, [name]: event.target.value });
        } else {
            setState({ ...state, [name]: event.target.value });
        }
    };


    const [selectedCount, setSelectedCount] = useState(1);

    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
        console.log(selectedCount)
    };

    const fetchTimeTableData = async () => {
        try {
            if (user) {
                const timeTableCollection = collection(db, 'timeTable');
                const timeTableSnapshot = await getDocs(query(
                    timeTableCollection,
                    where('clinic', '==', 'คลินิกฝั่งเข็ม')
                ));

                const timeTableData = timeTableSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));




                if (timeTableData) {
                    setTimetable(timeTableData);
                    const initialIsChecked = timeTableData.reduce((acc, timetableItem) => {
                        acc[timetableItem.id] = timetableItem.status === "Enabled";
                        return acc;
                    }, {});

                    setIsChecked(initialIsChecked);

                    console.log(timeTableData);
                } else {
                    console.log("time table not found");
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    const submitForm = async (e) => {
        e.preventDefault();
        console.log(timetableId)
        const start = new Date(`2000-01-01T${timeAppointmentStart}`);
        const end = new Date(`2000-01-01T${timeAppointmentEnd}`);
        const duration = (end - start) / 60000;

        if (duration <= 0) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรุณากรอกช่วงเวลานัดหมายใหม่!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            })
            return;
        }
        if (numberAppointment <= 0) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ใส่จํานวนคิวใหม่เนื่องจากน้อยกว่า 1 ครั้ง!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            })
            return;
        }
        if (!Number.isInteger(parseFloat(numberAppointment))) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ต้องเป็นเลขจํานวนเต็มเท่านั่น!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeAppointmentStart >= timeAppointmentEnd 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาใหม่ เวลาเริ่มนัดหมายน้อยกว่าช่วงเวลาสุดท้าย!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeStart >= timeEnd 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาใหม่ เวลาเริ่มเปิดคลินิกน้อยกว่าช่วงเวลาปิด!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeAppointmentStart < timeStart 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาเปิดนัดหมายใหม่ เวลาเริ่มเปิดนัดหมายน้อยกว่าช่วงเวลาเปิดคลิกนิก!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeAppointmentEnd > timeEnd
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาเปิดนัดหมายใหม่ เวลาเริ่มปิดนัดหมายมากกว่าช่วงเวลาปิดคลิกนิก!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }

        if (
            timeAppointmentMainStart >= timeAppointmentMainEnd 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาฝั่งเข็มใหม่ เวลาเริ่มน้อยกว่าช่วงเวลาปิด!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        

        const timeablelist = [];

        const interval = Math.floor(duration / numberAppointment);

        for (let i = 0; i < numberAppointment; i++) {
            const slotStart = new Date(start.getTime() + i * interval * 60000);
            const slotEnd = new Date(slotStart.getTime() + interval * 60000);
        
            if (slotEnd.getTime() > end.getTime()) {
                timeablelist.push({
                    start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    end: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                });
                break;
            }
        
            timeablelist.push({
                start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                end: slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                type:"talk"
            });
        }

        const start2 = new Date(`2000-01-01T${timeAppointmentMainStart}`);
        const end2 = new Date(`2000-01-01T${timeAppointmentMainEnd}`);
        const duration2 = (end2 - start2) / 60000;

        const interval2 = Math.floor(duration2 / numberMainAppointment);

        for (let i = 0; i < numberMainAppointment; i++) {
            const slotStart = new Date(start2.getTime() + i * interval2 * 60000);
            const slotEnd = new Date(slotStart.getTime() + interval2 * 60000);
        
            if (slotEnd.getTime() > end2.getTime()) {
                timeablelist.push({
                    start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    end: end2.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                });
                break;
            }
        
            timeablelist.push({
                start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                end: slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                type:"main"
            });
        }


        try {
            const additionalTImeTable = {
                addDay: addDay,
                timeStart: timeStart,
                timeEnd: timeEnd,
                timeAppointmentStart: timeAppointmentStart,
                timeAppointmentEnd: timeAppointmentEnd,
                timeAppointmentMainStart:timeAppointmentMainStart,
                timeAppointmentMainEnd:timeAppointmentMainEnd,
                numberAppointment: numberAppointment,
                numberMainAppointment: numberMainAppointment,
                clinic: "คลินิกฝั่งเข็ม",
                timeablelist: timeablelist,
                status: "Enabled",
            };
            

            const isInputMainTimeOverlap = () => {
                const appointmentStartTime = new Date(`2000-01-01T${timeStart}`);
                const appointmentEndTime = new Date(`2000-01-01T${timeEnd}`);
                const inputStartTime = new Date(`2000-01-01T${timeAppointmentMainStart}`);
                const inputEndTime = new Date(`2000-01-01T${timeAppointmentMainEnd}`);
                
                return (
                    (inputStartTime >= appointmentStartTime && inputStartTime <= appointmentEndTime) ||
                    (inputEndTime >= appointmentStartTime && inputEndTime <= appointmentEndTime) ||
                    (inputStartTime <= appointmentStartTime && inputEndTime >= appointmentEndTime)
                );
            };

            const isInputMainAppointmentTimeOverlap = () => {
                const appointmentStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                const appointmentEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
                const inputStartTime = new Date(`2000-01-01T${timeAppointmentMainStart}`);
                const inputEndTime = new Date(`2000-01-01T${timeAppointmentMainEnd}`);
                
                return (
                    (inputStartTime >= appointmentStartTime && inputStartTime <= appointmentEndTime) ||
                    (inputEndTime >= appointmentStartTime && inputEndTime <= appointmentEndTime) ||
                    (inputStartTime <= appointmentStartTime && inputEndTime >= appointmentEndTime)
                );
            };
            if (addDay === "monday") {
                const mondayTimetable = timetable.filter(item => item.addDay === "monday");
                
                const isTimeOverlap = mondayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = mondayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
                
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }
            if (addDay === "tuesday") {
                const tuesdayTimetable = timetable.filter(item => item.addDay === "tuesday");
                
                const isTimeOverlap = tuesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = tuesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }

            if (addDay === "wednesday") {
                const wednesdayTimetable = timetable.filter(item => item.addDay === "wednesday");
                
                const isTimeOverlap = wednesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = wednesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }

            if (addDay === "thursday") {
                const thursdayTimetable = timetable.filter(item => item.addDay === "thursday");
                
                const isTimeOverlap = thursdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = thursdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }
            
            if (addDay === "friday") {
                const fridayTimetable = timetable.filter(item => item.addDay === "friday");
                
                const isTimeOverlap = fridayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = fridayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }
            await addDoc(collection(db, 'timeTable'), additionalTImeTable);

            Swal.fire({
                icon: "success",
                title: "เพิ่มช่วงเวลาสำเร็จ!",
                text: "ช่วงเวลาถูกสร้างเรียบร้อยแล้ว!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchTimeTableData();
                }
            });

        } catch (firebaseError) {
            console.error('Firebase signup error:', firebaseError);
        }
    };

    const editForm = async (e) => {
        e.preventDefault();
        console.log(timetableId);
        const start = new Date(`2000-01-01T${timeAppointmentStart}`);
        const end = new Date(`2000-01-01T${timeAppointmentEnd}`);
        const duration = (end - start) / 60000;
    
        if (duration <= 0) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรุณากรอกช่วงเวลานัดหมายใหม่!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            })
            return;
        }
        if (numberAppointment <= 0) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ใส่จํานวนคิวใหม่เนื่องจากน้อยกว่า 1 ครั้ง!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            })
            return;
        }
        if (!Number.isInteger(parseFloat(numberAppointment))) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "ต้องเป็นเลขจํานวนเต็มเท่านั่น!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeAppointmentStart >= timeAppointmentEnd 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาใหม่ เวลาเริ่มนัดหมายน้อยกว่าช่วงเวลาสุดท้าย!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeStart >= timeEnd 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาใหม่ เวลาเริ่มเปิดคลินิกน้อยกว่าช่วงเวลาปิด!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeAppointmentStart < timeStart 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาเปิดนัดหมายใหม่ เวลาเริ่มเปิดนัดหมายน้อยกว่าช่วงเวลาเปิดคลิกนิก!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
        if (
            timeAppointmentEnd > timeEnd
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาเปิดนัดหมายใหม่ เวลาเริ่มปิดนัดหมายมากกว่าช่วงเวลาปิดคลิกนิก!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }

        if (
            timeAppointmentMainStart >= timeAppointmentMainEnd 
        ) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "กรอกช่วงเวลาฝั่งเข็มใหม่ เวลาเริ่มน้อยกว่าช่วงเวลาปิด!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            });
            return;
        }
    
        const timeablelist = [];
    
        const interval = Math.floor(duration / numberAppointment);
    
        for (let i = 0; i < numberAppointment; i++) {
            const slotStart = new Date(start.getTime() + i * interval * 60000);
            const slotEnd = new Date(slotStart.getTime() + interval * 60000);
    
            if (slotEnd.getTime() > end.getTime()) {
                timeablelist.push({
                    start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    end: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                break;
            }
    
            timeablelist.push({
                start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                end: slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    
        try {
            const timetableRef = doc(db, 'timeTable', timetableId);
            console.log(timetableId);
    
            const updatedTimetable = {
                addDay: addDay,
                timeStart: timeStart,
                timeEnd: timeEnd,
                timeAppointmentStart: timeAppointmentStart,
                timeAppointmentEnd: timeAppointmentEnd,
                numberAppointment: numberAppointment,
                clinic: "คลินิกฝั่งเข็ม",
                timeablelist: timeablelist,
                status: "Enabled",
            };
            
            const isInputMainAppointmentTimeOverlap = () => {
                const appointmentStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                const appointmentEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
                const inputStartTime = new Date(`2000-01-01T${timeAppointmentMainStart}`);
                const inputEndTime = new Date(`2000-01-01T${timeAppointmentMainEnd}`);
                
                return (
                    (inputStartTime >= appointmentStartTime && inputStartTime <= appointmentEndTime) ||
                    (inputEndTime >= appointmentStartTime && inputEndTime <= appointmentEndTime) ||
                    (inputStartTime <= appointmentStartTime && inputEndTime >= appointmentEndTime)
                );
            };
            if (addDay === "monday") {
                const mondayTimetable = timetable.filter(item => item.addDay === "monday");
                
                const isTimeOverlap = mondayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = mondayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
                
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }
            if (addDay === "tuesday") {
                const tuesdayTimetable = timetable.filter(item => item.addDay === "tuesday");
                
                const isTimeOverlap = tuesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = tuesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }

            if (addDay === "wednesday") {
                const wednesdayTimetable = timetable.filter(item => item.addDay === "wednesday");
                
                const isTimeOverlap = wednesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = wednesdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }

            if (addDay === "thursday") {
                const thursdayTimetable = timetable.filter(item => item.addDay === "thursday");
                
                const isTimeOverlap = thursdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = thursdayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }
            
            if (addDay === "friday") {
                const fridayTimetable = timetable.filter(item => item.addDay === "friday");
                
                const isTimeOverlap = fridayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                const isAppointmentTimeOverlap = fridayTimetable.some(item => {
                    const startTime = new Date(`2000-01-01T${item.timeAppointmentStart}`);
                    const endTime = new Date(`2000-01-01T${item.timeAppointmentEnd}`);
                    const inputStartTime = new Date(`2000-01-01T${timeAppointmentStart}`);
                    const inputEndTime = new Date(`2000-01-01T${timeAppointmentEnd}`);
            
                    return (
                        (inputStartTime >= startTime && inputStartTime <= endTime) ||
                        (inputEndTime >= startTime && inputEndTime <= endTime) ||
                        (inputStartTime <= startTime && inputEndTime >= endTime)
                    );
                });
            
                if (isTimeOverlap && !isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิด!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (!isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                } else if (isTimeOverlap && isAppointmentTimeOverlap) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "ช่วงเวลาที่กำหนดซ้ำกับเวลาที่คลินิกเปิดหรือปิดและช่วงเวลานัดหมายที่มีอยู่แล้ว!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }  else if (isInputMainAppointmentTimeOverlap()) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด!",
                        text: "กรอกเวลาฝั่งเข็มทับซ้อนกับช่วงเวลานัดหมาย กรุณากรอกใหม่!",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#263A50',
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                    return;
                }
            }
            await updateDoc(timetableRef, updatedTimetable);
    
            Swal.fire({
                icon: "success",
                title: "การอัปเดตช่วงเวลาสำเร็จ!",
                text: "ช่วงเวลาถูกอัปเดตเรียบร้อยแล้ว!",
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchTimeTableData();
                }
            });
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
        }
    };
    
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        document.title = 'Health Care Unit';
        fetchTimeTableData();

        const updateShowTime = () => {
            const newTime = getShowTime();
            if (newTime !== showTime) {
                setShowTime(newTime);
            }
            animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };

        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };

        updateShowTime();
        responsivescreen();

        window.addEventListener("resize", responsivescreen);

        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };
    }, [user,userData]);

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
    const locale = 'en'
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;



    const handleToggle = async (id) => {
        setIsChecked(prevState => {
            const updatedStatus = !prevState[id];

            // อัพเดต status จาก toggle
            const docRef = doc(db, 'timeTable', id);
            updateDoc(docRef, { status: updatedStatus ? "Enabled" : "Disabled" }).catch(error => {
                console.error('Error updating timetable status:', error);
            });

            return { ...prevState, [id]: updatedStatus };
        });
    };

    const [saveDetailId, setsaveDetailId] = useState([])
    const [saveEditId, setsaveEditId] = useState([])

    const openAddtimetable = () => {
        adminCards.forEach(card => card.classList.remove('focused'));
        let x = document.getElementById("Addtimetable");
        let y = document.getElementById("Edittimetable");
        let z = document.getElementById("Detailtimetable");
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

    const navigate = useNavigate();


    const openEdittimetable = (element, timetable) => {
        let x = document.getElementById("Edittimetable");
        let y = document.getElementById("Addtimetable");
        let z = document.getElementById("Detailtimetable");
        console.log(timetable)
        if (window.getComputedStyle(x).display === "none") {
            if(window.getComputedStyle(z).display === "block" && saveDetailId === timetable.id ){
                element.stopPropagation();
            }
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId(timetable.id)
      
      
            setState((prevState) => ({
                ...prevState,
                addDay: timetable.addDay,
                timeStart: timetable.timeStart,
                timeEnd: timetable.timeEnd,
                timeAppointmentStart: timetable.timeAppointmentStart,
                timeAppointmentEnd: timetable.timeAppointmentEnd,
                numberAppointment: timetable.numberAppointment,
                clinic: "คลินิกฝั่งเข็ม",
                timeablelist: timetable.timeablelist,
                status: "Enabled",
                timetableId: timetable.id,  // Update the id in the state
            }));

          // console.log(timetable.id)
          // window.history.replaceState({}, null, `/timeTablePhysicalAdmin/${timetable.id}`);
        } else {
            if(saveEditId === timetable.id){
                x.style.display = "none";
                setsaveEditId("")
            }else{
                setsaveEditId(timetable.id)
                setState((prevState) => ({
                    ...prevState,
                    addDay: timetable.addDay,
                    timeStart: timetable.timeStart,
                    timeEnd: timetable.timeEnd,
                    timeAppointmentStart: timetable.timeAppointmentStart,
                    timeAppointmentEnd: timetable.timeAppointmentEnd,
                    numberAppointment: timetable.numberAppointment,
                    clinic: "คลินิกฝั่งเข็ม",
                    timeablelist: timetable.timeablelist,
                    status: "Enabled",
                    timetableId: timetable.id,  // Update the id in the state
                  }));
        
            }
        }
      };





    const openDetailtimetable = (element, timetable) => {
        let x = document.getElementById("Detailtimetable");
        let y = document.getElementById("Edittimetable");
        let z = document.getElementById("Addtimetable");

        if (window.getComputedStyle(x).display === "none") {
            if(window.getComputedStyle(y).display === "block" && saveEditId === timetable.id ){
                element.stopPropagation();
            }
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveEditId("")
            setsaveDetailId(timetable.id)
            let detailDay = timetable.addDay;
            let listtimetable = ""
            
            if (detailDay === "monday") {
                document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันจันทร์`
            } else if (detailDay === "tuesday") {
                document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันอังคาร`
            } else if (detailDay === "wednesday") {
                document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันพุธ`
            } else if (detailDay === "thursday") {
                document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันพฤหัสบดี`
            } else if (detailDay === "friday") {
                document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันศุกร์`
            }
            document.getElementById("Detailtimeall").innerHTML = `<b>ช่วงเวลาเปิดให้บริการ</b> : ${timetable.timeStart} - ${timetable.timeEnd} `
            document.getElementById("Detailtime").innerHTML = `<b>ช่วงเวลาเปิดให้นัดหมาย</b> : ${timetable.timeAppointmentStart} - ${timetable.timeAppointmentEnd} `
            document.getElementById("Detailqueue").innerHTML = `<b>จำนวนคิวนัดหมาย</b> : ${timetable.numberAppointment} `
            console.log(timetable.timeablelist.length)
            
            let TimeArrayTalk = [];
            let TimeArrayMain = [];
            let listmaintable = ""
            for (let i = 0; i < timetable.timeablelist.length; i++) {
                if (timetable.timeablelist[i].type === "talk") {
                    TimeArrayTalk.push(timetable.timeablelist[i]);
                } else {
                    TimeArrayMain.push(timetable.timeablelist[i]);
                }
            }

            console.log(TimeArrayTalk)
            console.log("XD")
            console.log(TimeArrayMain)
            for (let i = 0; i < TimeArrayTalk.length; i++) {
                listtimetable += `<p class="textBody-big">คิวลำดับที่ ${i + 1} : ${TimeArrayTalk[i].start} - ${TimeArrayTalk[i].end}</p>`
                console.log(TimeArrayTalk[i])
            }

            for (let i = 0; i < TimeArrayMain.length; i++) {
                listmaintable += `<p class="textBody-big">คิวลำดับที่ ${i + 1} : ${TimeArrayMain[i].start} - ${TimeArrayMain[i].end}</p>`
                console.log(TimeArrayMain[i])
            }
        
            document.getElementById("Detail").innerHTML = `<b>ช่วงเวลาเปิดให้นัดหมายพูดคุย</b> : ${listtimetable}`
            document.getElementById("Detail2").innerHTML = `<b>ช่วงเวลาทําฝั่งเข็ม</b> : ${listmaintable}`
            // window.history.replaceState({}, null, `/timeTablePhysicalAdmin/${timetable.id}`);
        } else {
            if(saveDetailId === timetable.id){
                x.style.display = "none";
                setsaveDetailId("")
            }
            else{
                setsaveDetailId(timetable.id)
                let detailDay = timetable.addDay;
                let listtimetable = ""
                if (detailDay === "monday") {
                    document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันจันทร์`
                } else if (detailDay === "tuesday") {
                    document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันอังคาร`
                } else if (detailDay === "wednesday") {
                    document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันพุธ`
                } else if (detailDay === "thursday") {
                    document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันพฤหัสบดี`
                } else if (detailDay === "friday") {
                    document.getElementById("Detailday").innerHTML = `<b>วัน</b> : วันศุกร์`
                }
                document.getElementById("Detailtimeall").innerHTML = `<b>ช่วงเวลาเปิดให้บริการ</b> : ${timetable.timeStart} - ${timetable.timeEnd} `
                document.getElementById("Detailtime").innerHTML = `<b>ช่วงเวลาเปิดให้นัดหมาย</b> : ${timetable.timeAppointmentStart} - ${timetable.timeAppointmentEnd} `
                document.getElementById("Detailqueue").innerHTML = `<b>จำนวนคิวนัดหมาย</b> : ${timetable.numberAppointment} `
                console.log(timetable.timeablelist.length)
                let TimeArrayTalk = [];
                let TimeArrayMain = [];
                let listmaintable = ""
                for (let i = 0; i < timetable.timeablelist.length; i++) {
                    if (timetable.timeablelist[i].type === "talk") {
                        TimeArrayTalk.push(timetable.timeablelist[i]);
                    } else {
                        TimeArrayMain.push(timetable.timeablelist[i]);
                    }
                }
    
                console.log(TimeArrayTalk)
                console.log("XD")
                console.log(TimeArrayMain)
                for (let i = 0; i < TimeArrayTalk.length; i++) {
                    listtimetable += `<p class="textBody-big">คิวลำดับที่ ${i + 1} : ${TimeArrayTalk[i].start} - ${TimeArrayTalk[i].end}</p>`
                    console.log(TimeArrayTalk[i])
                }
    
                for (let i = 0; i < TimeArrayMain.length; i++) {
                    listmaintable += `<p class="textBody-big">คิวลำดับที่ ${i + 1} : ${TimeArrayMain[i].start} - ${TimeArrayMain[i].end}</p>`
                    console.log(TimeArrayMain[i])
                }
            
                document.getElementById("Detail").innerHTML = `<b>ช่วงเวลาเปิดให้นัดหมายพูดคุย</b> : ${listtimetable}`
                document.getElementById("Detail2").innerHTML = `<b>ช่วงเวลาทําฝั่งเข็ม</b> : ${listmaintable}`
            }
        }

    }

    const Deletetimetable = async(element, timetable)  => {
        let detailDay = timetable.addDay;
        if (detailDay === "monday") {
            detailDay = 'วันจันทร์'
        } else if (detailDay === "tuesday") {
            detailDay = 'วันอังคาร'
        } else if (detailDay === "wednesday") {
            detailDay = 'วันพุธ'
        } else if (detailDay === "thursday") {
            detailDay = 'วันพฤหัสบดี'
        } else if (detailDay === "friday") {
            detailDay = 'วันศุกร์'
        }
        const timetableRef = doc(db, 'timeTable', `${timetable.id}`);
        Swal.fire({
            title: 'ลบช่วงเวลา',
            text: `${detailDay} เวลา ${timetable.timeStart} - ${timetable.timeEnd}`,
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
        }).then((result) => {
            if (result.isConfirmed) {
                try{
                    deleteDoc(timetableRef,`${timetable.id}`)
                    console.log(`${timetable.id}`);
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
                        }
                        ).then((result) => {
                            if (result.isConfirmed) {
                                fetchTimeTableData();
                            }
                        });
                } catch {

                }
                
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire(
                    {
                        title: 'ลบช่วงเวลาไม่สำเร็จ!',
                        text: `ไม่สามารถลบช่วงเวลาได้ กรุณาลองอีกครั้งในภายหลัง`,
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

    const adminCards = document.querySelectorAll('.card');

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

    return (
        <div style={containerStyle}>
            <NavbarComponent />
            <div className="admin-topicBox">
                <div></div>
                <div>
                    <h1 className="colorPrimary-800 center">ช่วงเวลาเข้าทำการแพทย์</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large">Time : {showTime}</p>
                </div>
            </div>
            <div className="clinic">
                <a href="/timeTableGeneralAdmin" target="_parent">คลินิกทั่วไป</a>
                <a href="/timeTableSpecialAdmin" target="_parent">คลินิกเฉพาะทาง</a>
                <a href="/timeTablePhysicalAdmin" target="_parent">คลินิกกายภาพ</a>
                <a href="/timeTableNeedleAdmin" target="_parent" id="select">คลินิกฝั่งเข็ม</a>
            </div>
            {isLoading ? (
        <div className="loading-spinner">

          <PulseLoader size={15} color={"#54B2B0"} loading={isLoading} />
        </div>
      ) : (
            <div className="admin-timetable-system">
                <div className="admin-timetable-system-item">
                    <div className="admin-timetable-system-top">
                        <h2 className="colorPrimary-800 admin-timetable-system-top-item">ช่วงเวลาเข้าทำการแพทย์</h2>
                        <button className="admin-timetable-system-top-item" onClick={openAddtimetable}>เพิ่มเวลา +</button>
                    </div>
                    <div className="admin-timetable-system-detail">
                        <h3 className="colorPrimary-800">วันจันทร์</h3>
                        {timetable.filter((timetable) => timetable.addDay === "monday" && timetable.clinic === "คลินิกฝั่งเข็ม").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวนนัดพูดคุย {timetable.numberAppointment} คิว / จำนวนนัดฝั่งเข็ม {timetable.numberMainAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked[timetable.id]}
                                                onChange={() => handleToggle(timetable.id)}
                                            />
                                            <div className="slider"></div>
                                        </label>

                                        <img src={edit} className="icon" onClick={(event) => openEdittimetable(event, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "monday" && timetable.clinic === "คลินิกฝั่งเข็ม").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันอังคาร</h3>
                        {timetable.filter((timetable) => timetable.addDay === "tuesday" && timetable.clinic === "คลินิกฝั่งเข็ม").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวนนัดพูดคุย {timetable.numberAppointment} คิว / จำนวนนัดฝั่งเข็ม {timetable.numberMainAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={(event) => openEdittimetable(event, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "tuesday" && timetable.clinic === "คลินิกฝั่งเข็ม").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันพุธ</h3>
                        {timetable.filter((timetable) => timetable.addDay === "wednesday" && timetable.clinic === "คลินิกฝั่งเข็ม").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวนนัดพูดคุย {timetable.numberAppointment} คิว / จำนวนนัดฝั่งเข็ม {timetable.numberMainAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={(event) => openEdittimetable(event, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "wednesday" && timetable.clinic === "คลินิกฝั่งเข็ม").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันพฤหัสบดี</h3>
                        {timetable.filter((timetable) => timetable.addDay === "thursday" && timetable.clinic === "คลินิกฝั่งเข็ม").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวนนัดพูดคุย {timetable.numberAppointment} คิว / จำนวนนัดฝั่งเข็ม {timetable.numberMainAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={(event) => openEdittimetable(event, timetable)} />
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "thursday" && timetable.clinic === "คลินิกฝั่งเข็ม").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันศุกร์</h3>
                        {timetable.filter((timetable) => timetable.addDay === "friday" && timetable.clinic === "คลินิกฝั่งเข็ม").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวนนัดพูดคุย {timetable.numberAppointment} คิว / จำนวนนัดฝั่งเข็ม {timetable.numberMainAppointment} คิว</p>
                                    </a>
                                    <div className="card-funtion">
                                        <label className={`toggle-switch ${isChecked[timetable.id] ? 'checked' : ''}`}>
                                            <input type="checkbox" checked={isChecked[timetable.id]} onChange={() => handleToggle(timetable.id)} />
                                            <div className="slider"></div>
                                        </label>
                                        <img src={edit} className="icon" onClick={(event) => openEdittimetable(event, timetable)}/>
                                        <img src={icon_delete} className="icon" onClick={() => Deletetimetable(this, timetable)} />
                                    </div>
                                </div>
                            </div>

                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "friday" && timetable.clinic === "คลินิกฝั่งเข็ม").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-timetable-system-item border-L">

                    <div id="Addtimetable">
                        <form onSubmit={submitForm}>
                            <div >
                                <button type="button" onClick={openAddtimetable} className="colorPrimary-800" id="backTopic">❮ เพิ่มเวลาเข้าทำการแพทย์</button>
                            </div>
                            <div className="admin-timetable-system-detail">
                            <h2 className=" colorPrimary-800">คลินิกฝั่งเข็ม</h2>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800" >วัน</label>
                                <div className="custom-admin-addtimetable">
                                <select
                                    name="Day"
                                    value={addDay}
                                    onChange={(e) => { inputValue("addDay")(e); handleSelectChange(); }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    <option value="" disabled hidden> กรุณาเลือกวัน </option>
                                    <option value="monday">วันจันทร์</option>
                                    <option value="tuesday">วันอังคาร</option>
                                    <option value="wednesday">วันพุธ</option>
                                    <option value="thursday">วันพฤหัสบดี</option>
                                    <option value="friday">วันศุกร์</option>
                                </select>
                                </div>
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลาเปิดให้บริการ</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeStart}
                                    onChange={inputValue("timeStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeEnd}
                                    onChange={inputValue("timeEnd")}
                                    placeholder="00:00"
                                />
                            </div>

                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลาเปิดให้นัดหมายพูดคุย</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentStart}
                                    onChange={inputValue("timeAppointmentStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentEnd}
                                    onChange={inputValue("timeAppointmentEnd")}
                                    placeholder="00:00"
                                />
                            </div>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">จำนวคิว</label><br></br>
                                <input type="text" className="form-control timeable" value={numberAppointment} onChange={inputValue("numberAppointment")} placeholder="5" />
                                <span> คิว</span>

                            </div>
                            <div className="custome-admin-underline"></div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลาทําฝั่งเข็ม</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentMainStart}
                                    onChange={inputValue("timeAppointmentMainStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentMainEnd}
                                    onChange={inputValue("timeAppointmentMainEnd")}
                                    placeholder="00:00"
                                />
                            </div>
                            <div>
                                <label className="textBody-big2 colorPrimary-800">จำนวคิว</label><br></br>
                                <input type="text" className="form-control timeable" value={numberMainAppointment} onChange={inputValue("numberMainAppointment")} placeholder="5" />
                                <span> คิว</span>

                            </div>
                            <div className="admin-timetable-btn custom-admin-addtimetable">
                                <button type="button" onClick={openAddtimetable} className="btn-secondary btn-systrm">กลับ</button>
                                <input type="submit" value="เพิ่มช่วงเวลา" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                            </div>
                            </div>
                        </form>
                    </div>
                    <div id="Edittimetable">
                        <form onSubmit={editForm}>
                            <div>
                                <button type="button" onClick={() => openEdittimetable()} className="colorPrimary-800" id="backTopic">❮ แก้ไขเวลาเข้าทำการแพทย์</button>
                            </div>
                            <h2 className=" colorPrimary-800">คลินิกฝั่งเข็ม</h2>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วัน</label>
                                <select
                                    name="Day"
                                    value={addDay}
                                    onChange={(e) => { inputValue("addDay")(e); handleSelectChange(); }}
                                    className={selectedCount >= 2 ? 'selected' : ''}
                                >
                                    <option value="" disabled  hidden> กรุณาเลือกวัน </option>
                                    <option value="monday">วันจันทร์</option>
                                    <option value="tuesday">วันอังคาร</option>
                                    <option value="wednesday">วันพุธ</option>
                                    <option value="thursday">วันพฤหัสบดี</option>
                                    <option value="friday">วันศุกร์</option>
                                </select>
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลาเปิดให้บริการ</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeStart}
                                    onChange={inputValue("timeStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeEnd}
                                    onChange={inputValue("timeEnd")}
                                    placeholder="00:00"
                                />
                            </div>

                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลาเปิดให้นัดหมาย</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentStart}
                                    onChange={inputValue("timeAppointmentStart")}
                                    placeholder="00:00"
                                />
                                <span> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentEnd}
                                    onChange={inputValue("timeAppointmentEnd")}
                                    placeholder="00:00"
                                />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">จำนวคิว</label><br></br>
                                <input type="text" className="form-control timeable" value={numberAppointment} disabled onChange={inputValue("numberAppointment")} placeholder="5" />
                                <span> คิว</span>

                            </div>
                            <div className="admin-timetable-btn">
                                <button onClick={() => openEdittimetable()} className="btn-secondary btn-systrm" >กลับ</button>
                                <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary btn-systrm" target="_parent" />
                            </div>
                        </form>
                    </div>
                    <div id="Detailtimetable" className="colorPrimary-800">
                        <h2 className="center">รายละเอียด</h2>
                        <p id="Detailclinic" className="admin-textBody-big"><b>คลินิก</b> : คลินิกฝั่งเข็ม</p>
                        <p id="Detailday" className="admin-textBody-big">วัน :</p>
                        <p id="Detailtimeall" className="admin-textBody-big">ช่วงเวลาเปิดให้บริการ :</p>
                        <p id="Detailtime" className="admin-textBody-big">ช่วงเวลาเปิดให้นัดหมาย :</p>
                        <p id="Detailqueue" className="admin-textBody-big">จำนวนคิวนัดหมาย :</p>
                        <p id="Detail" className="admin-textBody-big">ช่วงเวลาเปิดให้นัดหมายพูดคุย :</p>
                        <p id="Detail2" className="admin-textBody-big">ช่วงเวลาทําฝั่งเข็ม :</p>


                    </div>

                </div>




            </div>


      )}
        </div>

    );
}

export default TimetablePhysicalComponent;