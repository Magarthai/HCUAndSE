import { useState, useEffect } from "react";
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarComponent';
import "../css/Component.css";
import "../css/UserProfileCompoment.css";
import { useUserAuth } from "../context/UserAuthContext";
import male from "../picture/male.png";
import female from "../picture/female.png";
import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion, deleteDoc, arrayRemove } from 'firebase/firestore';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const ProfileEditComponent = (props) => {
    const { user, userData } = useUserAuth();
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        id: "",
        tel: "",
        gender: "",
      });
    
      const {
        firstName,
        lastName,
        email,
        id,
        tel,
        gender,
      } = state;
    
      const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
      };
      const navigate = useNavigate();
    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const timetableRef = doc(db, 'users', userData.userID);
            const updatedTimetable = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                id: id ,
                tel: tel,
                gender: gender,
            };

            

            Swal.fire({
                title: "แก้ไขโปรไฟล์",
                html:  `ตรวจสอบก่อนยืนยัน<br/> ชื่อ-นามกสุล ${firstName} ${lastName} <br/> เบอร์โทรศัพท์ ${tel}`,
                showConfirmButton: true,
                showCancelButton: true,
                icon: 'warning',
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
                confirmButtonColor: '#263A50',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'custom-confirm-button',
                    cancelButton: 'custom-cancel-button',
                }
            }).then(async(result) => {
                if (result.isConfirmed) {
                    await updateDoc(timetableRef, updatedTimetable);
                Swal.fire({
                    title: "แก้ไข้โปรไฟล์",
                    icon: "success",
                    confirmButtonText: "ตกลง",
                    customClass: {
                        confirmButton: 'custom-confirm-button',
                    }

                });  
                window.location.href = '/profile';
                }
                if (result.isDenied){
                    Swal.fire({
                        title: "แก้ไข้ไม่สําเร็จ",
                        icon: "error",
                        confirmButtonText: "ตกลง",
                        customClass: {
                            confirmButton: 'custom-confirm-button',
                        }
                    });
                }
            });
            
        } catch (firebaseError) {
            console.error('Firebase update error:', firebaseError);
        }
    };
    const [isInitialRender, setIsInitialRender] = useState(false);
    useEffect(() => {
        if (!userData && !isInitialRender) {
            console.log("no userData")
        } else {
            setState({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: user.email || "",
                id: userData.id || "",
                tel: userData.tel || "",
                gender: userData.gender || "",
            });
            setIsInitialRender(true)
        }
    },[userData])


    return (
        
        <div className="user">
            <header className="user-header">
                    <div>
                        <h2>โปรไฟล์</h2>
                        <h3>รายละเอียดบัญชี</h3>
                    </div>

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <div className="user-profile">
                    <div className="user-profile-info" style={{borderTopLeftRadius:15,borderTopRightRadius:15}}>
                        <form onSubmit={submitForm}>
                            <br></br>
                            <h2 className="colorPrimary-800">แก้ไขโปรไฟล์</h2>
                            <div>
                                <label className="textBody-big colorPrimary-800">ชื่อ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={firstName}
                                    onChange={inputValue("firstName")}
                                    placeholder="ชื่อจริง"
                                />
                            </div>

                            <div>
                                <label className="textBody-big colorPrimary-800">นามสกุล</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lastName}
                                    onChange={inputValue("lastName")}
                                    placeholder="นามสกุล"
                                />
                            </div>

                            

        
                            <div>
                                <label className="textBody-big colorPrimary-800">เบอร์โทร</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={tel}
                                    onChange={inputValue("tel")}
                                    placeholder="0900000000"
                                    pattern="[0-9]*"
                                />
                            </div>
                            <div>
                                <label className="textBody-big colorPrimary-800">E-mail</label>
                                <input
                                    disabled
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={inputValue("email")}
                                    placeholder="karapagos@mail.kmutt.ac.th"
                                />
                            </div>

                            <br/>
                            <input
                                type="submit"
                                value="แก้ไข"
                                className="btn-primary "
                                target="_parent"
                                id="edit"
                            />
                            <a  href="/profile" role="button"  target="_parent" className="btn btn-secondary">ยกเลิก</a>
                            <br/>
                        </form>
                        <br></br>
                    
                    </div>
                </div>
                
            </div>
         
           
            
        </div>

    );
}

export default ProfileEditComponent;