import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import Swal from "sweetalert2";

function ProtectAdminRoute({ children }) {
    const { logOut, user, userData } = useUserAuth();
    const navigate = useNavigate();

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
    }, [userData, navigate, logOut]);

    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectAdminRoute;
