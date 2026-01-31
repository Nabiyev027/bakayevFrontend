import {
    FaCommentDots,
    FaHeadset,
    FaHome,
    FaRegIdCard,
    FaBars
} from "react-icons/fa";
import {MdMeetingRoom, MdOutlineSettings} from "react-icons/md";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { BsBuildingsFill, BsCashCoin } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";
import { useEffect, useState } from "react";
import { SlPeople } from "react-icons/sl";
import RefreshTokenCall from "../../Utils/RefreshTokenCall";
import { GiStarsStack } from "react-icons/gi";
import { LuClipboardList } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import {FaHandHoldingDollar} from "react-icons/fa6";
import {RiRefund2Line} from "react-icons/ri";

function Admin() {
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation(); // ⭐ MUHIM
    const userToken = localStorage.getItem("token");

    useEffect(() => {
        if (userToken) getUserInfo();
    }, [userToken]);

    function getUserInfo() {
        const decoded = jwtDecode(userToken);
        const userId = decoded.sub;
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

    // ⭐ Active path checker
    const isActive = (path) => location.pathname === path;

    return (
        <div className="wrapper-reception">
            <div className="nav-rec">
                <div className="wrap-logo">
                    <img src={logo} alt="logo" />
                    <h1>Admin</h1>
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

            <div className={`wrap-page ${sidebarOpen ? "active-overlay" : ""}`}>
                <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
                    <div className="wrap-bars">
                        <h2 className="userName">{user.fullName}</h2>

                        <div
                            onClick={() => { navigate("/admin/addREC"); closeSidebar(); }}
                            className={`box ${isActive("/admin/addREC") ? "active-menu" : ""}`}
                        >
                            <FaRegIdCard />
                            <h3>Registration</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/group"); closeSidebar(); }}
                            className={`box ${isActive("/admin/group") ? "active-menu" : ""}`}
                        >
                            <GrGroup />
                            <h3>Groups</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/roomSchedule"); closeSidebar(); }}
                            className={`box ${isActive("/admin/roomSchedule") ? "active-menu" : ""}`}
                        >
                            <MdMeetingRoom />
                            <h3>Rooms Schedule</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/employer"); closeSidebar(); }}
                            className={`box ${isActive("/admin/employer") ? "active-menu" : ""}`}
                        >
                            <SlPeople />
                            <h3>Employees</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/student"); closeSidebar(); }}
                            className={`box ${isActive("/admin/student") ? "active-menu" : ""}`}
                        >
                            <PiStudentBold />
                            <h3>Students</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/infoStudent"); closeSidebar(); }}
                            className={`box ${isActive("/admin/infoStudent") ? "active-menu" : ""}`}
                        >
                            <LuClipboardList />
                            <h3>Students Info List</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/studentRatings"); closeSidebar(); }}
                            className={`box ${isActive("/admin/studentRatings") ? "active-menu" : ""}`}
                        >
                            <GiStarsStack />
                            <h3>Students Ratings</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/payment"); closeSidebar(); }}
                            className={`box ${isActive("/admin/payment") ? "active-menu" : ""}`}
                        >
                            <BsCashCoin />
                            <h3>Payments</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/refundFee"); closeSidebar(); }}
                            className={`box ${isActive("/admin/refundFee") ? "active-menu" : ""}`}
                        >
                            <RiRefund2Line />
                            <h3>Refund Fee</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/salary"); closeSidebar(); }}
                            className={`box ${isActive("/admin/salary") ? "active-menu" : ""}`}
                        >
                            <FaHandHoldingDollar />
                            <h3>Salary</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/comments"); closeSidebar(); }}
                            className={`box ${isActive("/admin/comments") ? "active-menu" : ""}`}
                        >
                            <FaCommentDots />
                            <h3>Comments</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/branch"); closeSidebar(); }}
                            className={`box ${isActive("/admin/branch") ? "active-menu" : ""}`}
                        >
                            <BsBuildingsFill />
                            <h3>Branches</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/interface"); closeSidebar(); }}
                            className={`box ${isActive("/admin/interface") ? "active-menu" : ""}`}
                        >
                            <FaHome />
                            <h3>Interface</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/admin/setting"); closeSidebar(); }}
                            className={`box ${isActive("/admin/setting") ? "active-menu" : ""}`}
                        >
                            <MdOutlineSettings />
                            <h3>Settings</h3>
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

                <div className="content-bar" onClick={closeSidebar}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Admin;
