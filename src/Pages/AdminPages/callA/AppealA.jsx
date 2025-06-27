// AppealA.jsx
import React, { useState } from "react";
import "./AppealA.scss";

export default function AppealA() {
  const [appeal] = useState([
    {
      id: 1,
      name: "Appeal 1",
      date: "2022-01-01",
      status: "Pending",
      text: "This is the first appeal.",
      email: "appeal1@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 2,
      name: "Appeal 2",
      date: "2022-01-02",
      status: "Resolved",
      text: "This is the second appeal.",
      email: "appeal2@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 3,
      name: "Appeal 3",
      date: "2022-01-03",
      status: "Pending",
      text: "This is the third appeal.",
      email: "appeal3@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 4,
      name: "Appeal 4",
      date: "2022-01-04",
      status: "Resolved",
      text: "This is the fourth appeal.",
      email: "appeal4@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 5,
      name: "Appeal 5",
      date: "2022-01-05",
      status: "Pending",
      text: "This is the fifth appeal.",
      email: "appeal5@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 6,
      name: "Appeal 6",
      date: "2022-01-06",
      status: "Resolved",
      text: "This is the sixth appeal.",
      email: "appeal6@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 7,
      name: "Appeal 7",
      date: "2022-01-07",
      status: "Pending",
      text: "This is the seventh appeal.",
      email: "appeal7@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 8,
      name: "Appeal 8",
      date: "2022-01-08",
      status: "Resolved",
      text: "This is the eighth appeal.",
      email: "appeal8@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 9,
      name: "Appeal 9",
      date: "2022-01-09",
      status: "Pending",
      text: "This is the ninth appeal.",
      email: "appeal9@example.com",
      number: "+998 90 123 45 67",
    },
    {
      id: 10,
      name: "Appeal 10",
      date: "2022-01-10",
      status: "Resolved",
      text: "This is the tenth appeal.",
      email: "appeal10@example.com",
      number: "+998 90 123 45 67",
    },
  ]);

  return (
    <div className="Appeal-page">
      <h1>Appeal</h1>
      <div className="appeal-container">
        {appeal.map((a) => (
          <div key={a.id} className="appeal-item">
            <div className="header">
              <h2>{a.name}</h2>
              <span className={`status ${a.status.toLowerCase()}`}>
                {a.status}
              </span>
            </div>
            <p className="date">{a.date}</p>
            <p className="text">{a.text}</p>
            <p className="email">📧 {a.email}</p>
            <p className="phone">📞 {a.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
