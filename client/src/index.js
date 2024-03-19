import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App";
import LoginComponent from "./components_all/LoginComponent"
import SignupComponent from "./components_all/SignupComponent";
import AdminHomeComponent from "./components_hcu/HomeComponent"
import ProtectAdminRoute from './auth/protectAdminRoute.jsx';
import GeneralTimetableComponent from "./components_hcu/TimetableGeneralComponent.js"
import SpecialTimetableComponent from "./components_hcu/TimetableSpecialComponent"
import PhysicalTimetableComponent from "./components_hcu/TimetablePhysicalComponent"
import NeedleTimetableComponent from "./components_hcu/TimetableNeedleComponent"
import AppointmentManagerComponent from './components_hcu/AppointmentManagerComponent.js';
import AdminActivityAddComponent from './components_hcu/ActivityAddComponent.js';
import AdminActivityTodayComponent from './components_hcu/ActivityTodayComponent.js';
import AppointmentDetail from './components_user/AppointmentDetail.js';
import UserChooseClinic from './components_user/UserChooseClinic.js';
import ExampleComponent from './components_user/ExampleComponent.js';
import UserAllAppointment from './components_user/UserAllAppointment.js';
import ListAppointmentUser from './components_user/ListAppointmentUser.js';
import AdminAppointmentManagerPhysicalComponent from './components_hcu/AppointmentManagerPhysicalComponent.js';
import UserDateateAppointment from './components_user/DateAppointment.js';
import AddAppointmentUserGeneral from './components_user/AddAppointmentUserGeneral.js';
import AdminAppointmentRequestManagementComponent from './components_hcu/AppointmentRequestManagementComponent.js';
import AdminAppointmentRequestManagementHistoryComponent from './components_hcu/AppointmentRequestManagementHistoryComponent.js';
import AdminQueueManagementSystemComponent from './components_hcu/QueueManagementSystemComponent.js';
import UserHomeComponent from './components_user/HomeCompoment.js';
import UserEditAppointment from "./components_user/UserEditAppointment.js"
import UserHistoryAppointment from "./components_user/UserHistoryAppointment.js"
import AppointmentManagerComponentSpecial from './components_hcu/AppointmentManagerComponentSpecial.js';
import UserTimetableComponet from './components_user/TimetableComponet.js';
import UserProfileComponent from './components_user/ProfileComponent.js';
import UserEditAppointmentSpecial from './components_user/UserEditAppointmentSpecial.js';
import UserProfileEditComponent from './components_user/ProfileEditComponent.js';
import AppointmentManagerNeedleComponent from './components_hcu/AppointmentManagerNeedleComponent.js';
import UserEditAppointmentPhysic from './components_user/UserEditAppointmentPhysic.js';
import ForgetPasswordComponent from "./components_all/ForgetPasswordComponent.js"
import ConfirmResetPassowrd from "./components_all/ResetPasswordComponent.js"
import AdminActivityOpenRegisterComponent from './components_hcu/ActivityOpenRegisterComponent.js';
import AdminActivityNoOpenRegisterComponent from './components_hcu/ActivityNoOpenRegisterComponent.js';
import AdminActivityAllComponent from './components_hcu/ActivityAllComponent.js';
import AdminActivityEditComponent from './components_hcu/ActivityEditComponent.js';
import AdminActivityListOfPeopleComponent from './components_hcu/ActivityListOfPeopleComponent.js';
import UserActivity from './components_user/UserActivity.js';
import UserActivityDetail from './components_user/UserActivityDetail.js';
import UserManual from './components_user/UserManual.js';
import UserQueue from './components_user/UserQueue.js';
import UserEditAppointmentNeedle from './components_user/UserEditAppointmentNeedle.js';
import AdminActivityDetail from './components_hcu/ActivityDetailComponent.js';
import AdminActivityQueueComponent from './components_hcu/ActivityQueueComponent.js';
import Test from './components_user/test.js'
import AdminActivityEditOpenRegistartComponent from './components_hcu/ActivityEditOpenRegistartComponent.js';
import AdminDashboardServiceAll from './components_hcu/DashboardServiceAll.js';
import AdminDashboardGeneral from './components_hcu/DashBoardServiceGeneral.js';
import AdminDashboardSpecial from './components_hcu/DashBoardServiceSpecial.js';
import AdminDashboardPhysical from './components_hcu/DashboardServicePhysical.js';
import AdminDashboardNeedle from './components_hcu/DashboardServiceNeedle.js';
import AdminFeedbackGeneralAll from './components_hcu/FeedbackGeneralAll.js';
import AdminFeedbackGeneralDoctor from './components_hcu/FeedbackGeneralDoctor.js';
import AdminFeedbackGeneralNurses from './components_hcu/FeedbackGeneralNurses.js';
import AdminFeedbackGeneralDressing from './components_hcu/FeedbackGeneralDressing.js';
import AdminFeedbackGeneralPhysical from './components_hcu/FeedbackGeneralPhysical.js';
import AdminFeedbackGeneralNeedle from './components_hcu/FeedbackGeneralNeedle.js';
import AdminFeedbackGeneralOther from './components_hcu/FeedbackGeneralOther.js';
import AdminFeedbackServiceGeneral from './components_hcu/FeedbackServiceGeneral.js';
import AdminFeedbackServiceSpecial from './components_hcu/FeedbackServiceSpecial.js';
import AdminFeedbackServicePhysical from './components_hcu/FeedbackServicePhysical.js';
import AdminFeedbackServiceNeedle from './components_hcu/FeedbackServiceNeedle.js';
import AdminDashboardFeedbackAll from './components_hcu/DashboardFeedbackAll.js';
import AdminDashboardFeedbackGeneral from './components_hcu/DashboardFeedbackGeneral.js';
import AdminDashboardFeedbackSpecial from './components_hcu/DashboardFeedbackSpecial.js';
import AdminDashboardFeedbackPhysical from './components_hcu/DashboardFeedbackPhysical.js';
import AdminDashboardFeedbackNeedle from './components_hcu/DashboardFeedbackNeedle.js';
import AdminInformationAdd from './components_hcu/InformationAdd.js';
import AdminInformationAll from './components_hcu/InformationAll.js';
import AdminInformationEdit from './components_hcu/InformationEdit.js';
import AdminInformationPreview from './components_hcu/InformationPreview.js';
import ErrorPage from './components_all/ErrorPage.js';
import AppointmentHoliday from './components_hcu/AppointmentHoliday.js';
import UserLocation from './components_user/UserLocation.js';
import './index.css'
import { UserAuthContextProvider } from './context/UserAuthContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ProtectRoute from './auth/protectRoute.jsx';

