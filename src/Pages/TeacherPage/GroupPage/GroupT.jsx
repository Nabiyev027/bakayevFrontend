import React, { useState, useEffect } from "react";
import "./groupT.scss";

export default function GroupT() {
  const [groups] = useState([
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
    { id: 3, name: "Group 3" },
    { id: 4, name: "Group 4" },
  ]);

  // Auto-select Group 1 on page load
  const [activeGroup, setActiveGroup] = useState(1);
  const [students] = useState([
    { id: 1, name: "Ali Valiyev", phone: "+998901234567", groupId: 1 },
    { id: 2, name: "Laylo Karimova", phone: "+998909876543", groupId: 2 },
    { id: 3, name: "Sardor Eshonov", phone: "+998933215432", groupId: 1 },
    { id: 4, name: "Bob Smith", phone: "+998901112233", groupId: 3 },
  ]);
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (activeGroup !== null) {
      const groupStudents = students.filter((s) => s.groupId === activeGroup);
      const init = {};
      groupStudents.forEach((s) => {
        init[s.id] = { present: false, note: "" };
      });
      setAttendance(init);
      setSaved(false);
    }
  }, [activeGroup, students]);

  const togglePresent = (id) => {
    setAttendance((prev) => {
      const entry = prev[id] || { present: false, note: "" };
      return { ...prev, [id]: { ...entry, present: !entry.present, note: "" } };
    });
  };

  const handleNote = (id, value) => {
    setAttendance((prev) => {
      const entry = prev[id] || { present: false, note: "" };
      return { ...prev, [id]: { ...entry, note: value } };
    });
  };

  const handleSave = () => setSaved(true);
  const handleEdit = () => setSaved(false);

  return (
    <div className="attendance-page">
      <header className="headerT">
        <h1>Class Attendance</h1>
      </header>

      <div className="layout">
        <div className="table-container">
          {/* Group selection dropdown */}
          <div className="group-select-wrapper">
            <label>Select Group:</label>
            <select
              value={activeGroup}
              onChange={(e) => setActiveGroup(Number(e.target.value))}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="table-boxx">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Present</th>
                  <th>Sabab</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter((s) => s.groupId === activeGroup)
                  .map((st) => {
                    const entry = attendance[st.id] || {
                      present: false,
                      note: "",
                    };
                    return (
                      <tr
                        key={st.id}
                        className={entry.present ? "present" : ""}
                      >
                        <td>{st.id}</td>
                        <td>{st.name}</td>
                        <td>{st.phone}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={entry.present}
                            disabled={saved}
                            onChange={() => togglePresent(st.id)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="note-input"
                            placeholder="Sababni yozing..."
                            value={entry.note}
                            disabled={entry.present || saved}
                            onChange={(e) => handleNote(st.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="controls">
            {!saved ? (
              <button className="save-btn" onClick={handleSave}>
                Save Attendance
              </button>
            ) : (
              <button className="edit-btn" onClick={handleEdit}>
                Edit Attendance
              </button>
            )}
          </div>
        </div>

        {/* Removed aside panel; group selection now via select */}
      </div>
    </div>
  );
}
