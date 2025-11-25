import "./admin.scss";
import {FaCommentDots, FaHeadset, FaHome, FaRegIdCard, FaBars,} from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { ImExit } from "react-icons/im";
import logo from "../../Images/Logos/logoO.png";
import {BsBuildingsFill, BsCashCoin} from "react-icons/bs";
import { GrGroup } from "react-icons/gr";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ApiCall from "../../Utils/ApiCall";
import { useEffect, useState } from "react";
import {SlPeople} from "react-icons/sl";
import RefreshTokenCall from "../../Utils/RefreshTokenCall";

function Admin() {
  const [user, setUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
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

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="wrapper-reception">
      <div className="nav-rec">
        <div className="wrap-logo">
          <img src={logo} alt="#logo" />
          <h1>Admin</h1>
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
                navigate("/admin/addREC");
                closeSidebar();
              }}
              className="box"
            >
              <FaRegIdCard />
              <h3>Add reception</h3>
            </div>

            <div
              onClick={() => {
                navigate("/admin/group");
                closeSidebar();
              }}
              className="box"
            >
              <GrGroup />
              <h3>Groups</h3>
            </div>
            <div
                onClick={() => {
                  navigate("/admin/employer");
                  closeSidebar();
                }}
                className="box"
            >
              <SlPeople />
              <h3>Employees</h3>
            </div>
            <div
              onClick={() => {
                navigate("/admin/payment");
                closeSidebar();
              }}
              className="box"
            >
              <BsCashCoin />
              <h3>Payments</h3>
            </div>
            <div
              onClick={() => {
                navigate("/admin/comments");
                closeSidebar();
              }}
              className="box"
            >
              <FaCommentDots />
              <h3>Comments</h3>
            </div>
              <div onClick={() => {
                  navigate("/admin/branch");
                  closeSidebar();
              }}
                   className="box">
                  <BsBuildingsFill />
                  <h3>Branches</h3>
              </div>
            <div
              onClick={() => {
                navigate("/admin/interface");
                closeSidebar();
              }}
              className="box"
            >
              <FaHome />
              <h3>Interface</h3>
            </div>
            <div
              onClick={() => {
                navigate("/admin/setting");
                closeSidebar();
              }}
              className="box"
            >
              <MdOutlineSettings />
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
