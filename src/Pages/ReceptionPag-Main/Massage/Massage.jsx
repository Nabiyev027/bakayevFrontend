import React, {useEffect, useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import "./Massage.scss";
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";

export default function Massage() {
  const [groups, setGroups] = useState([]);
  const [branches, setBranches] = useState([]);
  const [students,setStudents] = useState([]);
  const [selGroupId, setSelGroupId] = useState("");
  const [selBranchId, setSelBranchId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({mToStudent:"", mToParent:""});

  useEffect(() => {
    getFilials()
  }, []);

  async function getFilials() {
    try {
      const res = await ApiCall("/filial/getAll", {method: "GET"});
      setBranches(res.data);
    } catch (err) {
      const res = err.message || "Branches not found";
      toast.error(res);
    }

  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
    setData({mToStudent:"", mToParent:""});
  }

  return (
    <div className="message-page">
      <h1>Message</h1>

      <div className="select-wrap-cont">
        <label htmlFor="branch-select">
          <h4>Select branch:</h4>
          <select
              id="branch-select"
              value={selBranchId}
          >
            <option value="">Select</option>
            {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
            ))}
          </select>
        </label>
        <label htmlFor="group-select">
          <h4>Select group:</h4>
          <select
              id="group-select"
              value={selGroupId}
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

      {selGroupId==="" && (
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

          </tbody>
        </table>
      )}

      <button className="send-btn" onClick={toggleModal}>
        Xabar yuborish
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-body">
            <h2>Send SMS</h2>
            <textarea className={"area-message"}
              placeholder="Message To Student"
              value={data.mToStudent}
              onChange={(e) => setData({...data, mToStudent:e.target.value})}
            />
            <textarea className={"area-message"}
              placeholder="Message To Parent"
              value={data.mToParent}
              onChange={(e) => setData({...data, mToParent:e.target.value})}
            />
            <div className="modal-buttons">
              <button onClick={toggleModal}>
                Cancel
              </button>
              <button>
                Send message
              </button>
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
