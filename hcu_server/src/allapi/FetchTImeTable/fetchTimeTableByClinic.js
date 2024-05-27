const express = require('express');
const { initializeApp } = require('firebase/app');
const { collection, getDoc, query, where,doc,getDocs } = require('firebase/firestore');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('../../firebase');

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const router = express.Router();
const today = new Date();
today.setHours(0, 0, 0, 0); 

function isSameDay(date1, date2) {
    console.log(date1,date2)
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

router.post('/fetchTimeTableByClinic', async (req,res) => {
    if (req.body.role != 'admin') {
        res.status(500).json({ error: 'Internal server error' });
    }
    try {
        
        const selectedDate = req.body.selectedDate;
        const timeTableCollection = collection(db, 'timeTable');
        const clinic = req.body.clinic;
        console.log(clinic,selectedDate)
        const querySnapshot = await getDocs(query(
            timeTableCollection,
            where('addDay', '==', selectedDate.dayName),
            where('clinic', '==', clinic),
            where('status', '==', 'Enabled')
        ));
        const timeTableData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
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

                if (timeOptionsFromTimetable.length <= 1) {
                    const noTimeSlotsAvailableOption = [{ label: "ไม่มีช่วงเวลาทําการ กรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true }];
                    res.send(noTimeSlotsAvailableOption);
                } else {
                    res.send(timeOptionsFromTimetable);
                }


            } else {
                const noTimeSlotsAvailableOption = [{ label: "ไม่มีช่วงเวลาทําการ กรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true }];
                res.send(noTimeSlotsAvailableOption);
            }

        } else {
            const noTimeSlotsAvailableOption = [{ label: "ไม่มีช่วงเวลาทําการ กรุณาเปลี่ยนวัน", value: "", disabled: true, hidden: true }];
            res.send(noTimeSlotsAvailableOption);
        }

    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;