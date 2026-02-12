import React, {useState} from "react";
import "./login.scss";
import {FaEye, FaEyeSlash, FaLock, FaUser} from "react-icons/fa";

import {useNavigate} from "react-router-dom";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

const LoginCard = () => {
    const [isShow, setIsShow] = useState(false);
    const [user, setUser] = useState({username:"", password:""});
    const navigate = useNavigate();

    function handleLogin() {

        const trimmedUser = {
            username: user.username.trim(),
            password: user.password.trim()
        };

        if (!trimmedUser.username || !trimmedUser.password) {
            toast.error("Login va parolni to‘ldiring!");
            return;
        }

        axios.post("http://localhost:8080/auth/login", trimmedUser)
            .then(res => {

                localStorage.setItem("token", res.data.access_token);
                localStorage.setItem("refresh_token", res.data.refresh_token);

                const roleNames = res.data.roles;
                localStorage.setItem("roles", JSON.stringify(roleNames));

                toast.success("Welcome!");

                setTimeout(() => {
                    navigate("/selectRoles");
                }, 500);

            })
            .catch(err => {
                const errorMsg = typeof err.response?.data === 'string'
                    ? err.response.data
                    : "Login or password error!";
                toast.error(errorMsg);
            });
    }




    return (
        <div className="login-wrapper">
            <ToastContainer/>
            <div className={"login-container"}>
                <div className="login-card">
                    <h2>Login</h2>
                    <label className="input-group">
                        <FaUser className="icon" />
                        <input onChange={(e)=>setUser({...user,username:e.target.value})} value={user.username} type={"text"} required placeholder="Login" />
                    </label>
                    <label className="input-group">
                        <FaLock className="icon" />
                        <input onChange={(e)=>setUser({...user,password:e.target.value})}
                               value={user.password} type={isShow ? "text":"password"} required placeholder="Password" />
                        {
                            isShow ? <FaEyeSlash className="icon-2" onClick={()=>setIsShow(p=>!p)} /> :
                                <FaEye className="icon-2" onClick={()=>setIsShow(p=>!p)} />
                        }

                    </label>
                    <button onClick={handleLogin} className="login-btn">Login</button>
                </div>
                <h1>BAKAYEV EDUCATION</h1>

            </div>
        </div>
    );
};

export default LoginCard;
