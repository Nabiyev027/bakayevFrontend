import React, { useState, useEffect } from "react";
import "./students.scss";

function Students() {
  // Til holatini olish va hodisa listener
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("lang") || "UZ"
  );

  useEffect(() => {
    const onLangChange = () => {
      setSelectedLang(localStorage.getItem("lang") || "UZ");
    };
    window.addEventListener("languageChanged", onLangChange);
    return () => window.removeEventListener("languageChanged", onLangChange);
  }, []);

  // Tarjimalar
  const translations = {
    UZ: {
      header: "O'quvchilarimiz natijalari",
      metrics: ["Listening", "Reading", "Writing", "Speaking", "Overall"],
    },
    EN: {
      header: "Our Students' Results",
      metrics: ["Listening", "Reading", "Writing", "Speaking", "Overall"],
    },
    RU: {
      header: "Результаты наших студентов",
      metrics: ["Аудирование", "Чтение", "Письмо", "Говорение", "Общий балл"],
    },
  };

  const { header, metrics } = translations[selectedLang];

  const [students] = useState([
    {
      img: "https://ieltszone.uz/_next/image?url=%2Fimages%2Fresults%2F9.JPG&w=750&q=75",
      name: "Nabiyev Abduvali",
      listening: "9.0",
      reading: "8.0",
      writing: "7.0",
      speaking: "7.0",
      overall: "8.0",
    },
    {
      img: "https://ieltszone.uz/_next/image?url=%2Fimages%2Fresults%2F3.JPG&w=750&q=75",
      name: "Nosirov Amirbek",
      listening: "8.0",
      reading: "8.0",
      writing: "7.0",
      speaking: "6.5",
      overall: "7.0",
    },
    {
      img: "https://ieltszone.uz/_next/image?url=%2Fimages%2Fresults%2F7.png&w=750&q=75",
      name: "Abdullayeva Nasiba",
      listening: "9.0",
      reading: "8.0",
      writing: "7.0",
      speaking: "7.0",
      overall: "8.0",
    },
    {
      img: "https://ieltszone.uz/_next/image?url=%2Fimages%2Fresults%2F4.png&w=750&q=75",
      name: "Sattorov Aziz",
      listening: "9.0",
      reading: "8.0",
      writing: "7.0",
      speaking: "7.0",
      overall: "8.0",
    },
    {
      img: "https://ieltszone.uz/_next/image?url=%2Fimages%2Fresults%2F7.png&w=750&q=75",
      name: "Diyorova Gulnoza",
      listening: "9.0",
      reading: "8.0",
      writing: "7.0",
      speaking: "7.0",
      overall: "8.0",
    },
  ]);

  const [selStudent, setSelStudent] = useState(students[0]);

  const selectStudent = (student) => setSelStudent(student);

  return (
    <div className="students-wrapper">
      <div className="container">
        <div className="header">
          <h1>{header}</h1>
        </div>

        <div className="sect-wrap">
          <div className="head-card">
            <div className="wrap-students">
              {students.map((item) => (
                <div
                  onClick={() => selectStudent(item)}
                  key={item.name}
                  className={`circle ${
                    item.name === selStudent.name ? "active" : ""
                  }`}
                >
                  <img className="img" src={item.img} alt={item.name} />
                </div>
              ))}
            </div>
          </div>

          <div className="body-card">
            <div className="result-text">
              <div className="res-card res-6">
                <h1>{selStudent.name}</h1>
              </div>
              {metrics.slice(0, 5).map((label, idx) => (
                <div className={`res-card res-${idx + 1}`} key={idx}>
                  <h2>{label}</h2>
                  <h1>
                    {
                      [
                        selStudent.listening,
                        selStudent.reading,
                        selStudent.writing,
                        selStudent.speaking,
                        selStudent.overall,
                      ][idx]
                    }
                  </h1>
                </div>
              ))}
            </div>
            <div className="result-img">
              <img src={selStudent.img} alt={selStudent.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;
