import { useEffect, useState, useRef} from "react";
import "../css/Component.css";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import { db, getDocs, collection } from "../firebase/config";
import NavbarComponent from "./NavbarComponent";
import {Bar, BarChart, LabelList,  PieChart, Pie, Cell,LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import people from "../picture/people.png";
import axios from "axios";

const DashboardFeedbackAll = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { user, userData } = useUserAuth();
    const [showTime, setShowTime] = useState(getShowTime);
    const [zoomLevel, setZoomLevel] = useState(1);
    const animationFrameRef = useRef();
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [data4, setData4] = useState([]);
    const [data5, setData5] = useState([]);
    const [data6, setData6] = useState([]);
    const [data7, setData7] = useState([]);

    const [data8, setData8] = useState([]);
    const [data9, setData9] = useState([]);
    const [data10, setData10] = useState([]);
    const [data11, setData11] = useState([]);
    const [data12, setData12] = useState([]);
    const [data13, setData13] = useState([]);

    const [dataToday, setDataToday] = useState([]);
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

    useEffect(() => {
        console.log(selectedDate);
        if(userData){
        handleDateSelectData(selectedDate);
        }
    },[selectedDate,userData]);


    const handleDateSelectData = async(selectedDate) => {
       
            const info = {
                role: userData.role,
                selectedDate: selectedDate
            };
            const respone = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackByRange`,info);
            console.log(respone.data,"data")
            setData(respone.data)
    
            const responeToday = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeTodayRange`,info);
            console.log(responeToday.data,"responeToday")
            setDataToday(responeToday.data)
    
            const respone2 = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeData2`,info);
            console.log(respone2.data.length,"data");
            const handleData = respone2.data;
    
            const handleData2 = [];
            handleData2.push(handleData[0][0]);
            handleData2.push(handleData[0][1]);
            handleData2.push(handleData[0][2]);
            handleData2.push(handleData[0][3]);
            handleData2.push(handleData[0][4]);
            setData2(handleData2);
    
            const handleData3 = [];
            handleData3.push(handleData[1][0]);
            handleData3.push(handleData[1][1]);
            handleData3.push(handleData[1][2]);
            handleData3.push(handleData[1][3]);
            handleData3.push(handleData[1][4]);
            setData3(handleData3);
    
            const handleData4 = [];
            handleData4.push(handleData[2][0]);
            handleData4.push(handleData[2][1]);
            handleData4.push(handleData[2][2]);
            handleData4.push(handleData[2][3]);
            handleData4.push(handleData[2][4]);
            setData4(handleData4);
    
            const handleData5 = [];
            handleData5.push(handleData[3][0]);
            handleData5.push(handleData[3][1]);
            handleData5.push(handleData[3][2]);
            handleData5.push(handleData[3][3]);
            handleData5.push(handleData[3][4]);
            setData5(handleData5);
    
            const handleData6 = [];
            handleData6.push(handleData[4][0]);
            handleData6.push(handleData[4][1]);
            handleData6.push(handleData[4][2]);
            handleData6.push(handleData[4][3]);
            handleData6.push(handleData[4][4]);
            setData6(handleData6);
    
            const handleData7 = [];
            handleData7.push(handleData[5][0]);
            handleData7.push(handleData[5][1]);
            handleData7.push(handleData[5][2]);
            handleData7.push(handleData[5][3]);
            handleData7.push(handleData[5][4]);
            setData7(handleData7);
    
    
            const respone3 = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeToday`,info);
            console.log(respone3.data,"handleData8");
            const handleDataToday = respone3.data;
    
            const handleData8 = [];
            handleData8.push(handleDataToday[0][0]);
            handleData8.push(handleDataToday[0][1]);
            handleData8.push(handleDataToday[0][2]);
            handleData8.push(handleDataToday[0][3]);
            handleData8.push(handleDataToday[0][4]);
            setData8(handleData8);
    
            const handleData9 = [];
            handleData9.push(handleDataToday[1][0]);
            handleData9.push(handleDataToday[1][1]);
            handleData9.push(handleDataToday[1][2]);
            handleData9.push(handleDataToday[1][3]);
            handleData9.push(handleDataToday[1][4]);
            setData9(handleData9);
    
            const handleData10 = [];
            handleData10.push(handleDataToday[2][0]);
            handleData10.push(handleDataToday[2][1]);
            handleData10.push(handleDataToday[2][2]);
            handleData10.push(handleDataToday[2][3]);
            handleData10.push(handleDataToday[2][4]);
            setData10(handleData10);
    
            const handleData11 = [];
            handleData11.push(handleDataToday[3][0]);
            handleData11.push(handleDataToday[3][1]);
            handleData11.push(handleDataToday[3][2]);
            handleData11.push(handleDataToday[3][3]);
            handleData11.push(handleDataToday[3][4]);
            setData11(handleData11);
    
            const handleData12 = [];
            handleData12.push(handleDataToday[4][0]);
            handleData12.push(handleDataToday[4][1]);
            handleData12.push(handleDataToday[4][2]);
            handleData12.push(handleDataToday[4][3]);
            handleData12.push(handleDataToday[4][4]);
            setData12(handleData12);
    
            const handleData13 = [];
            handleData13.push(handleDataToday[5][0]);
            handleData13.push(handleDataToday[5][1]);
            handleData13.push(handleDataToday[5][2]);
            handleData13.push(handleDataToday[5][3]);
            handleData13.push(handleDataToday[5][4]);
            setData13(handleData13);
        
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

    const REACT_APP_MONGO_API = process.env.REACT_APP_MONGO_API
    const fetchData = async() => {
        const info = {
            role: userData.role
        };
        const respone = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackByRange`,info);
        console.log(respone.data,"data")
        setData(respone.data)

        const responeToday = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeTodayRange`,info);
        console.log(responeToday.data,"responeToday")
        setDataToday(responeToday.data)

        const respone2 = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeData2`,info);
        console.log(respone2.data,"datarespone2");
        const handleData = respone2.data;

        const handleData2 = [];
        handleData2.push(handleData[0][0]);
        handleData2.push(handleData[0][1]);
        handleData2.push(handleData[0][2]);
        handleData2.push(handleData[0][3]);
        handleData2.push(handleData[0][4]);
        setData2(handleData2);

        const handleData3 = [];
        handleData3.push(handleData[1][0]);
        handleData3.push(handleData[1][1]);
        handleData3.push(handleData[1][2]);
        handleData3.push(handleData[1][3]);
        handleData3.push(handleData[1][4]);
        setData3(handleData3);

        const handleData4 = [];
        handleData4.push(handleData[2][0]);
        handleData4.push(handleData[2][1]);
        handleData4.push(handleData[2][2]);
        handleData4.push(handleData[2][3]);
        handleData4.push(handleData[2][4]);
        setData4(handleData4);

        const handleData5 = [];
        handleData5.push(handleData[3][0]);
        handleData5.push(handleData[3][1]);
        handleData5.push(handleData[3][2]);
        handleData5.push(handleData[3][3]);
        handleData5.push(handleData[3][4]);
        setData5(handleData5);

        const handleData6 = [];
        handleData6.push(handleData[4][0]);
        handleData6.push(handleData[4][1]);
        handleData6.push(handleData[4][2]);
        handleData6.push(handleData[4][3]);
        handleData6.push(handleData[4][4]);
        setData6(handleData6);

        const handleData7 = [];
        handleData7.push(handleData[5][0]);
        handleData7.push(handleData[5][1]);
        handleData7.push(handleData[5][2]);
        handleData7.push(handleData[5][3]);
        handleData7.push(handleData[5][4]);
        setData7(handleData7);


        const respone3 = await axios.post(`${REACT_APP_MONGO_API}/api/getFeedbackTimeRangeToday`,info);
        console.log(respone3.data,"respone3.data.");
        const handleDataToday = respone3.data;

        const handleData8 = [];
        handleData8.push(handleDataToday[0][0]);
        handleData8.push(handleDataToday[0][1]);
        handleData8.push(handleDataToday[0][2]);
        handleData8.push(handleDataToday[0][3]);
        handleData8.push(handleDataToday[0][4]);
        setData8(handleData8);

        const handleData9 = [];
        handleData9.push(handleDataToday[1][0]);
        handleData9.push(handleDataToday[1][1]);
        handleData9.push(handleDataToday[1][2]);
        handleData9.push(handleDataToday[1][3]);
        handleData9.push(handleDataToday[1][4]);
        setData9(handleData9);

        const handleData10 = [];
        handleData10.push(handleDataToday[2][0]);
        handleData10.push(handleDataToday[2][1]);
        handleData10.push(handleDataToday[2][2]);
        handleData10.push(handleDataToday[2][3]);
        handleData10.push(handleDataToday[2][4]);
        setData10(handleData10);

        const handleData11 = [];
        handleData11.push(handleDataToday[3][0]);
        handleData11.push(handleDataToday[3][1]);
        handleData11.push(handleDataToday[3][2]);
        handleData11.push(handleDataToday[3][3]);
        handleData11.push(handleDataToday[3][4]);
        setData11(handleData11);

        const handleData12 = [];
        handleData12.push(handleDataToday[4][0]);
        handleData12.push(handleDataToday[4][1]);
        handleData12.push(handleDataToday[4][2]);
        handleData12.push(handleDataToday[4][3]);
        handleData12.push(handleDataToday[4][4]);
        setData12(handleData12);

        const handleData13 = [];
        handleData13.push(handleDataToday[5][0]);
        handleData13.push(handleDataToday[5][1]);
        handleData13.push(handleDataToday[5][2]);
        handleData13.push(handleDataToday[5][3]);
        handleData13.push(handleDataToday[5][4]);
        setData13(handleData13);
    };


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
                        {data && data[0] && (<h1 style={{fontSize:"50px"}}>{data[0].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data && data[0] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data[0].lenght}</p>)}
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
                    <h4 className="center">บริการจ่ายยาโดยพยาบาล</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {data && data[1] && (<h1 style={{fontSize:"50px"}}>{data[1].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data && data[1] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data[1].lenght}</p>)}
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
                            
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการทำแผล-ฉีดยา</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {data && data[2] && (<h1 style={{fontSize:"50px"}}>{data[2].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data && data[2] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data[2].lenght}</p>)}
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
                            <Bar dataKey="value" fill="#365372" minPointSize={5}></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการกายภาพบำบัด</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {data && data[3] && (<h1 style={{fontSize:"50px"}}>{data[3].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data && data[3] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data[3].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data5}
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
                        {data && data[4] && (<h1 style={{fontSize:"50px"}}>{data[4].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data && data[4] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data[4].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data6}
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
                        {data && data[5] && (<h1 style={{fontSize:"50px"}}>{data[5].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {data && data[5] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {data[5].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data7}
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
                      data={dataToday}
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
                      <Bar dataKey="score" fill="#54B2B0" ></Bar>
                    </BarChart>
            </ResponsiveContainer>
           
          </div>
          <div className="admin-dashboard-feedback-day-all admin-dashboard-flexbox">
          <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการตรวจรักษาโรคโดยแพทย์</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {dataToday && dataToday[0] && (<h1 style={{fontSize:"50px"}}>{dataToday[0].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {dataToday && dataToday[0] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {dataToday[0].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data8}
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
                            <Bar dataKey="value" fill="#54B2B0" ></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการจ่ายยาโดยพยาบาล</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {dataToday && dataToday[1] && (<h1 style={{fontSize:"50px"}}>{dataToday[1].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {dataToday && dataToday[1] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {dataToday[1].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data9}
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
                            <Bar dataKey="value" fill="#54B2B0" ></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการทำแผล-ฉีดยา</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {dataToday && dataToday[2] && (<h1 style={{fontSize:"50px"}}>{dataToday[2].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {dataToday && dataToday[2] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {dataToday[2].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data10}
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

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการกายภาพบำบัด</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {dataToday && dataToday[3] && (<h1 style={{fontSize:"50px"}}>{dataToday[3].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {dataToday && dataToday[3] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {dataToday[3].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data11}
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
                           
                            <Bar dataKey="value" fill="#54B2B0" ></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">บริการฝังเข็ม</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {dataToday && dataToday[4] && (<h1 style={{fontSize:"50px"}}>{dataToday[4].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {dataToday && dataToday[4] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {dataToday[4].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data12}
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
                            
                            <Bar dataKey="value" fill="#54B2B0" ></Bar>
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-dashboard-box3 admin-dashboard-flexbox" style={{padding:"10px" }}>
                    <h4 className="center">อื่นๆ</h4>
                    <div className="admin-dashboard-feedback-box5 boxcenter3" >
                        {dataToday && dataToday[5] && (<h1 style={{fontSize:"50px"}}>{dataToday[5].score}</h1> )}
                        <h3> จาก 5 </h3>
                    </div>
                    <div className="admin-dashboard-feedback-box4">
                        <div style={{ width: '100%', height: '250px'}}>
                        {dataToday && dataToday[5] && (<p style={{fontSize:"14px", textAlign:"right", margin:"0% 20px 0% 0%"}}>ทั้งหมด {dataToday[5].lenght}</p>)}
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data13}
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
                            <Bar dataKey="value" fill="#54B2B0" ></Bar>
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