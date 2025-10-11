import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./Pages/Home/Home";
import Navbar from "./Pages/Navbar/Navbar";
import "./App.css";
import Private from "./Pages/Home/Private/Private";
import Teachers from "./Pages/Home/Teachers/Teachers";
import Students from "./Pages/Home/Students/Students";
import Courses from "./Pages/Home/Courses/Courses";
import Login from "./Pages/Login/Login";
import Teacher from "./Pages/TeacherPage/Teacher";
import LessonsT from "./Pages/TeacherPage/lessonsPage/LessonsT";
import StudentPage from "./Pages/StudentPage/StudentPage";
import LessonsS from "./Pages/StudentPage/lessonsS/LessonsS";
import PaymentS from "./Pages/StudentPage/paymentS/PaymentS";
import Admin from "./Pages/AdminPages/Admin";
import GroupA from "./Pages/AdminPages/groupA/GroupA";
import SettingA from "./Pages/AdminPages/settingsA/SettingA";
import AddReception from "./Pages/AdminPages/addRECEPTION/AddReception";
import SettingsS from "./Pages/StudentPage/settingsS/SettingsS";
import InterfaceA from "./Pages/AdminPages/interfaceA/InterfaceA";
import ExamS from "./Pages/StudentPage/examS/ExamS";
import ExamT from "./Pages/TeacherPage/examT/ExamT";
import Reception from "./Pages/ReceptionPag-Main/Reception";
import Register from "./Pages/ReceptionPag-Main/RegisterUser/Register";
import Student from "./Pages/ReceptionPag-Main/StudentPage/Student";
import Group from "./Pages/ReceptionPag-Main/GroupPage/Group";
import Payment from "./Pages/ReceptionPag-Main/PaymentPage/Payment";
import Setting from "./Pages/ReceptionPag-Main/SettingPage/Setting";
import NotFound from "./Pages/NotFound/NotFound";
import Massage from "./Pages/ReceptionPag-Main/Massage/Massage";
import SelectRoles from "./Pages/SelectRoles/SelectRoles";
import Appeal from "./Pages/ReceptionPag-Main/AppealPage/Appeal";
import Branch from "./Pages/AdminPages/Branch/Branch";
import TeacherMain from "./Pages/ReceptionPag-Main/TeacherPage/TeacherMain";
import Employer from "./Pages/AdminPages/employerA/Employer";
import CommentsA from "./Pages/AdminPages/comentsA/CommentsA";
import {LangProvider} from "./Pages/AdminPages/interfaceA/langConfig/LangContext";
import Rating from "./Pages/TeacherPage/ratingExam/Rating";
import AttendanceTable from "./Pages/ReceptionPag-Main/Attendance/AttendanceR";
import AttendanceGroup from "./Pages/TeacherPage/groupAttendance/AttendanceG";


function App() {
    const observerErrorHandler = () => {
        // resize observer error ni e'tiborsiz qoldirish
    };
    window.addEventListener("error", (e) => {
        if (
            e.message ===
            "ResizeObserver loop completed with undelivered notifications"
        ) {
            observerErrorHandler();
            e.stopImmediatePropagation();
        }
    });

    return (
        <LangProvider>
            <Routes>
                <Route path="/" element={<Home/>}>
                    <Route path="/" element={<Private/>}/>
                    <Route path={"/courses"} element={<Courses/>}/>
                    <Route path={"/teachers"} element={<Teachers/>}/>
                    <Route path={"/students"} element={<Students/>}/>
                </Route>
                <Route path="/" element={<Navbar/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/selectRoles"} element={<SelectRoles/>}/>

                <Route path={"/reception"} element={<Reception/>}>
                    <Route path={"/reception/register"} element={<Register/>}/>
                    <Route path={"/reception/student"} element={<Student/>}/>
                    <Route path={"/reception/teacher"} element={<TeacherMain/>}/>
                    <Route path={"/reception/group"} element={<Group/>}/>
                    <Route path={"/reception/payment"} element={<Payment/>}/>
                    <Route path={"/reception/setting"} element={<Setting/>}/>
                    <Route path={"/reception/present"} element={<AttendanceTable />}/>
                    <Route path={"/reception/massage"} element={<Massage/>}/>
                    <Route path={"/reception/appeal"} element={<Appeal/>}/>
                </Route>
                <Route path="/teacher" element={<Teacher/>}>
                    <Route path="/teacher/group" element={<AttendanceGroup/>}/>
                    <Route path="/teacher/lessons" element={<LessonsT/>}/>
                    <Route path="/teacher/exam" element={<ExamT/>}/>
                    <Route path="/teacher/rating" element={<Rating/>} />
                </Route>
                <Route path="/student" element={<StudentPage/>}>
                    <Route path="/student/lessons" element={<LessonsS/>}/>
                    <Route path="/student/payment" element={<PaymentS/>}/>
                    <Route path="/student/setting" element={<SettingsS/>}/>
                    <Route path="/student/exam" element={<ExamS/>}/>
                </Route>
                <Route path="/admin" element={<Admin/>}>
                    <Route path="/admin/group" element={<GroupA/>}/>
                    <Route path="/admin/setting" element={<SettingA/>}/>
                    <Route path="/admin/comments" element={<CommentsA/>}/>
                    <Route path="/admin/addREC" element={<AddReception/>}/>
                    <Route path="/admin/interface" element={<InterfaceA/>}/>
                    <Route path={"/admin/employer"} element={<Employer/>}/>
                    <Route path={"/admin/branch"} element={<Branch/>}/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </LangProvider>
    );
}

export default App;
