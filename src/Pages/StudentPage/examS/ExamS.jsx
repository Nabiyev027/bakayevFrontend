import React, { useState } from "react";
import "./Exams.scss";

export default function ExamS() {
  const [exams] = useState([
    {
      id: "uuid-1",
      title: "English",
      lessonId: "lsn-01",
      groupId: "grp-01",
      date: "2025-04-01",
      type: [
        { name: "Listening", grade: 80 },
        { name: "Reading", grade: 85 },
      ],
      startTime: "10:00",
      endTime: "11:30",
      teacher: "John Smith",
    },
    {
      id: "uuid-2",
      title: "English",
      lessonId: "lsn-02",
      groupId: "grp-02",
      date: "2025-04-10",
      type: [
        { name: "Writing", grade: 90 },
        { name: "Speaking", grade: 88 },
      ],
      startTime: "12:00",
      endTime: "13:30",
      teacher: "Jane Doe",
    },
    {
      id: "uuid-3",
      title: "English",
      lessonId: "lsn-03",
      groupId: "grp-03",
      date: new Date().toISOString().slice(0, 10),
      type: [{ name: "Listening" }, { name: "Speaking" }],
      startTime: "14:00",
      endTime: "15:30",
      teacher: "Emily White",
    },
  ]);

  const todayDate = new Date().toISOString().slice(0, 10);
  const pastExams = exams.filter((ex) => ex.date < todayDate);
  const todayExams = exams.filter((ex) => ex.date === todayDate);

  return (
    <div className="exam-page">
      <h1>Exams</h1>
      <div className="cards">
        {/* Today's Exams */}

        {/* Past Exams */}
        <div className="card">
          <h3>Completed Exams</h3>
          <ul>
            {pastExams.map((ex) => (
              <li key={ex.id} className="exam-item">
                <div className="exam-header">
                  <strong>{ex.title}</strong>
                  <span className="exam-time">
                    {ex.startTime} - {ex.endTime}
                  </span>
                </div>
                <div className="exam-types">
                  {ex.type.map((t, idx) => (
                    <div className="exam-type" key={idx}>
                      {t.name} : {t.grade}
                    </div>
                  ))}
                </div>
                <div className="exam-info">
                  Date: {ex.date}
                  <br />
                  Lesson ID: {ex.lessonId}, Group ID: {ex.groupId}
                </div>
                <div className="exam-footer">
                  <span className="exam-teacher">{ex.teacher}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Today's Exams</h3>
          {todayExams.length > 0 ? (
            <ul>
              {todayExams.map((ex) => (
                <li key={ex.id} className="exam-item">
                  <div className="exam-header">
                    <strong>{ex.title}</strong>
                    <span className="exam-time">
                      {ex.startTime} - {ex.endTime}
                    </span>
                  </div>
                  <div className="exam-types">
                    {ex.type.map((t, idx) => (
                      <div className="exam-type" key={idx}>
                        {t.name}
                      </div>
                    ))}
                  </div>
                  <div className="exam-info">
                    Date: {ex.date}
                    <br />
                    Lesson ID: {ex.lessonId}, Group ID: {ex.groupId}
                  </div>
                  <div className="exam-footer">
                    <span className="exam-teacher">{ex.teacher}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No exams today</p>
          )}
        </div>
      </div>
    </div>
  );
}
