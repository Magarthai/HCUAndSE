import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import "../css/Login&SignupComponent.css";
import NavbarUserComponent from './NavbarComponent';
import "../css/Component.css";
import "../css/UserProfileCompoment.css";
import { useUserAuth } from "../context/UserAuthContext";
import male from "../picture/male.png";
import female from "../picture/female.png";
import { collection, getDocs } from 'firebase/firestore';

const ProfileUserComponents = (props) => {
  const { user, userData } = useUserAuth();
  const [fetchedData, setFetchedData] = useState(null);
  const [fetchedDataByClinic, setFetchedDataByClinic] = useState(null);
  const [fetchedDataCurrentDateByClinic, setFetchedDataCurrentDateByClinic] = useState(null);
  useEffect(() => {
    document.title = 'Health Care Unit';
    console.log(user);
  }, [user]);
  const [state, setState] = useState({
    startDate: "",
    endDate: "",
  });
  const { startDate, endDate } = state;
  const fetchData = async () => {
    try {

      const info = {
        startDate: startDate,
        endDate: endDate,
        clinic: selectedOption
      }
      const response = await axios.post(`${process.env.REACT_APP_MONGO_API}/api/getFeedbackByRange`, info);
      setFetchedData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataByClinic = async () => {
    try {

      const info = {
        startDate: startDate,
        endDate: endDate,
        clinic: selectedOption
      }
      const response = await axios.post(`${process.env.REACT_APP_MONGO_API}/api/getFeedbackTimeRangeByClinic`, info);
      setFetchedDataByClinic(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataFromDefaultFeeback = async () => {
    try {

      const info = {
        startDate: startDate,
        endDate: endDate,
        clinic: selectedOption
      }
      const response = await axios.post(`${process.env.REACT_APP_MONGO_API}/api/getFeedbackManyType`, info);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataFromCurrentDateByClinic = async () => {
    try {

      const info = {
        startDate: startDate,
        endDate: endDate,
        clinic: selectedOption
      }
      const response = await axios.post(`${process.env.REACT_APP_MONGO_API}/api/getFeedbackCurrentDateByClinic`, info);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const inputValue = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

  const [selectedOption, setSelectedOption] = useState('');
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
    setFetchedDataByClinic(null)
  };
  const dropdownOptions = [
    { value: 'คลินิกทั่วไป', label: 'คลินิกทั่วไป' },
    { value: 'คลินิกเฉพาะทาง', label: 'คลินิกเฉพาะทาง' },
    { value: 'คลินิกกายภาพ', label: 'คลินิกกายภาพ' },
    { value: 'คลินิกฝังเข็ม', label: 'คลินิกฝังเข็ม' }
  ];
  return (
    <div className="user">
      <header className="user-header">
        <div>
          <h2>โปรไฟล์</h2>
          <h3>รายละเอียดบัญชี</h3>
        </div>
        <NavbarUserComponent />
      </header>
      <div className="user-body">
        <div className="user-profile">
          <div className="center user-profile-header-box">
            <div className="user-profile-wave-container">

              <p style={{ fontSize: 30, color: "white", zIndex: 999 }}>ดึงข้อมูลทั้งหมด</p>
            </div>
            <div className="header"></div>
          </div>
          <div className="user-profile-info colorPrimary-800">
            <input
              type="date"
              className="form-control admin-activity-input"
              placeholder="startDate"
              onChange={(e) => {
                inputValue("startDate")(e);
              }}
              style={{ margin: 5 }}
            />
            <input
              type="date"
              className="form-control admin-activity-input"
              placeholder="endDate"
              onChange={(e) => {
                inputValue("endDate")(e);
              }}
              style={{ margin: 5 }}
            />
            <button className="btn btn-primary" onClick={fetchData}>ดึงข้อมูล</button>
            {fetchedData &&
              <>
                <div>จํานวนคนส่ง {fetchedData.totalSubmit}</div>
                <div>คะแนนเฉลี่ย {fetchedData.meanScore}</div>
              </>
            }
          </div>
        </div>
      </div>
      <div className="user-body" style={{ margin: 0 }}>
        <div className="user-profile">
          <div className="center user-profile-header-box">
            <div className="user-profile-wave-container">

              <p style={{ fontSize: 30, color: "white", zIndex: 999 }}>ดึงข้อมูลทั้งหมดตามคลินิก</p>
            </div>
            <div className="header"></div>
          </div>
          <div className="user-profile-info colorPrimary-800">
            <input
              type="date"
              className="form-control admin-activity-input"
              placeholder="startDate"
              onChange={(e) => {
                inputValue("startDate")(e);
              }}
              style={{ margin: 5 }}
            />
            <input
              type="date"
              className="form-control admin-activity-input"
              placeholder="endDate"
              onChange={(e) => {
                inputValue("endDate")(e);
              }}
              style={{ margin: 5 }}
            />
            <select value={selectedOption} onChange={handleDropdownChange}>
              <option value="">Select an option</option>
              {/* Map through dropdown options to render each option */}
              {dropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={fetchDataByClinic}>ดึงข้อมูล</button>
            {selectedOption && selectedOption === "คลินิกกายภาพ" && fetchedDataByClinic ?
              <>
                <div>จํานวนคนส่ง {fetchedDataByClinic.totalSubmit}</div>
                <div>คะแนนเฉลี่ย {fetchedDataByClinic.meanScore}</div>
                <div>จํานวนคนส่งแบบฟอร์ม2 {fetchedDataByClinic.totalSubmit2}</div>
                <div>คะแนนเฉลี่ยแบบฟอร์ม2 {fetchedDataByClinic.meanScore2}</div>
              </>
              :
              selectedOption && fetchedDataByClinic &&
              <>
                <div>จํานวนคนส่ง {fetchedDataByClinic.totalSubmit}</div>
                <div>คะแนนเฉลี่ย {fetchedDataByClinic.meanScore}</div>
              </>}

          </div>
        </div>
      </div>

      <div className="user-body" style={{ margin: 0 }}>
        <div className="user-profile">
          <div className="center user-profile-header-box">
            <div className="user-profile-wave-container">

              <p style={{ fontSize: 30, color: "white", zIndex: 999 }}>ดึงข้อมูลทั้งหมดจาก Feedback ปกติ</p>
            </div>
            <div className="header"></div>
          </div>
          <div className="user-profile-info colorPrimary-800">
            <input
              type="date"
              className="form-control admin-activity-input"
              placeholder="startDate"
              onChange={(e) => {
                inputValue("startDate")(e);
              }}
              style={{ margin: 5 }}
            />
            <input
              type="date"
              className="form-control admin-activity-input"
              placeholder="endDate"
              onChange={(e) => {
                inputValue("endDate")(e);
              }}
              style={{ margin: 5 }}
            />
            <button className="btn btn-primary" onClick={fetchDataFromDefaultFeeback}>ดึงข้อมูล</button>

          </div>
        </div>
      </div>

      <div className="user-body" style={{ margin: 0 }}>
        <div className="user-profile">
          <div className="center user-profile-header-box">
            <div className="user-profile-wave-container">

              <p style={{ fontSize: 30, color: "white", zIndex: 999 }}>ดึงข้อมูลทั้งหมดตามคลินิกวันปัจจุบัน</p>
            </div>
            <div className="header"></div>
          </div>
          <div className="user-profile-info colorPrimary-800">
            <select value={selectedOption} onChange={handleDropdownChange}>
              <option value="">Select an option</option>
              {/* Map through dropdown options to render each option */}
              {dropdownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={fetchDataFromCurrentDateByClinic}>ดึงข้อมูล</button>
            {selectedOption && selectedOption === "คลินิกกายภาพ" && fetchedDataByClinic ?
              <>
                <div>จํานวนคนส่ง {fetchedDataByClinic.totalSubmit}</div>
                <div>คะแนนเฉลี่ย {fetchedDataByClinic.meanScore}</div>
                <div>จํานวนคนส่งแบบฟอร์ม2 {fetchedDataByClinic.totalSubmit2}</div>
                <div>คะแนนเฉลี่ยแบบฟอร์ม2 {fetchedDataByClinic.meanScore2}</div>
              </>
              :
              selectedOption && fetchedDataByClinic &&
              <>
                <div>จํานวนคนส่ง {fetchedDataByClinic.totalSubmit}</div>
                <div>คะแนนเฉลี่ย {fetchedDataByClinic.meanScore}</div>
              </>}

          </div>
        </div>
      </div>

    </div>
  );
}

export default ProfileUserComponents;
