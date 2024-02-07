import { useState, useEffect } from "react";
import "../css/UserTimetableComponent.css";
import "../css/Component.css";
import NavbarUserComponent from './NavbarComponent';
import { db, getDocs, collection } from "../firebase/config";
import { useUserAuth } from "../context/UserAuthContext";


const TimetableComponet = (props) => {

    const [clinic, setClinic] = useState("คลินิกทั่วไป")
    const { user,userData } = useUserAuth();
    const [timetable, setTimetable] = useState([])
    const [isChecked, setIsChecked] = useState({});

    const changeClinic = (e) =>{
        setClinic(e.target.value);
    }

    const fetchTimeTableData = async () => {
        try {
            if (user) {
                const timeTableCollection = collection(db, 'timeTable');
                const timeTableSnapshot = await getDocs(timeTableCollection);

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

    useEffect(() => {
        fetchTimeTableData();
    }, [user, clinic]);

    console.log("clinic", clinic)
    return (
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>ตารางเข้าทำการแพทย์</h2>
                        <h3>เวลาเปิด-ปิดทำการ</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="user-timetable">
                    <div style={{marginBottom:"10px"}}>
                        <label className="colorPrimary-800"><h3>คลินิก</h3></label>
                        <select
                            name="clinic"
                            value={clinic}
                            onChange={(e) => {changeClinic(e);}}
                            className="colorPrimary-800"
                        >
                            <option value="คลินิกทั่วไป">คลินิกทั่วไป</option>
                            <option value="คลินิกเฉพาะทาง">คลินิกเฉพาะทาง</option>
                            <option value="คลินิกกายภาพ">คลินิกกายภาพ</option>
                            <option value="คลินิกฝั่งเข็ม">คลินิกฝั่งเข็ม</option>
                        </select>
                    </div>
                    <div className="colorPrimary-800">
                        <p>วันจันทร์</p>
                        <div className="user-timetable-detail">
                        {timetable.filter((timetable) => timetable.addDay === "monday" && timetable.clinic == clinic).sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                            <p> เวลา : {timetable.timeStart} - {timetable.timeEnd}</p> 
                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "monday" && timetable.clinic == clinic).length == 0 && (
                            <p>ไม่มีช่วงเวลาทําการ</p>
                        )}
                        </div>

                        <p>วันอังคาร</p>
                        <div className="user-timetable-detail">
                        {timetable.filter((timetable) => timetable.addDay === "tuesday" && timetable.clinic == clinic).sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                                <p> เวลา : {timetable.timeStart} - {timetable.timeEnd}</p> 
                        ))}
                        {timetable.filter((timetable) => timetable.addDay === "tuesday" && timetable.clinic == clinic).length == 0 && (
                            <p>ไม่มีช่วงเวลาทําการ</p>
                        )}
                        </div>
                        <p>วันพุธ</p>
                        <div className="user-timetable-detail">
                        {timetable.filter((timetable) => timetable.addDay === "wednesday" && timetable.clinic == clinic).sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                                <p> เวลา : {timetable.timeStart} - {timetable.timeEnd}</p> 
                            ))}
                        {timetable.filter((timetable) => timetable.addDay === "wednesday" && timetable.clinic == clinic).length == 0 && (
                            <p>ไม่มีช่วงเวลาทําการ</p>
                        )}
                        </div>
                        <p>วันพฤหัสบดี</p>
                        <div className="user-timetable-detail">
                        {timetable.filter((timetable) => timetable.addDay === "thursday" && timetable.clinic == clinic).sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                                <p> เวลา : {timetable.timeStart} - {timetable.timeEnd}</p> 
                            ))}
                        {timetable.filter((timetable) => timetable.addDay === "thursday" && timetable.clinic == clinic).length == 0 && (
                            <p>ไม่มีช่วงเวลาทําการ</p>
                        )}
                        </div>
                        <p>วันศุกร์</p>
                        <div className="user-timetable-detail">
                        {timetable.filter((timetable) => timetable.addDay === "friday" && timetable.clinic == clinic).sort((a, b) => (a.timeStart > b.timeStart) ? 1 : ((b.timeStart > a.timeStart) ? -1 : 0)).map((timetable, index) => (
                                <p> เวลา : {timetable.timeStart} - {timetable.timeEnd}</p> 
                            ))}
                        {timetable.filter((timetable) => timetable.addDay === "friday" && timetable.clinic == clinic).length == 0 && (
                            <p>ไม่มีช่วงเวลาทําการ</p>
                        )}
                        </div>
                    </div>
                </div>
            </div>
         
           
            
        </div>

    );
}

export default TimetableComponet;