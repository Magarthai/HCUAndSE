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
        { name: '5', value: 60 },
        { name: '4', value: 50 },
        { name: '3', value: 50 },
        { name: '2', value: 50 },
        { name: '1', value: 50 },
   
      ];

      const totalItemCount = data2.reduce((total, item) => total + item.value, 0);


    return (
        
      <div>
        <div style={containerStyle}>
          <NavbarComponent />
          <div className="admin-topicBox colorPrimary-800">
              <div></div>
              <div>
                  <h1 className="center">Dashboard <br></br>ข้อเสนอแนะทั่วไป</h1>
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
                    <a href="#" target="_parent" id="select" >ข้อเสนอแนะทั่วไป</a>
                    <a href="/adminDashboardFeedbackGeneral" target="_parent" >หลังใช้บริการคลินิกทั่วไป</a>
                    <a href="/adminDashboardFeedbackSpecial" target="_parent" >หลังใช้บริการคลินิกเฉพาะทาง</a>
                    <a href="/adminDashboardFeedbackPhysical" target="_parent" >หลังใช้บริการคลินิกกายภาพ</a>
                    <a href="/adminDashboardFeedbackNeedle" target="_parent" >หลังใช้บริการคลินิกฝังเข็ม</a>
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

          <div className="admin-dashboard-feedback-month admin-dashboard-flexbox" style={{height:"300px"}}>
            
            <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                      top: 10,
                      right: 20,
                      left: -20,
                      bottom: 0,
                     }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10}}/>
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 5]} />
                      <Tooltip />
                      <Legend style={{ fontSize: '10px',wordWrap: "break-word"}}/>
                      <Bar dataKey="score" fill="#365372" minPointSize={1}></Bar>
                    </BarChart>
            </ResponsiveContainer>
           
            
          
          </div>
          <div className="admin-dashboard-feedback-all admin-dashboard-flexbox" >
                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการตรวจรักษาโรคโดยแพทย์</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการจ่ายโดยพยาบาล</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการทำแผล-ฉีดยา</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการกายภาพบำบัด</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการฝังเข็ม</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">อื่นๆ</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

          </div> 
          
          <div className="admin-body">
            <h2>{selectedDate && formatDateInThai(selectedDate)}</h2>
          </div>  
          <div className="admin-dashboard-feedback-day admin-dashboard-flexbox" style={{height:"300px"}}>
            
            <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                      top: 10,
                      right: 20,
                      left: -20,
                      bottom: 0,
                     }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10}}/>
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 5]} />
                      <Tooltip />
                      <Legend style={{ fontSize: '10px',wordWrap: "break-word"}}/>
                      <Bar dataKey="score" fill="#54B2B0" minPointSize={1}></Bar>
                    </BarChart>
            </ResponsiveContainer>
           
          </div>
          <div className="admin-dashboard-feedback-day-all admin-dashboard-flexbox">
          <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการตรวจรักษาโรคโดยแพทย์</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#54B2B0" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการจ่ายโดยพยาบาล</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#54B2B0" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการทำแผล-ฉีดยา</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#54B2B0" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการกายภาพบำบัด</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                           
                            <Bar dataKey="value" fill="#54B2B0" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการฝังเข็ม</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            
                            <Bar dataKey="value" fill="#54B2B0" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">อื่นๆ</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        <h1 style={{fontSize:"50px"}}>4.8</h1>
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        <p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {totalItemCount}</p>
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
                            <Bar dataKey="value" fill="#54B2B0" minPointSize={5}></Bar>
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

export default DashboardFeedbackAll;



