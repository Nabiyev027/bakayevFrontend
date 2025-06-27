import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import "./examT.scss";

export default function ExamT({ groups = ["Group A", "Group B", "Group C"] }) {
  const today = new Date().toISOString().slice(0, 10);
  const [exams, setExams] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [showForm, setShowForm] = useState(false);

  const [newExam, setNewExam] = useState({
    id: null,
    title: "",
    date: "",
    time: "",
    types: [],
  });
  const [typeInput, setTypeInput] = useState("");

  // Add a type tag
  const handleAddType = (e) => {
    e.preventDefault();
    const t = typeInput.trim();
    if (t && !newExam.types.includes(t)) {
      setNewExam((prev) => ({ ...prev, types: [...prev.types, t] }));
    }
    setTypeInput("");
  };

  // Save new or edited exam
  const handleSave = () => {
    if (!selectedGroup || !newExam.title || !newExam.date || !newExam.time)
      return;
    const examPayload = {
      ...newExam,
      id: newExam.id || Date.now().toString(),
      group: selectedGroup,
    };
    if (newExam.id) {
      // edit existing
      setExams((prev) =>
        prev.map((ex) => (ex.id === newExam.id ? examPayload : ex))
      );
    } else {
      // add new
      setExams((prev) => [...prev, examPayload]);
    }
    setShowForm(false);
    setNewExam({ id: null, title: "", date: "", time: "", types: [] });
  };

  // Prefill form for editing
  const handleEdit = (exam) => {
    setSelectedGroup(exam.group);
    setNewExam(exam);
    setShowForm(true);
  };

  // Filter exams by date & group
  const groupExams = exams.filter((ex) => ex.group === selectedGroup);
  const pastExams = groupExams.filter((ex) => ex.date < today);
  const upcoming = groupExams.filter((ex) => ex.date >= today);

  return (
    <div className="exam-page">
      <header className="top-bar">
        <h1>Exams</h1>
        <select
          className="group-select"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <button
          className={`btn-add ${showForm ? "active" : ""}`}
          onClick={() => {
            setShowForm((v) => !v);
            if (!showForm)
              setNewExam({
                id: null,
                title: "",
                date: "",
                time: "",
                types: [],
              });
          }}
        >
          {showForm ? "✕ Close Form" : "+ Add Exam"}
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="form-panel"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              placeholder="Exam Title"
              value={newExam.title}
              onChange={(e) =>
                setNewExam((prev) => ({ ...prev, title: e.target.value }))
              }
              className="input-full"
            />
            <div className="datetime-row">
              <input
                type="date"
                value={newExam.date}
                onChange={(e) =>
                  setNewExam((prev) => ({ ...prev, date: e.target.value }))
                }
                className="input-date"
              />
              <input
                type="time"
                value={newExam.time}
                onChange={(e) =>
                  setNewExam((prev) => ({ ...prev, time: e.target.value }))
                }
                className="input-time"
              />
            </div>
            <div className="types-list">
              {newExam.types.map((t, i) => (
                <span key={i} className="type-tag">
                  {t}
                </span>
              ))}
            </div>
            <form className="add-type" onSubmit={handleAddType}>
              <input
                type="text"
                placeholder="Add Type"
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                className="input-type"
              />
              <button type="submit" className="btn-type">
                ＋
              </button>
            </form>
            <button className="btn-save" onClick={handleSave}>
              ↑ Save Exam
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="panels">
        <div className="panel past-panel">
          <h2>Past Exams</h2>
          {pastExams.length === 0 ? (
            <p className="empty">No past exams</p>
          ) : (
            pastExams.map((ex) => (
              <div key={ex.id} className="exam-item">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(ex)}
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
                <div className="exam-header">
                  <strong>{ex.title}</strong>
                </div>
                <div className="exam-meta">
                  <time>{ex.date}</time>
                  <span className="dot">•</span>
                  <time>{ex.time}</time>
                </div>
                <div className="exam-types-small">
                  {ex.types.map((t, i) => (
                    <span key={i} className="type-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="panel upcoming-panel">
          <h2>Upcoming Exams</h2>
          {upcoming.length === 0 ? (
            <p className="empty">No upcoming exams</p>
          ) : (
            upcoming.map((ex) => (
              <div key={ex.id} className="exam-item">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(ex)}
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
                <div className="exam-header">
                  <strong>{ex.title}</strong>
                </div>
                <div className="exam-meta">
                  <time>{ex.date}</time>
                  <span className="dot">•</span>
                  <time>{ex.time}</time>
                </div>
                <div className="exam-types-small">
                  {ex.types.map((t, i) => (
                    <span key={i} className="type-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
