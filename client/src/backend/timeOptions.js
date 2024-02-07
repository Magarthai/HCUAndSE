export const GetTimeOptionsFromTimetable = (availableTimeSlots) => [
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

export const GetTimeOptionsFilterdFromTimetable = (availableTimeSlots) => [
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