// StudentPage.jsx
import "./StudentPage.scss";
import { FaHeadset, FaBars } from "react-icons/fa";
import { MdEditDocument, MdOutlineSettings } from "react-icons/md";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { BsCashCoin } from "react-icons/bs";
import { Outlet, useNavigate } from "react-router-dom";
import ApiCall from "../../Utils/ApiCall";
import { useEffect, useState } from "react";
import { GiWhiteBook } from "react-icons/gi";

// Helper to decode JWT without external library
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
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    if (userToken) {
      const decoded = parseJwt(userToken);
      if (decoded && decoded.sub) {
        const id = decoded.sub;
        localStorage.setItem("userId", id);
        ApiCall(`/auth/user/${id}`, { method: "GET" })
          .then((res) => setUser(res.data))
          .catch((err) => console.error(err));
      }
    }
  }, [userToken]);

  const toggleSidebar = () => {
    if (sidebarOpen) setSidebarOpen(false);
    else setSidebarOpen(true);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="wrapper-reception">
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
        <div className="burger" onClick={toggleSidebar}>
          <FaBars />
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
                navigate("/student/lessons");
                closeSidebar();
              }}
              className="box"
            >
              <GiWhiteBook />
              <h3>Darslar</h3>
            </div>
            <div
              onClick={() => {
                navigate("/student/payment");
                closeSidebar();
              }}
              className="box"
            >
              <BsCashCoin />
              <h3>To'lovlar</h3>
            </div>
            <div
              onClick={() => {
                navigate("/student/exam");
                closeSidebar();
              }}
              className="box"
            >
              <MdEditDocument />
              <h3>Exam</h3>
            </div>
            <div
              onClick={() => {
                navigate("/student/setting");
                closeSidebar();
              }}
              className="box"
            >
              <MdOutlineSettings />
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
            <ImExit />
            <h3>Chiqish</h3>
          </div>
        </div>

        <div className="content-bar" onClick={closeSidebar}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentPage;
