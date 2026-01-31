import React, { useState, useEffect } from "react";
import "./adminsControl.scss";
import ApiCall from "../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

export default function AdminsControl() {
    const [admins, setAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});

    // Modal form fields
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
    });

    const [editId, setEditId] = useState(null); // null bo'lsa ADD, id bo'lsa EDIT

    useEffect(() => {
        getAdmins();
    }, []);

    async function getAdmins() {
        try {
            const res = await ApiCall(`/user/admins`, { method: "GET" });
            setAdmins(res.data);
        } catch (err) {
            toast.error(err.message || "Admins not found");
        }
    }

    // Modalni ochish (add)
    const openAddModal = () => {
        setForm({
            firstName: "",
            lastName: "",
            username: "",
            password: ""
        });
        setEditId(null);
        setShowModal(true);
    };

    // Edit modalni ochish
    const openEditModal = (admin) => {
        setForm({
            firstName: admin.firstName,
            lastName: admin.lastName,
            username: admin.username,
            password: ""
        });
        setEditId(admin.id);
        setShowModal(true);
    };

    // Input handler
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    function validateForm() {
        if (!form.firstName.trim()) {
            toast.error("First Name is required");
            return false;
        }
        if (!form.lastName.trim()) {
            toast.error("Last Name is required");
            return false;
        }
        if (!form.username.trim()) {
            toast.error("Username is required");
            return false;
        }
        return true;
    }

    // Add yoki Update admin
    const handleSaveAdmin = async (e) => {
        e.preventDefault();

        // Frontend validation
        const newErrors = {};

        // Common fields doimiy tekshiruv
        ["firstName", "lastName", "username"].forEach((field) => {
            if (!form[field] || form[field].trim() === "") {
                newErrors[field] = `${field} bo‘sh bo‘lishi mumkin emas`;
            }
        });

        // Agar ADD rejimida bo'lsa, password majburiy
        if (!editId && (!form.password || form.password.trim() === "")) {
            newErrors.password = "Password bo‘sh bo‘lishi mumkin emas";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Iltimos, formani to‘g‘ri to‘ldiring!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("firstName", form.firstName);
            formData.append("lastName", form.lastName);
            formData.append("username", form.username);

            // Password faqat to‘ldirilgan bo‘lsa yuboriladi
            if (form.password && form.password.trim()) {
                formData.append("password", form.password);
            }

            let url = "/auth/registerForSuper";
            let method = "POST";

            if (editId) {
                url = `/auth/updateForSuper/${editId}`;
                method = "PUT";
            }

            await ApiCall(url, { method }, formData);

            toast.success(editId ? "Admin muvaffaqiyatli yangilandi!" : "Admin muvaffaqiyatli qo‘shildi!");
            setShowModal(false);
            await getAdmins();

            // Formani reset qilish
            setForm({
                firstName: "",
                lastName: "",
                username: "",
                password: ""
            });
            setErrors({});
            setEditId(null);
        } catch (err) {
            toast.error(err.message || "Xatolik yuz berdi!");
        }
    };

    async function handleDeleteAdmin(id) {
        try {
            const res = await ApiCall(`/user/delete/${id}`, { method: "DELETE" });
            await getAdmins()
            toast.success(res.data);
        }catch (err){
            toast.error(err.response.data)
        }
    }


    return (
        <div className="adminsControl-page">
            <ToastContainer autoClose={"1350"} />

            <button className="add-btn" onClick={openAddModal}>
                Add admin
            </button>

            <div className="wrap-adm">
                {admins && admins.map((ad) =>
                    <div className="adm-card" key={ad.id}>
                        <FaUserCircle className="img-icon" />

                        <h2>
                            Full Name:
                            <br />
                            <span>{ad.firstName + " " + ad.lastName}</span>
                        </h2>

                        <h3>
                            Username:
                            <span>{ad.username}</span>
                        </h3>

                        <div className="wrap-btns">
                            <button className="btn e" onClick={() => openEditModal(ad)}>
                                Edit
                            </button>
                            <button className="btn d" onClick={()=>handleDeleteAdmin(ad.id)}>Delete</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= MODAL ================= */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editId ? "Edit Admin" : "Add Admin"}</h2>

                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        <div className="modal-btns">
                            <button
                                className="btn save"
                                onClick={handleSaveAdmin}
                            >
                                {editId ? "Save Changes" : "Add Admin"}
                            </button>

                            <button className="btn cancel" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
