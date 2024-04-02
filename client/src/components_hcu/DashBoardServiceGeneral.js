import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {Bar, BarChart, LabelList,  PieChart, Pie, Cell,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import people from "../picture/people.png";
import axios from "axios"
const DashBoardGeneral = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const REACT_APP_API = process.env.REACT_APP_API
    const [count, setCount] = useState({});
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
        if (userData) {
          fetchData();
          fetchCount();
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
      useEffect(() =>{
        if(userData){
        handleDashboardDateSelected(selectedDate);
        }
      },[selectedDate,userData]);

    const handleDashboardDateSelected = async(selectedDate) => {
      try {
      const info = {
        userData: userData,
        clinic : "คลินิกทั่วไป",
        selectedDate: selectedDate
      };
      
      const respones = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeByClinic`,info)
      if (respones.data){
        setData(respones.data,"คลินิกทั่วไป")
        console.log(respones.data)
      }
      const respone2 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeCountSuccessByClinic`,info);
      if (respone2.data){
        setData2(respone2.data,"คลินิกทั่วไป")
        console.log(respone2.data)
      }
      const respone3 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountSuccessByClinic`,info);
      if (respone3.data){
        setData3(respone3.data)
        console.log(respone3.data,"respone3")
      }
      const respones4 = await axios.post(`${REACT_APP_API}/api/getCountAppointmentByClinic`,info)
      if (respones4.data){
        setCount(respones4.data,"respones.data")
        console.log(respones4.data)
      }
    } catch (error) {
      console.error(error)
    }
    };

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

    const fetchData = async() => {
      try {
      const info = {
        userData: userData,
        clinic : "คลินิกทั่วไป"
      }
      const respones = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeByClinic`,info)
      if (respones.data){
        setData(respones.data,"คลินิกทั่วไป")
        console.log(respones.data)
      }
      const respone2 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeCountSuccessByClinic`,info);
      if (respone2.data){
        setData2(respone2.data,"คลินิกทั่วไป")
        console.log(respone2.data)
      }
      const respone3 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountSuccessByClinic`,info);
      if (respone3.data){
        setData3(respone3.data)
        console.log(respone3.data,"respone3")
      }
    } catch (error) {
      console.log("Network error occurred:", error);
    }
    };

    const fetchCount = async() => {
      const info = {
        userData: userData,
        clinic: "คลินิกทั่วไป"
      }
      try {
      const respones = await axios.post(`${REACT_APP_API}/api/getCountAppointmentByClinic`,info)
      if (respones.data){
        setCount(respones.data,"respones.data")
        console.log(respones.data)
      }
    } catch (error) {
      console.log(error);
    }
    };
      const COLORS = ['#BABABA', '#7C9DC1'];
      const COLORSDAY = ['#BABABA', '#54B2B0'];
      const RADIAN = Math.PI / 180;
      const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
        
          <text x={x} y={y} fill="white" fontSize={12} textAnchor="middle" dominantBaseline="middle">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
          
        
        );
      };


    return (
        
      <div>
        <div style={containerStyle}>
          <NavbarComponent />
          <div className="admin-topicBox colorPrimary-800">
              <div></div>
              <div>
                  <h1 className="center">Dashboard <br></br>การใช้บริการของ "คลินิกทั่วไป"</h1>
              </div>
              <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
              </div>
          </div>
          <div className="admin">
          <div className="admin-header">
              <div className="admin-hearder-item">
                    <a href="#" target="_parent" id="select">Dashboard การใช้บริการ</a>
                    <a href="/adminDashboardFeedbackAll" target="_parent" >Dashboard คะแนนความพึงพอใจ</a>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="admin-header">
                <div className="admin-hearder-item">
                    <a href="/adminDashboardService"  target="_parent">คลินิกทั้งหมด</a>
                    <a href="#" target="_parent" id="select">คลินิกทั่วไป</a>
                    <a href="/adminDashboardServiceSpecial" target="_parent" >คลินิกเฉพาะทาง</a>
                    <a href="/adminDashboardServicePhysical" target="_parent" >คลินิกกายภาพ</a>
                    <a href="/adminDashboardServiceNeedle" target="_parent" >คลินิกฝังเข็ม</a>
                </div>
                <div className="admin-hearder-item admin-right"  style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <input type="date" className="form-control" style={{width: 250}} value={selectedDate} onChange={handleDateChange} max={new Date().toISOString().split("T")[0]}/>
                </div>
            </div>
           
          </div>
        </div>

        <div className="admin colorPrimary-800" >
        <div className="admin-body">
            <h2>{selectedDate && formatDateInThai(selectedDate)}</h2>
          </div>  
        
          <div className="admin-dashboard-day-all admin-dashboard-flexbox">
                <div className="admin-dashboard-box4 boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"60px"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  {count && <h1>{count.today} คน</h1>}
         
               </div>
              <div className="admin-dashboard-box4 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการในคลินิกทั่วไป</h4>
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                    data={data3}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                  >
                    {data3 && data3.length > 0 &&  data3.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORSDAY[index % COLORSDAY.length]} />
                    ))}
                  </Pie>
                    {data3 && data3[0] && data3[1] && data3[0].value === 0 && data3[1].value === 0 && (
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="#263A50">
                          ไม่มีข้อมูลสำหรับวันที่ {formatDateInThai(selectedDate)}
                        </text>
                    )}
                    {data3 && data3[0] && data3[1] && (data3[0].value !== 0 || data3[1].value !== 0) && (
                  <Legend 
                    align="right" 
                    verticalAlign="middle" 
                    iconType="circle"
                    formatter={(value, entry) => {
                      const percentage = entry.payload.percent * 100;
                      const formattedPercentage = isNaN(percentage) ? 0 : percentage.toFixed(0);
                      return `${value} (${entry.payload.value})`;
                    }}
                    layout="vertical"
                  />
                  )}
                  </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
      
            </div>

          <div className="admin-body">
            <h2>{formatMonthInThai(selectedDate)}</h2>
          </div>

          <div className="admin-dashboard-month">
          <ResponsiveContainer width="100%" height={300} style={{padding:"0 3%"}}>
          <LineChart data={data}   width={500} height={300} margin={{ top: 20, right: 30, left: 0, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                    <YAxis  tick={{ fontSize: 12 }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="คลินิกทั่วไป" stroke="#456A91" />
            </LineChart>
          </ResponsiveContainer>
          </div>
          
          <div className="admin-dashboard-month-all admin-dashboard-flexbox">
              <div className="admin-dashboard-box4 boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"60px"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  {count && <h1>{count.all} คน</h1>}
              </div>

              <div className="admin-dashboard-box4 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการในคลินิกทั่วไป</h4>
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                      data={data2}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data2 && data2.length > 0 && data2.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}

                    </Pie>
                    {data2 && data2[0] && data2[1] && data2[0].value === 0 && data2[1].value === 0 && ( // เพิ่มเงื่อนไขตรวจสอบว่าไม่มีข้อมูล
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="#263A50">
                        ไม่มีข้อมูลสำหรับเดือน {formatMonthInThai(selectedDate)}
                      </text>
                    )}
                     {data2 && data2[0] && data2[1] && (data2[0].value != 0 || data2[1].value != 0) && (
                    <Legend 
                      align="right" 
                      verticalAlign="middle" 
                      iconType="circle"
                      formatter={(value, entry) => {
                        const percentage = entry.payload.percent * 100;
                        const formattedPercentage = isNaN(percentage) ? 0 : percentage.toFixed(0);
                        return `${value} (${entry.payload.value})`;
                      }}
                      layout="vertical"
                    />
                     )}
                   </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              

          </div> 
          
         
    
          
        </div>
      </div>
      

    );
}

export default DashBoardGeneral;



