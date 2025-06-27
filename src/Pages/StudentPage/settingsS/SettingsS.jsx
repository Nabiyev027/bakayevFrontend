import { useState } from "react";
import "./SettingsS.scss";

function SettingsS() {
  const [user, setUser] = useState({
    name: "John Doe",
    password: "secret123",
    avatar:
      "https://shapka-youtube.ru/wp-content/uploads/2021/02/avatarka-dlya-skaypa-dlya-parney.jpg", // default avatar
  });

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");

  const [error, setError] = useState("");

  const handleSaveNewPassword = () => {
    if (oldPassword !== user.password) {
      setError("Old password is incorrect.");
      return;
    }
    if (newPassword.trim() === "") {
      setError("New password cannot be empty.");
      return;
    }
    setUser({ ...user, password: newPassword });
    resetPasswordEditing();
  };

  const resetPasswordEditing = () => {
    setIsEditingPassword(false);
    setOldPassword("");
    setNewPassword("");
    setError("");
  };

  const handleSaveNewName = () => {
    if (newName.trim() === "") {
      setError("Name cannot be empty.");
      return;
    }
    setUser({ ...user, name: newName });
    setIsEditingName(false);
    setNewName("");
    setError("");
  };

  const resetNameEditing = () => {
    setIsEditingName(false);
    setNewName("");
    setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="setting-page">
      <h1 className="setting-title">Settings</h1>
      <div className="setting-card">
        <label htmlFor="avatar-input" className="avatar">
          <img src={user.avatar} alt="Avatar" />
          <div className="avatar-overlay">Change</div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </label>

        {/* Name update */}
        <div className="info-row">
          <span className="label">Name:</span>
          {isEditingName ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-edit"
                placeholder={user.name}
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
              <span className="value">{user.name}</span>
              <button
                className="action-btn"
                onClick={() => {
                  setIsEditingName(true);
                  setNewName(user.name);
                  setError("");
                }}
              >
                Change Name
              </button>
            </>
          )}
        </div>

        {/* Password update */}
        <div className="info-row">
          {isEditingPassword ? (
            <>
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
                  <button
                    className="action-btn"
                    onClick={handleSaveNewPassword}
                  >
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
            </>
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

        {/* Error display */}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default SettingsS;
