import React, {useState, useRef, useEffect} from "react";
import "./AddReception.scss";
import { FaFileUpload } from "react-icons/fa";
import ApiCall from "../../../Utils/ApiCall";
import {form} from "framer-motion/m";

export default function AddReception() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    number: "+998 ",
    photo: null,
    username: "",
    password: "",
    role: "",
    branch: "",
  });

  const [errors, setErrors] = useState({});
  const [branch,setBranch] = useState([]);

  useEffect(() => {
    getFilials()
  }, []);

  async function getFilials() {
    try {
      const res = await ApiCall("/filial/get", { method: "GET" });
      setBranch(res.data);
    }catch (error) {
      console.log(error.message);
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      let digits = value.replace(/\D/g, "").slice(0, 12);
      if (!digits.startsWith("998"))
        digits = "998" + digits.replace(/^998/, "");
      const parts = [
        digits.slice(0, 3),
        digits.slice(3, 5),
        digits.slice(5, 8),
        digits.slice(8, 10),
        digits.slice(10, 12),
      ].filter((p) => p);
      setFormData((f) => ({ ...f, number: "+" + parts.join(" ") }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((f) => ({ ...f, photo: file }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = "Ism kiriting";
    if (!formData.lastname) e.lastname = "Familiya kiriting";
    if (!/^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(formData.number))
      e.number = "Telefon +998 99 999 99 99 formatida bo‘lsin";
    if (!formData.username) e.username = "Username kiriting";
    if (!formData.password) e.password = "Parol kiriting";
    if (!formData.role) e.role = "Rolni tanlang";
    if (!formData.branch) e.branch = "Filialni tanlang";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) {
      setErrors(ve);
    } else {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("firstName", formData.name);
        formDataToSend.append("lastName", formData.lastname);
        formDataToSend.append("phone", formData.number);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("role", formData.role);
        formDataToSend.append("filialId", formData.branch);

        if (formData.photo) {
          formDataToSend.append("image", formData.photo);
        }

        const res = await ApiCall(
            "/auth/registerA",
            { method: "POST" },
            formDataToSend
        );

        alert("Foydalanuvchi muvaffaqiyatli qo‘shildi!");
        console.log("Server javobi:", res.data);
        setFormData({
          name: "",
          lastname: "",
          number: "+998 ",
          photo: null,
          username: "",
          password: "",
          role: "",
          branch: "",
        });
        fileInputRef.current.value = null;
      } catch (err) {
        console.error("Xatolik:", err);
        alert("Ro‘yxatdan o‘tishda xatolik yuz berdi!");
      }
    }
  };

  return (
      <div className="rec-page">
        <h1>Add Reception</h1>
        <div className="content">
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

          <div className="form-container">
            <form className="form-grid" onSubmit={handleSubmit}>
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

              <div className="form-group">
                <label>Telefon raqami</label>
                <input
                    name="number"
                    placeholder="+998 99 999 99 99"
                    value={formData.number}
                    onChange={handleChange}
                />
                {errors.number && <span className="error">{errors.number}</span>}
              </div>

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

              <div className="form-group">
                <label>Filial</label>
                <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                >
                  <option value="">Tanlang...</option>
                  {
                    branch&&branch.map((item) =>
                      <option value={item.id}>{item.name}</option>)
                  }
                </select>
                {errors.branch && (
                    <span className="error">{errors.branch}</span>
                )}
              </div>

              <div className="form-group roles">
                <label>
                  <input
                      type="radio"
                      name="role"
                      value="reception"
                      checked={formData.role === "reception"}
                      onChange={handleChange}
                  />
                  Reception
                </label>

                <label>
                  <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={formData.role === "teacher"}
                      onChange={handleChange}
                  />
                  Teacher
                </label>

                {errors.role && <span className="error">{errors.role}</span>}
              </div>

              <button type="submit" className="submit-btn">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}
