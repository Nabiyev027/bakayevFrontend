import "./reception.scss";
import {FaHeadset, FaRegIdCard, FaBars} from "react-icons/fa";
import {PiPhoneCallFill, PiStudentBold} from "react-icons/pi";
import {MdMeetingRoom, MdOutlineSettings} from "react-icons/md";
import {ImExit} from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import {BsCashCoin} from "react-icons/bs";
import {GrGroup} from "react-icons/gr";
import {TbPresentationAnalytics} from "react-icons/tb";
import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";
import {useEffect, useState} from "react";
import {LuClipboardList, LuMessageSquareMore} from "react-icons/lu";
import {GiStarsStack, GiTeacher} from "react-icons/gi";
import {IoCloseSharp} from "react-icons/io5";

function Reception() {
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation(); // ⭐ MUHIM
    const userToken = localStorage.getItem("token");

    useEffect(() => {
        if (userToken) getUserInfo();
    }, [userToken]);

    function getUserInfo() {
        try {
            const decoded = jwtDecode(userToken);

            // DIQQAT: .sub emas, backendda o'zingiz qo'shgan "userId"ni oling
            // Chunki biz JwtService'da .claim("userId", id) deb yozganmiz
            const userId = decoded.userId;

            if (!userId) {
                console.error("Token ichida userId topilmadi! Backendni tekshiring.");
                return;
            }

            // Endi userId UUID formatida (string) bo'ladi va Backend buni qabul qiladi
            ApiCall(`/user/${userId}`, { method: "GET" })
                .then((res) => {
                    setUser(res.data);
                    console.log("User ma'lumotlari keldi:", res.data);
                })
                .catch((err) => {
                    console.error("User ma'lumotlarini olishda xato:", err);
                });
        } catch (error) {
            console.error("Tokenni dekodlashda xato:", error);
        }
    }

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    // ⭐ Active path tekshiruvchi funksiya
    const isActive = (path) => location.pathname === path;

    return (
        <div className="wrapper-reception">
            <div className="nav-rec">
                <div className="wrap-logo">
                    <img src={logo} alt="logo"/>
                    <h1>RECEPTION</h1>
                </div>

                <div className="wrap-name">
                    <h2>{user.fullName}</h2>
                    <div className="circle">
                        <FaHeadset/>
                    </div>
                </div>

                {!sidebarOpen ? (
                    <div className="burger" onClick={toggleSidebar}>
                        <FaBars/>
                    </div>
                ) : (
                    <div className="close-btn" onClick={closeSidebar}>
                        <IoCloseSharp/>
                    </div>
                )}
            </div>

            <div className={`wrap-page ${sidebarOpen ? "active-overlay" : ""}`}>
                <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>

                    <div className="wrap-bars">
                        <h2 className="userName">{user.fullName}</h2>

                        <div
                            onClick={() => { navigate("/reception/register"); closeSidebar(); }}
                            className={`box ${isActive("/reception/register") ? "active-menu" : ""}`}
                        >
                            <FaRegIdCard/>
                            <h3>Registration</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/group"); closeSidebar(); }}
                            className={`box ${isActive("/reception/group") ? "active-menu" : ""}`}
                        >
                            <GrGroup/>
                            <h3>Groups</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/roomSchedule"); closeSidebar(); }}
                            className={`box ${isActive("/reception/roomSchedule") ? "active-menu" : ""}`}
                        >
                            <MdMeetingRoom />
                            <h3>Rooms Schedule</h3>
                        </div>



                        <div
                            onClick={() => { navigate("/reception/teacher"); closeSidebar(); }}
                            className={`box ${isActive("/reception/teacher") ? "active-menu" : ""}`}
                        >
                            <GiTeacher/>
                            <h3>Teachers</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/student"); closeSidebar(); }}
                            className={`box ${isActive("/reception/student") ? "active-menu" : ""}`}
                        >
                            <PiStudentBold/>
                            <h3>Students</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/infoStudent"); closeSidebar(); }}
                            className={`box ${isActive("/reception/infoStudent") ? "active-menu" : ""}`}
                        >
                            <LuClipboardList/>
                            <h3>Students Info List</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/studentRatings"); closeSidebar(); }}
                            className={`box ${isActive("/reception/studentRatings") ? "active-menu" : ""}`}
                        >
                            <GiStarsStack/>
                            <h3>Students Ratings</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/present"); closeSidebar(); }}
                            className={`box ${isActive("/reception/present") ? "active-menu" : ""}`}
                        >
                            <TbPresentationAnalytics/>
                            <h3>Attendance</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/payment"); closeSidebar(); }}
                            className={`box ${isActive("/reception/payment") ? "active-menu" : ""}`}
                        >
                            <BsCashCoin/>
                            <h3>Payments</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/massage"); closeSidebar(); }}
                            className={`box ${isActive("/reception/massage") ? "active-menu" : ""}`}
                        >
                            <LuMessageSquareMore/>
                            <h3>Message</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/appeal"); closeSidebar(); }}
                            className={`box ${isActive("/reception/appeal") ? "active-menu" : ""}`}
                        >
                            <PiPhoneCallFill/>
                            <h3>Appeals</h3>
                        </div>

                        <div
                            onClick={() => { navigate("/reception/setting"); closeSidebar(); }}
                            className={`box ${isActive("/reception/setting") ? "active-menu" : ""}`}
                        >
                            <MdOutlineSettings/>
                            <h3>Settings</h3>
                        </div>
                    </div>

                    <div
                        onClick={() => { navigate("/"); closeSidebar(); }}
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
