import React, { useState, useEffect } from "react";
import "../css/UserFeedbackComponent.css";
import NavbarUserComponent from './NavbarComponent';
import Swal from "sweetalert2";
import axios from 'axios';
const FeedbackComponentGeneral = (props) => {
    const [state, setState] = useState({
        score: "",
        score2: "",
        detail: "",
        clinic: "คลินิกทั่วไป"
    });
    const { score,score2, detail, clinic } = state;
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
    };

    const MONGO_API = process.env.REACT_APP_MONGO_API

    const handleScoreChange = (category, value) => {
        setState({ ...state, [category]: value });
        console.log('คะแนนที่ถูกเลือก:', value);
        // Additional logic if needed
    };
    const isSubmitEnabled =
    !score || !score2||!detail || detail.length > 135;

    const submitForm = async (e) => {
        e.preventDefault();
        Swal.fire({
            icon: "warning",
            title: "ยืนยันคําตอบ!",
            text: "กดตกลงเพื่อยืนยัน!",
            confirmButtonText: "ตกลง",
            confirmButtonColor: '#263A50',
            customClass: {
                cancelButton: 'custom-cancel-button',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                const info = {
                    score: score,
                    score2: score2,
                    detail: detail,
                    clinic: clinic
                };
                
                console.log(info);
                const createFeedback = await axios.post(`${MONGO_API}/api/createFeedback`,info)
                if (createFeedback.data == "success"){
                Swal.fire({
                    icon: "success",
                    title: "ส่งสำเร็จ!",
                    text: "ประเมินความพึงพอใจเสร็จสิ้น!",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: '#263A50',
                    customClass: {
                        cancelButton: 'custom-cancel-button',
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/home';
                    }
                });
            } else{
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด!",
                    text: "กรุณาลองใหม่คราวหลัง!",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: '#263A50',
                    customClass: {
                        cancelButton: 'custom-cancel-button',
                    }
                }).then(() => {
                    window.location.reload();
                })  
            }
                
            } catch(error) {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด!",
                    text: "กรุณาลองใหม่คราวหลัง!",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: '#263A50',
                    customClass: {
                        cancelButton: 'custom-cancel-button',
                    }
                }).then(() => {
                    window.location.reload();
                })
                console.log(error)
            }
            }
        });
        

    }


    return (

        <div className="user">
            <header className="user-header">
                <div>
                    <h2>ประเมินความพึงพอใจ</h2>
                </div>

                <NavbarUserComponent />
            </header>
            <div className="user-body">
                <form onSubmit={submitForm} className="user-body-feedback colorPrimary-800">
                    <h3>ประเมินความพึงพอใจ - คลินิกทั่วไป</h3>
                    <br></br>

                    <label className="textBody-big colorPrimary-800">บริการตรวจรักษาโรคโดยแพทย์</label>
                    <div className="rating">
                        {[5, 4, 3, 2, 1].map((value) => (
                            <React.Fragment key={`star1-${value}`}>
                                <input
                                    type="radio"
                                    id={`star1-${value}`}
                                    name="rating1"
                                    value={value}
                                    onChange={() => handleScoreChange('score', value)}
                                />
                                <label htmlFor={`star1-${value}`}>&#9733;</label>
                            </React.Fragment>
                        ))}
                    </div>
                    <label className="textBody-big colorPrimary-800">บริการจ่ายโดยพยาบาล</label>
                    <div className="rating">
                        {[5, 4, 3, 2, 1].map((value2) => (
                            <React.Fragment key={`star2-${value2}`}>
                                <input
                                    type="radio"
                                    id={`star2-${value2}`}
                                    name="rating2"
                                    value={value2}
                                    onChange={() => handleScoreChange('score2', value2)}
                                />
                                <label htmlFor={`star2-${value2}`}>&#9733;</label>
                            </React.Fragment>
                        ))}
                    </div>
                    <div>
                        <label className="textBody-big colorPrimary-800">เพิ่มเติม</label>
                        <textarea className="acivity-detail" rows="5" value={detail} onChange={inputValue("detail")}></textarea>
                        <span style={{ display: 'flex',justifyContent:"right", alignItems: 'center', color: detail.length > 135 ? 'red' : 'grey' }}>{detail.length}/135</span>
                    </div>
                    <div>
                        <br></br>
                        <input disabled={isSubmitEnabled} type="submit" value="ส่ง" className="btn-primary " target="_parent" />
                    </div>

                </form>

            </div>



        </div>

    );
}

export default FeedbackComponentGeneral;