import React, { useState, useEffect } from "react";
import "../css/UserFeedbackComponent.css";
import NavbarUserComponent from './NavbarComponent';
import Swal from "sweetalert2";
import axios from "axios";
const FeedbackComponent = (props) => {
    const [state, setState] = useState({
        score: "",
        detail: "",
        clinic: "คลินิกทั้งหมด",
        typeFeedback: ""
    });
    const { score, detail, clinic,typeFeedback } = state;
    const inputValue = (name) => (event) => {
        setState({ ...state, [name]: event.target.value });
      };
    const stars = document.querySelectorAll('.rating input');
    const MONGO_API = process.env.REACT_APP_MONGO_API
    stars.forEach((star) => {
        star.addEventListener('change', (e) => {
            const selectedScore = e.target.value;
            setState({ ...state, score: selectedScore });
            console.log('คะแนนที่ถูกเลือก:', e.target.value);
          // ทำสิ่งที่คุณต้องการกับคะแนนที่ถูกเลือกต่อไปนี้
        });
      }
    )
    const isSubmitEnabled =
    !score || !detail || detail.length > 135;
    const [selectedCount, setSelectedCount] = useState(1);
    const handleSelectChange = () => {
        setSelectedCount(selectedCount + 1);
        console.log(selectedCount)
    };

    const submitForm = async (e) => {
        e.preventDefault();
        Swal.fire({
            icon: "alret",
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
                    detail: detail,
                    clinic: clinic,
                    typeFeedback:typeFeedback,
                };
                

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

                    <NavbarUserComponent/>
            </header>
            <div className="user-body">
                <form onSubmit={submitForm} className="user-body-feedback colorPrimary-800">
                    <h3>ประเมินความพึงพอใจ</h3>
                    <br></br>
                    <div>
                        <label className="textBody-big colorPrimary-800">ประเภทบริการ</label>
                        <select
                            name="typeFeedback"
                            value={typeFeedback}
                            onChange={(e) => {
                                inputValue("typeFeedback")(e);
                                handleSelectChange();
                            }}
                            className={selectedCount >= 2 ? 'selected' : ''}
                        >
                            <option value="" hidden>
                                กรุณาเลือกประเภทบริการ
                            </option>
                            <option value="บริการตรวจรักษาโรคโดยแพทย์">บริการตรวจรักษาโรคโดยแพทย์</option>
                            <option value="บริการจ่ายยาโดยพยาบาล">บริการจ่ายยาโดยพยาบาล</option>
                            <option value="บริการทำแผล-ฉีดยา">บริการทำแผล-ฉีดยา</option>
                            <option value="บริการกายภาพบำบัด">บริการกายภาพบำบัด</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                    </div>
        
                    <div class="rating">
                        <input type="radio" id="star5" name="rating" value="5" />
                        <label for="star5">&#9733;</label>
                        <input type="radio" id="star4" name="rating" value="4" />
                        <label for="star4">&#9733;</label>
                        <input type="radio" id="star3" name="rating" value="3" />
                        <label for="star3">&#9733;</label>
                        <input type="radio" id="star2" name="rating" value="2" />
                        <label for="star2">&#9733;</label>
                        <input type="radio" id="star1" name="rating" value="1" />
                        <label for="star1">&#9733;</label>
                    </div>
                    
                    <div>
                        <label className="textBody-big colorPrimary-800">เพิ่มเติม</label>
                        <textarea className="acivity-detail" rows="5" value={detail} onChange={inputValue("detail")}></textarea>
                    </div>
                    <div>
                        <br></br>
                        <input type="submit" value="ส่ง" className="btn-primary " target="_parent"/>
                    </div>
            
                </form>

            </div>
         
           
            
        </div>

    );
}

export default FeedbackComponent;