import { FaBars } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { GrGroup } from "react-icons/gr";
import { GiStarsStack, GiWhiteBook } from "react-icons/gi";
import { MdEditDocument } from "react-icons/md";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";
import RefreshTokenCall from "../../Utils/RefreshTokenCall";
import { IoCloseSharp } from "react-icons/io5";

export default function Teachers() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    const userToken = localStorage.getItem("token");

    useEffect(() => {
        if (userToken) getUserInfo();
    }, [userToken]);

    function getUserInfo() {
        const decoded = jwtDecode(userToken);
        const userId = decoded.sub;
        setUserId(userId);
        localStorage.setItem("userId", userId);

        ApiCall(`/user/${userId}`, { method: "GET" })
            .then((res) => setUser(res.data))
            .catch((err) => {
                if (err.response?.status === 401) {
                    RefreshTokenCall();
                }
            });
    }

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    // ⭐ Parent path'lar uchun ham ishlaydi
    const isActive = (path) =>
        location.pathname.startsWith(path) ? "active-menu" : "";

    return (
        <div className="wrapper-reception">
            {/* NAVBAR */}
            <div className="nav-rec">
                <div className="wrap-logo">
                    <img src={logo} alt="logo" />
                    <h1>TEACHER</h1>
                </div>

                <div className="wrap-name">
                    <h2>{user.fullName}</h2>
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
                            onClick={() => { navigate("/teacher/group"); closeSidebar(); }}
                            className={`box ${isActive("/teacher/group")}`}
                        >
                            <GrGroup />
                            <h3>Groups</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/teacher/studentRatings"); closeSidebar(); }}
                            className={`box ${isActive("/teacher/studentRatings")}`}
                        >
                            <GiStarsStack />
                            <h3>Students Ratings</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/teacher/lessons"); closeSidebar(); }}
                            className={`box ${isActive("/teacher/lessons")}`}
                        >
                            <GiWhiteBook />
                            <h3>Lessons</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/teacher/exam"); closeSidebar(); }}
                            className={`box ${isActive("/teacher/exam")}`}
                        >
                            <MdEditDocument />
                            <h3>Exams</h3>
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
                    <Outlet context={{ teacherId:userId }} />
                </div>
            </div>
        </div>
    );
}
