import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import Swal from "sweetalert2";
import axios from "axios";

function ProtectAdminRoute({ children }) {
    const today = new Date();
    const REACT_APP_API = process.env.REACT_APP_API
    today.setHours(0, 0, 0, 0);
    const { user, userData,logOut } = useUserAuth();
    const navigate = useNavigate();
    const [serverDate, setServerDate] = useState("")
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/date');
        setServerDate(response.data)
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
            if (userData) {
                if (userData.role === 'user') {
                    console.log('User is not an admin');

                    logOut().then(() => {
                        Swal.fire({
                            icon: "error",
                            title: "Alert",
                            text: "You are not an ADMIN!",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/');
                            }
                        });
                    });
                }

                console.log(userData);
            }
        };

        checkUserAdminStatus();
        fetchData();
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
    }, [userData, navigate, logOut,serverDate]);

    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectAdminRoute;
