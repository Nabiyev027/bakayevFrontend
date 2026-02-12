import "../ReceptionPag-Main/reception.scss";
import { FaHeadset, FaBars } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { BsCashCoin } from "react-icons/bs";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiWhiteBook } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import {jwtDecode} from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";



function StudentPage() {
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const userToken = localStorage.getItem("token");
    const userId = jwtDecode(userToken).userId;


    useEffect(() => {
        if (userToken) getUserInfo();
    }, [userToken]);

    function getUserInfo() {
        try {
            if (!userId) {
                console.error("Token ichida userId topilmadi!");
                return;
            }

            ApiCall(`/user/${userId}`, { method: "GET" })
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.error("User ma'lumotlarini olishda xato:", err);
                });
        } catch (error) {
            console.error("Tokenni dekodlashda xato:", error);
        }
    }

    const navigate = useNavigate();
    const location = useLocation();


    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    // ⭐ active path (nested route'lar bilan)
    const isActive = (path) =>
        location.pathname.startsWith(path) ? "active-menu" : "";

    return (
        <div className="wrapper-reception">
            {/* NAVBAR */}
            <div className="nav-rec">
                <div className="wrap-logo">
                    <img src={logo} alt="logo" />
                    <h1>Student</h1>
                </div>

                <div className="wrap-name">
                    <h2>{user.fullName}</h2>
                    <div className="circle">
                        <FaHeadset />
                    </div>
                </div>

                {!sidebarOpen ? (
                    <div className="burger" onClick={toggleSidebar}>
                        <FaBars />
                    </div>
                ) : (
                    <div className="close-btn" onClick={closeSidebar}>
                        <IoCloseSharp />
                    </div>
                )}
            </div>

            {/* PAGE */}
            <div className={`wrap-page ${sidebarOpen ? "active-overlay" : ""}`}>
                {/* SIDEBAR */}
                <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
                    <div className="wrap-bars">
                        <h2 className="userName">{user.fullName}</h2>

                        <div
                            onClick={() => { navigate("/student/lessons"); closeSidebar(); }}
                            className={`box ${isActive("/student/lessons")}`}
                        >
                            <GiWhiteBook />
                            <h3>Lessons</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/student/payment"); closeSidebar(); }}
                            className={`box ${isActive("/student/payment")}`}
                        >
                            <BsCashCoin />
                            <h3>Payments</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/student/exam"); closeSidebar(); }}
                            className={`box ${isActive("/student/exam")}`}
                        >
                            <MdEditDocument />
                            <h3>Exam</h3>
                        </div>
                    </div>

                    <div
                        onClick={() => { navigate("/"); closeSidebar(); }}
                        className="box-2"
                    >
                        <ImExit />
                        <h3>Exit</h3>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="content-bar" onClick={closeSidebar}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default StudentPage;
