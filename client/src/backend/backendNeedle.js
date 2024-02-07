import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { getUserDataFromUserId } from './getDataFromUserId'
export const fetchTimeTableDataNeedle = async (user, selectedDate) => {
    try {
        if (user && selectedDate && selectedDate.dayName) {
            const timeTableCollection = collection(db, 'timeTable');
            const querySnapshot = await getDocs(query(
                timeTableCollection,
                where('addDay', '==', selectedDate.dayName),
                where('clinic', '==', 'คลินิกฝั่งเข็ม')
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

export const fetchTimeTableMainDataNeedle = async (user, selectedDates) => {
    try {
        if (user && selectedDates && selectedDates.dayName) {
            const timeTableCollection = collection(db, 'timeTable');
            const querySnapshot = await getDocs(query(
                timeTableCollection,
                where('addDay', '==', selectedDates.dayName),
                where('clinic', '==', 'คลินิกฝั่งเข็ม')
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

export const submitFormNeedle = async (selectedDate, timeOptions, selectedValue, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation) => {
    try {
        const appointmentInfo = {
            appointmentDate: `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`,
            appointmentTime,
            appointmentId: appointmentId || null,
            appointmentCasue,
            appointmentSymptom,
            appointmentNotation,
            clinic: "คลินิกฝั่งเข็ม",
            type: "talk",
            status: "ลงทะเบียนแล้ว",
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
                }).then((result) => {
                    if (result.isConfirmed) {
                        try {
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
                            ).then(async (result) => {
                                if (result.isConfirmed) {
                                    const appointmentRef = await addDoc(collection(db, 'appointment'), appointmentInfo);
                                    await updateDoc(userDocRef, {
                                        appointments: arrayUnion(appointmentRef.id),
                                    });
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

export const editFormNeedle = async (selectedDate, timeOptions, timeOptionsss, typecheck, selectedValue, appointmentTime, appointmentId, appointmentCasue, appointmentSymptom, appointmentNotation, uid) => {
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
            clinic: "คลินิกฝั่งเข็ม",
            status: "ลงทะเบียนแล้ว",
        };

        if (typecheck === "talk") {
            if (foundUser) {
                const selectedTimeLabel = timeOptions.find((timeOption) => {
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



export const fetchUserDataWithAppointmentsNeedle = async (user, selectedDate) => {
    try {
        if (user && selectedDate && selectedDate.dayName) {
            const appointmentsCollection = collection(db, 'appointment');
            const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==',
                `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
                where('clinic', '==', 'คลินิกฝั่งเข็ม')));


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


export const existingAppointmentsNeedle = async (xd) => {
    const appointmentsCollection = collection(db, 'appointment');
    const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', `${xd.day}/${xd.month}/${xd.year}`),
        where('clinic', '==', 'คลินิกฝั่งเข็ม')));

    const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => doc.data().appointmentTime);
    return existingAppointments
}

export const fetchAppointmentUsersDataNeedle = async (existingAppointments) => {
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

export const availableTimeSlotsNeedle = async (filteredTimeTableData, selectedDate, db) => {
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

    return availableTimeSlots;
};

export const submitFormAddContinue2Needle = async (appointmentId, time, state, appointmentCasue, appointmentSymptom, appointmentNotation, resetForm) => {
    try {
        const usersCollection = collection(db, 'users');
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
                    clinic: "คลินิกฝั่งเข็ม",
                    status: "ลงทะเบียนแล้ว",
                    type: "main",
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

            Swal.fire({
                icon: "success",
                title: "การนัดหมายสำเร็จ!",
                text: "การนัดหมายถูกสร้างเรียบร้อยแล้ว!",
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

const DeleteAppointmentNeedle = async (appointmentuid, uid) => {
    const timetableRef = doc(db, 'appointment', appointmentuid);

    Swal.fire({
        title: 'ลบนัดหมาย',
        text: `วันที่ 15/12/2023 เวลา 13:01 - 13:10`,
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
                window.location.reload();
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

export default DeleteAppointmentNeedle;



