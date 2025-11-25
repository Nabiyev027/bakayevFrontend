import "./reception.scss";
import {FaHeadset, FaRegIdCard, FaBars} from "react-icons/fa";
import {PiPhoneCallFill, PiStudentBold} from "react-icons/pi";
import {MdOutlineSettings} from "react-icons/md";
import {ImExit} from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import {BsCashCoin} from "react-icons/bs";
import {GrGroup} from "react-icons/gr";
import {TbPresentationAnalytics} from "react-icons/tb";
import {Outlet, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";
import {useEffect, useState} from "react";
import {LuMessageSquareMore} from "react-icons/lu";
import {GiTeacher} from "react-icons/gi";

function Reception() {
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const userToken = localStorage.getItem("token");

    useEffect(() => {
        if (userToken) getUserInfo();
    }, [userToken]);

    function getUserInfo() {
        const decodedToken = jwtDecode(userToken);
        const userId = decodedToken.sub;
        localStorage.setItem("userId", userId);
        ApiCall(`/user/${userId}`, {method: "GET"})
            .then((res) => setUser(res.data))
            .catch((err) => console.error(err));
    }

    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="wrapper-reception">
            <div className="nav-rec">
                <div className="wrap-logo">
                    <img src={logo} alt="#logo"/>
                    <h1>RECEPTION</h1>
                </div>
                <div className="wrap-name">
                    <h2>{user.fullName}</h2>
                    <div className="circle">
                        <FaHeadset/>
                    </div>
                </div>
                <div className="burger" onClick={toggleSidebar}>
                    <FaBars/>
                </div>
            </div>

            <div className={`wrap-page ${sidebarOpen ? "active-overlay" : ""}`}>
                <div
                    className="sidebar"
                    style={
                        window.innerWidth <= 768
                            ? {
                                transform: sidebarOpen
                                    ? "translateX(0)"
                                    : "translateX(-100%)",
                            }
                            : {}
                    }
                >
                    <div className="wrap-bars">
                        <div
                            onClick={() => {
                                navigate("/reception/register");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <FaRegIdCard/>
                            <h3>Registration</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/group");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <GrGroup/>
                            <h3>Groups</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/teacher");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <GiTeacher />
                            <h3>Teachers</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/student");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <PiStudentBold/>
                            <h3>Students</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/present");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <TbPresentationAnalytics/>
                            <h3>Attendance</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/payment");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <BsCashCoin/>
                            <h3>Payments</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/massage");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <LuMessageSquareMore/>
                            <h3>Message</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/appeal");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <PiPhoneCallFill/>
                            <h3>Appeals</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/setting");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <MdOutlineSettings/>
                            <h3>Settings</h3>
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            navigate("/");
                            closeSidebar();
                        }}
                        className="box-2"
                    >
                        <ImExit/>
                        <h3>Exit</h3>
                    </div>
                </div>

                <div className="content-bar" onClick={closeSidebar}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

export default Reception;
