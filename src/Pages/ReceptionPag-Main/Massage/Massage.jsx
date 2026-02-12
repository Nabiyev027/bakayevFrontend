import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./Massage.scss";
import { toast, ToastContainer } from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";
import CustomMsgSelect from "./CustomMsgSelect";

export default function Massage() {
  const [groups, setGroups] = useState([]);
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selGroupId, setSelGroupId] = useState("");
  const [selBranchId, setSelBranchId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ msgToStudent: false, msgToParent: false });
  const [msgTexts, setMsgTexts] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);


  // Filiallarni olish
  useEffect(() => {
    getFilials();
    getMessageTexts();
  }, []);

  // Guruhlarni filial bo‘yicha olish
  useEffect(() => {
    if (selBranchId) {
      getGroupsByFilial();
    } else {
      setGroups([]);
    }
  }, [selBranchId]);

  async function getMessageTexts() {
    try {
      const res = await ApiCall("/message", { method: "GET" });
      setMsgTexts(res.data || []);
    } catch (err) {
      console.error(err.response.data ||"Error to get Message texts");
    }
  }


  async function handleAddMsg(newText) {
    try {
      // Backend @RequestBody String description kutayotgani uchun
      // oddiy string formatida yuboramiz
      const res = await ApiCall("/message", { method: "POST" }, newText, {
        "Content-Type": "application/json"
      });
      toast.success(res.data);
      getMessageTexts();
    } catch (err) {
      toast.error("Qo'shishda xatolik");
    }
  }

  async function handleDeleteMsg(id) {
    try {
      await ApiCall(`/message/${id}`, { method: "DELETE" });
      toast.success("Matn o'chirildi");
      getMessageTexts(); // Ro'yxatni yangilash
    } catch (err) {
      toast.error("O'chirishda xatolik");
    }
  }

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
      toast.error("Iltimos, kamida bitta talabani tanlang!");
      return;
    }

    if (!data.msgToStudent && !data.msgToParent) {
      toast.error("Kamida bitta yo'nalishni tanlang (Talaba yoki Ota-ona)!");
      return;
    }

    if (!selectedMsg) {
      toast.error("Xabar matnini tanlang!");
      return;
    }

    // Backend kutayotgan NotificationDto formatiga mos payload
    const payload = {
      studentsId: selectedStudents.map(s => s.id), // List<String>
      msgToStudent: data.msgToStudent,             // boolean
      msgToParent: data.msgToParent,               // boolean
      messageTextId: selectedMsg.id                // UUID
    };

    try {
      await ApiCall("/notification/send",
          { method: "POST" },
          payload,
          {
            "Content-Type": "application/json",
            // Tokenni headerda yuborish (agar ApiCall o'zi qo'shmasa)
            key: localStorage.getItem("token")?.trim(),
          }
      );

      toast.success("Xabar muvaffaqiyatli yuborildi!");
      toggleModal();
      // Tanlangan talabalarni tozalash
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
          <button className="send-msg-btn" onClick={toggleModal}>
            Xabar yuborish
          </button>
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



        {/* Modal */}
        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-body">
                <h2>Send SMS</h2>

                <CustomMsgSelect
                    msgTexts={msgTexts}
                    onSelect={setSelectedMsg}
                    onAdd={handleAddMsg}      // Yangi xabar qo'shish funksiyasi
                    onDelete={handleDeleteMsg} // O'chirish funksiyasi
                />

                <label>
                <h3>To Students</h3>
                <input
                    className="inp-check"
                    type="checkbox"
                    checked={data.msgToStudent}
                    onChange={(e) =>
                        setData(prev => ({ ...prev, msgToStudent: e.target.checked }))
                    }
                />
              </label>

              <label>
                <h3>To Parents</h3>
                <input
                    className="inp-check"
                    type="checkbox"
                    checked={data.msgToParent}
                    onChange={(e) =>
                        setData(prev => ({ ...prev, msgToParent: e.target.checked }))
                    }
                />
              </label>


                <div className="modal-buttons">
                  <button className={"btn"} onClick={toggleModal}>Cancel</button>
                  <button className={"btn"} onClick={sendMessage}>Send message</button>
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
