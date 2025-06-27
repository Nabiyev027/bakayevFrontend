// Massage.jsx
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Massage.scss";

export default function Massage() {
  const groups = [
    { id: 1, name: "Group A" },
    { id: 2, name: "Group B" },
    { id: 3, name: "Group C" },
  ];

  const studentData = {
    1: [
      {
        id: 101,
        name: "Alice",
        number: "U123",
        parent: "+998901234567",
        paid: true,
        amount: 900000,
      },
      {
        id: 102,
        name: "Bob",
        number: "U124",
        parent: "+998909876543",
        paid: false,
        amount: 450000,
      },
    ],
    2: [
      {
        id: 201,
        name: "Charlie",
        number: "U125",
        parent: "+998901112233",
        paid: true,
        amount: 900000,
      },
    ],
    330: [],
  };

  const [selectedGroup, setSelectedGroup] = useState("");
  const [checkedStudents, setCheckedStudents] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToStudent, setMessageToStudent] = useState("");
  const [messageToParent, setMessageToParent] = useState("");

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    setCheckedStudents({});
    setExpandedRows({});
  };

  const handleCheck = (id) => {
    setCheckedStudents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const sendMessages = (type) => {
    const targets = Object.entries(checkedStudents)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
    if (!targets.length) {
      toast.error("Iltimos, kamida bitta o'quvchini tanlang", {
        theme: "colored",
      });
      return;
    }
    toast(
      `Xabar ${type === "student" ? "o'quvchiga" : "otasiga/onaga"} yuborildi!`,
      { theme: "colored" }
    );
    closeModal();
    setMessageToStudent("");
    setMessageToParent("");
    setCheckedStudents({});
  };

  const students = selectedGroup ? studentData[selectedGroup] || [] : [];

  return (
    <div className="message-page">
      <h1>Message</h1>

      <div className="select-container">
        <label htmlFor="group-select">Select Group:</label>
        <select
          id="group-select"
          value={selectedGroup}
          onChange={handleGroupChange}
        >
          <option value="">-- Tanlang --</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && (
        <table className="students-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="info-col">Info</th>
              <th className="hide-mobile">Number</th>
              <th className="hide-mobile">Parent</th>
              <th className="hide-mobile">Paid</th>
              <th className="hide-mobile">Select</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <tr className={idx % 2 === 0 ? "even" : "odd"}>
                    <td>{idx + 1}</td>
                    <td>{s.name}</td>
                    <td className="info-col">
                      <button
                        className="info-btn"
                        onClick={() => toggleRow(s.id)}
                      >
                        Info
                      </button>
                    </td>
                    <td className="hide-mobile">{s.number}</td>
                    <td className="hide-mobile">{s.parent}</td>
                    <td className="hide-mobile">
                      {s.paid
                        ? "Ha"
                        : `Yo'q, to'langan: ${s.amount.toLocaleString()}`}
                    </td>
                    <td className="hide-mobile">
                      <input
                        type="checkbox"
                        checked={!!checkedStudents[s.id]}
                        onChange={() => handleCheck(s.id)}
                      />
                    </td>
                  </tr>
                  {expandedRows[s.id] && (
                    <tr className="expanded-row">
                      <td colSpan={7}>
                        <div className="expanded-content">
                          <p>
                            <strong>Number:</strong> {s.number}
                          </p>
                          <p>
                            <strong>Parent:</strong> {s.parent}
                          </p>
                          <p>
                            <strong>Paid:</strong>{" "}
                            {s.paid
                              ? "Ha"
                              : `Yo'q, to'langan: ${s.amount.toLocaleString()}`}
                          </p>
                          <p>
                            <strong>Select:</strong>{" "}
                            <input
                              type="checkbox"
                              checked={!!checkedStudents[s.id]}
                              onChange={() => handleCheck(s.id)}
                            />
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-data">
                  Bu guruhda o'quvchi yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <button className="send-btn" onClick={openModal}>
        Xabar yuborish
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>
              x
            </button>
            <h2>Xabarnoma yuborish</h2>
            <textarea
              placeholder="O'quvchiga xabar"
              value={messageToStudent}
              onChange={(e) => setMessageToStudent(e.target.value)}
            />
            <textarea
              placeholder="Ota/Onaga xabar"
              value={messageToParent}
              onChange={(e) => setMessageToParent(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => sendMessages("student")}>
                O'quvchiga yuborish
              </button>
              <button onClick={() => sendMessages("parent")}>
                Ota/Onaga yuborish
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
