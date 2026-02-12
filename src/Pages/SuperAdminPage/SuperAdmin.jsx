import "../ReceptionPag-Main/reception.scss"
import { FaHeadset, FaBars } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import ApiCall from "../../Utils/ApiCall";
import { useEffect, useState } from "react";
import { GrUserAdmin } from "react-icons/gr";
import { MdOutlineSettings } from "react-icons/md";
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";

function SuperAdmin() {
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(""); // Active menu state
    const navigate = useNavigate();
    const location = useLocation(); // current path
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
                    toast.error(err.response?.data);
                });
        } catch (error) {
            console.error("Tokenni dekodlashda xato:", error);
        }
    }

    // Automatically highlight menu based on current path
    useEffect(() => {
        if (location.pathname.includes("adminsControl")) setActiveMenu("adminsControl");
        else if (location.pathname.includes("setting")) setActiveMenu("setting");
        else setActiveMenu("");
    }, [location.pathname]);

    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="wrapper-reception">
            <div className="nav-rec">
                <div className="wrap-logo">
                    <img src={logo} alt="logo" />
                    <h1>Super Admin</h1>
                </div>
                <div className="wrap-name">
                    <h2>{user.username}</h2>
                    <div className="circle">
                        <FaHeadset />
                    </div>
                </div>
                <div className="burger" onClick={toggleSidebar}>
                    <FaBars />
                </div>
            </div>

            <div className={`wrap-page ${sidebarOpen ? "active-overlay" : ""}`}>
                <div
                    className={`sidebar ${sidebarOpen ? "active" : ""}`}
                    style={
                        window.innerWidth <= 768
                            ? { transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }
                            : {}
                    }
                >
                    <div className="wrap-bars">
                        <div
                            onClick={() => {
                                setActiveMenu("adminsControl");
                                navigate("/superAdmin/adminsControl");
                                closeSidebar();
                            }}
                            className={`box ${activeMenu === "adminsControl" ? "active-menu" : ""}`}
                        >
                            <GrUserAdmin />
                            <h3>Admins control</h3>
                        </div>

                        <div
                            onClick={() => {
                                setActiveMenu("setting");
                                navigate("/superAdmin/setting");
                                closeSidebar();
                            }}
                            className={`box ${activeMenu === "setting" ? "active-menu" : ""}`}
                        >
                            <MdOutlineSettings />
                            <h3>Setting</h3>
                        </div>
                    </div>

                    <div
                        onClick={() => {
                            navigate("/");
                            closeSidebar();
                        }}
                        className="box-2"
                    >
                        <ImExit />
                        <h3>Exit</h3>
                    </div>
                </div>

                <div className="content-bar" onClick={closeSidebar}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default SuperAdmin;
