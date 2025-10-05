import React, { useState, useEffect } from "react";
import "./students.scss";
import ApiCall from "../../../Utils/ApiCall";
import { toast } from "react-toastify";

function Students() {
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "UZ");
  const [results, setResults] = useState([]);
  const [selStudent, setSelStudent] = useState(null);
  const BaseUrl = "http://localhost:8080";

  // Til o‘zgarganda yangilanish
  useEffect(() => {
    const onLangChange = () => setSelectedLang(localStorage.getItem("lang") || "UZ");
    window.addEventListener("languageChanged", onLangChange);
    return () => window.removeEventListener("languageChanged", onLangChange);
  }, []);

  // O‘quvchilar natijalarini olish
  useEffect(() => {
    getStudentResults();
  }, []);

  async function getStudentResults() {
    try {
      const res = await ApiCall("/studentSection/getInfo", { method: "GET" });
      setResults(res.data);
      if (res.data.length > 0) setSelStudent(res.data[0]);
    } catch (err) {
      const message = err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
      toast.warn(message);
    }
  }

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

  const selectStudent = (student) => setSelStudent(student);

  return (
      <div className="students-wrapper">
        <div className="container-s">
          <div className="header">
            <h1 className="main-title">{header}</h1>
          </div>

          <div className="sect-wrap">
            <div className="head-card">
              <div className="wrap-students">
                {results.map((item) => (
                    <div
                        key={item.id || item.name}
                        onClick={() => selectStudent(item)}
                        className={`circle ${selStudent?.name === item.name ? "active" : ""}`}
                    >
                      <img className="img" src={`${BaseUrl}${item.imgUrl}`} alt={item.name} />
                    </div>
                ))}
              </div>
            </div>

            {selStudent && (
                <div className="body-card">
                  <div className="result-text">
                    <div className="res-card res-6">
                      <h1>{selStudent.name}</h1>
                    </div>
                    {metrics.map((label, idx) => (
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
                    <img src={`${BaseUrl}${selStudent.imgUrl}`} alt={selStudent.name} />
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Students;