import QueueManagementSystemComponentPhysic from './components_hcu/QueueManagementSystemComponentPhysic.js';
import QueueManagementSystemComponentSpecial from './components_hcu/QueueManagementSystemComponentSpecial.js';
import QueueManagementSystemComponentNeedle from './components_hcu/QueueManagementSystemComponentNeedle.js'
import AddAppointmentUserNeedle from './components_user/AddAppointmentUserNeedle.js';
import AddAppointmentUserPhysic from './components_user/AddAppointmentUserPhysics.js';
import AddAppointmentUserSpecial from './components_user/AddAppointmentUserSpecial.js';
import UserInformationAllComponent from './components_user/InformationAllComponent.js';
import UserInformationPreviewComponent from './components_user/InformationPreviewComponent.js';
import UserFeedbackComponent from './components_user/FeedbackComponent.js';
import UserFeedbackComponentGeneral from './components_user/FeedbackComponentGeneral.js';
import UserFeedbackComponentSpecial from "./components_user/FeedbackComponentSpecial.js"
import UserFeedbackComponentPhysical from "./components_user/FeedbackComponentPhysical.js"
import UserFeedbackComponentPhysical2 from "./components_user/FeedbackComponentPhysical2.js"
import UserFeedbackComponentNeedle from './components_user/FeedbackComponentNeedle.js';
import UserFeedbackComponentNeedle2 from './components_user/FeedbackComponentNeedle2.js';

