import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {Bar, BarChart, LabelList,  PieChart, Pie, Cell,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import people from "../picture/people.png";

const DashboardServiceNeedle = (props) => {
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
            name: '01/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400

          },
          {
            name: '02/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '03/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '04/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '05/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '06/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '07/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '08/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '09/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '10/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '11/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '12/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '13/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '14/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '15/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '16/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '17/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '18/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '19/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '20/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '21/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '22/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '23/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '24/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '25/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '26/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '27/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '28/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '29/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '30/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
          {
            name: '31/02/2024',
            คลินิกฝังเข็ม: 2400,
            ปรึกษาแพทย์: 1000,
            ทำฝังเข็ม: 1400
          },
      ];

      const data2 = [
        { name: 'ปรึกษาแพทย์', value: 400 },
        { name: 'ทำฝังเข็ม', value: 300 },
      ];
      const COLORS = ['#BABABA', '#456A91'];
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

      const data3 = [
        {
          name: 'ปรึกษาแพทย์',
          สำเร็จ: 4000,
          ไม่สำเร็จ: 2400,
         
        },
        {
          name: 'ทำฝังเข็ม',
          สำเร็จ: 4000,
          ไม่สำเร็จ: 2400,
         
        },
      ];



    return (
        
      <div>
        <div style={containerStyle}>
          <NavbarComponent />
          <div className="admin-topicBox colorPrimary-800">
              <div></div>
              <div>
                  <h1 className="center">Dashboard <br></br> การใช้บริการของ "คลินิกฝังเข็ม"</h1>
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
                    <a href="/adminDashboardServicePhysical" target="_parent" >คลินิกกายภาพ</a>
                    <a href="#" target="_parent" id="select">คลินิกฝังเข็ม</a>
                </div>
                <div className="admin-hearder-item admin-right"  style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <input type="date" className="form-control" style={{width: 250}} value={selectedDate} onChange={handleDateChange}/>
                </div>
            </div>
           
          </div>
        </div>

        <div className="admin colorPrimary-800" >

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
                    <Line type="monotone" dataKey="ทำฝังเข็ม" stroke="#7C9DC1" />
                    <Line type="monotone" dataKey="คลินิกฝังเข็ม" stroke="#456A91" />
            </LineChart>
          </ResponsiveContainer>
          </div>
          
          <div className="admin-dashboard-month-all admin-dashboard-flexbox">
              <div className="admin-dashboard-box boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"20%"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  <h1>150 คน</h1>
              </div>

              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>จำนวนผู้ใช้บริการแต่ละส่วนของคลินิกฝังเข็ม</h4>
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
                      formatter={(value, entry) => `${value} (${(entry.payload.percent * 100).toFixed(0)}%)`}
                      layout="vertical"
                    />
                   </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการแต่ละส่วนของคลินิกฝังเข็ม</h4>
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
                      <Bar dataKey="สำเร็จ" fill="#365372" />
                      <Bar dataKey="ไม่สำเร็จ" fill="#7C9DC1"  />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

          </div> 
          
          <div className="admin-body">
            <h2>{selectedDate && formatDateInThai(selectedDate)}</h2>
          </div>  
        
          <div className="admin-dashboard-day-all admin-dashboard-flexbox">
                <div className="admin-dashboard-box boxcenter" style={{padding:"30px"}}>
                  <img src={people} style={{width:"20%"}}/>
                  <br></br>
                  <h5>จำนวนผู้ใช้บริการทั้งหมด</h5>
                  <h1>150 คน</h1>
         
               </div>
              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>จำนวนผู้ใช้บริการแต่ละส่วนของคลินิกฝังเข็ม</h4>
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
                    formatter={(value, entry) => `${value} (${(entry.payload.percent * 100).toFixed(0)}%)`}
                    layout="vertical"
                  />
                  </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="admin-dashboard-box1 boxcenter2" style={{padding:"10px"}}>
                <h4>การดำเนินการแต่ละส่วนของคลินิกฝังเข็ม</h4>
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
                  <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                  <YAxis tick={{ fontSize: 12 }}/>
                  <Tooltip />
                 <Legend style={{ fontSize: '10px' }}/>
                   <Bar dataKey="สำเร็จ" fill="#295B5B" />
                  <Bar dataKey="ไม่สำเร็จ" fill="#54B2B0" />
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </div>
            </div>
    
          
        </div>
      </div>
      

    );
}

export default DashboardServiceNeedle;



