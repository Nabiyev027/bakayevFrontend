import React, { useEffect, useState } from "react";
import "./infoStudentsList.scss";
import ApiCall from "../../Utils/ApiCall";
import { toast, ToastContainer } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { IoIosUndo } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

function InfoStudentsList() {
    const [showDiscountModal, setShowDiscountModal] = useState(false);

    const [filials, setFilials] = useState([]);
    const [selFilialId, setSelFilialId] = useState("");

    const [groups, setGroups] = useState([]);
    const [selGroupId, setSelGroupId] = useState("");

    const [studentInfos, setStudentInfos] = useState([]);

    const [editingIndex, setEditingIndex] = useState(null);
    const [statusEditValue, setStatusEditValue] = useState("");

    const [selStudentId, setSelStudentId] = useState("");
    const [newDis, setNewDis] = useState({ amount: "", limitMonth: "" });
    const [discounts, setDiscounts] = useState([]);

    const [editingDiscountId, setEditingDiscountId] = useState(null);


    const selectedRole = localStorage.getItem("selectedRole");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        console.log("Mounted:", selectedRole, userId);
    }, []);

    useEffect(() => {
        if (!selectedRole) {
            getFilials();
            return;
        }

        if (selectedRole === "ROLE_RECEPTION") {
            getFilialByReceptionId();
        } else {
            getFilials();
        }
    }, [selectedRole, userId]);

    useEffect(() => {
        if (selFilialId) getGroupsByFilial();
    }, [selFilialId]);

    useEffect(() => {
        if (selGroupId) getStudentsInfoByGroup();
    }, [selGroupId]);

    useEffect(() => {
        if (selStudentId) getStudentDiscounts();
    }, [selStudentId]);

    async function getFilialByReceptionId() {
        try {
            const res = await ApiCall(`/filial/getOne/${userId}`, { method: "GET" });
            setFilials([res.data]);
            setSelFilialId(res.data.id);
        } catch (err) {
            toast.error("Filial not found");
        }
    }

    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", { method: "GET" });
            setFilials(res.data || []);
            if (res.data?.length) setSelFilialId(res.data[0].id);
        } catch {
            toast.error("Error loading filials");
        }
    }

    async function getGroupsByFilial() {
        try {
            const res = await ApiCall(`/group?filialId=${selFilialId}`, { method: "GET" });
            setGroups(res.data || []);
            if (res.data?.length) setSelGroupId(res.data[0].id);
        } catch {
            toast.error("Groups not found");
        }
    }

    async function getStudentsInfoByGroup() {
        try {
            const res = await ApiCall(`/user/studentInfo/${selGroupId}`, { method: "GET" });
            setStudentInfos(res.data || []);
        } catch {
            toast.error("Students not found");
        }
    }

    async function getStudentDiscounts() {
        try {
            const res = await ApiCall(`/user/discount/student/${selStudentId}`, { method: "GET" });
            setDiscounts(res.data || []);
        } catch {
            toast.error("Error loading discounts");
        }
    }

    const handleEdit = (i) => {
        setEditingIndex(i);
        setStatusEditValue(studentInfos[i].status);
    };

    const handleCancel = () => {
        setEditingIndex(null);
    };

    const handleSave = async () => {
        const student = studentInfos[editingIndex];
        try {
            await ApiCall(
                `/user/updateStatus/${student.id}?status=${statusEditValue}&groupId=${selGroupId}`,
                { method: "PUT" }
            );
            toast.success("Status updated");
            setEditingIndex(null);
            getStudentsInfoByGroup();
        } catch {
            toast.error("Error updating status");
        }
    };

    const showStudentDiscount = (id) => {
        setSelStudentId(id);
        setShowDiscountModal(true);
    };

    const handleAddDiscount = async () => {
        if (!newDis.amount || !newDis.limitMonth) {
            toast.warn("Fill all fields");
            return;
        }

        try {
            if (editingDiscountId) {
                await ApiCall(
                    `/user/discount/update/${editingDiscountId}`,
                    { method: "PUT" },
                    {
                        amount: Number(newDis.amount),
                        limitMonth: Number(newDis.limitMonth),
                    }
                );
                toast.success("Discount updated");
            } else {
                // ADD
                await ApiCall(
                    `/user/discount/add/${selStudentId}`,
                    { method: "POST" },
                    {
                        amount: Number(newDis.amount),
                        limitMonth: Number(newDis.limitMonth),
                    }
                );
                toast.success("Discount added");
            }

            setNewDis({ amount: "", limitMonth: "" });
            setEditingDiscountId(null);
            getStudentDiscounts();

        } catch {
            toast.error("Error saving discount");
        }
    };


    const deleteUserDiscount = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this discount?"
        );

        if (!confirmDelete) return;

        try {
            await ApiCall(`/user/discount/${id}`, { method: "DELETE" });
            toast.success("Discount deleted");
            await getStudentDiscounts();
        } catch {
            toast.error("Error deleting discount");
        }
    };


    function closeModal() {
        setShowDiscountModal(false)
        setNewDis({ amount: "", limitMonth: "" });
        setEditingDiscountId(null);
    }

    function editUserDiscount(d) {
        const end = new Date(d.endDate);
        const now = new Date();

        const diffMonth =
            (end.getFullYear() - now.getFullYear()) * 12 +
            (end.getMonth() - now.getMonth());

        setEditingDiscountId(d.id);
        setNewDis({
            amount: d.amount,
            limitMonth: diffMonth > 0 ? diffMonth : ""
        });
    }


    return (
        <div className="infoStudentsList-page">
            <ToastContainer />

            <h2>Student Information</h2>

            <div className="info-header">
                <select
                    className="filial-select"
                    value={selFilialId}
                    onChange={(e) => setSelFilialId(e.target.value)}
                >
                    {filials.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>

                <select
                    className="filial-select"
                    value={selGroupId}
                    onChange={(e) => setSelGroupId(e.target.value)}
                >
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>

            <div className="table-wrap-box">
                <table className="employer-table">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Full name</th>
                        <th>Discount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Debt</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {studentInfos.map((s, i) => (
                        <tr key={s.id}>
                            <td>{i + 1}</td>
                            <td>{s.name}</td>
                            <td>
                                <button className="btn-d" onClick={() => showStudentDiscount(s.id)}>
                                    See discounts
                                </button>
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <select
                                        className="select-status"
                                        value={statusEditValue}
                                        onChange={(e) => setStatusEditValue(e.target.value)}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="LEFT">Left</option>
                                        <option value="GRADUATED">Graduated</option>
                                    </select>
                                ) : (
                                    <span className={`${s.status.toLowerCase()} s`}>
                                            {s.status}
                                        </span>
                                )}
                            </td>
                            <td>{s.paymentStatus}</td>
                            <td>{s.debt}</td>
                            <td>
                                {editingIndex === i ? (
                                    <div className="actions-t">
                                        <div className="t-btn-check btn-t" onClick={handleSave}><FaCheck /></div>
                                        <div className="t-btn-cancel btn-t" onClick={handleCancel}><IoIosUndo /></div>
                                    </div>
                                ) : (
                                    <div className="actions-t">
                                        <div className="t-btn-edit btn-t" onClick={() => handleEdit(i)}><MdEdit /></div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showDiscountModal && (
                    <motion.div className="modal-backdrop">
                        <motion.div className="modal">
                            <h2>Discounts</h2>

                            <div className="wrap-options">
                                <label>
                                    <h4>Amount</h4>
                                    <input
                                        className="inp-d"
                                        type="number"
                                        value={newDis.amount}
                                        placeholder={"0"}
                                        onChange={(e) => setNewDis({ ...newDis, amount: e.target.value })}
                                    />
                                </label>
                                <label>
                                    <h4>Limit</h4>
                                    <select
                                        className="select"
                                        value={newDis.limitMonth}
                                        onChange={(e) => setNewDis({ ...newDis, limitMonth: e.target.value })}
                                    >
                                        <option value="">Select limit</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1} month</option>
                                        ))}
                                    </select>
                                </label>

                                <button className="btn-add" onClick={handleAddDiscount}>
                                    {editingDiscountId ? "Update" : "Add"}
                                </button>

                            </div>

                            {discounts.length === 0 ? (
                                <div className={"discounts-wrap"}>
                                    <h2>No any discount!</h2>
                                </div>

                                )  :
                                <div className="discounts-wrap">
                                {discounts.map(d => (
                                <div className={"dis-card"} key={d.id}>
                                    <h3>{d.amount}</h3>
                                    <p>{d.endDate}</p>
                                    <div>{d.active ? "Active" : "Completed"}</div>
                                    <div className={"actions-d"}>
                                    <button className={"btn btn-e"} onClick={()=>editUserDiscount(d)} >edit</button>
                                    <button className={"btn btn-d"} onClick={() => deleteUserDiscount(d.id)}>delete</button>
                                    </div>
                                </div>
                                    ))}
                                </div>
                            }

                            <button className={"btn-close"} onClick={closeModal}>Close</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default InfoStudentsList;
