import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {Bar, BarChart, LabelList,  PieChart, Pie, Cell,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import people from "../picture/people.png";
import axios from "axios"
const DashboardServiceAll = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [Todaydata2, setTodayData2] = useState([]);

    const [count, setCount] = useState({});
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
        fetchCount();
        fetchData2();
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

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        console.log(selectedDate)
    };
    useEffect(() =>{
      if(userData){
        setData4();
        console.log(selectedDate)
      handleDashboardDateSelected(selectedDate);
      }
    },[selectedDate,userData]);

    const handleDashboardDateSelected = async(selectedDate) => {
      try {
      const info = {
        userData: userData,
        selectedDate: selectedDate
      }
      const responesAll = await axios.post(`${REACT_APP_API}/api/getDashboardMonthRange`,info)
      if (responesAll.data){
        setData(responesAll.data)
        console.log(responesAll.data)
      }
      const respones = await axios.post(`${REACT_APP_API}/api/getDashboardMonthRangeCount`, info);
        if (respones.data) {
          setData2(respones.data);
          console.log(respones.data);
        }
    
        const respones2 = await axios.post(`${REACT_APP_API}/api/getDashboardMonthTodayCount`, info);
        if (respones2.data) {
          setTodayData2(respones2.data);
          console.log(respones2.data);
        }
    
        const respones3 = await axios.post(`${REACT_APP_API}/api/getDashboardMonthRangeCountNeedlePhysic`, info);
        if (respones3.data) {
          setData3(respones3.data, "respones3.data");
          console.log(respones3.data);
        }
    
        const respones4 = await axios.post(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountNeedlePhysic`, info);
        if (respones4.data) {
          setData4(respones4.data, "respones4.data");
          console.log(respones4.data);
        }

        const responesCount = await axios.post(`${REACT_APP_API}/api/getCountAppointment`,info)
      if (responesCount.data){
        setCount(responesCount.data,"respones.data")
        console.log(responesCount.data)
      }
    } catch(error) {
      console.error(error);
    }
    }
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

    const REACT_APP_API = process.env.REACT_APP_API
    const fetchData = async() => {
      try {
      const info = {
        userData: userData
      }
      const respones = await axios.post(`${REACT_APP_API}/api/getDashboardMonthRange`,info)
      if (respones.data){
        setData(respones.data)
        console.log(respones.data)
      }
    } catch (error) {
      console.log("Network error occurred:", error);
    }
    };

    const fetchData2 = async () => {
      const info = {
        userData: userData
      };
    
      try {
        const respones = await axios.post(`${REACT_APP_API}/api/getDashboardMonthRangeCount`, info);
        if (respones.data) {
          setData2(respones.data);
          console.log(respones.data);
        }
    
        const respones2 = await axios.post(`${REACT_APP_API}/api/getDashboardMonthTodayCount`, info);
        if (respones2.data) {
          setTodayData2(respones2.data);
          console.log(respones2.data);
        }
    
        const respones3 = await axios.get(`${REACT_APP_API}/api/getDashboardMonthRangeCountNeedlePhysic`, info);
        if (respones3.data) {
          setData3(respones3.data, "respones3.data");
          console.log(respones3.data);
        }
    
        const respones4 = await axios.get(`${REACT_APP_API}/api/appointmentCurrentMonthTodayCountNeedlePhysic`, info);
        if (respones4.data) {
          setData4(respones4.data, "respones4.data");
          console.log(respones4.data);
        }
      } catch (error) {
        console.log("Network error occurred:", error);

      }
    };
    

    const fetchCount = async() => {
      const info = {
        userData: userData
      }
      try {

      const respones = await axios.post(`${REACT_APP_API}/api/getCountAppointment`,info)
      if (respones.data){
        setCount(respones.data,"respones.data")
        console.log(respones.data)
      }
    } catch (error) {
      console.log(error);
    }
    };
  

      const COLORS = ['#BABABA', '#7C9DC1', '#456A91', '#263A50'];
      const COLORSDAY = ['#BABABA', '#ABD9D8', '#54B2B0', '#295B5B'];
      const RADIAN = Math.PI / 180;
      const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
        
          <text x={x} y={y} fill="white" fontSize={12}   textAnchor="middle" dominantBaseline="middle">
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
                  <h1 className="center">Dashboard <br></br> การใช้บริการของแต่ละคลินิก</h1>
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
                    <a href="#" target="_parent" id="select">คลินิกทั้งหมด</a>
                    <a href="/adminDashboardServiceGeneral" target="_parent" >คลินิกทั่วไป</a>
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
                <div className="admin-dashboard-box boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"45px"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  {count && <h1>{count.today} คน</h1>}
         
               </div>
              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>จำนวนผู้ใช้บริการแต่ละคลินิก</h4>
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                    data={Todaydata2}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      tick={{ fontSize: 12 }}
                  >
                    {Todaydata2 && Todaydata2.length > 0 && data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORSDAY[index % COLORSDAY.length]} />
                    ))}
                    
                  </Pie>
                  {Todaydata2 && Todaydata2.length === 0 && ( // เพิ่มเงื่อนไขตรวจสอบว่าไม่มีข้อมูล
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="#263A50">
                      ไม่มีข้อมูลสำหรับวันที่ {formatDateInThai(selectedDate)}
                    </text>
                  )}
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
                  </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการแต่ละคลินิก</h4>
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
                  <Bar dataKey="สำเร็จ" fill="#54B2B0" minPointSize={0}/>
                  <Bar dataKey="ไม่สำเร็จ" fill="#BABABA" minPointSize={0} />
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
                    <Line type="monotone" dataKey="คลินิกทั่วไป" stroke="#BABABA" />
                    <Line type="monotone" dataKey="คลินิกเฉพาะทาง" stroke="#7C9DC1" />
                    <Line type="monotone" dataKey="คลินิกกายภาพ" stroke="#456A91" />
                    <Line type="monotone" dataKey="คลินิกฝังเข็ม" stroke="#263A50" />
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
                <h4>จำนวนผู้ใช้บริการแต่ละคลินิก</h4>
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
                      
                      {data2 && data2.length > 0 && data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
     
                    </Pie>
                    {data2 && data2.length === 0 && (
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="#263A50">
                          ไม่มีข้อมูลสำหรับเดือน {formatMonthInThai(selectedDate)}
                        </text>
                    )}
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
                   </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการแต่ละคลินิก</h4>
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
                      <Bar dataKey="สำเร็จ" fill="#7C9DC1" minPointSize={0}/>
                      <Bar dataKey="ไม่สำเร็จ" fill="#BABABA" minPointSize={0} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

          </div> 
          
          
    
          
        </div>
      </div>
      

    );
}

export default DashboardServiceAll;



