import React, { useState } from "react";
import "./settingA.scss";

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

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAdmin((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewName = () => {
    if (newName.trim() === "") {
      setError("Name cannot be empty.");
      return;
    }
    setAdmin((prev) => ({ ...prev, name: newName }));
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
    setAdmin((prev) => ({ ...prev, password: newPassword }));
    resetPasswordEditing();
  };

  const resetPasswordEditing = () => {
    setIsEditingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setError("");
  };

  return (
    <div className="setting-page">
      <h1>Settings</h1>
      <div className="setting-box">
        {/* Avatar with hover overlay */}
        <label className="avatar-container">
          <img src={admin.avatar} alt="Admin Avatar" className="avatar-img" />
          <div className="avatar-overlay">📷</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
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
    </div>
  );
}
