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
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ForgetPasswordComponent = () => {
  const [error, setError] = useState("");
  const { user, resetPassword2 } = useUserAuth();
  
  const query = useQuery();
  console.log(query.get('mode'), query.get('oobCode'));

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

  const isSubmitEnabled = !password;

  let navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    console.log({ email });
    setError("");
    try {
      await resetPassword2(query.get('oobCode'), password);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your password has been reset!",
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
        title: "Alert",
        text: "This email does not exist",
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
                        <h2 className="colorPrimary-800">Reset Password</h2>


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

                        <br />
                        <input
                            type="submit"
                            value="Reset password"
                            className="btn-primary "
                            target="_parent"
                            disabled={isSubmitEnabled}
                            id="signup"
                        />
                        <br />
                    </form>

                    <div className="center">
                        <a href="/login" role="button" className="colorPrimary-800" style={{textDecoration:"underline"}} >มีบัญชีแล้ว Log in</a>
                        <p className="textBody-small login-kmutt">King Mongkut's University of Technology Thonburi</p>
                    </div>

                </div>

                <img className="login-hcu-image" src={HCU} alt="health care unit" />
            </div>


        </div>

    );
}

export default ForgetPasswordComponent;