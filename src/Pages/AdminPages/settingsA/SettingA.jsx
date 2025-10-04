import React, {useEffect, useState} from "react";
import "./settingA.scss";
import PaymentDaySelector from "./component/payment-day-selector";
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";


export default function SettingA() {
    const [admin, setAdmin] = useState({
        name: "Ali Valiyev",
        password: "123456",
        avatar:
            "https://shapka-youtube.ru/wp-content/uploads/2021/02/avatarka-dlya-skaypa-dlya-parney.jpg",
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [newName, setNewName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");

    const [paymentInfo, setPaymentInfo] = useState({day: null, amount: ""})

    useEffect(() => {
        getPaymentInfo()
    }, []);

    async function getPaymentInfo() {
        try {
            const res = await ApiCall("/payment/courseInfo",{method: "GET"})
            setPaymentInfo({
                day: Number(res.data?.paymentDay),
                amount: res.data?.amount});
        } catch (err) {
            const message =
                err.response?.data
            toast.warn(message);
        }
    }

    // Handle avatar file selection
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setAdmin((prev) => ({...prev, avatar: reader.result}));
        };
        reader.readAsDataURL(file);
    };

    const handleSaveNewName = () => {
        if (newName.trim() === "") {
            setError("Name cannot be empty.");
            return;
        }
        setAdmin((prev) => ({...prev, name: newName}));
        resetNameEditing();
    };

    const resetNameEditing = () => {
        setIsEditingName(false);
        setNewName("");
        setError("");
    };

    const handleSaveNewPassword = () => {
        if (oldPassword !== admin.password) {
            setError("Old password is incorrect.");
            return;
        }
        if (newPassword.trim() === "") {
            setError("New password cannot be empty.");
            return;
        }
        setAdmin((prev) => ({...prev, password: newPassword}));
        resetPasswordEditing();
    };

    const resetPasswordEditing = () => {
        setIsEditingPassword(false);
        setOldPassword("");
        setNewPassword("");
        setError("");
    };

    async function handleSaveInfo() {
        console.log(paymentInfo.day)
        console.log(paymentInfo.amount)
        const formData = new FormData();
        formData.append("day", parseInt(paymentInfo.day));
        formData.append("amount", paymentInfo.amount);

        try {
            const res = await ApiCall("/payment/courseInfo", {method: "POST"}, formData);
            toast.success(res.data);
        } catch (err) {
            const message =
                err.response?.data
            toast.warn(message);
        }
    }

    return (
        <div className="setting-page">
            <ToastContainer/>
            <h1>Settings</h1>
            <div className="wrap-settings">
                <div className="setting-box">
                    {/* Avatar with hover overlay */}
                    <label className="avatar-container">
                        <img src={admin.avatar} alt="Admin Avatar" className="avatar-img"/>
                        <div className="avatar-overlay">📷</div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{display: "none"}}
                        />
                    </label>

                    {/* Name Update */}
                    <div className="info-row">
                        <span className="label">Name:</span>
                        {isEditingName ? (
                            <>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="input-edit"
                                    placeholder={admin.name}
                                />
                                <button className="action-btn" onClick={handleSaveNewName}>
                                    Save
                                </button>
                                <button className="action-btn cancel" onClick={resetNameEditing}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="value">{admin.name}</span>
                                <button
                                    className="action-btn"
                                    onClick={() => {
                                        setIsEditingName(true);
                                        setNewName(admin.name);
                                        setError("");
                                    }}
                                >
                                    Change Name
                                </button>
                            </>
                        )}
                    </div>

                    {/* Password Update */}
                    <div className="info-row">
                        {isEditingPassword ? (
                            <div className="password-inputs">
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="input-edit"
                                    placeholder="Enter old password"
                                />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input-edit"
                                    placeholder="Enter new password"
                                />
                                <div>
                                    <button className="action-btn" onClick={handleSaveNewPassword}>
                                        Save
                                    </button>
                                    <button
                                        className="action-btn cancel"
                                        onClick={resetPasswordEditing}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="action-btn"
                                onClick={() => {
                                    setIsEditingPassword(true);
                                    setError("");
                                }}
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && <div className="error-message">{error}</div>}
                </div>
                <div className="setting-box">
                    <label>
                        <div className="section">
                            <PaymentDaySelector
                                value={paymentInfo.day}
                                onChange={(value) => setPaymentInfo({ ...paymentInfo, day: value })}
                                label="Course Payment Day"
                            />
                        </div>
                    </label>
                    <label>
                        <h3>Course Payment Amount (So'm)</h3>
                        <input type="number" value={paymentInfo.amount}
                               onChange={(e) => setPaymentInfo({...paymentInfo, amount: e.target.value})}/>
                    </label>

                    <button onClick={handleSaveInfo} className={"btn"}>Save</button>

                </div>
            </div>

        </div>
    );
}
