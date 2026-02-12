import { useEffect, useState } from "react";
import "./SettingsS.scss";
import { toast, ToastContainer } from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";
import { FaRegUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

function SettingsS() {

    const BaseURL = "http://localhost:8080";
    const userToken = localStorage.getItem("token");

    // userId ni xavfsiz olish
    let userId = null;
    try {
        if (userToken) {
            const decoded = jwtDecode(userToken);
            userId = decoded.userId;
        }
    } catch (err) {
        console.error("Token decode xato:", err);
    }

    // Backenddan kelgan user
    const [userInitialData, setUserInitialData] = useState({});

    // Form state
    const [profileData, setProfileData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        imgUrl: "",
        avatarPreview: ""
    });

    const [avatarFile, setAvatarFile] = useState(null);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
    });

    // ===================== USER INFO =====================
    useEffect(() => {
        if (userId) {
            getUserInfo();
        }
    }, [userId]);

    const getUserInfo = async () => {
        try {
            const res = await ApiCall(`/user/${userId}`, { method: "GET" });
            setUserInitialData(res.data);
        } catch (err) {
            toast.error(err.response?.data || "User ma'lumotini olishda xatolik");
        }
    };

    // Backenddan kelgan fullName ni split qilish
    useEffect(() => {
        if (userInitialData) {
            let first = "";
            let last = "";

            if (userInitialData.fullName) {
                const parts = userInitialData.fullName.split(" ");
                first = parts[0] || "";
                last = parts[1] || "";
            }

            setProfileData({
                firstname: first,
                lastname: last,
                username: userInitialData.username || "",
                imgUrl: userInitialData.imgUrl || "",
                avatarPreview: ""
            });
        }
    }, [userInitialData]);

    // ===================== INPUT HANDLERS =====================

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarFile(file);

        const previewUrl = URL.createObjectURL(file);
        setProfileData(prev => ({
            ...prev,
            avatarPreview: previewUrl
        }));
    };

    // ===================== SAVE PROFILE =====================

    const saveProfileSettings = async () => {
        try {
            const formData = new FormData();
            formData.append("firstName", profileData.firstname);
            formData.append("lastName", profileData.lastname);
            formData.append("username", profileData.username);

            if (avatarFile) {
                formData.append("img", avatarFile);
            }

            const res = await ApiCall(
                `/user/updateInfo/${userId}`,
                { method: "PUT" },
                formData
            );

            toast.success(res.data);
            setAvatarFile(null);
            await getUserInfo();

        } catch (err) {
            toast.error("Xatolik: " + (err.response?.data || "Server error"));
        }
    };

    // ===================== CHANGE PASSWORD =====================

    const changePassword = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword) {
            toast.error("Iltimos barcha maydonlarni to‘ldiring!");
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append("oldPassword", passwordData.oldPassword);
            params.append("newPassword", passwordData.newPassword);

            const res = await ApiCall(
                `/user/settings/${userId}?${params.toString()}`,
                { method: "PUT" }
            );

            toast.success(res.data);
            setPasswordData({ oldPassword: "", newPassword: "" });

        } catch (err) {
            toast.error(err.response?.data || "Parolni o‘zgartirishda xatolik");
        }
    };

    // ===================== JSX =====================

    return (
        <div className="setting-page-s">
            <h1 className="setting-title">Settings</h1>
            <ToastContainer />

            <div className="user-settings-card">

                <div className="profile-section">
                    <h2>Profile settings</h2>

                    <div className="profile-header">
                        <div className="user-avatar-wrapper">
                            {
                                profileData.avatarPreview ? (
                                    <img
                                        src={profileData.avatarPreview}
                                        alt="Preview"
                                        className="user-avatar"
                                    />
                                ) : profileData.imgUrl ? (
                                    <img
                                        src={`${BaseURL}${profileData.imgUrl}`}
                                        alt="User"
                                        className="user-avatar"
                                    />
                                ) : (
                                    <FaRegUserCircle className="icon" />
                                )
                            }
                        </div>

                        <div className="avatar-upload-group">
                            <label htmlFor="avatar-upload" className="upload-label">
                                {avatarFile ? "Boshqa rasm tanlash" : "Rasm yuklash"}
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            {avatarFile && (
                                <span className="file-name">{avatarFile.name}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-groups">
                        <div className="form-group">
                            <label>Ism</label>
                            <input
                                type="text"
                                name="firstname"
                                value={profileData.firstname}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Familiya</label>
                            <input
                                type="text"
                                name="lastname"
                                value={profileData.lastname}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <button
                            className="save-button profile-save"
                            onClick={saveProfileSettings}
                        >
                            Profilni saqlash
                        </button>
                    </div>
                </div>

                <div className="password-section">
                    <h2>Change password</h2>

                    <div className="form-group">
                        <label>Old Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    <button
                        className="save-button password-save"
                        onClick={changePassword}
                    >
                        Parolni saqlash
                    </button>
                </div>

            </div>
        </div>
    );
}

export default SettingsS;
