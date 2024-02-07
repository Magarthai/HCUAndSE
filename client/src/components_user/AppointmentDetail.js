import React, { useEffect, useState } from "react";
import "../css/UserAppointmentDetail.css";
import '../css/Component.css';
import CalendarFlat_icon from "../picture/calendar-flat.png";
import ClockFlat_icon from "../picture/clock-flat.png";
import NavbarUserComponent from '../components_user/NavbarComponent';
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
const AppointmentDetail = () => {
    const navigate = useNavigate();
    const { userData } = useUserAuth();
  const [searchParams] = useSearchParams();
  const encodedInfo = searchParams.get('info');
  const appointmentInfo = JSON.parse(encodedInfo);
  const timetableIdToMatch = appointmentInfo.appointmentTime.timetableId;
  const [timetableData, setTimetableData] = useState()
  const [timeSlot, setTimeSlot] = useState()
  const fetchTimeTableData = async () => {
    try {
        if (appointmentInfo) {
            console.log("id",timetableIdToMatch)
            const timetableDocRef = doc(collection(db, 'timeTable'), timetableIdToMatch);
            const timetableDocSnapshot = await getDoc(timetableDocRef);
            const timetableData = timetableDocSnapshot.data();
            const timeablelistAtIndex = timetableData.timeablelist[appointmentInfo.appointmentTime.timeSlotIndex];
            setTimetableData(timetableData)
            setTimeSlot(timeablelistAtIndex)
            console.log("timetableIdToMatch",timeablelistAtIndex)
        }
        else{
            navigate(`/appointment`);
        }
    } catch (firebaseError) {
        console.error('Firebase submit error:', firebaseError);

        console.error('Firebase error response:', firebaseError);
    }
};

  useEffect(() => {
    if (!timetableData){
        fetchTimeTableData();
    }
    console.log(appointmentInfo)
}, [appointmentInfo]);

    return (
        <div className="user">
            <header className="user-header">
                <div>
                    <h2>การนัดหมาย</h2>
                    <h3>รายละเอียดนัดหมาย</h3>
                </div>

                <NavbarUserComponent/>
            </header>

            <div className="user-body">
                <div className="user-AppointmenDetail-Card_container gap-32">
                    <div className="user-AppointmenDetail-Card colorPrimary-800">
                        <h2 className="user-AppointmenDetail-Card_title" style={{marginTop:10}}>นัดหมาย</h2>
                       <p className="textBody-big gap-4">ID : {appointmentInfo.appointmentId}</p>
                        {userData &&<p className="textBody-big gap-4">ชื่อ-นามสกุล : {userData.firstName} {userData.lastName}</p>}
                        <p className="textBody-big gap-4">คลินิก : {appointmentInfo.clinic}</p>
                        <p className="textBody-big gap-4"> <img src={CalendarFlat_icon}/> {appointmentInfo.appointmentDate} </p>
                        {timeSlot && <p className="textBody-big gap-4"> <img src={ClockFlat_icon}/>  {timeSlot.start} - {timeSlot.end}</p>}
                        <h5>สาเหตุการนัดหมาย</h5>
                        <p className="textBody-big">: {appointmentInfo.appointmentCasue}</p>
                        <h5>อาการเบื้องต้น</h5>
                        <p className="textBody-big">: {appointmentInfo.appointmentSymptom}</p>
                    </div>
                </div>

                <div className="user-AppointmenDetail-Button_container">
                    <a className="btn btn-primary" href="/appointment" role="button"  target="_parent">ย้อนกลับ</a>
                </div>
            </div>
    
            
        </div>

    );
}

export default AppointmentDetail;

 