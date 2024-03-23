import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {Bar, BarChart, LabelList,  PieChart, Pie, Cell,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import people from "../picture/people.png";
import axios from "axios";
const DashboardFeedbackNeedle = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { user, userData } = useUserAuth();
    const [ data1, setData1] = useState([]);
    const [ data2, setData2] = useState([]);
    const [ data3, setData3] = useState([]);
    const [ data4, setData4] = useState([]);
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
  
  
    useEffect(() => {
        document.title = 'Health Care Unit';
        console.log(user);
        console.log(userData)
        const responsivescreen = () => {
        const innerWidth = window.innerWidth;
        const baseWidth = 1920;
        const newZoomLevel = (innerWidth / baseWidth) * 100 / 100;
        setZoomLevel(newZoomLevel);
        };
        if(userData){
            fetchData();
            fetchDataTimeRange();
        }
        responsivescreen();
        window.addEventListener("resize", responsivescreen);
        const updateShowTime = () => {
        const newTime = getShowTime();
        if (newTime !== showTime) {
            setShowTime(newTime);
        }
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
        };
  
        animationFrameRef.current = requestAnimationFrame(updateShowTime);
    
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("resize", responsivescreen);
        };
    
    }, [user,userData]); 

    useEffect(() => {
        if(userData){
            handleDateSelectData(selectedDate);
        }
    },[selectedDate,userData])

    const handleDateSelectData = async(selectedDate) => {
        const info = {
            role : userData.role,
            clinic : "คลินิกฝังเข็ม",
            selectedDate: selectedDate
        }
        const responeToday = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTodayGetByClinicPhysicNeedle`,info);
        if (responeToday.data){
            const data = responeToday.data;
            console.log(data[0],"data 2 ")

            setData3(data[0])
            setData4(data[1])
        }

        const respone = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeGetByClinicPhysicNeedle`,info);
        if (respone.data){
            const data = respone.data;
            console.log(data[0],"data  ")

            setData1(data[0])
            setData2(data[1])
        }

    }
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
    const REACT_APP_MONGO_API = process.env.REACT_APP_MONGO_API;
    const fetchData = async() => {
        try{
        const info = {
            role : userData.role,
            clinic : "คลินิกฝังเข็ม"
        }
        const respone = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTodayGetByClinicPhysicNeedle`,info);
        if (respone.data){
            const data = respone.data;
            console.log(data[0],"data 2 ")

            setData3(data[0])
            setData4(data[1])
        }
    } catch(error) {
        console.error(error);
    }
    }


    const fetchDataTimeRange = async() => {
        try{
        const info = {
            role : userData.role,
            clinic : "คลินิกฝังเข็ม"
        }
        const respone = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeGetByClinicPhysicNeedle`,info);
        if (respone.data){
            const data = respone.data;
            console.log(data[0],"data  ")

            setData1(data[0])
            setData2(data[1])
        }
    } catch(error) {
        console.error(error);
    }
    }

    const locale = 'en';
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const day = today.toLocaleDateString(locale, { weekday: 'long' });
    const currentDate = `${day} ${month}/${date}/${year}`;
    
    const monthsInThai = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        console.log(selectedDate)
    };

    const formatDateInThai = (date) => {
        const [year, month, day] = date.split('-');
        const thaiMonth = monthsInThai[parseInt(month, 10) - 1];
        return `${day} ${thaiMonth} ${year}`;
    };

    const formatMonthInThai = (date) => {
        const [year, month, day] = date.split('-');
        const thaiMonth = monthsInThai[parseInt(month, 10) - 1];
        return `${thaiMonth} ${year}`;
    };

    const dataInday = [
        {
            name: selectedDate,
            uv: 4000,
            pv: 2400,
            amt: 2400,
          }
    ]

      const totalItemCount = data2.reduce((total, item) => total + item.value, 0);

    return (
        
      <div>
        <div style={containerStyle}>
          <NavbarComponent />
          <div className="admin-topicBox colorPrimary-800">
              <div></div>
              <div>
                  <h1 className="center">Dashboard <br></br>ข้อเสนอแนะหลังใช้บริการ "คลินิกฝังเข็ม"</h1>
              </div>
              <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
              </div>
          </div>
          <div className="admin">
            <div className="admin-header">
              <div className="admin-hearder-item">
                    <a href="/adminDashboardService" target="_parent" >Dashboard การใช้บริการ</a>
                    <a href="#" target="_parent" id="select">Dashboard คะแนนความพึงพอใจ</a>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="admin-header">
                <div className="admin-hearder-item2">
                <a href="/adminDashboardFeedbackAll" target="_parent">ข้อเสนอแนะทั่วไป</a>
                    <a href="/adminDashboardFeedbackGeneral" target="_parent" >หลังใช้บริการคลินิกทั่วไป</a>
                    <a href="/adminDashboardFeedbackSpecial" target="_parent" >หลังใช้บริการคลินิกเฉพาะทาง</a>
                    <a href="/adminDashboardFeedbackPhysical" target="_parent" >หลังใช้บริการคลินิกกายภาพ</a>
                    <a href="#" target="_parent" id="select" >หลังใช้บริการคลินิกฝังเข็ม</a>
                </div>
                <div className="admin-hearder-item3 admin-right"  style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <input type="date" className="form-control" style={{width: 250}} value={selectedDate} onChange={handleDateChange}/>
                </div>
            </div>
           
          </div>
        </div>

        <div className="admin colorPrimary-800" >

          <div className="admin-body">
            <h2>{formatMonthInThai(selectedDate)}</h2>
          </div>

         
          <div className="admin-dashboard-feedback-all admin-dashboard-flexbox" >
                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการตรวจรักษาโรคโดยแพทย์</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                    {data1 && data1[5] && (<h1 style={{fontSize:"50px"}}>{data1[5].score}</h1>)}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data1 && data1[5] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data1[5].totalSubmit}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data1}
                            margin={{
                            top: 0,
                            right: 20,
                            left: -30,
                            bottom: 10,
                            }}
                            layout="vertical"
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fontSize: 10}}/>
                            <YAxis  type="category" dataKey="name" tick={{ fontSize: 10 }} domain={[1,5]} />
                            <Tooltip />
                            
                            <Bar dataKey="value" fill="#365372" ></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการฝังเข็ม</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                    {data2 && data2[5] && (<h1 style={{fontSize:"50px"}}>{data2[5].score}</h1>)}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data2 && data2[5] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data2[5].totalSubmit}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data2}
                            margin={{
                            top: 0,
                            right: 20,
                            left: -30,
                            bottom: 10,
                            }}
                            layout="vertical"
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fontSize: 10}}/>
                            <YAxis  type="category" dataKey="name" tick={{ fontSize: 10 }} domain={[1,5]} />
                            <Tooltip />
                            
                            <Bar dataKey="value" fill="#365372" ></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

             

          </div> 
          
          <div className="admin-body">
            <h2>{selectedDate && formatDateInThai(selectedDate)}</h2>
          </div>  
         
          <div className="admin-dashboard-feedback-day-all admin-dashboard-flexbox">
          <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการตรวจรักษาโรคโดยแพทย์</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                    {data3 && data3[5] && (<h1 style={{fontSize:"50px"}}>{data3[5].score}</h1>)}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '240px'}}>
                        {data3 && data3[5] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data3[5].totalSubmit}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data3}
                            margin={{
                            top: 0,
                            right: 20,
                            left: -30,
                            bottom: 10,
                            }}
                            layout="vertical"
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fontSize: 10}}/>
                            <YAxis  type="category" dataKey="name" tick={{ fontSize: 10 }} domain={[1,5]} />
                            <Tooltip />
                            {/* <Legend style={{ fontSize: '10px'}}/> */}
                            <Bar dataKey="value" fill="#54B2B0" ></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการฝังเข็ม</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                    {data4 && data4[5] && (<h1 style={{fontSize:"50px"}}>{data4[5].score}</h1>)}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data4 && data4[5] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data4[5].totalSubmit}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data4}
                            margin={{
                            top: 0,
                            right: 20,
                            left: -30,
                            bottom: 10,
                            }}
                            layout="vertical"
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tick={{ fontSize: 10}}/>
                            <YAxis  type="category" dataKey="name" tick={{ fontSize: 10 }} domain={[1,5]} />
                            <Tooltip />
                            
                            <Bar dataKey="value" fill="#54B2B0"></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

              
            </div>
    
          
        </div>
      </div>
      

    );
}

export default DashboardFeedbackNeedle;

