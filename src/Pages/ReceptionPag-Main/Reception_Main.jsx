import "./reception.scss";
import {FaHeadset, FaRegIdCard, FaBars} from "react-icons/fa";
import {PiPhoneCallFill, PiStudentBold} from "react-icons/pi";
import {MdOutlineSettings} from "react-icons/md";
import {ImExit} from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import {BsBuildingsFill, BsCashCoin} from "react-icons/bs";
import {GrGroup} from "react-icons/gr";
import {TbPresentationAnalytics} from "react-icons/tb";
import {Outlet, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";
import {useEffect, useState} from "react";
import {LuMessageSquareMore} from "react-icons/lu";

function Reception_Main() {
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
                            <h3>Ro'yxatdan o'tkazish</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/group");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <GrGroup/>
                            <h3>Guruhlar</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/student");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <PiStudentBold/>
                            <h3>O'quvchilar</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/present");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <TbPresentationAnalytics/>
                            <h3>Davomat</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/payment");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <BsCashCoin/>
                            <h3>To'lovlar</h3>
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
                        <div onClick={() => {
                            navigate("/reception/branch");
                            closeSidebar();
                        }}
                             className="box">
                            <BsBuildingsFill />
                            <h3>Branches</h3>
                        </div>
                        <div
                            onClick={() => {
                                navigate("/reception/setting");
                                closeSidebar();
                            }}
                            className="box"
                        >
                            <MdOutlineSettings/>
                            <h3>Sozlamalar</h3>
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
                        <h3>Chiqish</h3>
                    </div>
                </div>

                <div className="content-bar" onClick={closeSidebar}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
}

export default Reception_Main;