const router = createBrowserRouter([
  {
    path: "/resetPassword",
    element: <ForgetPasswordComponent />
  },
  {
    path: "/resetPassword",
    element: <ForgetPasswordComponent />
  },
  {
    path: "/test",
    element: <Test />
  },
  {
    path: "/",
    element: <LoginComponent />
  },
  {
    path: "/signup",
    element: <SignupComponent />
  },
  {
    path: "/confirmResetPassword",
    element: <ConfirmResetPassowrd />
  },
  {
    path: "*",
    element: <ErrorPage/>
  },
  {
    path: "/homeAdmin",
    element: <ProtectAdminRoute><AdminHomeComponent /></ProtectAdminRoute>
  },
  {
    path: "/timeTableGeneralAdmin",
    element: <ProtectAdminRoute><GeneralTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/AppointmentHoliday",
    element: <ProtectAdminRoute><AppointmentHoliday/></ProtectAdminRoute>
  },
  {
    path: "/timeTableSpecialAdmin",
    element: <ProtectAdminRoute><SpecialTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/timeTablePhysicalAdmin",
    element: <ProtectAdminRoute><PhysicalTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/timeTableNeedleAdmin",
    element: <ProtectAdminRoute><NeedleTimetableComponent/></ProtectAdminRoute>
  },
  {
    path: "/AppointmentManagerComponent",
    element: <ProtectAdminRoute><AppointmentManagerComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminAppointmentManagerPhysicalComponent",
    element: <ProtectAdminRoute><AdminAppointmentManagerPhysicalComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminAppointmentManagerNeedleComponent",
    element: <ProtectAdminRoute><AppointmentManagerNeedleComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminAppointmentRequestManagementComponent",
    element: <ProtectAdminRoute><AdminAppointmentRequestManagementComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminAppointmentRequestManagementHistoryComponent",
    element: <ProtectAdminRoute><AdminAppointmentRequestManagementHistoryComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminQueueManagementSystemComponent",
    element: <ProtectAdminRoute><AdminQueueManagementSystemComponent/></ProtectAdminRoute>
  },
  {
    path: "/AppointmentManagerComponentSpecial",
    element: <ProtectAdminRoute><AppointmentManagerComponentSpecial/></ProtectAdminRoute>
  },
  {
    path: "/adminQueueManagementSystemComponentSpecial",
    element: <ProtectAdminRoute><QueueManagementSystemComponentSpecial/></ProtectAdminRoute>
  },
  {
    path: "/adminQueueManagementSystemComponentNeedle",
    element: <ProtectAdminRoute><QueueManagementSystemComponentNeedle/></ProtectAdminRoute>
  },
  {
    path: "/adminQueueManagementSystemComponentPhysic",
    element: <ProtectAdminRoute><QueueManagementSystemComponentPhysic/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityAddComponent",
    element: <ProtectAdminRoute><AdminActivityAddComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityTodayComponent",
    element: <ProtectAdminRoute><AdminActivityTodayComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityOpenRegisterComponent",
    element: <ProtectAdminRoute><AdminActivityOpenRegisterComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityNoOpenRegisterComponent",
    element: <ProtectAdminRoute><AdminActivityNoOpenRegisterComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityAllComponent",
    element: <ProtectAdminRoute><AdminActivityAllComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityEditComponent",
    element: <ProtectAdminRoute><AdminActivityEditComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityEditOpenRegistartComponent",
    element: <ProtectAdminRoute><AdminActivityEditOpenRegistartComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityListOfPeopleComponent",
    element: <ProtectAdminRoute><AdminActivityListOfPeopleComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityDetail",
    element: <ProtectAdminRoute><AdminActivityDetail/></ProtectAdminRoute>
  },
  {
    path: "/adminActivityQueueComponent",
    element: <ProtectAdminRoute><AdminActivityQueueComponent/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardService",
    element: <ProtectAdminRoute><AdminDashboardServiceAll/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardServiceGeneral",
    element: <ProtectAdminRoute><AdminDashboardGeneral/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardServiceSpecial",
    element: <ProtectAdminRoute><AdminDashboardSpecial/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardServicePhysical",
    element: <ProtectAdminRoute><AdminDashboardPhysical/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardServiceNeedle",
    element: <ProtectAdminRoute><AdminDashboardNeedle/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackGeneralAll",
    element: <ProtectAdminRoute><AdminFeedbackGeneralAll/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackGeneralDoctor",
    element: <ProtectAdminRoute><AdminFeedbackGeneralDoctor/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackGeneralNurses",
    element: <ProtectAdminRoute><AdminFeedbackGeneralNurses/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackGeneralDressing",
    element: <ProtectAdminRoute><AdminFeedbackGeneralDressing/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackGeneralPhysical",
    element: <ProtectAdminRoute><AdminFeedbackGeneralPhysical/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackGeneralNeeddle",
    element: <ProtectAdminRoute><AdminFeedbackGeneralNeedle/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackGeneralOther",
    element: <ProtectAdminRoute><AdminFeedbackGeneralOther/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackServiceGeneral",
    element: <ProtectAdminRoute><AdminFeedbackServiceGeneral/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackServiceSpecial",
    element: <ProtectAdminRoute><AdminFeedbackServiceSpecial/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackServicePhysical",
    element: <ProtectAdminRoute><AdminFeedbackServicePhysical/></ProtectAdminRoute>
  },
  {
    path: "/adminFeedbackServiceNeedle",
    element: <ProtectAdminRoute><AdminFeedbackServiceNeedle/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardFeedbackAll",
    element: <ProtectAdminRoute><AdminDashboardFeedbackAll/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardFeedbackGeneral",
    element: <ProtectAdminRoute><AdminDashboardFeedbackGeneral/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardFeedbackSpecial",
    element: <ProtectAdminRoute><AdminDashboardFeedbackSpecial/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardFeedbackPhysical",
    element: <ProtectAdminRoute><AdminDashboardFeedbackPhysical/></ProtectAdminRoute>
  },
  {
    path: "/adminDashboardFeedbackNeedle",
    element: <ProtectAdminRoute><AdminDashboardFeedbackNeedle/></ProtectAdminRoute>
  },
  {
    path: "/adminInformationAll",
    element: <ProtectAdminRoute><AdminInformationAll/></ProtectAdminRoute>
  },
  {
    path: "/adminInformationAdd",
    element: <ProtectAdminRoute><AdminInformationAdd/></ProtectAdminRoute>
  },
  {
    path: "/adminInformationEdit",
    element: <ProtectAdminRoute><AdminInformationEdit/></ProtectAdminRoute>
  },
  {
    path: "/adminInformationPreview",
    element: <ProtectAdminRoute><AdminInformationPreview/></ProtectAdminRoute>
  },
  {
    path: "/appointment/detail/:id",
    element: <ProtectRoute><AppointmentDetail /></ProtectRoute>
  },
  {
    path: "/appointment",
    element: <ProtectRoute><UserAllAppointment/></ProtectRoute>
  },
  {
    path: "/appointment/clinic",
    element: <ProtectRoute><UserChooseClinic/></ProtectRoute>
  },
  {
    path: "/appointment/list",
    element: <ProtectRoute><ListAppointmentUser/></ProtectRoute>
  },
  {
    path: "/appointment/date",
    element: <ProtectRoute><UserDateateAppointment/></ProtectRoute>
  },
  {
    path: "/exampleAppointment",
    element: <ProtectRoute><ExampleComponent/></ProtectRoute>
  },
  {
    path: "/appointment/add",
    element: <ProtectRoute><AddAppointmentUserGeneral/></ProtectRoute>
  },
  {
    path: "/appointment/addSpecial",
    element: <ProtectRoute><AddAppointmentUserSpecial/></ProtectRoute>
  },
  {
    path: "/appointment/addPhysic",
    element: <ProtectRoute><AddAppointmentUserPhysic/></ProtectRoute>
  },
  {
    path: "/appointment/addNeedle",
    element: <ProtectRoute><AddAppointmentUserNeedle/></ProtectRoute>
  },

  {
    path: "/home",
    element: <ProtectRoute><UserHomeComponent/></ProtectRoute>
  },
  {
    path: "/appointment/edit",
    element: <ProtectRoute><UserEditAppointment/></ProtectRoute>
  },
  {
    path: "/appointment/editPhysic",
    element: <ProtectRoute><UserEditAppointmentPhysic/></ProtectRoute>
  },
  {
    path: "/appointment/editNeedle",
    element: <ProtectRoute><UserEditAppointmentNeedle/></ProtectRoute>
  },
  {
    path: "/appointment/editSpecial",
    element: <ProtectRoute><UserEditAppointmentSpecial/></ProtectRoute>
  },
  {
    path: "/appointment/history",
    element: <ProtectRoute><UserHistoryAppointment/></ProtectRoute>
  },
  {
    path: "/timetable",
    element: <UserTimetableComponet/>
  },
  {
    path: "/profile",
    element: <ProtectRoute><UserProfileComponent/></ProtectRoute>
  },
  {
    path: "/profile/edit",
    element: <ProtectRoute><UserProfileEditComponent/></ProtectRoute>
  },
  {
    path: "/activity",
    element: <ProtectRoute><UserActivity/></ProtectRoute>
  },
  {
    path: "/activity/detail",
    element: <ProtectRoute><UserActivityDetail/></ProtectRoute>
  },
  {
    path: "/queue",
    element: <ProtectRoute><UserQueue/></ProtectRoute>
  },
  {
    path: "/manual",
    element: <ProtectRoute><UserManual/></ProtectRoute>
  },
  {
    path: "/information",
    element: <ProtectRoute><UserInformationAllComponent/></ProtectRoute>
  },
  {
    path: "/information/preview",
    element: <ProtectRoute><UserInformationPreviewComponent/></ProtectRoute>
  },
  {
    path: "/feedback",
    element: <ProtectRoute><UserFeedbackComponent/></ProtectRoute>
  },
  {
    path: "/feedback/general",
    element: <ProtectRoute><UserFeedbackComponentGeneral/></ProtectRoute>
  },
  {
    path: "/feedback/special",
    element: <ProtectRoute><UserFeedbackComponentSpecial/></ProtectRoute>
  },
  {
    path: "/feedback/physical",
    element: <ProtectRoute><UserFeedbackComponentPhysical/></ProtectRoute>
  },
  {
    path: "/feedback/physical/service",
    element: <ProtectRoute><UserFeedbackComponentPhysical2/></ProtectRoute>
  },
  {
    path: "/feedback/needle",
    element: <ProtectRoute><UserFeedbackComponentNeedle/></ProtectRoute>
  },
  {
    path: "/feedback/needle/service",
    element: <ProtectRoute><UserFeedbackComponentNeedle2/></ProtectRoute>
  },
  {
    path: "/location",
    element: <ProtectRoute><UserLocation/></ProtectRoute>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>
)