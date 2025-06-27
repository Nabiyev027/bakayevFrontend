import React, { useState, useRef, useEffect } from "react";
import { FiCheck } from "react-icons/fi";
import "./lessonsT.scss";

export default function LessonsT() {
  const [selectedGroup, setSelectedGroup] = useState("1");
  const groups = [
    { id: "1", name: "Group 1" },
    { id: "2", name: "Group 2" },
    { id: "3", name: "Group 3" },
  ];

  const [lessons, setLessons] = useState([
    { id: "1", GroupId: "1", startTime: "10:00", endTime: "11:00" },
    { id: "2", GroupId: "2", startTime: "11:15", endTime: "12:15" },
  ]);

  const students = [
    {
      id: "1",
      name: "Fadriddinov Fazliddin",
      GroupId: "1",
      phone: "+998930676146",
    },
    { id: "2", name: "Jane Smith", GroupId: "1", phone: "+998930676146" },
    { id: "3", name: "Bob Brown", GroupId: "2", phone: "+998930676146" },
    { id: "4", name: "Alice Green", GroupId: "2", phone: "+998930676146" },
    { id: "5", name: "Charlie Black", GroupId: "3", phone: "+998930676146" },
  ];

  const defaultCriteria = [
    { name: "Lugat", selected: false },
    { name: "Speaking", selected: false },
    { name: "Listening", selected: false },
    { name: "Writing", selected: false },
    { name: "Reading", selected: false },
  ];
  const initialCritByGroup = groups.reduce((acc, g) => {
    acc[g.id] = [...defaultCriteria];
    return acc;
  }, {});
  const [criteriaByGroup, setCriteriaByGroup] = useState(initialCritByGroup);
  const [newCritName, setNewCritName] = useState("");
  const [showCritModal, setShowCritModal] = useState(false);

  const modalRef = useRef();
  useEffect(() => {
    const handleOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        setShowCritModal(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const addNewCriteria = () => {
    const trimmed = newCritName.trim();
    if (trimmed) {
      setCriteriaByGroup((prev) => ({
        ...prev,
        [selectedGroup]: prev[selectedGroup].find((c) => c.name === trimmed)
          ? prev[selectedGroup]
          : [...prev[selectedGroup], { name: trimmed, selected: false }],
      }));
      setNewCritName("");
    }
  };
  const deleteCriteria = (name) =>
    setCriteriaByGroup((prev) => ({
      ...prev,
      [selectedGroup]: prev[selectedGroup].filter((c) => c.name !== name),
    }));
  const toggleCriteriaSelection = (name) =>
    setCriteriaByGroup((prev) => ({
      ...prev,
      [selectedGroup]: prev[selectedGroup].map((c) =>
        c.name === name ? { ...c, selected: !c.selected } : c
      ),
    }));

  const [marks, setMarks] = useState({});
  const handleMarkChange = (stuId, crit, value) =>
    setMarks((prev) => ({
      ...prev,
      [stuId]: { ...prev[stuId], [crit]: value },
    }));

  const currentIdx = lessons.findIndex((l) => l.GroupId === selectedGroup);
  const currentLesson = lessons[currentIdx];
  const filteredStudents = students.filter((s) => s.GroupId === selectedGroup);

  const [tempTimes, setTempTimes] = useState({
    start: currentLesson?.startTime || "",
    end: currentLesson?.endTime || "",
  });
  useEffect(() => {
    if (currentLesson)
      setTempTimes({
        start: currentLesson.startTime,
        end: currentLesson.endTime,
      });
  }, [currentLesson]);

  const confirmTimes = () => {
    const updated = [...lessons];
    updated[currentIdx] = {
      ...updated[currentIdx],
      startTime: tempTimes.start,
      endTime: tempTimes.end,
    };
    setLessons(updated);
  };

  const criteria = criteriaByGroup[selectedGroup];

  return (
    <div className="lessonsT-page">
      <h1>Lesson Progress</h1>
      <div className="controls">
        <div className="group-select-wrapper">
          <label>Group:</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {currentLesson && (
          <div className="time-display">
            <label>Start:</label>
            <input
              type="time"
              value={tempTimes.start}
              onChange={(e) =>
                setTempTimes((prev) => ({ ...prev, start: e.target.value }))
              }
            />
            <label>End:</label>
            <input
              type="time"
              value={tempTimes.end}
              onChange={(e) =>
                setTempTimes((prev) => ({ ...prev, end: e.target.value }))
              }
            />
            <button className="confirm-btn" onClick={confirmTimes}>
              <FiCheck size={20} />
            </button>
          </div>
        )}

        <div className="criteria-button-wrapper">
          <button
            className="criteria-btn"
            onClick={() => setShowCritModal(true)}
          >
            Criteria
          </button>
        </div>

        {showCritModal && (
          <>
            <div className="modal-backdrop" />
            <div className="criteria-modal animate" ref={modalRef}>
              <button
                className="close-btn"
                onClick={() => setShowCritModal(false)}
              >
                &times;
              </button>
              <h3>
                All Types for {groups.find((g) => g.id === selectedGroup)?.name}
              </h3>
              <div className="add-row">
                <input
                  type="text"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  placeholder="New type name..."
                />
                <button className="modal-add-btn" onClick={addNewCriteria}>
                  Add
                </button>
              </div>
              <div className="criteria-list">
                {criteria.map((c, i) => (
                  <div key={i} className="criteria-row">
                    <input
                      type="checkbox"
                      checked={c.selected}
                      onChange={() => toggleCriteriaSelection(c.name)}
                    />
                    <h1>{c.name}</h1>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCriteria(c.name)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="modal-save-btn"
                onClick={() => setShowCritModal(false)}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="index-col">№</th>
              <th className="name-col">Name</th>
              <th className="phone-col">Phone</th>
              {criteria
                .filter((c) => c.selected)
                .map((c) => (
                  <th className="mark-col" key={c.name}>
                    {c.name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((st, idx) => (
              <tr key={st.id}>
                <td className="index-col">{idx + 1}</td>
                <td className="name-col">{st.name}</td>
                <td className="phone-col">{st.phone}</td>
                {criteria
                  .filter((c) => c.selected)
                  .map((c) => (
                    <td className="mark-col" key={c.name}>
                      <input
                        className="inp"
                        type="number"
                        value={marks[st.id]?.[c.name] || ""}
                        onChange={(e) =>
                          handleMarkChange(st.id, c.name, e.target.value)
                        }
                      />
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="save-container">
        <button className="save-btn" onClick={() => console.log(marks)}>
          Save
        </button>
      </div>
    </div>
  );
}
