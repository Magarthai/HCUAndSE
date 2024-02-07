import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { authenticate } from "../services/authorize";
import { useNavigate } from "react-router-dom"
import logo from "../picture/LogoHCU.png";
import { auth } from '../firebase/config';
import HCU from "../picture/HCU.jpg";
import "../css/Login&SignupComponent.css";
import "../css/Component.css";
import { useUserAuth } from "../context/UserAuthContext";

const LoginComponent = () => {
    const [error, setError] = useState("");
    const { user,logIn } = useUserAuth();

    const [state, setState] = useState({
        email: "",
        password: "",
      });
    
      const {
        email,
        password,
      } = state;
    
      const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
      };
    
      const isSubmitEnabled =
        !email ||!password;

    let navigate = useNavigate()

    useEffect(() => {
        document.title = 'Health Care Unit';
        if (user) {
            navigate('/Home');
        }
    }, [navigate])

    const submitForm = async (e) => {
        e.preventDefault();
        console.log({ email, password })
        setError("");
        try{
            await logIn(email, password);
            Swal.fire({
                icon: "success",
                title: "ล็อคอินสําเร็จ",
                text: "ยินดีต้อนรับเข้าสู่เว็ปไซต์ HCU!",
                confirmButtonText: "ตกลง",
                confirmButtonColor: '#263A50',
                customClass: {
                    cancelButton: 'custom-cancel-button',
                }
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/home');
                }
              });
            

        } catch (err) {
            setError(err.message);
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
                confirmButtonColor: '#263A50',
            customClass: {
                cancelButton: 'custom-cancel-button',
            }        
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
              });
        }
    };

    return (
        <div>
            <div className="login-flexbox">
                <div className="login-flexbox-item">
                    <header className="login-hearder">
                        <img className="logo" src={logo} alt="logo health care unit" />
                        <h4 className="colorPrimary-800">Health Care Unit</h4>
                        <p className="textBody-medium colorPrimary-800">กลุ่มงานบริการสุขภาพและอนามัย</p>
                        <hr></hr>
                    </header>

                    <form onSubmit={submitForm}>
                        <h2 className="colorPrimary-800">Log in</h2>


                        <div>
                            <label className="textBody-big colorPrimary-800">E-mail</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={inputValue("email")}
                                placeholder="karapagos@kmutt.ac.th"
                            />
                        </div>



                        <div>
                            <label className="textBody-big colorPrimary-800">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={inputValue("password")}
                                placeholder="password"
                            />
                        </div>
                        <div style={{textAlign:"right", marginBottom:"10px"}}>
                            <a href="/resetPassword" role="button" className="colorPrimary-800 admin-textBody-small2" style={{textDecoration:"underline"}} >ลืมรหัสผ่าน?</a>
                        </div>
                      
                        <input
                            type="submit"
                            value="Login"
                            className="btn-primary "
                            target="_parent"
                            disabled={isSubmitEnabled}
                            id="signup"
                        />
                        <br />
                    </form>
                    
                    <div className="center">
                        <a href="/signup" role="button" className="colorPrimary-800" style={{textDecoration:"underline"}} >ยังไม่มีบัญชี? Sign up</a>
                        <p className="textBody-small login-kmutt">King Mongkut's University of Technology Thonburi</p>
                    </div>

                </div>

                <img className="login-hcu-image" src={HCU} alt="health care unit" />
            </div>


        </div>

    );
}

export default LoginComponent;