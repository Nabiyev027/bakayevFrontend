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

  useEffect(() => {
    getFilials();
  }, []);

  useEffect(() => {
    if (selBranchId) {
      getGroupsByFilial();
    } else {
      setGroups([]); // filial tanlanmasa, group tozalanadi
    }
  }, [selBranchId]);

  useEffect(() => {
    if (selBranchId) {
      getStudentsByGroup()
    }
  }, []);

  async function getFilials() {
    try {
      const res = await ApiCall("/filial/getAll", { method: "GET" });
      setBranches(res.data);
    } catch (err) {
      const res = err.message || "Branches not found";
      toast.error(res);
    }
  }

  async function getGroupsByFilial() {
    try {
      const res = await ApiCall(`/group?filialId=${selBranchId}`, {
        method: "GET",
      });
      setGroups(res.data);
    } catch (err) {
      toast.error(err.response?.data || "Guruhlarni olishda xatolik");
    }
  }

  async function getStudentsByGroup() {
    try {
      const res = await ApiCall(`/user/studentsForMessage?groupId=${selGroupId}`, {
        method: "GET",
      });
      setStudents(res.data);
    } catch (err) {
      toast.error(err.response?.data || "Talabalarni olishda xatolik");
    }
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
    setData({ mToStudent: "", mToParent: "" });
  }

  return (
      <div className="message-page">
        <h1>Message</h1>

        <div className="select-wrap-cont">
          {/* Branch select */}
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

          {/* Group select */}
          <label htmlFor="group-select">
            <h4>Select group:</h4>
            <select
                id="group-select"
                value={selGroupId}
                onChange={(e) => setSelGroupId(e.target.value)}
                disabled={!selBranchId} // filial tanlanmasa group select bloklanadi
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

        {/* Jadval — faqat group tanlanganda chiqsin */}
        {selGroupId !== "" && (
            <table className="students-table">
              <thead className={"sM-thead"}>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Phone 1</th>
                <th>Phone 2</th>
                <th>Course payment</th>
                <th>Debt</th>
                <th>Choose</th>
              </tr>
              </thead>
              <tbody className={"sM-tbody"}>
              {/* Hozircha studentlar bo‘sh, lekin keyinchalik fetch qilinadi */}
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
                    onChange={(e) =>
                        setData({ ...data, mToStudent: e.target.value })
                    }
                />
                <textarea
                    className="area-message"
                    placeholder="Message To Parent"
                    value={data.mToParent}
                    onChange={(e) => setData({ ...data, mToParent: e.target.value })}
                />
                <div className="modal-buttons">
                  <button onClick={toggleModal}>Cancel</button>
                  <button>Send message</button>
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
