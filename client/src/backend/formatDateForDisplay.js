export const formatDateForDisplay = (isoDate,getDayName) => {
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

        return formattedDate;
    }
    return isoDate;
};


export const formatDateForDisplay2 = (isoDate,getDayName) => {
    const dateParts = isoDate.split("-");
    if (dateParts.length === 3) {
        const [year, month, day] = dateParts;
        const formattedMonth = parseInt(month, 10).toString();
        const formattedDay = parseInt(day, 10).toString();
        const formattedYear = parseInt(year, 10).toString();

        const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

        const dayName = getDayName(new Date(isoDate)).toLowerCase();
        const formattedSelectedDate = {
            day: parseInt(formattedDay, 10),
            month: parseInt(formattedMonth, 10),
            year: parseInt(formattedYear, 10),
            dayName: dayName,
        };

        return formattedDate;
    }
    return isoDate;
};


