import "./teacher.scss";
import { FaHeadset, FaBars } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { Outlet, useNavigate } from "react-router-dom";
import { GrGroup } from "react-icons/gr";
import { GiWhiteBook } from "react-icons/gi";
import { MdEditDocument } from "react-icons/md";
import {useEffect, useState} from "react";
import {FaRankingStar} from "react-icons/fa6";
import {jwtDecode} from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";
import RefreshTokenCall from "../../Utils/RefreshTokenCall";

export default function Teachers() {
  const navigate = useNavigate();
    const [user, setUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
                if(err.response.status === 401){
                    RefreshTokenCall()
                }
            });
    }

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="wrap-teacher">
      <div className="header">
        <div className="wrap-logo">
          <img src={logo} alt="#logo" />
          <h1>Teacher</h1>
        </div>
        <div className="wrap-name">
            <h2>{user.fullName}</h2>
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
          <div>
            <div className="wrap-bars">
              <div
                onClick={() => {
                  navigate("/teacher/group");
                  closeSidebar();
                }}
                className="box"
              >
                <GrGroup />
                <h3>Groups</h3>
              </div>
            </div>
            <div className="wrap-bars">
              <div
                onClick={() => {
                  navigate("/teacher/lessons");
                  closeSidebar();
                }}
                className="box"
              >
                <GiWhiteBook />
                <h3>Lessons</h3>
              </div>
            </div>

            <div className="wrap-bars">
              <div
                onClick={() => {
                  navigate("/teacher/exam");
                  closeSidebar();
                }}
                className="box"
              >
                <MdEditDocument />
                <h3>Exams</h3>
              </div>
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
