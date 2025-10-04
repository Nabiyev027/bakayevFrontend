import React, {useState, useMemo, useEffect} from "react";
import "./lessonsS.scss";
import ApiCall from "../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify";

export default function LessonsS() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [studentGroups, setStudentGroups] = useState([]);
  const [lessons,setLessons] = useState([]);
  const [filter, setFilter] = useState("today");
  const [selGroup, setSelGroup] = useState(null);
  const [selLesson, setSelLesson] = useState(null);
  const colors = [
    "rgb(247, 174, 248)",
    "rgb(207, 17, 203)",
    "rgb(179, 136, 235)",
    "rgb(128, 147, 241)",
    "rgb(114, 221, 247)"
  ];

  const colors2 = [
    "rgb(67, 186, 250)",
    "rgb(18, 99, 198)",
    "rgb(92, 231, 23)",
    "rgb(35, 255, 141)",
    "rgb(255, 0, 0)"
  ];

  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    getStudentGroups()
  }, []);

  useEffect(() => {
    if (selGroup?.id) {
      getLessonsWithMark();
    }
  }, [selGroup, filter]);

  async function getStudentGroups() {
    try {
      const res = await ApiCall(`/group/student/${studentId}`,{method: "GET"});
      if (res.data.length > 0) {
        setSelGroup(res.data[0]);
      }
      setStudentGroups(res.data);
    } catch (err) {
      const res = err.message || "Groups not found";
      toast.error(res);
    }

  }

  async function getLessonsWithMark() {
    try {
      const res = await ApiCall(`/lesson/student/${studentId}?groupId=${selGroup.id}&type=${filter}`, {method: "GET"});
      setLessons(res.data);
      if (res.data.length > 0) {
        setSelLesson(res.data[0]);
      } else {
        setSelLesson(null);
      }
    } catch (err) {
      const res = err.message || "lessons not found";
      toast.error(res);
    }
  }


  function selectLesson(lesson) {
    setSelLesson(lesson);
  }

  function calculateOverallMarksForAllLessons(lessons) {
    const typeGroups = {};

    lessons.forEach((lesson) => {
      lesson.marks.forEach((m) => {
        if (!typeGroups[m.typeName]) {
          typeGroups[m.typeName] = [];
        }
        typeGroups[m.typeName].push(m.mark);
      });
    });

    const overall = Object.keys(typeGroups).map((typeName) => {
      const marksArray = typeGroups[typeName];
      const avg = marksArray.reduce((sum, val) => sum + val, 0) / marksArray.length;
      return {
        typeName,
        mark: Math.round(avg)
      };
    });

    return overall;
  }




  return (
    <div className="lessonsS-page">
      <ToastContainer />
      <h1 className="section-title">Marks Overview</h1>
      <div className="filter-buttons">
        <select
            value={selGroup ? selGroup.id : ""}
            onChange={(e) => {
              const selected = studentGroups.find((g) => g.id === e.target.value);
              setSelGroup(selected);
            }}
        >
          {studentGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
          ))}
        </select>


        {["today", "week", "month"].map((type) => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type)}
          >
            {type === "today"
              ? "Today"
              : type === "week"
              ? "Last Week"
              : "Last Month"}
          </button>
        ))}
      </div>

      <div className="lesson-box">
        {
          lessons&&lessons.map((lesson) => (<div key={lesson.id}
                                                  onClick={()=>selectLesson(lesson)}
                                                  className={`lesson-card ${selLesson.id===lesson.id ? "active":""}`}>
                <h3 className={"weekday"}>{lesson.weekDay}</h3>
                <h2 className={"day"}>{new Date(lesson.date).getDate()}</h2> {/* faqat kun */}
                <h2 className={"month"} >{months[new Date(lesson.date).getMonth()]}</h2>
                <h3 className={"year"}>{new Date(lesson.date).getFullYear()}</h3>
            </div>))
        }
      </div>

      <div className={"wrap-res"}>
        <div className={"res-box"}>
          <h2 className={"title"}>Lesson results</h2>
          {
            selLesson ? <div className={"les-res"}>
              {selLesson && selLesson.marks && selLesson.marks.map((m,index) => (
                  <div className={"card-mark"} style={{ backgroundColor: colors[index % colors.length] }}>
                    <h2>{m.typeName}</h2>
                    <h1>{m.mark}</h1>
                  </div>
              ))}
            </div> : <span>Select Lesson</span>
          }

        </div>

        <div className={"res-box"}>
          <h2 className={"title"}>Overall results</h2>
          {
            lessons.length > 0 ? (
                <div className={"les-res"}>
                  {calculateOverallMarksForAllLessons(lessons).map((m, index) => (
                      <div className={"card-mark"} style={{ backgroundColor: colors2[index % colors2.length] }} key={index}>
                        <h2>{m.typeName}</h2>
                        <h1>{m.mark}</h1>
                      </div>
                  ))}
                </div>
            ) : <span>No lessons</span>
          }
        </div>


      </div>


    </div>
  );
}
