import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {Bar, BarChart, LabelList,  PieChart, Pie, Cell,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import people from "../picture/people.png";

const DashboardFeedbackAll = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { user, userData } = useUserAuth();
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
    
    }, [user]); 
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

    const data = [
        {
            name: 'บริการตรวจรักษาโรคโดยแพทย์',
            score: 5,
           
          },
          {
            name: 'บริการจ่ายโดยพยาบาล',
            score: 4,
          
          },
          {
            name: 'บริการทำแผล-ฉีดยา',
            score: 5,
           
          },
          {
            name: 'บริการกายภาพบำบัด',
            score: 4,
            
          },
          {
            name: 'บริการฝังเข็ม',
            score: 3,
            
          },
          {
            name: 'อื่นๆ',
            score: 3,
           
          },
   
      ];

      const data2 = [
        { name: 'สำเร็จ', value: 400 },
        { name: 'ไม่สำเร็จ', value: 300 },
   
      ];
      const COLORS = ['#BABABA', '#7C9DC1'];
      const COLORSDAY = ['#BABABA', '#54B2B0'];
      const RADIAN = Math.PI / 180;
      const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
        
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
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
                  <h1 className="center">Dashboard <br></br>ข้อเสนอแนะ "ทั่วไปและหลังใช้บริการ"</h1>
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
                    <a href="#"  target="_parent" id="select">ทั้งหมด</a>
                    <a href="#" target="_parent" >ข้อเสนอแนะทั่วไป</a>
                    <a href="#" target="_parent" >ข้อเสนอแนะของคลินิกทั่วไป</a>
                    <a href="#" target="_parent" >ข้อเสนอแนะของคลินิกเฉพาะทาง</a>
                    <a href="#" target="_parent" >ข้อเสนอแนะของคลินิกกายภาพ</a>
                    <a href="#" target="_parent" >ข้อเสนอแนะของคลินิกฝังเข็ม</a>
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

          <div className="admin-dashboard-feedback-month admin-dashboard-flexbox">
            <div className="admin-dashboard-feedback-box4" style={{height:"300px"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                      top: 5,
                      right: 30,
                      left: 5,
                      bottom: 0,
                     }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }}/>
                      <Tooltip />
                      <Legend style={{ fontSize: '10px' }}/>
                      <Bar dataKey="score" fill="#365372" maxPointSize={5}></Bar>
                    </BarChart>
                  </ResponsiveContainer>
            </div>
          
          </div>
          
          <div className="admin-dashboard-month-all admin-dashboard-flexbox">
              <div className="admin-dashboard-box4 boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"60px"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  <h1>150 คน</h1>
              </div>

              <div className="admin-dashboard-box3 boxcenter2" style={{padding:"10px"}}>
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
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend 
                      align="right" 
                      verticalAlign="middle" 
                      iconType="circle"
                      formatter={(value, entry) => `${value} (${(entry.payload.percent * 100).toFixed(0)}%, ${entry.payload.value})`}
                      layout="vertical"
                    />
                   </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              

          </div> 
          
          <div className="admin-body">
            <h2>{selectedDate && formatDateInThai(selectedDate)}</h2>
          </div>  
        
          <div className="admin-dashboard-day-all admin-dashboard-flexbox">
                <div className="admin-dashboard-box3 boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"60px"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  <h1>150 คน</h1>
         
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
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORSDAY[index % COLORSDAY.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    align="right" 
                    verticalAlign="middle" 
                    iconType="circle"
                    formatter={(value, entry) => `${value} (${(entry.payload.percent * 100).toFixed(0)}%, ${entry.payload.value}))`}
                    layout="vertical"
                  />
                  </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
      
            </div>
    
          
        </div>
      </div>
      

    );
}

export default DashboardFeedbackAll;



