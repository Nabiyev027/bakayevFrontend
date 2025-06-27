import React, { useState, useEffect } from "react";
import "./courses.scss";
import Student from "../../../Images/Logos/student.png";
import preIelts from "../../../Images/Logos/pre-Ielts.png";
import Ielts from "../../../Images/Logos/Ielts.png";
import preMulti from "../../../Images/Logos/pre-Multilevel.png";
import multi from "../../../Images/Logos/multi-level.png";
import { FaStar } from "react-icons/fa";

function Courses() {
  // Til holatini o'qish va boshlanganida o'rnatish
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

  // Tarjimalar va sahifa tuzilmasi
  const translations = {
    UZ: {
      title: "Bizning Kurslarimiz",
      periods: [
        {
          heading: "Foundation Period",
          courses: [
            { name: "Starter", stars: 1 },
            { name: "Beginner", stars: 2 },
            { name: "Elementary", stars: 3 },
            { name: "Pre-Intermediate", stars: 4 },
            { name: "Intermediate", stars: 5 },
            { name: "Upper-Intermediate", stars: 6 },
          ],
        },
        {
          heading: "Advanced Period",
          courses: [{ name: "Pre-IELTS" }, { name: "Pre-Multi-level" }],
        },
        {
          heading: "Practice Period",
          courses: [{ name: "IELTS" }, { name: "Multi-level" }],
        },
      ],
    },
    EN: {
      title: "Our Courses",
      periods: [
        {
          heading: "Foundation Period",
          courses: [
            { name: "Starter", stars: 1 },
            { name: "Beginner", stars: 2 },
            { name: "Elementary", stars: 3 },
            { name: "Pre-Intermediate", stars: 4 },
            { name: "Intermediate", stars: 5 },
            { name: "Upper-Intermediate", stars: 6 },
          ],
        },
        {
          heading: "Advanced Period",
          courses: [{ name: "Pre-IELTS" }, { name: "Pre-Multi-level" }],
        },
        {
          heading: "Practice Period",
          courses: [{ name: "IELTS" }, { name: "Multi-level" }],
        },
      ],
    },
    RU: {
      title: "Наши курсы",
      periods: [
        {
          heading: "Foundation Period",
          courses: [
            { name: "Starter", stars: 1 },
            { name: "Beginner", stars: 2 },
            { name: "Elementary", stars: 3 },
            { name: "Pre-Intermediate", stars: 4 },
            { name: "Intermediate", stars: 5 },
            { name: "Upper-Intermediate", stars: 6 },
          ],
        },
        {
          heading: "Advanced Period",
          courses: [{ name: "Pre-IELTS" }, { name: "Pre-Multi-level" }],
        },
        {
          heading: "Practice Period",
          courses: [{ name: "IELTS" }, { name: "Multi-level" }],
        },
      ],
    },
  };

  const t = translations[selectedLang];

  // Kurs darajasiga mos rasm ro'yxatlari
  const images = [
    [Student, Student, Student, Student, Student, Student],
    [preIelts, preMulti],
    [Ielts, multi],
  ];

  // Yulduzcha generatsiya funksiyasi
  function generateStar(num) {
    return Array.from({ length: num }, (_, i) => <FaStar key={i} />);
  }

  return (
    <div className="wrap-courses">
      <div className="container">
        <div className="header">
          <h1>{t.title}</h1>
        </div>

        {t.periods.map((period, pi) => (
          <div className="period1" key={pi}>
            <h2>{period.heading}</h2>
            <div className={pi === 0 ? "wrap-per1" : "wrap-per2"}>
              {period.courses.map((course, ci) => (
                <div className="course-card" key={ci}>
                  <img src={images[pi][ci]} alt={course.name} />
                  <h3>{course.name}</h3>
                  {course.stars && (
                    <div className="wrap-stars">
                      {generateStar(course.stars)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
