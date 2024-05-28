import React, { useEffect,useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import axios from "axios";
import Swal from 'sweetalert2';
function ProtectRoute({ children }) {
    const today = new Date();
    const REACT_APP_API = process.env.REACT_APP_API
    today.setHours(0, 0, 0, 0);
    const { user, userData,logOut } = useUserAuth();
    const navigate = useNavigate();
    const [serverDate, setServerDate] = useState("")
    const [state, setState] = useState(false);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API}/date`);
        setServerDate(response.data)
        setState(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const handleLogout = async () => {
        try{
            await logOut();
            navigate('/');
        } catch (err) {
            console.log(err.message);
          }
    }
  
    useEffect(() => {
      const checkUserAdminStatus = () => {
        if (userData && userData.role === 'admin') {
          console.log('User is not an admin');
          navigate('/homeAdmin');
        }
        console.log(userData);
      };
  
      console.log(userData);
      checkUserAdminStatus();
      if(!state){
      fetchData();
      }
      console.log(serverDate)
      if(serverDate){
        const checkDate = new Date(serverDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        checkDate.setHours(0,0,0,0);
        if (today.getTime() === checkDate.getTime()) {
            console.log("Dates are equal");
        } else {
            console.log("Dates are not equal");
            handleLogout();
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'กรุณาตั้งเวลาให้ตรงกับวันปัจจุบัน!',
                confirmButtonColor: '#263A50',
                customClass: {
                    confirmButton: 'custom-confirm-button',
                }
            })
        }
      }
    }, [navigate, userData,serverDate]);
  
    if (!user) {
      return <Navigate to="/" />;
    }
  
    return children;
  }
  
export default ProtectRoute;
