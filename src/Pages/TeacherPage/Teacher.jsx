import "./teacher.scss";
import { FaHeadset, FaBars } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import { Outlet, useNavigate } from "react-router-dom";
import { GrGroup } from "react-icons/gr";
import { GiWhiteBook } from "react-icons/gi";
import { MdEditDocument } from "react-icons/md";
import { useState } from "react";

export default function Teacher() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="teacher">
      <div className="header">
        <div className="wrap-logo">
          <img src={logo} alt="#logo" />
          <h1>Teacher</h1>
        </div>
        <div className="wrap-name">
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
                <h3>Guruhlar</h3>
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
                <h3>Darslar</h3>
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
                <h3>Imtihon</h3>
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
