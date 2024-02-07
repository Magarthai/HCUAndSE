import { db, getDocs, collection, doc, getDoc } from "../firebase/config";
import { addDoc, query, where, updateDoc, arrayUnion ,deleteDoc,arrayRemove } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const fetchTimeTableDataFromBackend = async (user, selectedDate) => {
    try {
        if (user && selectedDate && selectedDate.dayName) {
            const timeTableCollection = collection(db, 'timeTable');
            const querySnapshot = await getDocs(query(
                timeTableCollection,
                where('addDay', '==', selectedDate.dayName),
                where('clinic', '==', 'คลินิกทั่วไป')
            ));

            const timeTableData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return timeTableData;
        }
    } catch (error) {
        console.error('Error fetching time table data:', error);
        throw error;
    }
};

export const getTimeablelist = (duration,numberAppointment,start,end) => {
    const timeablelist = [];
        const interval = Math.floor(duration / numberAppointment);

        for (let i = 0; i < numberAppointment; i++) {
            const slotStart = new Date(start.getTime() + i * interval * 60000);
            const slotEnd = new Date(slotStart.getTime() + interval * 60000);

            if (slotEnd.getTime() > end.getTime()) {
                timeablelist.push({
                    start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    end: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                });
                break;
            }

            timeablelist.push({
                start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                end: slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            });
        }
        return timeablelist
};

export const fetchTimeTableDataGeneral = async () => {
  try {
      const timeTableCollection = collection(db, 'timeTable');
      const timeTableSnapshot = await getDocs(query(timeTableCollection,where('clinic', '==', 'คลินิกทั่วไป')));

      const timeTableData = timeTableSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
      }));

          return timeTableData;
      
  } catch (error) {
      console.error('Error fetching time table data:', error);
      throw error;
  }
};


export const fetchUserDataWithAppointments = async (user, selectedDate, setAllAppointmentUsersData) => {
  try {
    if (user && selectedDate && selectedDate.dayName) {
      const appointmentsCollection = collection(db, 'appointment');
      const appointmentQuerySnapshot = await getDocs(query(appointmentsCollection, where('appointmentDate', '==', 
        `${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`),
        where('clinic', '==', 'คลินิกทั่วไป')));

      const timeTableCollection = collection(db, 'timeTable');
      const existingAppointments = appointmentQuerySnapshot.docs.map((doc) => {
        const appointmentData = doc.data();
        return {
          appointmentId: doc.id,
          appointmentuid: doc.id,
          ...appointmentData,
        };
      });

      console.log("existingAppointments", existingAppointments);

      if (existingAppointments.length > 0) {
        console.log(`Appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}:`, existingAppointments);

        const AppointmentUsersDataArray = await Promise.all(existingAppointments.map(async (appointment) => {
          const timeSlotIndex = appointment.appointmentTime.timeSlotIndex;
          const timeTableId = appointment.appointmentTime.timetableId;

          try {
              const timetableDocRef = doc(timeTableCollection, timeTableId);
              const timetableDocSnapshot = await getDoc(timetableDocRef);

              if (timetableDocSnapshot.exists()) {
                  const timetableData = timetableDocSnapshot.data();
                  const timeslot = timetableData.timeablelist[timeSlotIndex];

                  const userDetails = await getUserDataFromUserId(appointment, appointment.appointmentId, timeslot, appointment.appointmentuid);

                  if (userDetails) {
                      console.log("User Data for appointmentId", appointment.appointmentId, ":", userDetails);
                      return userDetails;
                  } else {
                      console.log("No user details found for appointmentId", appointment.appointmentId);
                      return null;
                  }
              } else {
                  console.log("No such document with ID:", timeTableId);
                  return null;
              }
          } catch (error) {
              console.error('Error fetching timetable data:', error);
              return null;
          }
      }));


        if (AppointmentUsersDataArray.length > 0) {
          setAllAppointmentUsersData(AppointmentUsersDataArray);
          console.log("AppointmentUsersData", AppointmentUsersDataArray);
        } else {
          console.log("No user details found for any appointmentId");
        }

        console.log("AppointmentUsersDataArray", AppointmentUsersDataArray);
        setAllAppointmentUsersData(AppointmentUsersDataArray);
        console.log("AppointmentUsersData", AppointmentUsersDataArray);
      } else {
        console.log(`No appointments found for ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`);
      }
    }
  } catch (error) {
    console.error('Error fetching user data with appointments:', error);
  }
};

const getUserDataFromUserId = async (appointment,userId,timeslot,appointmentuid) => {
    const usersCollection = collection(db, 'users');
    const userQuerySnapshot = await getDocs(query(usersCollection, where('id', '==', userId)));

    if (userQuerySnapshot.empty) {
        console.log("No user found with id:", userId);
        return null;
    }

    <u></u>
    const userUid = userQuerySnapshot.docs[0].id;
    const userDatas = userQuerySnapshot.docs[0].data();
    userDatas.timeslot = timeslot;
    userDatas.appointment = appointment;
    userDatas.appointmentuid = appointmentuid;
    userDatas.userUid = userUid;
    console.log("User Data for userId", userId, ":", userDatas);
    console.log("userDatas",userDatas)
    console.log("testxd",userDatas.timeslot.start)
    return userDatas;
};



export const DeleteAppointment = async (appointmentuid, uid, setAllAppointmentUsersData, fetchUserDataWithAppointmentsWrapper) => {
    const timetableRef = doc(db, 'appointment', appointmentuid);
  
    Swal.fire({
      title: 'ลบนัดหมาย',
      text: `วันที่ 15/12/2023 เวลา 13:01 - 13:10`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#DC2626',
      reverseButtons: true,
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(timetableRef);
  
          console.log('Appointment deleted:', appointmentuid);
  
          const userRef = doc(db, 'users', uid);
  
          await updateDoc(userRef, {
            appointments: arrayRemove('appointments', appointmentuid),
          });
  
          console.log(appointmentuid);
          setAllAppointmentUsersData([]);
          fetchUserDataWithAppointmentsWrapper();
          Swal.fire({
            title: 'Deleted!',
            text: 'ลบนัดหมายสำเร็จ',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#263A50',
            customClass: {
              confirmButton: 'custom-confirm-button',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } catch (error) {
          console.error('Error deleting appointment:', error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Deleted!',
          text: 'ลบนัดหมายไม่สำเร็จ',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#263A50',
          customClass: {
            confirmButton: 'custom-confirm-button',
          },
        });
      }
    });
  };
  


export const fetchUserDataWithAppointmentsWrapper = async (user,selectedDate,setAllAppointmentUsersData) => {
  try {
      if (user && selectedDate && selectedDate.dayName) {
          await fetchUserDataWithAppointments(user, selectedDate, setAllAppointmentUsersData);
          console.log("test1s")
      } else {
          console.log("User, selectedDate, or dayName is missing");
      }
  } catch (error) {
      console.error('Error in fetchUserDataWithAppointmentsWrapper:', error);
  }
};
