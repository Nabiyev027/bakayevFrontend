import React, {useEffect, useState} from 'react';
import "./refundFee.scss"
import ApiCall from "../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify";
import {AnimatePresence, motion} from "framer-motion";

function RefundFee() {
    const [filials,setFilials] = useState([]);
    const [selFilialId, setSelFilialId] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [selTeacherId, setSelTeacherId] = useState("");
    const [groups, setGroups] = useState([]);
    const [selGroupId, setSelGroupId] = useState("");
    const [students, setStudents] = useState([]);
    const [selStudentId, setSelStudentId] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState(0);

    const [refunds, setRefunds] = useState([]);

    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("selectedRole");

    useEffect(() => {
        getFilials();
    }, []);

    useEffect(() => {
        if (!selFilialId) return;
        getTeachersByFilial();
    }, [selFilialId]);

    useEffect(() => {
        if (!selTeacherId) return;
        getGroupsByTeacher();
    }, [selTeacherId]);

    useEffect(() => {
        if (!selGroupId) return;
        getStudents();
    }, [selGroupId]);


    useEffect(() => {
        getRefunds()
    }, [selFilialId,selTeacherId,selGroupId,selStudentId]);

    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"})
            setFilials(res.data)
        } catch (err) {
            toast.error(err.response?.data || "Something went wrong");
        }
    }

    async function getTeachersByFilial() {
        try {
            const res = await ApiCall(`/user/teacher/${selFilialId}`, {method: "GET"});
            setTeachers(res.data || []);
        } catch (err) {
            toast.error(err.response?.data || "Error to get teachers");
        }
    }

    async function getGroupsByTeacher() {
        try {
            const res = await ApiCall(`/group/teacher/${selTeacherId}`, {method: "GET"});
            setGroups(res.data || []);
        } catch (err) {
            toast.error(err.response?.data || "Error to get groups");
        }
    }

    async function getStudents() {
        try {
            const res = await ApiCall(`/user/student?groupId=${selGroupId}`, {
                method: "GET",
            });
            setStudents(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get students!");
        }
    }

    async function getRefunds() {
        try {
            const res = await ApiCall(
                `/refund/get?filialId=${selFilialId}&teacherId=${selTeacherId}&groupId=${selGroupId}&studentId=${selStudentId}`,
                { method: "GET" }
            );
            setRefunds(res.data || []); // ✅ TO‘G‘RI
        } catch (err) {
            toast.error(err.response?.data || "Error to get refunds!");
        }
    }


    async function handleSave() {

        if (!selStudentId) {
            toast.error("Student tanlanmagan");
            return;
        }

        if (!amount || amount <= 0) {
            toast.error("Amount noto‘g‘ri");
            return;
        }

        try {
            const res = await ApiCall("/refund/post", {
                method: "POST"},
                {
                    studentId: selStudentId,
                    receptionId: userId,
                    amount: amount,
            } );

            toast.success(res.data);
            closeModal();
            getRefunds(); // refresh
        } catch (err) {
            toast.error(err.response?.data || "Something went wrong");
        }
    }


    function closeModal() {
        setShowModal(false);
        setAmount("")
    }

    async function deleteRefund(id) {
        try {
            const res = await ApiCall(`/refund/delete/${id}`, {method: "DELETE"});
            toast.success(res.data);
            await getRefunds();
        } catch (err) {
            toast.error(err.response?.data || "Something went wrong");
        }
    }

    return (
        <div className={"refund-page"}>
            <ToastContainer/>
            <h1>Refund fee</h1>
            <div className={"refund-header"}>
                {
                    filials.length > 0 && <select
                        className="filial-select"
                        value={selFilialId || ""}
                        onChange={(e) => setSelFilialId(e.target.value)}
                    >
                        <option value="">Select</option>
                        {filials.map(b => (
                            <option value={b.id} key={b.id}>{b.name}</option>
                        ))}
                    </select>
                }

                <select
                    className="filial-select"
                    value={selTeacherId || ""}
                    onChange={(e) => setSelTeacherId(e.target.value)}
                >
                    <option value="">Select</option>
                    {teachers.map(t => (
                        <option value={t.id} key={t.id}>{t.name}</option>
                    ))}
                </select>

                <select
                    className="filial-select"
                    value={selGroupId || ""}
                    onChange={(e) => setSelGroupId(e.target.value)}
                >
                    <option value="">Select</option>
                    {groups.map(g => (
                        <option value={g.id} key={g.id}>{g.name}</option>
                    ))}
                </select>

                <select
                    className="filial-select"
                    value={selStudentId || ""}
                    onChange={(e) => setSelStudentId(e.target.value)}
                >
                    <option value="">Select</option>
                    {students.map(s => (
                        <option value={s.id} key={s.id}>{s.name}</option>
                    ))}
                </select>

                <button className={"btn"} onClick={()=>setShowModal(true)}>
                    Add+
                </button>

            </div>
            <div className={"table-wrap-refund"}>
                <table className={"refund-table"}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Full name</th>
                        <th>Amount</th>
                        <th>Reception Name</th>
                        <th>Date</th>
                        {
                            (userRole ==="ROLE_ADMIN" || userRole === "ROLE_MAIN_RECEPTION") && <th>Action</th>
                        }

                    </tr>
                    </thead>
                    <tbody>
                    {
                        refunds&&refunds.map((refund,i) => <tr key={refund.id}>
                        <td>{i+1}</td>
                        <td>{refund.studentName}</td>
                        <td>{refund.amount}</td>
                        <td>{refund.receptionName}</td>
                        <td>{refund.date}</td>
                            {
                                (userRole ==="ROLE_ADMIN" || userRole === "ROLE_MAIN_RECEPTION") &&
                                <td>
                                    <button className={"btn-del"} onClick={()=>deleteRefund(refund.id)}>Delete</button>
                                </td>
                            }

                        </tr>)
                    }
                    </tbody>
                </table>
            </div>
            <AnimatePresence>
                {showModal && (
                    <motion.div className="modal-backdrop">
                        <motion.div className="modal">
                            <h2>Refund user fee</h2>

                                <label>
                                    <h4>Amount</h4>
                                    <input
                                        className="inp-d"
                                        type="number"
                                        value={amount}
                                        placeholder="0"
                                        onChange={(e) => setAmount(e.target.value)}
                                    />

                                </label>

                                <div className={"modal-actions"}>
                                    <button className={"btn btn-close"} onClick={closeModal}>Close</button>
                                    <button className="btn btn-add" onClick={handleSave}>Save</button>
                                </div>


                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default RefundFee;