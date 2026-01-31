import {useEffect, useState} from "react";
import "./SettingsS.scss";
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";
import {FaRegUserCircle} from "react-icons/fa";

function SettingsS() {

    const userId = localStorage.getItem("userId");
    const BaseURL = "http://localhost:8080"

    const [userInitialData, setUserInitialData] = useState({});
    const [profileData, setProfileData] = useState({
        firstname: userInitialData.firstname || '',
        lastname: userInitialData.lastname || '',
        username: userInitialData.username || '',
        imgUrl: userInitialData.imgUrl || '',
    });

    useEffect(() => {
        getUserInfo()
    }, [userId])

    useEffect(() => {
        setProfileData({
            firstname: userInitialData.firstName || '',
            lastname: userInitialData.lastName || '',
            username: userInitialData.username || '',
            imgUrl: userInitialData.imgUrl || '',
        });
    }, [userInitialData]);


    async function getUserInfo() {
        try {
            const res = await ApiCall(`/user/getInfo/${userId}`, {method: "GET"})
            setUserInitialData(res.data);
        } catch (err) {
            toast.error(err.response.data);
        }
    }



    // Rasm fayli uchun yangi holat
    const [avatarFile, setAvatarFile] = useState(null);

    // Parol o'zgartirish uchun holat (avvalgidek qoladi)
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
    });

    // --- Input o'zgarishini boshqarish funksiyalari ---

    const handleProfileChange = (e) => {
        const {name, value} = e.target;
        setProfileData(prevData => ({...prevData, [name]: value}));
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswordData(prevData => ({...prevData, [name]: value}));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarFile(file);

        // Preview
        const previewUrl = URL.createObjectURL(file);
        setProfileData(prev => ({
            ...prev,
            avatarUrl: previewUrl
        }));
    };


    const saveProfileSettings = async () => {
        try {
            const formData = new FormData();
            formData.append("firstName", profileData.firstname);
            formData.append("lastName", profileData.lastname);
            formData.append("username", profileData.username);

            if (avatarFile) {
                formData.append("img", avatarFile);
            }

            const res = await ApiCall(`/user/updateInfo/${userId}`, {method: "PUT"}, formData);

            toast.success(res.data);
            await getUserInfo(); // yangi rasmni backenddan qayta olish

        } catch (err) {
            toast.error("Xatolik: " + err.response?.data);
        }
    };


    const changePassword = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword) {
            toast.error("Iltimos, barcha maydonlarni to‘ldiring!");
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append("oldPassword", passwordData.oldPassword);
            params.append("newPassword", passwordData.newPassword);

            const res = await ApiCall(`/user/settings/${userId}?${params.toString()}`, { method: "PUT" });

            toast.success(res.data);
            // Clear password fields after success
            setPasswordData({ oldPassword: "", newPassword: "" });
        } catch (err) {
            toast.error(err.response?.data || "Xatolik yuz berdi");
        }
    };



    return (
        <div className="setting-page-s">
            <h1 className="setting-title">Settings</h1>

            <ToastContainer/>

            <div className="user-settings-card">

                {/* --- Profil Ma'lumotlari Qismi (Rasm qo'shildi) --- */}
                <div className="profile-section">
                    <h2>Profile settings</h2>

                    <div className="profile-header">
                                    <div className="user-avatar-wrapper">
                                        {
                                            profileData.avatarUrl ? (
                                                // Preview rasm (yangi yuklangan)
                                                <img
                                                    src={profileData.avatarUrl}
                                                    alt="Preview"
                                                    className="user-avatar"
                                                />
                                            ) : profileData.imgUrl ? (
                                                // Backenddan kelgan eski rasm
                                                <img
                                                    src={`${BaseURL}${profileData.imgUrl}`}
                                                    alt="User Image"
                                                    className="user-avatar"
                                                />
                                            ) : (
                                                <FaRegUserCircle className="icon"/>
                                            )
                                        }

                                    </div>




                        {/* Rasm tanlash inputi */}
                        <div className="avatar-upload-group">
                            <label htmlFor="avatar-upload" className="upload-label">
                                {avatarFile ? 'Boshqa rasmni tanlash' : 'Rasmni yuklash'}
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{display: 'none'}} // Inputni yashirish
                            />
                            {avatarFile && <span className="file-name">{avatarFile.name}</span>}
                        </div>
                    </div>

                    <div className={"form-groups"}>
                        <div className="form-group">
                            <label htmlFor="firstname">Ism (Firstname)</label>
                            <input
                                id="firstname" type="text" name="firstname"
                                value={profileData.firstname} onChange={handleProfileChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastname">Familiya (Lastname)</label>
                            <input
                                id="lastname" type="text" name="lastname"
                                value={profileData.lastname} onChange={handleProfileChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username" type="text" name="username"
                                value={profileData.username} onChange={handleProfileChange}
                            />
                        </div>

                        <button className="save-button profile-save" onClick={saveProfileSettings}>
                            Profilni Saqlash
                        </button>
                    </div>

                </div>

                {/* --- Parolni O'zgartirish Qismi (O'zgarmadi) --- */}
                <div className="password-section">
                    <h2>Change password</h2>

                    <div className="form-group">
                        <label htmlFor="oldPassword">Joriy Parol (Old Password)</label>
                        <input
                            id="oldPassword" type="text" name="oldPassword"
                            value={passwordData.oldPassword} onChange={handlePasswordChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Yangi Parol (New Password)</label>
                        <input
                            id="newPassword" type={"text"} name="newPassword"
                            value={passwordData.newPassword} onChange={handlePasswordChange}
                        />
                    </div>

                    <button className="save-button password-save" onClick={changePassword}>
                        Parolni Saqlash
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsS;
