import React, { useState, useMemo } from "react";
import "./lessonsS.scss";

// "dd.mm.yyyy" formatdagi sanani Date ga aylantirish funksiyasi
function parseDate(str) {
  const [day, month, year] = str.split(".");
  return new Date(`${year}-${month}-${day}`);
}

export default function LessonsS() {
  // O'quvchi bir nechta guruhda qatnashishi mumkin
  const [student] = useState({
    name: "John Doe",
    age: 20,
    photo: "",
    groupIds: ["1", "2"], // bir nechta guruhlar
    marks: [
      { day: "10.09.2023", mark: 5, type: "Listening" },
      { day: "09.09.2023", mark: 4, type: "Speaking" },
      { day: "08.09.2023", mark: 3, type: "Writing" },
      { day: "07.09.2023", mark: 2, type: "Reading" },
      { day: "06.09.2023", mark: 5, type: "Listening" },
      { day: "05.09.2023", mark: 4, type: "Speaking" },
      { day: "04.09.2023", mark: 3, type: "Writing" },
      { day: "03.09.2023", mark: 2, type: "Reading" },
      { day: "02.09.2023", mark: 5, type: "Listening" },
      { day: "01.09.2023", mark: 4, type: "Speaking" },
    ].map((item) => ({
      ...item,
      percent: Math.round((item.mark / 5) * 100),
    })),
  });

  const [lessons] = useState([
    {
      id: "1",
      type: "Listening",
      startTime: "10:00",
      endTime: "11:00",
      GroupId: "1",
      teacherId: "1",
    },
    {
      id: "2",
      type: "Speaking",
      startTime: "11:00",
      endTime: "12:00",
      GroupId: "1",
      teacherId: "1",
    },
    {
      id: "3",
      type: "Writing",
      startTime: "12:00",
      endTime: "13:00",
      GroupId: "1",
      teacherId: "1",
    },
    {
      id: "4",
      type: "Reading",
      startTime: "13:00",
      endTime: "14:00",
      GroupId: "1",
      teacherId: "1",
    },
    {
      id: "5",
      type: "Listening",
      startTime: "10:00",
      endTime: "11:00",
      GroupId: "2",
      teacherId: "2",
    },
    {
      id: "6",
      type: "Speaking",
      startTime: "11:00",
      endTime: "12:00",
      GroupId: "2",
      teacherId: "2",
    },
    {
      id: "7",
      type: "Writing",
      startTime: "12:00",
      endTime: "13:00",
      GroupId: "2",
      teacherId: "2",
    },
    {
      id: "8",
      type: "Reading",
      startTime: "13:00",
      endTime: "14:00",
      GroupId: "2",
      teacherId: "2",
    },
  ]);

  // Filter holati: "today", "week" yoki "month"
  const [filter, setFilter] = useState("today");
  const referenceDate =
    student.marks.length > 0 ? parseDate(student.marks[0].day) : new Date();

  const filteredMarks = useMemo(() => {
    let marks = [...student.marks];
    marks.sort((a, b) => parseDate(b.day) - parseDate(a.day));
    if (filter === "today") {
      marks = marks.filter((item) => {
        const d = parseDate(item.day);
        return (
          d.getDate() === referenceDate.getDate() &&
          d.getMonth() === referenceDate.getMonth() &&
          d.getFullYear() === referenceDate.getFullYear()
        );
      });
    } else if (filter === "week") {
      const oneWeekAgo = new Date(referenceDate);
      oneWeekAgo.setDate(referenceDate.getDate() - 7);
      marks = marks.filter((item) => parseDate(item.day) >= oneWeekAgo);
    } else if (filter === "month") {
      const oneMonthAgo = new Date(referenceDate);
      oneMonthAgo.setMonth(referenceDate.getMonth() - 1);
      marks = marks.filter((item) => parseDate(item.day) >= oneMonthAgo);
    }
    return marks;
  }, [student.marks, filter, referenceDate]);

  // Har bir type uchun o'rtacha foizni hisoblash
  const avgPercentByType = useMemo(() => {
    const sums = {};
    const counts = {};
    filteredMarks.forEach(({ type, percent }) => {
      sums[type] = (sums[type] || 0) + percent;
      counts[type] = (counts[type] || 0) + 1;
    });
    const result = {};
    Object.keys(sums).forEach((type) => {
      result[type] = Math.round(sums[type] / counts[type]);
    });
    return result;
  }, [filteredMarks]);

  // Bugungi darslar: faqat student.groupIds ga mos keluvchilar
  const todaysLessons = useMemo(() => {
    const today = new Date();
    return lessons.filter(
      (l) => student.groupIds.includes(l.GroupId)
      // agar kerak bo'lsa, sana bilan solishtirish qo'shish mumkin
    );
  }, [lessons, student.groupIds]);

  return (
    <div className="lessonsS-page">
      <h1 className="section-title">Marks Overview</h1>
      <div className="filter-buttons">
        {["today", "week", "month"].map((key) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {key === "today"
              ? "Today"
              : key === "week"
              ? "Last Week"
              : "Last Month"}
          </button>
        ))}
      </div>

      <div className="mark-box">
        {Object.entries(avgPercentByType).map(([type, avgPercent]) => {
          const recent = filteredMarks.find((m) => m.type === type);
          return (
            <div key={type} className="mark-item">
              <h3 className="type-title">{type}</h3>
              <p className="mark-value">{avgPercent}%</p>
              {recent && <p className="mark-date">{recent.day}</p>}
            </div>
          );
        })}
      </div>

      <h1 className="section-title lessons-title">Today's Lessons</h1>
      <div className="todays-lessons-box">
        {todaysLessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <div className="lesson-header">
              <span className="lesson-type">{lesson.type}</span>
              <span className="lesson-group">Group {lesson.GroupId}</span>
            </div>
            <div className="lesson-time">
              {lesson.startTime} - {lesson.endTime}
            </div>
            <div className="lesson-teacher">Teacher {lesson.teacherId}</div>
          </div>
        ))}
        {todaysLessons.length === 0 && (
          <p className="no-lessons">No lessons for today.</p>
        )}
      </div>
    </div>
  );
}
