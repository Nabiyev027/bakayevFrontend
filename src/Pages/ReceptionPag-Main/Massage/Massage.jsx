import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./Massage.scss";
import { toast, ToastContainer } from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";

export default function Massage() {
  const [groups, setGroups] = useState([]);
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selGroupId, setSelGroupId] = useState("");
  const [selBranchId, setSelBranchId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ mToStudent: "", mToParent: "" });

  // Filiallarni olish
  useEffect(() => {
    getFilials();
  }, []);

  // Guruhlarni filial bo‘yicha olish
  useEffect(() => {
    if (selBranchId) {
      getGroupsByFilial();
    } else {
      setGroups([]);
    }
  }, [selBranchId]);

  // Talabalarni filial va guruh bo‘yicha olish
  useEffect(() => {
    if (selBranchId && selGroupId) {
      getStudentsByGroup();
    } else {
      setStudents([]);
    }
  }, [selBranchId, selGroupId]);

  async function getFilials() {
    try {
      const res = await ApiCall("/filial/getAll", { method: "GET" });
      setBranches(res.data);
    } catch (err) {
      toast.error(err.message || "Branches not found");
    }
  }

  async function getGroupsByFilial() {
    try {
      const res = await ApiCall(`/group?filialId=${selBranchId}`, { method: "GET" });
      setGroups(res.data);
    } catch (err) {
      toast.error(err.response?.data || "Guruhlarni olishda xatolik");
    }
  }

  async function getStudentsByGroup() {
    if (!selBranchId || !selGroupId) return;
    try {
      const res = await ApiCall(
          `/user/studentsForMessage?filialId=${selBranchId}&groupId=${selGroupId}`,
          { method: "GET" }
      );
      setStudents(res.data);
    } catch (err) {
      toast.error(err.response?.data || "Error to get students");
    }
  }

  // Modalni ochish/yopish
  function toggleModal() {
    setIsModalOpen(!isModalOpen);
    setData({ mToStudent: "", mToParent: "" });
  }

  // Xabar yuborish
  async function sendMessage() {
    const selectedStudents = students.filter(s => s.selected);
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student!");
      return;
    }

    const payload = {
      studentsId: selectedStudents.map(s => s.id),
      reportStudent: data.mToStudent,
      reportParent: data.mToParent,
    };

    try {
      await ApiCall("/notification/send",
          { method: "POST" },
          payload,
          {
            "Content-Type": "application/json",
            key: localStorage.getItem("token")?.trim(),
            lang: localStorage.getItem("lang"),
          }
      );

      toast.success("Xabar muvaffaqiyatli yuborildi!");
      toggleModal();
      setStudents(prev => prev.map(s => ({ ...s, selected: false })));
    } catch (err) {
      toast.error(err.response?.data || "Xabar yuborishda xatolik yuz berdi");
    }
  }


  return (
      <div className="message-page">
        <h1>Message</h1>

        <div className="select-wrap-cont">
          {/* Filial select */}
          <label htmlFor="branch-select">
            <h4>Select branch:</h4>
            <select
                id="branch-select"
                value={selBranchId}
                onChange={(e) => setSelBranchId(e.target.value)}
            >
              <option value="">Select</option>
              {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
              ))}
            </select>
          </label>

          {/* Guruh select */}
          <label htmlFor="group-select">
            <h4>Select group:</h4>
            <select
                id="group-select"
                value={selGroupId}
                onChange={(e) => setSelGroupId(e.target.value)}
                disabled={!selBranchId}
            >
              <option value="">Select</option>
              {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
              ))}
            </select>
          </label>
        </div>

        {/* Talabalar jadvali */}
        {students.length > 0 && (
            <table className="studentR-table">
              <thead className="sM-thead">
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Parent phone</th>
                <th>Course payment</th>
                <th>Debt</th>
                <th>Choose</th>
              </tr>
              </thead>
              <tbody className="sM-tbody">
              {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.phone}</td>
                    <td>{student.parentPhone || "-"}</td>
                    <td>{student.paid}</td>
                    <td>{student.debt}</td>
                    <td>
                      <input
                          className="inp-check-box"
                          type="checkbox"
                          value={student.id}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setStudents(prev =>
                                prev.map(s =>
                                    s.id === student.id ? { ...s, selected: checked } : s
                                )
                            );
                          }}
                          checked={student.selected || false}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}

        <button className="send-btn" onClick={toggleModal}>
          Xabar yuborish
        </button>

        {/* Modal */}
        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-body">
                <h2>Send SMS</h2>
                <textarea
                    className="area-message"
                    placeholder="Message To Student"
                    value={data.mToStudent}
                    onChange={(e) => setData({ ...data, mToStudent: e.target.value })}
                />
                <textarea
                    className="area-message"
                    placeholder="Message To Parent"
                    value={data.mToParent}
                    onChange={(e) => setData({ ...data, mToParent: e.target.value })}
                />
                <div className="modal-buttons">
                  <button onClick={toggleModal}>Cancel</button>
                  <button onClick={sendMessage}>Send message</button>
                </div>
              </div>
            </div>
        )}

        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            theme="colored"
        />
      </div>
  );
}
