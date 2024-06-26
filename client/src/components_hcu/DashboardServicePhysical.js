import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {Bar, BarChart, LabelList,  PieChart, Pie, Cell,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import people from "../picture/people.png";
import axios from "axios";
const DashboardServicePhysical = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { user, userData } = useUserAuth();
    const [data, setData] = useState([]);
    const [count, setCount] = useState({});
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [data5, setData5] = useState([]);
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
  
    const REACT_APP_API = process.env.REACT_APP_API
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

    useEffect(() =>{
      if(userData){
      handleDashboardDateSelected(selectedDate);
      }
    },[selectedDate,userData]);

    const handleDashboardDateSelected = async(selectedDate) => {
      try{
        const info = {
          userData: userData,
          clinic: "คลินิกกายภาพ",
          selectedDate: selectedDate
        }
        const responescount = await axios.post(`${REACT_APP_API}/api/getCountAppointmentByClinic`,info)
        if (responescount.data){
          setCount(responescount.data)
          console.log(responescount.data)
        }
        const respones = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeByClinic`,info)
        if (respones.data){
          setData(respones.data)
          console.log(respones.data)
        }
        const respone2 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeCountSuccessByClinic`,info);
        if (respone2.data){
          setData2(respone2.data)
          console.log(respone2.data)
        }
        const respone5 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountSuccessByClinic`,info);
        if (respone5.data){
          setData5(respone5.data)
          console.log(respone5.data)
        }
        const respone3 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeCountSuccessByPhysicOrNeedle`,info);
        if (respone3.data){
          setData3(respone3.data)
          console.log(respone3.data,"3")
        }
        const respone4 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountSuccessByPhysicOrNeedle`,info);
        if (respone4.data){
          setData4(respone4.data)
          console.log(respone4.data,"4")
        }
      } catch(error) {
        console.error(error);
      }
    }

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
    const fetchCount = async() => {
      const info = {
        userData: userData,
        clinic: "คลินิกกายภาพ"
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
  }
    const fetchData = async() => {
      try {
      const info = {
        userData: userData,
        clinic : "คลินิกกายภาพ"
      }
      const respones = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeByClinic`,info)
      if (respones.data){
        setData(respones.data)
        console.log(respones.data)
      }
      const respone2 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeCountSuccessByClinic`,info);
      if (respone2.data){
        setData2(respone2.data)
        console.log(respone2.data)
      }
      const respone5 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountSuccessByClinic`,info);
      if (respone5.data){
        setData5(respone5.data)
        console.log(respone5.data,"คลินิกกายภาพ22222")
      }
      const respone3 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthRangeCountSuccessByPhysicOrNeedle`,info);
      if (respone3.data){
        setData3(respone3.data)
        console.log(respone3.data,"3")
      }
      const respone4 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountSuccessByPhysicOrNeedle`,info);
      if (respone4.data){
        setData4(respone4.data)
        console.log(respone4.data,"4")
      }
    } catch (error) {
      console.log("Network error occurred:", error);
    }
    };

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

    
      const COLORS = [ '#456A91','#BABABA'];
      const COLORSDAY = [ '#54B2B0', '#BABABA'];
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
                  <h1 className="center">Dashboard <br></br> การใช้บริการของ "คลินิกกายภาพ"</h1>
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
                    <a href="/adminDashboardService" target="_parent">คลินิกทั้งหมด</a>
                    <a href="/adminDashboardServiceGeneral" target="_parent" >คลินิกทั่วไป</a>
                    <a href="/adminDashboardServiceSpecial" target="_parent" >คลินิกเฉพาะทาง</a>
                    <a href="#" target="_parent" id="select">คลินิกกายภาพ</a>
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
                <div className="admin-dashboard-box boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"45px"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  {count && <h1>{count.today} คน</h1>}
         
               </div>
              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>จำนวนผู้ใช้บริการแต่ละส่วนของคลินิกกายภาพ</h4>
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                    data={data5}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                  >
                    {data5 && data5.length > 0 && data5.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORSDAY[index % COLORSDAY.length]} />
                    ))}
                  </Pie>
                  {data5 && data5[0] && data5[1] && data5[0].value === 0 && data5[1].value === 0 && (
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="#263A50">
                          ไม่มีข้อมูลสำหรับวันที่ {formatDateInThai(selectedDate)}
                        </text>
                    )}
                  {data5 && data5[0] && data5[1] && (data5[0].value !== 0 || data5[1].value !== 0) && (
                  <Legend 
                    align="right" 
                    verticalAlign="middle" 
                    iconType="circle"
                    formatter={(value, entry) => {
                      const percentage = entry.payload.percent * 100;
                      const formattedPercentage = isNaN(percentage) ? 0 : percentage.toFixed(0);
                      return `${value} (${entry.payload.value} คน)`;
                    }}
                    layout="vertical"
                  />
                  )} 
                  </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการแต่ละส่วนของคลินิกกายภาพ</h4>
                <div style={{ width: '100%', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={data4}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 5,
                    bottom: 0,
                  }}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                  <YAxis tick={{ fontSize: 12 }}/>
                  <Tooltip />
                 <Legend style={{ fontSize: '10px' }}/>
                  <Bar dataKey="สำเร็จ" fill="#54B2B0" />
                  <Bar dataKey="ไม่สำเร็จ" fill="#BABABA"/>
                  </BarChart>
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
                    <Line type="monotone" dataKey="ปรึกษาแพทย์" stroke="#BABABA" />
                    <Line type="monotone" dataKey="ทำกายภาพ" stroke="#7C9DC1" />
                    <Line type="monotone" dataKey="คลินิกกายภาพ" stroke="#456A91" />
            </LineChart>
          </ResponsiveContainer>
          </div>
          
          <div className="admin-dashboard-month-all admin-dashboard-flexbox">
              <div className="admin-dashboard-box boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"45px"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  {count && <h1>{count.all} คน</h1>}
              </div>

              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>จำนวนผู้ใช้บริการแต่ละส่วนของคลินิกกายภาพ</h4>
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
                    {data2 && data2[0] && data2[1] && data2[0].value === 0 && data2[1].value === 0 && ( 
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
                        return `${value} (${entry.payload.value} คน)`;
                      }}
                      layout="vertical"
                    />
                    )} 
                   </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการแต่ละส่วนของคลินิกกายภาพ</h4>
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={data3}
                      margin={{
                      top: 5,
                      right: 30,
                      left: 5,
                      bottom: 0,
                     }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }}/>
                      <Tooltip />
                      <Legend style={{ fontSize: '10px' }}/>
                      <Bar dataKey="สำเร็จ" fill="#7C9DC1" />
                      <Bar dataKey="ไม่สำเร็จ" fill="#BABABA"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

          </div> 
          
          
    
          
        </div>
      </div>
      

    );
}

export default DashboardServicePhysical;



