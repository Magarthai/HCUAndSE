import React, { useEffect, useState } from "react";
import "../css/CalendarComponent.css";
import { useLocation, useNavigate } from "react-router-dom";
const CalendarAddUserComponent = (props) => {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Adjusted to start from 1
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [daysArray, setDaysArray] = useState([]);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
  const [selectedYearIndex, setSelectedYearIndex] = useState(null);

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth - 1, day);
    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    const formattedSelectedDate = {
      day: day,
      month: currentMonth,
      year: currentYear,
      dayName: dayName,
    };
    setSelectedDateIndex(day);
    setSelectedMonthIndex(currentMonth)
    console.log("currentMonth",currentMonth)
    setSelectedYearIndex(currentYear)
    setSelectedDate(formattedSelectedDate);
    renderCalendar();
    props.onDateSelect(formattedSelectedDate);
};

const renderCalendar = () => {
  let firstDayofMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  let lastDateofMonth = new Date(currentYear, currentMonth, 0).getDate();
  let lastDayofMonth = new Date(currentYear, currentMonth - 1, lastDateofMonth).getDay();
  let lastDateofLastMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
  let days = [];

  for (let i = firstDayofMonth; i > 0; i--) {
    days.push(<li key={`inactive-prev-${lastDateofLastMonth - i + 1}`} className="inactive">{lastDateofLastMonth - i + 1}</li>);
  }

  for (let i = 1; i <= lastDateofMonth; i++) {
    const isToday = i === new Date().getDate() && currentMonth === new Date().getMonth() + 1 && currentYear === new Date().getFullYear() ? "inactive active grey-cantselect" : "";

    const isSelected = i === selectedDateIndex && currentMonth === selectedMonthIndex && currentYear === selectedYearIndex ? "focused" : "";
    const DateOld = i === selectedDateFromLocation.day && currentMonth === selectedDateFromLocation.month && currentYear === selectedDateFromLocation.year  ? "active " : "";
    const handleClick = () => handleDateClick(i);
    if ((i >= new Date().getDate() && currentMonth === new Date().getMonth() + 1 && currentYear === new Date().getFullYear()) ||
      (currentMonth > new Date().getMonth() + 1 && currentMonth < new Date().getMonth() + 4 && currentYear === new Date().getFullYear()) ||
      (currentYear > new Date().getFullYear())
    ) {
      days.push(
        <li key={`active-${i}`} className={`${isToday} ${isSelected} ${DateOld}`} onClick={handleClick}>
          {i}
        </li>
      );
    }
     else {
      days.push(<li key={`inactive-current-${i}`} className="inactive">{i}</li>);
    }
  }

  for (let i = lastDayofMonth; i < 6; i++) {
    days.push(<li key={`inactive-next-${i - lastDayofMonth + 1}`} className="inactive">{i - lastDayofMonth + 1}</li>);
  }

  setDaysArray(days);
};
const [isLoading, setIsLoading] = useState(false);
const selectedDateFromLocation = location.state?.selectedDate || null;
const handleSelectedDate = (dateData) => {
  if (dateData) {
      handleDateClick(dateData.day);
      setCurrentMonth(dateData.month);
      setCurrentYear(dateData.year);
      setSelectedMonthIndex(dateData.month);
      setSelectedYearIndex(dateData.year);
      renderCalendar();
      setIsLoading(true);
  }
};

// First useEffect
useEffect(() => {
  console.log("Selected DateXX:", selectedDate);
  renderCalendar();
}, [currentMonth, currentYear, selectedDate]);

// Second useEffect
useEffect(() => {
  if (!selectedDate) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      handleDateClick(currentDate.getDate());
      if (props.selectedDate) {
          setSelectedDate(props.selectedDate);
          renderCalendar();
      }
  } else {
      if (!isLoading && selectedDateFromLocation) {
          handleSelectedDate(selectedDateFromLocation);
      }
  }
}, [selectedDate, currentMonth]);

// Third useEffect
useEffect(() => {
  if (!isLoading && selectedDateFromLocation) {
      handleSelectedDate(selectedDateFromLocation);
  }
}, [selectedDateFromLocation]);

// Fourth useEffect
useEffect(() => {
  console.log("Updated selectedDate:", selectedDate);
  console.log(selectedDate);

  setCalendarSelectedDate(selectedDate);
}, [selectedDate]);

// Fifth useEffect
useEffect(() => {
  if (!selectedDateFromLocation) {
      console.log("check");
  } else if (!isInitialRender) {
      console.log("hello world");
  } else {
      if (selectedDateFromLocation) {
          setSelectedDate(selectedDateFromLocation);
          setSelectedMonthIndex(selectedDateFromLocation.month);
          setSelectedYearIndex(selectedDateFromLocation.year);
          console.log("date checkss", selectedDate);
          setIsInitialRender(false);
          handleSelectedDate(selectedDateFromLocation); // Using the new function
      }
  }
}, [selectedDate]);

  const [isInitialRender, setIsInitialRender] = useState(true);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);
  return (
    <div className="wrapper" id="userCalendar">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <header>
        <div className="icons">
          <span
            id="prev"
            className="material-symbols-outlined"
            onClick={() => {
              setCurrentMonth((prevMonth) => (prevMonth === 1 ? 12 : prevMonth - 1));
              setCurrentYear((prevYear) => (currentMonth === 1 ? prevYear - 1 : prevYear));
            }}
          >
            chevron_left
          </span>
          <p className="current-date">{months[currentMonth - 1]} {currentYear}</p>
          <span
            id="next"
            className="material-symbols-outlined"
            onClick={() => {
              setCurrentMonth((prevMonth) => (prevMonth === 12 ? 1 : prevMonth + 1));
              setCurrentYear((prevYear) => (currentMonth === 12 ? prevYear + 1 : prevYear));
            }}
          >
            chevron_right
          </span>
        </div>
      </header>
      <div className="calendar">
        <ul className="weeks">
          {weeks.map((day, index) => (
            <li key={index}>{day}</li>
          ))}
        </ul>
        <ul className="days">
          {daysArray}
        </ul>
      </div>
    </div>
  );
};

export default CalendarAddUserComponent;
