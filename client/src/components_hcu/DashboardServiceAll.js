import { useEffect, useState, useRef } from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const DashboardServiceAll = (props) => {
    const [selectedDate, setSelectedDate] = useState("");
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
            genaral: 4000,
            special: 2400,
            physic: 2400,
            needle:1000
          },
          {
            name: '02/02/2024',
            genaral: 3000,
            special: 1398,
            physic: 2400,
            needle:1000
          },
          {
            name: '03/02/2024',
            genaral: 2000,
            special: 9800,
            physic: 2400,
            needle:1000
          },
          {
            name: '04/02/2024',
            genaral: 2780,
            special: 3908,
            physic: 2400,
            needle:1000
          },
          {
            name: '05/02/2024',
            genaral: 1890,
            special: 4800,
            physic: 2400,
            needle:1000
          },
          {
            name: '06/02/2024',
            genaral: 2390,
            special: 3800,
            physic: 2400,
            needle:1000
          },
          {
            name: '07/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '08/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '09/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '10/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '11/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '12/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '13/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '14/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '15/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '16/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '17/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '18/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '19/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '20/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '21/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '22/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '23/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '24/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '25/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '26/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '27/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '28/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '29/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '30/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
          {
            name: '31/02/2024',
            genaral: 3490,
            special: 4300,
            physic: 2400,
            needle:1000
          },
      ];

    //   const CustomTooltip = ({ active, payload, label }) => {
    //     if (active && payload) {
    //       return (
    //         <div className="custom-tooltip">
    //           <p className="label">{`Date : ${label}`}</p>
    //           <p className="intro">{`Value : ${payload[0].value}`}</p>
    //         </div>
    //       );
    //     }
      
    //     return null;
    //   };
      

    // const CustomizedAxisTick = ({ x, y, stroke, payload }) => (
    //     <g transform={`translate(${x},${y})`}>
    //       <text x={0} y={0} dy={16} textAnchor="end" fill="#666" >
    //         {payload.value}
    //       </text>
    //     </g>
    //   );

    //   const CustomizedLabel = ({ x, y, stroke, value }) => (
    //     <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
    //       {value}
    //     </text>
    //   );
  
      

    return (
        
        <div style={containerStyle}>
        <NavbarComponent />
        <div className="admin-topicBox colorPrimary-800">
            <div></div>
            <div>
                <h1 className="center">Dashboard</h1>
            </div>
            <div className="dateTime">
                <p className="admin-textBody-large">Date : {currentDate}</p>
                <p className="admin-textBody-large">Time : {showTime}</p>
            </div>
        </div>
        <div className="admin">
            <div className="admin-header">
                <div className="admin-hearder-item">
                    <a href="#" target="_parent" id="select">คลินิกทั้งหมด</a>
                    <a href="/" target="_parent" >คลินิกทั่วไป</a>
                    <a href="/" target="_parent" >คลินิกเฉพาะทาง</a>
                    <a href="/" target="_parent" >คลินิกกายภาพ</a>
                    <a href="/" target="_parent" >คลินิกฝังเข็ม</a>
                </div>
                <div className="admin-hearder-item admin-right"  style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <input type="date" className="form-control" style={{width: 250}} value={selectedDate} onChange={handleDateChange}/>
                </div>
            </div>

            
            <div className="admin-body">
                <div className="admin-dashboard-month">
                <h1>{formatMonthInThai(selectedDate)}</h1>
                
                <ResponsiveContainer width="100%" height={500}>
                <LineChart data={data}   height={300} margin={{ top: 20, right: 30, left: 20, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"  width={0} />
                    <YAxis />
                    <Tooltip cursor="pointer" labelFormatter={(value, payload) => {if (payload && payload.length > 0) {return `Date: ${payload[0].payload.name}`;}return null;}} />
                    <Legend />
                    <Line type="monotone" dataKey="genaral" stroke="#8884d8" label={{ position: 'top' }}/>
                    <Line type="monotone" dataKey="special" stroke="#82ca9d" label={{ position: 'top' }} />
                    <Line type="monotone" dataKey="physic" stroke="#F5A110" label={{ position: 'top' }}/>
                    <Line type="monotone" dataKey="needle" stroke="#FF2626" label={{ position: 'top' }} />
                </LineChart>
                </ResponsiveContainer>

                </div>
                <div className="admin-dashboard-day">
                    <h1>{selectedDate && formatDateInThai(selectedDate)}</h1>
                </div>
                
                
            </div>
           
        </div>
        
    </div>

    );
}

export default DashboardServiceAll;