import React, { useState, useEffect } from "react";
import "./lessonsT.scss";
import { toast, ToastContainer } from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export default function LessonsT() {
  const teacherId = localStorage.getItem("userId");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupLessonTime, setGroupLessonTime] = useState({
    startTime: "",
    endTime: "",
  });
  const [groupStudents, setGroupStudents] = useState({});
  const [showForm, setShowForm] = useState(false);

  const [types, setTypes] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]); // checkbox orqali tanlangan typelar
  const [studentMarks, setStudentMarks] = useState({}); // { studentId: { typeName: mark } }

  useEffect(() => {
    getGroups();
    getLessonTypes();
  }, []);


  useEffect(() => {
    if (selectedGroup && selectedGroup.id && types.length > 0) {
      getStudentsWithMarkToday(selectedGroup.id);
    }
  }, [selectedGroup, types]);

  async function changeGroupTime() {
    try {
      const formData = new FormData();
      formData.append("startTime", groupLessonTime.startTime);
      formData.append("endTime", groupLessonTime.endTime);

      const res = await ApiCall(
          `/lesson/changeTime/${selectedGroup.id}`,
          { method: "POST" },
          formData
      );
      toast.success(res.data);
      getGroups();
    } catch (err) {
      const res = err.message || "Groups not found";
      toast.error(res);
    }
  }

  // Guruhlarni olish
  async function getGroups() {
    try {
      const res = await ApiCall(`/group/teacher/${teacherId}`, { method: "GET" });
      setGroups(res.data);
      if (res.data.length > 0) {
        setSelectedGroup(res.data[0]);
      }
    } catch (err) {
      const res = err.message || "Groups not found";
      toast.error(res);
    }
  }

  async function getStudentsWithMarkToday(groupId) {
    try {
      const res = await ApiCall(`/lesson/${groupId}`, { method: "GET" });

      // vaqtni faqat soat:minut qilib olish
      setGroupLessonTime({
        startTime: res.data.startTime ? res.data.startTime.substring(0, 5) : "",
        endTime: res.data.endTime ? res.data.endTime.substring(0, 5) : "",
      });

      setGroupStudents(res.data);

      // mavjud baholarni state ichiga joylab qo‘yamiz
      const marks = {};
      const usedTypes = new Set();

      res.data.studentsWithResults.forEach((s) => {
        marks[s.id] = {};
        s.lessonMarks.forEach((m) => {
          // ❌ oldingi xato: m.type
          // ✅ to‘g‘ri: m.typeName
          const typeObj = types.find((t) => t.name === m.typeName);
          if (typeObj) {
            marks[s.id][typeObj.id] = m.mark;
            usedTypes.add(typeObj.id); // avtomatik checkbox belgilansin
          }
        });
      });

      setStudentMarks(marks);
      setSelectedTypes([...usedTypes]);
    } catch (err) {
      const res = err.message || "Marks not found";
      toast.error(res);
    }
  }

  async function getLessonTypes() {
    try {
      const res = await ApiCall(`/lessonTypes`, { method: "GET" });
      setTypes(res.data);
    } catch (err) {
      const res = err.message || "Types not found";
      toast.error(res);
    }
  }

  async function addType() {
    try {
      const res = await ApiCall(`/lessonTypes?typeName=${typeName}`, {
        method: "POST",
      });
      toast.success(res.data);
      getLessonTypes();
      setTypeName("");
    } catch (err) {
      const res = err.message;
      toast.error(res);
    }
  }



  const toggleTypeSelection = (typeId) => {
    setSelectedTypes((prev) => {
      let updated;
      if (prev.includes(typeId)) {
        // Agar type uncheck qilinsa o‘chirish
        updated = prev.filter((id) => id !== typeId);

        // Studentlardan ham shu type ni o‘chirib tashlash
        setStudentMarks((prevMarks) => {
          const newMarks = { ...prevMarks };
          Object.keys(newMarks).forEach((studentId) => {
            if (newMarks[studentId]) {
              delete newMarks[studentId][typeId];
            }
          });
          return newMarks;
        });
      } else {
        // Agar type check qilinsa qo‘shish
        updated = [...prev, typeId];

        // Studentlarga shu type uchun qiymat qo‘yish
        setStudentMarks((prevMarks) => {
          const newMarks = { ...prevMarks };
          groupStudents.studentsWithResults?.forEach((student) => {
            if (!newMarks[student.id]) newMarks[student.id] = {};

            // Backenddan shu studentning eski bahosini tekshiramiz
            const existingMark = student.lessonMarks?.find(
                (m) => {
                  const typeObj = types.find((t) => t.id === typeId);
                  return typeObj && m.typeName === typeObj.name;
                }
            );

            if (existingMark) {
              // Agar bor bo‘lsa o‘sha qiymatni tiklaymiz
              newMarks[student.id][typeId] = existingMark.mark;
            } else {
              // Aks holda bo‘sh qiymat
              newMarks[student.id][typeId] = 0;
            }
          });
          return newMarks;
        });
      }
      return updated;
    });
  };



  // Inputdagi bahoni o‘zgartirish
  const handleMarkChange = (studentId, type, value) => {
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value,
      },
    }));
  };


  const saveMarks = async () => {
    if (selectedTypes.length === 0) {
      toast.error("Type not selected!");
      return;
    }

    const formattedMarks = [];

    Object.entries(studentMarks).forEach(([studentId, marks]) => {
      Object.entries(marks).forEach(([typeId, mark]) => {
        formattedMarks.push({
          studentId,
          typeId,
          mark: Number(mark),
        });
      });
    });

    try {
      const res = await ApiCall(
          `/lesson/saveMarks/${selectedGroup.id}`,
          { method: "POST" },
          formattedMarks
      );
      toast.success(res.data);
    } catch (err) {
      const res = err.message;
      toast.error(res);
    }
  };



  async function deleteType(id) {
    const confirmDelete = window.confirm("Do you really want to delete this type?");

    if (!confirmDelete) return; // foydalanuvchi bekor qilsa chiqib ketadi

    try {
      const res = await ApiCall(`/lessonTypes/${id}`, { method: "DELETE" });
      toast.success(res.data);
      await getLessonTypes();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
      <div className="lessonsT-page">
        <ToastContainer />
        <h1>Lesson Progress</h1>
        <div className="controls">
          <div className="group-select-wrapper">
            <label>Group:</label>
            <select
                value={selectedGroup ? selectedGroup.id : ""}
                onChange={(e) => {
                  const group = groups.find((g) => g.id === e.target.value);
                  setSelectedGroup(group);
                }}
            >
              <option value="" disabled >Select Group</option>
              {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
              ))}
            </select>
          </div>

          <div className="criteria-button-wrapper">
            <div className={"time-box"}>
              <label>
                Time:
                <input
                    type={"time"}
                    value={groupLessonTime.startTime}
                    onChange={(e) =>
                        setGroupLessonTime({
                          ...groupLessonTime,
                          startTime: e.target.value,
                        })
                    }
                />
              </label>
              -
              <label>
                <input
                    type={"time"}
                    value={groupLessonTime.endTime}
                    onChange={(e) =>
                        setGroupLessonTime({
                          ...groupLessonTime,
                          endTime: e.target.value,
                        })
                    }
                />
              </label>

              <FaCheck className={"btn-ico"} onClick={changeGroupTime} />
            </div>

            <button className="criteria-btn" onClick={() => setShowForm(!showForm)}>
              {
                showForm ? "Close" : "Add Type"
              }
            </button>
          </div>
        </div>

        <div className="table-lesson-wrapper">
          <AnimatePresence>
            {showForm && (
                <motion.div
                    className="form-panel"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                  <div className="add-type">
                    <input
                        type="text"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        placeholder="Add Type"
                        className="input-type"
                    />
                    <button type="submit" className="btn-type" onClick={addType}>
                      ＋
                    </button>
                  </div>


                  <div className={"types-list"}>
                    {types.map((t, index) => (
                        <div key={t.id} className="type-tag">
                          <h1>
                            {index + 1} {t.name}
                          </h1>

                          <div className="btn-wrap">
                            <input
                                className="checkbox"
                                type="checkbox"
                                checked={selectedTypes.includes(t.id)}   // <-- endi ID bilan ishlayapti
                                onChange={() => toggleTypeSelection(t.id)} // <-- ID yuboriladi
                            />
                            <MdClose
                                className="btn-delete"
                                onClick={() => deleteType(t.id)}
                            />
                          </div>
                        </div>
                    ))}
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
          <table className="table-lesson">
            <thead>
            <tr>
              <th>No</th>
              <th>Full name</th>
              {selectedTypes.map((typeId) => {
                const typeObj = types.find((t) => t.id === typeId); // id orqali name topiladi
                return <th key={typeId}>{typeObj ? typeObj.name : typeId}</th>;
              })}
            </tr>
            </thead>
            <tbody>
            {groupStudents.studentsWithResults &&
                groupStudents.studentsWithResults.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>{s.name}</td>
                      {selectedTypes.map((typeId) => (   // <-- t emas, typeId qilib olamiz
                          <td key={typeId}>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={studentMarks[s.id]?.[typeId] ?? 0}
                                onChange={(e) => handleMarkChange(s.id, typeId, e.target.value)}
                                className="inp"
                            />
                            %
                          </td>
                      ))}
                    </tr>
                ))}
            </tbody>

          </table>
        </div>

        <div className="save-container">
          <button
              className="save-btn"
              onClick={saveMarks}
              disabled={selectedTypes.length === 0}
          >
            Save
          </button>
        </div>
      </div>
  );
}
