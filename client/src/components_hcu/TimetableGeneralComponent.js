import React, { useEffect, useState, useRef } from "react";
import NavbarComponent from "./NavbarComponent";
import "../css/AdminTimeTableComponent.css";
import edit from "../picture/icon_edit.jpg";
import icon_delete from "../picture/icon_delete.jpg";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import Swal from "sweetalert2";
import { doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "../css/Component.css";
import { PulseLoader } from "react-spinners";
import { fetchTimeTableDataGeneral, getTimeablelist } from "../backend/backendGeneral";
import ClockComponent from "../utils/ClockComponent";
const TimetableGeneralComponent = (props) => {
    const animationFrameRef = useRef();
    const { user, userData } = useUserAuth();
    const [zoomLevel, setZoomLevel] = useState(1);
    const [timetable, setTimetable] = useState([])
    const { id } = useParams();
    const [state, setState] = useState({
        addDay: "",
        timeStart: "",
        timeEnd: "",
        timeAppointmentStart: "",
        timeAppointmentEnd: "",
        numberAppointment: "",
        clinic: "",
        timetableId: id || "",
    })


    const { addDay, timeStart, timeEnd, timeAppointmentStart, timeAppointmentEnd, numberAppointment, clinic, timetableId } = state

    const isSubmitEnabled =
        !addDay || !timeStart || !timeEnd || !timeAppointmentStart || !timeAppointmentEnd || !numberAppointment;


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
                const timeTableData = await fetchTimeTableDataGeneral();
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
        
        
        const timeablelist = getTimeablelist(duration,numberAppointment,start,end);
        try {
            const additionalTImeTable = {
                addDay: addDay,
                timeStart: timeStart,
                timeEnd: timeEnd,
                timeAppointmentStart: timeAppointmentStart,
                timeAppointmentEnd: timeAppointmentEnd,
                numberAppointment: numberAppointment,
                clinic: "คลินิกทั่วไป",
                timeablelist: timeablelist,
                status: "Enabled",
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
        
        const timeablelist = getTimeablelist(duration,numberAppointment,start,end);
        try {
            const timetableRef = doc(db, 'timeTable', timetableId);
            console.log(timetableId);  // Corrected from console.log(timetable.id)

            const updatedTimetable = {
                addDay: addDay,
                timeStart: timeStart,
                timeEnd: timeEnd,
                timeAppointmentStart: timeAppointmentStart,
                timeAppointmentEnd: timeAppointmentEnd,
                numberAppointment: numberAppointment,
                clinic: "คลินิกทั่วไป",
                timeablelist: timeablelist,
                status: "Enabled",
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

        const responsivescreen = () => {
            const innerWidth = window.innerWidth;
            const baseWidth = 1920;
            const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
            setZoomLevel(newZoomLevel);
        };

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
    }, [user]);

    const containerStyle = {
        zoom: zoomLevel,
    };
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
        setState((prevState) => ({
            ...prevState,
            addDay: timetable.addDay,
            timeStart: timetable.timeStart,
            timeEnd: timetable.timeEnd,
            timeAppointmentStart: timetable.timeAppointmentStart,
            timeAppointmentEnd: timetable.timeAppointmentEnd,
            numberAppointment: timetable.numberAppointment,
            clinic: "คลินิก",
            timeablelist: timetable.timeablelist,
            status: "Enabled",
            timetableId: timetable.id,
        }));
        if (window.getComputedStyle(x).display === "none") {
            if(window.getComputedStyle(z).display === "block" && saveDetailId === timetable.id ){
                element.stopPropagation();
            }
            x.style.display = "block";
            y.style.display = "none";
            z.style.display = "none";
            setsaveDetailId("")
            setsaveEditId(timetable.id)
          
        } else {
            if (saveEditId === timetable.id) {
                x.style.display = "none";
                setsaveEditId("")
             
            } else {
                setsaveEditId(timetable.id)
        
            }

        }
    };

    const openDetailtimetable = (element, timetable) => {
        let x = document.getElementById("Detailtimetable");
        let y = document.getElementById("Edittimetable");
        let z = document.getElementById("Addtimetable");
        if(window.getComputedStyle(y).display === "block" && saveEditId === timetable.id ){
            element.stopPropagation();
        }

        if (window.getComputedStyle(x).display === "none") {
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
            for (let i = 0; i < timetable.timeablelist.length; i++) {
                listtimetable += `<p class="textBody-big">คิวลำดับที่ ${i + 1} : ${timetable.timeablelist[i].start} - ${timetable.timeablelist[i].end}</p>`
                console.log(timetable.timeablelist[i])
            }
            document.getElementById("Detail").innerHTML = `<b>ช่วงเวลาคิวนัดหมาย</b> : ${listtimetable}`
            // window.history.replaceState({}, null, `/timeTableGeneralAdmin/${timetable.id}`);
        } else {
            if (saveDetailId === timetable.id) {
                x.style.display = "none";
                setsaveDetailId("")
            }
            else {
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
                for (let i = 0; i < timetable.timeablelist.length; i++) {
                    listtimetable += `<p class="textBody-big">คิวลำดับที่ ${i + 1} : ${timetable.timeablelist[i].start} - ${timetable.timeablelist[i].end}</p>`
                    console.log(timetable.timeablelist[i])
                }
                document.getElementById("Detail").innerHTML = `<b>ช่วงเวลาคิวนัดหมาย</b> : ${listtimetable}`

            }

        }

    }

    const Deletetimetable = async (element, timetable) => {
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
                try {
                    deleteDoc(timetableRef, `${timetable.id}`)
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
            <div className="admin-topicBox colorPrimary-800">
                <div></div>
                <div>
                    <h1 className="center">ช่วงเวลาเข้าทำการแพทย์</h1>
                </div>
                <div className="dateTime">
                    <p className="admin-textBody-large">Date : {currentDate}</p>
                    <p className="admin-textBody-large admin-time">Time : <ClockComponent/></p>
                </div>
            </div>
            
            <div className="clinic">
                <a href="/timeTableGeneralAdmin" target="_parent" id="select">คลินิกทั่วไป</a>
                <a href="/timeTableSpecialAdmin" target="_parent" >คลินิกเฉพาะทาง</a>
                <a href="/timeTablePhysicalAdmin" target="_parent" >คลินิกกายภาพ</a>
                <a href="/timeTableNeedleAdmin" target="_parent" >คลินิกฝั่งเข็ม</a>
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
                        {timetable.filter((timetable) => timetable.addDay === "monday" && timetable.clinic === "คลินิกทั่วไป").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
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
                        {timetable.filter((timetable) => timetable.addDay === "monday" && timetable.clinic === "คลินิกทั่วไป").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันอังคาร</h3>
                        {timetable.filter((timetable) => timetable.addDay === "tuesday" && timetable.clinic === "คลินิกทั่วไป").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
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
                        {timetable.filter((timetable) => timetable.addDay === "tuesday" && timetable.clinic === "คลินิกทั่วไป").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันพุธ</h3>
                        {timetable.filter((timetable) => timetable.addDay === "wednesday" && timetable.clinic === "คลินิกทั่วไป").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
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
                        {timetable.filter((timetable) => timetable.addDay === "wednesday" && timetable.clinic === "คลินิกทั่วไป").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันพฤหัสบดี</h3>
                        {timetable.filter((timetable) => timetable.addDay === "thursday" && timetable.clinic === "คลินิกทั่วไป").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
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
                        {timetable.filter((timetable) => timetable.addDay === "thursday" && timetable.clinic === "คลินิกทั่วไป").length === 0 && (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <p className="admin-textBody-big">ไม่มีช่วงเวลาทําการ</p>
                                </div>
                            </div>
                        )}
                        <h3 className="colorPrimary-800">วันศุกร์</h3>
                        {timetable.filter((timetable) => timetable.addDay === "friday" && timetable.clinic === "คลินิกทั่วไป").sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <div className="row" >
                                <div className="card" onClick={handleCardClick}>
                                    <a className="card-detail colorPrimary-800" onClick={(event) => openDetailtimetable(event, timetable)}>
                                        <p className="admin-textBody-large">{timetable.timeStart} - {timetable.timeEnd}</p>
                                        <p className="admin-textBody-big">เปิดให้นัดหมาย {timetable.timeAppointmentStart} - {timetable.timeAppointmentEnd} </p>
                                        <p className="admin-textBody-big">จำนวน {timetable.numberAppointment} คิว</p>
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
                        {timetable.filter((timetable) => timetable.addDay === "friday" && timetable.clinic === "คลินิกทั่วไป").length === 0 && (
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
                            <div>
                                <button type="button" onClick={openAddtimetable} className="colorPrimary-800" id="backTopic">❮  เพิ่มช่วงเวลาเข้าทำการแพทย์</button>
                            </div>
                            <h2 className=" colorPrimary-800">คลินิกทั่วไป</h2>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วัน</label>
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
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลาเปิดให้บริการ</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeStart}
                                    onChange={inputValue("timeStart")}
                                    onInvalid={(e) => e.target.setCustomValidity(`กรุณากรอกเวลาในรูปแบบนี้ "00:00"`)}
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    placeholder="00:00"
                                    pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                                />
                                <span className="admin-textBody-large"> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeEnd}
                                    onChange={inputValue("timeEnd")}
                                    onInvalid={(e) => e.target.setCustomValidity(`กรุณากรอกเวลาในรูปแบบนี้ "00:00"`)}
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    placeholder="00:00"
                                    pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                                />
                            </div>

                            <div>
                                <label className="admin-textBody-large colorPrimary-800">ช่วงเวลาเปิดให้นัดหมาย</label><br />
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentStart}
                                    onChange={inputValue("timeAppointmentStart")}
                                    onInvalid={(e) => e.target.setCustomValidity(`กรุณากรอกเวลาในรูปแบบนี้ "00:00"`)}
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    placeholder="00:00"
                                    pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                                />
                                <span className="admin-textBody-large"> ถึง </span>
                                <input
                                    type="text"
                                    className="form-control timeable"
                                    value={timeAppointmentEnd}
                                    onChange={inputValue("timeAppointmentEnd")}
                                    onInvalid={(e) => e.target.setCustomValidity(`กรุณากรอกเวลาในรูปแบบนี้ "00:00"`)}
                                    onInput={(e) => e.target.setCustomValidity("")}
                                    placeholder="00:00"
                                    pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                                />
                            </div>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">จำนวนคิว</label><br></br>
                                <input type="number" className="form-control timeable" value={numberAppointment} onChange={inputValue("numberAppointment")} placeholder="5" />
                                <span className="admin-textBody-large"> คิว</span>

                            </div>
                            <div className="admin-timetable-btn">
                                <button type="button" onClick={openAddtimetable} className="btn-secondary btn-systrm">กลับ</button>
                                <input type="submit" value="เพิ่มช่วงเวลา" className="btn-primary btn-systrm" target="_parent" disabled={isSubmitEnabled} />
                            </div>
                        </form>
                    </div>
                    <div id="Edittimetable">
                        <form onSubmit={editForm}>
                            <div>
                                <button type="button" onClick={() => openEdittimetable()} className="colorPrimary-800" id="backTopic">❮ แก้ไขเวลาเข้าทำการแพทย์</button>
                            </div>
                            <h2 className=" colorPrimary-800">คลินิกทั่วไป</h2>
                            <div>
                                <label className="admin-textBody-large colorPrimary-800">วัน</label>
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
                                <label className="admin-textBody-large colorPrimary-800">จำนวนคิว</label><br></br>
                                <input type="text" className="form-control timeable" value={numberAppointment} disabled onChange={inputValue("numberAppointment")} placeholder="5" />
                                <span> คิว</span>

                            </div>
                            <div className="admin-timetable-btn">
                                <button type="button" onClick={() => openEdittimetable()} className="btn-secondary btn-systrm" >กลับ</button>
                                <input type="submit" value="แก้ไขนัดหมาย" className="btn-primary btn-systrm" target="_parent" />
                            </div>
                        </form>
                    </div>
                    <div id="Detailtimetable" className="colorPrimary-800">
                        <h2 className="center">รายละเอียด</h2>
                        <br></br>
                        <p id="Detailclinic" className="admin-textBody-big"><b>คลินิก</b> : คลินิกทั่วไป</p>
                        <p id="Detailday" className="admin-textBody-big"></p>
                        <p id="Detailtimeall" className="admin-textBody-big"></p>
                        <p id="Detailtime" className="admin-textBody-big"></p>
                        <p id="Detailqueue" className="admin-textBody-big"></p>
                        <p id="Detail" className="admin-textBody-big"></p>

                    </div>
                </div>
            </div>
      )}
        </div>

    );
}

export default TimetableGeneralComponent;