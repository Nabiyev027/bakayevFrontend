"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, BookOpen, Clock, UsersIcon, Trophy, CheckCircle } from "lucide-react"
import { FaStar } from "react-icons/fa"
import "./courses.scss"
import ApiCall from "../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify"; // SCSS faylini import qilish

function Courses() {
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "UZ")
  const [expandedCards, setExpandedCards] = useState([])
  const [periods,setPeriods] = useState([])

  const BaseUrl = "http://localhost:8080";

  useEffect(() => {
    const onLangChange = () => {
      setSelectedLang(localStorage.getItem("lang") || "UZ")
    }
    window.addEventListener("languageChanged", onLangChange)
    return () => window.removeEventListener("languageChanged", onLangChange)
  }, [])

  useEffect(() => {
    getPeriodsWithLevels()
  }, [selectedLang]);

  async function getPeriodsWithLevels() {
    try {
      const res = await ApiCall(`/courseSection/getHome?lang=${selectedLang}`, {method: "GET"});
      setPeriods(res.data);
    } catch (err) {
      const message = err.response?.data || "No data";
      toast.warn(message);
    }
  }

  const translations = {
    UZ: {
      title: "Bizning Kurslarimiz",
      subtitle: "Har bir darajada professional ta'lim va zamonaviy o'qitish metodlari",
    },
    EN: {
      title: "Our Courses",
      subtitle: "Professional education and modern teaching methods at every level",
    },
    RU: {
      title: "Наши курсы",
      subtitle: "Профессиональное образование и современные методы обучения на каждом уровне",
    },
  }
  const t = translations[selectedLang]

  function generateStar(num) {
    return Array.from({ length: num }, (_, i) => (
        <FaStar key={i} className="star filled" />
    ));
  }

  const toggleCard = (cardId) => {
    setExpandedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const renderCourseCard = (card, index, periodIndex, type) => {
    const cardId = `${type}-${index}`
    const isExpanded = expandedCards.includes(cardId)

    return (
        <div
            key={index}
            className={`course-card ${isExpanded ? "expanded" : ""} ${type}-card`}
            style={{
              minHeight: isExpanded ? "auto" : "auto",
            }}
        >
          <ToastContainer />
          <div className="card-overlay"></div>

          <div className={`card-icon ${type}-icon`}>
            <img
                src={`${BaseUrl}${card.imageUrl}`}
                alt={card.name}
                width={type === "foundation" ? 40 : 50}
                height={type === "foundation" ? 40 : 50}
            />
          </div>

          <h3 className="course-name">{card.title}</h3>

          {card.rating > 0 && (
              <div className="stars-container">
                {generateStar(card.rating)}
              </div>
          )}

          <button onClick={() => toggleCard(cardId)} className="toggle-button">
            <BookOpen className="button-icon" />
            {isExpanded ? "Yashirish" : "Batafsil"}
            {isExpanded ? <ChevronUp className="button-icon" /> : <ChevronDown className="button-icon" />}
          </button>

          <div className={`expanded-content ${isExpanded ? "visible" : ""}`}>
            <div className="content-inner">
              <h4 className="topics-title">
                <Trophy className="topics-icon" />
                Kurs Mavzulari
              </h4>
              <div className="topics-list">
                {card.cardSkills.map((skill, topicIndex) => (
                    <div key={topicIndex} className="topic-item" style={{ animationDelay: `${topicIndex * 0.1}s` }}>
                      <CheckCircle className="topic-check-icon" />
                      <span>{skill.title}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="wrap-courses">
        <div className="container">
          <header className="page-header">
            <div className="header-title-wrapper">
              <div className="header-title-inner">
                <h1>{t.title}</h1>
              </div>
            </div>
            <p className="page-subtitle">{t.subtitle}</p>
          </header>

          {periods.map((period, pi) => (
              <section className="course-section" key={pi}>
                <div className="section-header">
                  <div className="section-line"></div>
                  <h2 className="section-title">
                    <span>{period.title}</span>
                    <div className="section-title-shine"></div>
                  </h2>
                  <div className="section-line"></div>
                </div>

                <div className={`courses-grid ${pi === 0 ? "foundation-grid" : "other-grid"}`}>
                  {period.cards.map((card, ci) =>
                      renderCourseCard(card, ci, pi, pi === 0 ? "foundation" : pi === 1 ? "advanced" : "practice"),
                  )}
                </div>
              </section>
          ))}
        </div>
      </div>
  )
}

export default Courses
