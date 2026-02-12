import React, {useEffect, useState} from "react";
import "./Exams.scss";
import ApiCall from "../../../Utils/ApiCall";
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";

export default function ExamS() {
  const [exams,setExams] = useState([]);
  const userToken = localStorage.getItem("token");
  const userId = jwtDecode(userToken).userId;

  useEffect(() => {
    getExams();
  },[])


  const pastExams = exams.filter(
      (ex) => ex.completed === true || ex.completed === "true"
  );

  const upcoming = exams.filter(
      (ex) => ex.completed === false || ex.completed === "false"
  );

  async function getExams() {
    try {
      const res = await ApiCall(`/examGrade/userRating/${userId}`, {method: "GET"});
      setExams(res.data);
    } catch (err) {
      const res = err.message || "Groups not found";
      toast.error(res);
    }
  }


  return (
    <div className="exam-page">
      <h1>Exams</h1>
      <div className="cards">

        <div className="card">
          <div className={"card-name"}>
            <h3>Completed Exams</h3>
          </div>
          {pastExams.length > 0 ? (
              <ul>
                {pastExams.map((ex) => (
                    <li key={ex.id} className="exam-item">
                      <div className="exam-header">
                        <strong>{ex.title}</strong>
                        <span className="exam-time">
                      {ex.startTime.slice(0, 5)}
                    </span>
                      </div>
                      <div className="exam-types">
                        {ex.marks.map((m, idx) => (
                            <div className="ex-type" key={idx}>
                              <div className={"type-t"}>{m.typeName} :</div> <div className={"type-t"}>{m.mark}</div>
                            </div>
                        ))}
                      </div>
                      <div className="exam-info">
                        <h3>Date: {ex.date}</h3>
                        <h3>Group: {ex.groupName}</h3>
                      </div>
                    </li>
                ))}
              </ul>
          ) : (
              <p>No exams</p>
          )}
        </div>

        <div className="card">
          <div className={"card-name"}>
            <h3>Upcoming Exams</h3>
          </div>
          {upcoming.length > 0 ? (
              <ul>
                {upcoming.map((ex) => (
                    <li key={ex.id} className="exam-item">
                      <div className="exam-header">
                        <strong>{ex.title}</strong>
                        <span className="exam-time">
                          {ex.startTime.slice(0, 5)}
                        </span>
                      </div>
                      <div className="exam-types">
                        {ex.marks.map((m, idx) => (
                            <div className="ex-type" key={idx}>
                              <div className={"type-t"}>{m.typeName}</div> <div className={"type-t"}>{m.mark}</div>
                            </div>
                        ))}
                      </div>
                      <div className="exam-info">
                        <h3>Date: {ex.date}</h3>
                        <h3>Group: {ex.groupName}</h3>
                      </div>
                    </li>
                ))}
              </ul>
          ) : (
              <p>No exams</p>
          )}
        </div>
      </div>
    </div>
  );
}
