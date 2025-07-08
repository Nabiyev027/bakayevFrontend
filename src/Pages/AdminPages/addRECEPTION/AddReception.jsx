import React, { useState, useEffect, useRef } from "react";
import "./AddReception.scss";
import { FaFileUpload } from "react-icons/fa";
import ApiCall from "../../../Utils/ApiCall";

export default function AddReception() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    phone: "",           // faqat 9 ta raqam (prefiksiz)
    photo: null,
    username: "",
    password: "",
    role: "",
    branchId: "",
    groupId: ""
  });

  const [errors, setErrors] = useState({});
  const [branch, setBranch] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getFilials();
    getGroups();
  }, []);

  async function getGroups() {
    try {
      const res = await ApiCall("/group/getNames", { method: "GET" });
      setGroups(res.data);
    } catch (error) {
      console.error("Gruppalarni olishda xatolik:", error);
    }
  }

  async function getFilials() {
    try {
      const res = await ApiCall("/filial/getAll", { method: "GET" });
      setBranch(res.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  /* ---------- Telefon raqamini formatlash va o‘zgartirish ---------- */
  const formatPhone = (digits) => {
    // 99 999 99 99
    const parts = [
      digits.slice(0, 2),
      digits.slice(2, 5),
      digits.slice(5, 7),
      digits.slice(7, 9)
    ].filter(Boolean);
    return "+998 " + parts.join(" ");
  };

  const handlePhoneChange = (e) => {
    let digits = e.target.value.replace(/\D/g, ""); // faqat raqam
    if (digits.startsWith("998")) digits = digits.slice(3); // foydalanuvchi 998 yozib yuborsa
    if (digits.length > 9) digits = digits.slice(0, 9);     // 9 tadan oshmasin

    setFormData((prev) => ({ ...prev, phone: digits }));
    setErrors((prev) => ({
      ...prev,
      phone: digits.length === 9 ? null : "9 ta raqam kiriting"
    }));
  };
  /* --------------------------------------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((f) => ({ ...f, photo: file }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = "Ism kiriting";
    if (!formData.lastname) e.lastname = "Familiya kiriting";
    if (formData.phone.length !== 9) e.phone = "Telefon 9 ta raqam bo‘lsin";
    if (!formData.username) e.username = "Username kiriting";
    if (!formData.password) e.password = "Parol kiriting";
    if (!formData.role) e.role = "Rolni tanlang";
    if (!formData.branchId) e.branchId = "Filialni tanlang";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) {
      setErrors(ve);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.name);
      formDataToSend.append("lastName", formData.lastname);
      formDataToSend.append("phone", "+998" + formData.phone); // <— prefiks qo‘shildi
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("filialId", formData.branchId);
      formDataToSend.append("groupId", formData.groupId);
      if (formData.photo) formDataToSend.append("image", formData.photo);

      await ApiCall("/auth/registerA", { method: "POST" }, formDataToSend);

      alert("Foydalanuvchi muvaffaqiyatli qo‘shildi!");
      // forma tozalash
      setFormData({
        name: "",
        lastname: "",
        phone: "",
        photo: null,
        username: "",
        password: "",
        role: "",
        branchId: "",
        groupId: ""
      });
      fileInputRef.current.value = null;
      setErrors({});
    } catch (err) {
      console.error("Xatolik:", err);
      alert("Ro‘yxatdan o‘tishda xatolik yuz berdi!");
    }
  };

  return (
      <div className="rec-page">
        <h1>Add Reception</h1>
        <div className="content">
          {/* ------ Rasm yuklash bo‘limi ------ */}
          <div className="image-section">
            <div className="preview-box">
              {formData.photo ? (
                  <img src={URL.createObjectURL(formData.photo)} alt="preview" />
              ) : (
                  <span className="placeholder">
                <FaFileUpload />
              </span>
              )}
            </div>
            <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current.click()}
            >
              Rasmni yuklash
            </button>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFile}
                style={{ display: "none" }}
            />
          </div>

          {/* -------------- Forma -------------- */}
          <div className="form-container">
            <form className="form-grid" onSubmit={handleSubmit}>
              {/* Firstname */}
              <div className="form-group">
                <label>Firstname</label>
                <input
                    name="name"
                    placeholder="Ism..."
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              {/* Lastname */}
              <div className="form-group">
                <label>Lastname</label>
                <input
                    name="lastname"
                    placeholder="Familiya..."
                    value={formData.lastname}
                    onChange={handleChange}
                />
                {errors.lastname && (
                    <span className="error">{errors.lastname}</span>
                )}
              </div>

              {/* Telefon */}
              <div className="form-group">
                <label>Telefon raqami</label>
                <input
                    type="text"
                    placeholder="+998 __ ___ __ __"
                    value={formatPhone(formData.phone)}
                    onChange={handlePhoneChange}
                    maxLength={17}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              {/* Username */}
              <div className="form-group">
                <label>Username</label>
                <input
                    name="username"
                    placeholder="Username..."
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && (
                    <span className="error">{errors.username}</span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Parol..."
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && (
                    <span className="error">{errors.password}</span>
                )}
              </div>

              {/* Filial tanlash */}
              <div className="form-group">
                <label>Filial</label>
                <select
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleChange}
                >
                  <option value="">Choose...</option>
                  {branch.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                  ))}
                </select>
                {errors.branchId && (
                    <span className="error">{errors.branchId}</span>
                )}
              </div>

              {/* Role tanlash */}
              <div className="form-group roles">
                <label>
                  <input
                      type="radio"
                      name="role"
                      value="ROLE_RECEPTION"
                      checked={formData.role === "ROLE_RECEPTION"}
                      onChange={handleChange}
                  />
                  Reception
                </label>

                <label>
                  <input
                      type="radio"
                      name="role"
                      value="ROLE_TEACHER"
                      checked={formData.role === "ROLE_TEACHER"}
                      onChange={handleChange}
                  />
                  Teacher
                </label>
                {errors.role && <span className="error">{errors.role}</span>}
              </div>

              {/* Grup tanlash (faqat o‘qituvchi bo‘lsa) */}
              {formData.role === "ROLE_TEACHER" && (
                  <div className="form-group">
                    <label>Select Group</label>
                    <select
                        name="groupId"
                        value={formData.groupId}
                        onChange={handleChange}
                    >
                      <option value="">Choose...</option>
                      {groups.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                      ))}
                    </select>
                  </div>
              )}

              <button type="submit" className="submit-btn">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}
