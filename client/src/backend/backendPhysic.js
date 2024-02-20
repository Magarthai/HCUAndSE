import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { getUserDataFromUserId } from './getDataFromUserId'
export const fetchTimeTableDataPhysic = async (user, selectedDate) => {
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
            return timeTableData;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

export const fetchTimeTableMainDataPhysic = async (user, selectedDates) => {
    try {
        if (user && selectedDates && selectedDates.dayName) {
            const timeTableCollection = collection(db, 'timeTable');
            const querySnapshot = await getDocs(query(
                timeTableCollection,
                where('addDay', '==', selectedDates.dayName),
                where('clinic', '==', 'คลินิกกายภาพ'),
                where('status', '==', 'Enabled')
            ));
            const timeTableData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return timeTableData;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

export const submitFormPhysic = async (selectedDate, timeOptions, selectedValue, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation) => {
    try {
        const appointmentInfo = {
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime,
            appointmentId: appointmentId || null,
            appointmentCasue,
            appointmentSymptom,
            appointmentNotation,
            clinic: "คลินิกกายภาพ",
            type: "talk",
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
                const selectedTimeLabel = timeOptions.find((timeOption) => {
                    const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                    return optionValue === selectedValue;
                })?.label;
                const userDocRef = doc(db, 'users', userId);
                const appointmentsCollection = collection(db, 'appointment');
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
            text: "ไม่สามารถสร้างนัดหมายได้ กรุณาลองอีกครั้งในภายหลัง",
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#263A50',
            customClass: {
                confirmButton: 'custom-confirm-button',
            }
        });
    }
}


export const editFormPhysic = async (selectedDate, timeOptions, timeOptionsss, typecheck, selectedValue, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, uid,appointmentDater,appointmentTimer,appointmentIdr,appointmentCasuer,appointmentSymptomr,appointmentNotationr) => {
    try {
        const timetableRef = doc(db, 'appointment', uid);
        console.log(uid);
        const usersCollection = collection(db, 'users');
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
        const userDocuments = userQuerySnapshot.docs;
        const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
        const updatedTimetable = {
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime: appointmentTime,
            appointmentId: appointmentId,
            appointmentCasue: appointmentCasue,
            appointmentSymptom: appointmentSymptom,
            appointmentNotation: appointmentNotation,
            clinic: "คลินิกกายภาพ",
            status: "ลงทะเบียนแล้ว",
        };
        const updatedTimetableRollBack = {
            appointmentDate: appointmentDater,
            appointmentTime: appointmentTimer,
            appointmentId: appointmentIdr,
            appointmentCasue: appointmentCasuer,
            appointmentSymptom: appointmentSymptomr,
            appointmentNotation: appointmentNotationr,
            clinic: "คลินิกกายภาพ",
            status: "ลงทะเบียนแล้ว",
        };

        if (typecheck === "talk") {
            if (foundUser) {
                const selectedTimeLabel = timeOptions.find((timeOption) => {
                    const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                    return optionValue === selectedValue;
                })?.label;
                const appointmentsCollection = collection(db, 'appointment');
                if (selectedTimeLabel != undefined) {
                    Swal.fire({
                        title: 'ยืนยันแก้นัดหมาย',
                        html: `ชื่อ-นามสกุล : ${foundUser.firstName} ${foundUser.lastName} </br> รหัสนักศึกษา/พนักงาน : ${appointmentId} </br> วันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
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

                                    await updateDoc(timetableRef, updatedTimetable); 
                                    const existingAppointmentsQuerySnapshot2 = await getDocs(query(
                                        appointmentsCollection,
                                        where('appointmentDate', '==', updatedTimetable.appointmentDate),
                                        where('appointmentTime.timetableId', '==', updatedTimetable.appointmentTime.timetableId),
                                        where('appointmentTime.timeSlotIndex', '==', updatedTimetable.appointmentTime.timeSlotIndex)
                                    ));
                    
                                    const existingAppointmentsQuerySnapshot3 = await getDocs(query(
                                        appointmentsCollection,
                                        where('appointmentDate2', '==', updatedTimetable.appointmentDate),
                                        where('appointmentTime2.timetableId', '==', updatedTimetable.appointmentTime.timetableId),
                                        where('appointmentTime2.timeSlotIndex', '==', updatedTimetable.appointmentTime.timeSlotIndex)
                                    ));
                    
                                    const b = existingAppointmentsQuerySnapshot2.docs.map((doc) => ({
                                        id: doc.id,
                                        ...doc.data(),
                                    }));
                    
                                    const c = existingAppointmentsQuerySnapshot3.docs.map((doc) => ({
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
                                            await updateDoc(timetableRef, updatedTimetable);
                                            window.location.reload();
                                        }
                                    });
                            } catch (firebaseError) {
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
                } else {
                    Swal.fire({
                        title: 'ยืนยันแก้นัดหมาย',
                        html: `ชื่อ-นามสกุล : ${foundUser.firstName} ${foundUser.lastName} </br> รหัสนักศึกษา/พนักงาน : ${appointmentId} </br> วันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
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
                                            await updateDoc(timetableRef, updatedTimetable);
                                            window.location.reload();
                                        }
                                    });
                            } catch (firebaseError) {
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
    
            }
        } else {
            if (foundUser) {
                const selectedTimeLabel = timeOptionsss.find((timeOption) => {
                    const optionValue = JSON.stringify({ timetableId: timeOption.value.timetableId, timeSlotIndex: timeOption.value.timeSlotIndex });
                    return optionValue === selectedValue;
                })?.label;
                if (selectedTimeLabel != undefined) {
                    Swal.fire({
                        title: 'ยืนยันแก้นัดหมาย',
                        html: `ชื่อ-นามสกุล : ${foundUser.firstName} ${foundUser.lastName} </br> รหัสนักศึกษา/พนักงาน : ${appointmentId} </br> วันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
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
                    }).then((result) => {
                        if (result.isConfirmed) {
                            try {
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
                                        await updateDoc(timetableRef, updatedTimetable);
                                        window.location.reload();
                                    }
                                });
                            } catch (firebaseError) {
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
                } else {
                    Swal.fire({
                        title: 'ยืนยันแก้นัดหมาย',
                        html: `ชื่อ-นามสกุล : ${foundUser.firstName} ${foundUser.lastName} </br> รหัสนักศึกษา/พนักงาน : ${appointmentId} </br> วันที่ ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} </br> เวลา ${selectedTimeLabel}`,
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
                    }).then((result) => {
                        if (result.isConfirmed) {
                            try {
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
                                        await updateDoc(timetableRef, updatedTimetable);
                                        window.location.reload();
                                    }
                                });
                            } catch (firebaseError) {
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
    
            }
        }
        
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



export const fetchUserDataWithAppointmentsPhysic = async (user, selectedDate) => {
    try {
        if (user && selectedDate && selectedDate.dayName) {
            const appointmentsCollection = collection(db, 'appointment');
            const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==',
                `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
                where('clinic', '==', 'คลินิกกายภาพ')));


            const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
                const appointmentData = doc.data();
                return {
                    appointmentId: doc.id,
                    appointmentuid: doc.id,
                    ...appointmentData,
                };
            });

            return existingAppointments


        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


export const existingAppointmentsPhysic = async (xd) => {
    const appointmentsCollection = collection(db, 'appointment');
    const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', `${xd.day}/${xd.month}/${xd.year}`),
        where('clinic', '==', 'คลินิกกายภาพ')));

    const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => doc.data().appointmentTime);
    return existingAppointments
}

export const fetchAppointmentUsersDataPhysic = async (existingAppointments) => {
    const timeTableCollection = collection(db, 'timeTable');
    console.log(existingAppointments, "test1")
    const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
        console.log("test2", existingAppointments)
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

    return AppointmentUsersDataArray;
}

export const availableTimeSlotsPhysic = async (filteredTimeTableData, selectedDate, db) => {
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

    return availableTimeSlots;
};

export const submitFormAddContinue2Physic = async (appointmentId, time, state, appointmentCasue, appointmentSymptom, appointmentNotation, resetForm) => {
    try {
        const usersCollection = collection(db, 'users'); // Assuming db is your Firestore instance
        const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', appointmentId)));
        const userDocuments = userQuerySnapshot.docs;
        const foundUser = userDocuments.length > 0 ? userDocuments[0].data() : null;
        const userId = userDocuments.length > 0 ? userDocuments[0].id : null;

        if (!userQuerySnapshot.empty) {
            console.log("User's collection ID:", userId);
        } else {
            console.log("No user found with the specified appointmentId");
        }

        if (foundUser) {
            for (let i = 1; i <= time; i++) {
                const updatedTimetable = {
                    appointmentDate: state[`appointmentDate${i}`],
                    appointmentTime: state[`appointmentTime${i}`],
                    appointmentId: appointmentId,
                    appointmentCasue: appointmentCasue,
                    appointmentSymptom: appointmentSymptom,
                    appointmentNotation: appointmentNotation,
                    clinic: "คลินิกกายภาพ",
                    status: "ลงทะเบียนแล้ว",
                    type: "main",
                    appove: "",
                    appointmentSymptom2: "",
                    appointmentDate2: "",
                    postPone: "",
                    appointmentTime2: [],
                };
                console.log(`time`, state[`appointmentTime${i}`],)
                const appointmentRef = await addDoc(collection(db, 'appointment'), updatedTimetable);
                console.log('Successful adddoc', updatedTimetable);
                console.log(appointmentId);
                console.log(appointmentRef.id);
                console.log("Newly created appointment ID:", appointmentRef.id);

                const userDocRef = doc(db, 'users', userId);

                await updateDoc(userDocRef, {
                    appointments: arrayUnion(appointmentRef.id),
                });
            }

        } else {
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
            console.log("User not found in alluserdata");
        }
        Swal.fire({
            icon: "success",
            title: "การนัดหมายสำเร็จ!",
            text: "การนัดหมายถูกสร้างเรียบร้อยแล้วว!",
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#263A50',
            customClass: {
                confirmButton: 'custom-confirm-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                resetForm();
            }
        });
    } catch (firebaseError) {
        console.error('Firebase submit error:', firebaseError);

        console.error('Firebase error response:', firebaseError);
        Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถสร้างนัดหมายได้ กรุณาลองอีกครั้งในภายหลัง",
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#263A50',
            customClass: {
                confirmButton: 'custom-confirm-button',
            }
        });
    }
};

const DeleteAppointmentPhysic = async (appointmentuid, uid,AppointmentUserData) => {
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
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            window.location.reload();
                        }
                    });
            } catch (firebaseError) {
                console.error('DeleteAppointment :', firebaseError);
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
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
            );
        }
    });
};

export default DeleteAppointmentPhysic;



