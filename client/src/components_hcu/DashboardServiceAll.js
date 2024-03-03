import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {BarChart,
  Bar,
  Brush,
  ReferenceLine, Rectangle,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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

      const [startIndex, setStartIndex] = useState(0);
      const [endIndex, setEndIndex] = useState(data.length-1);


    return (
        
        <div>
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
                <h1>{formatMonthInThai(selectedDate)}</h1>
            </div>
           
        </div>
      </div>
      {/* <ResponsiveContainer width="100%" height={300} style={{padding:"0 3%"}}>
        <LineChart data={data}   width={500} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 10}}>
            <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                    <YAxis  tick={{ fontSize: 12 }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="genaral" stroke="#8884d8" />
                    <Line type="monotone" dataKey="special" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="physic" stroke="#F5A110" />
                    <Line type="monotone" dataKey="needle" stroke="#FF2626" />
            </LineChart>
        </ResponsiveContainer> */}
        <ResponsiveContainer width="100%" height={300} style={{padding:"0 3%"}}>
          <BarChart width={500} height={300} data={data} margin={{top: 5, right: 30, left: 30, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" tick={{ fontSize: 12 }}/>
          <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="name" height={30} stroke="#8884d8" tick={{ fontSize: 12 }} startIndex={startIndex}
  endIndex={endIndex} onChange={(value) => {
    setStartIndex(value.startIndex);
    setEndIndex(value.endIndex);}}/>
          <Bar dataKey="genaral" fill="#8884d8" />
          <Bar dataKey="special" fill="#82ca9d" />
          <Bar dataKey="physic" fill="#F5A110" />
          <Bar dataKey="needle" fill="#FF2626" />
        </BarChart>
      </ResponsiveContainer>
      <div style={containerStyle}>
        <div className="admin-body">
            <h1>{selectedDate && formatDateInThai(selectedDate)}</h1>
        </div>

      </div>
    </div>
  

    );
}

export default DashboardServiceAll;



