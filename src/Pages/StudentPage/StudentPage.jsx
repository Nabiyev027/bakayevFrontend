import "../ReceptionPag-Main/reception.scss";
import { FaHeadset, FaBars } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { BsCashCoin } from "react-icons/bs";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ApiCall from "../../Utils/ApiCall";
import { useEffect, useState } from "react";
import { GiWhiteBook } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}

function StudentPage() {
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const userToken = localStorage.getItem("token");

    useEffect(() => {
        if (!userToken) return;

        const decoded = parseJwt(userToken);
        if (!decoded?.sub) return;

        const id = decoded.sub;
        localStorage.setItem("userId", id);

        ApiCall(`/user/${id}`, { method: "GET" })
            .then((res) => setUser(res.data))
            .catch((err) => console.error(err));
    }, [userToken]);

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
