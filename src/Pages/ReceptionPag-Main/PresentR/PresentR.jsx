/* PresentR.jsx */
import React, { useState } from "react";
import "./PresentR.scss";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// Initial data for groups and students
const initialGroups = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `Guruh ${i + 1}`,
  students: Array.from({ length: 6 }, (_, j) => ({
    id: j + 1,
    name: `O'quvchi ${j + 1}`,
    phone: `+998 90 000 000${j}`,
    present: Math.random() > 0.5,
    reason: "",
  })),
  editing: true,
}));

export default function PresentR() {
  const [groups, setGroups] = useState(initialGroups);
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (id) => {
    setOpenGroup(openGroup === id ? null : id);
  };

  const handleCheckbox = (groupId, studentId) => {
    setGroups(
      groups.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          students: group.students.map((std) =>
            std.id === studentId
              ? { ...std, present: !std.present, reason: "" }
              : std
          ),
        };
      })
    );
  };

  const handleReasonChange = (groupId, studentId, value) => {
    setGroups(
      groups.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          students: group.students.map((std) =>
            std.id === studentId ? { ...std, reason: value } : std
          ),
        };
      })
    );
  };

  const saveGroup = (groupId) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, editing: false } : group
      )
    );
  };

  const editGroup = (groupId) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, editing: true } : group
      )
    );
  };

  return (
    <div className="Present-page">
      <h1>Davomat</h1>
      <div className="groups-list">
        {groups.map((group) => (
          <div key={group.id} className="group-item">
            <div className="group-header">
              <button
                className="group-toggle"
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.name}</span>
                {openGroup === group.id ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              <div className="group-actions">
                {group.editing ? (
                  <button
                    className="save-btn"
                    onClick={() => saveGroup(group.id)}
                  >
                    Saqlash
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => editGroup(group.id)}
                  >
                    Tahrirlash
                  </button>
                )}
              </div>
            </div>

            <div
              className={`students-list ${
                openGroup === group.id ? "open" : "closed"
              }`}
            >
              {group.students.map((std) => (
                <div key={std.id} className="student-card">
                  <div className="info">
                    <p className="name">{std.name}</p>
                    <p className="phone">{std.phone}</p>
                  </div>
                  <div className="attendance">
                    <label>
                      <input
                        type="checkbox"
                        checked={std.present}
                        disabled={!group.editing}
                        onChange={() => handleCheckbox(group.id, std.id)}
                      />{" "}
                      Present
                    </label>
                    <input
                      type="text"
                      className="reason"
                      placeholder="Sababni yozing..."
                      value={std.reason}
                      disabled={std.present || !group.editing}
                      onChange={(e) =>
                        handleReasonChange(group.id, std.id, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
