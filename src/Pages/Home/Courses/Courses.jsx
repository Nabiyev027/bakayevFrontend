"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, BookOpen, Clock, UsersIcon, Trophy, CheckCircle } from "lucide-react"
import { FaStar } from "react-icons/fa"
import "./courses.scss" // SCSS faylini import qilish

// V0 preview uchun placeholder rasmlar
const studentPlaceholder = "/placeholder.svg?height=80&width=80"
const preIeltsPlaceholder = "/placeholder.svg?height=80&width=80"
const ieltsPlaceholder = "/placeholder.svg?height=80&width=80"
const preMultiPlaceholder = "/placeholder.svg?height=80&width=80"
const multiPlaceholder = "/placeholder.svg?height=80&width=80"

function Courses() {
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "UZ")
  const [expandedCards, setExpandedCards] = useState([])

  useEffect(() => {
    const onLangChange = () => {
      setSelectedLang(localStorage.getItem("lang") || "UZ")
    }
    window.addEventListener("languageChanged", onLangChange)
    return () => window.removeEventListener("languageChanged", onLangChange)
  }, [])

  const translations = {
    UZ: {
      title: "Bizning Kurslarimiz",
      subtitle: "Har bir darajada professional ta'lim va zamonaviy o'qitish metodlari",
      periods: [
        {
          heading: "Foundation Period",
          courses: [
            {
              name: "Starter",
              stars: 1,
              topics: [
                "Basic English Alphabet",
                "Simple Greetings & Introductions",
                "Numbers & Colors",
                "Family Members",
                "Daily Routines",
                "Basic Vocabulary (100 words)",
              ],
            },
            {
              name: "Beginner",
              stars: 2,
              topics: [
                "Present Simple Tense",
                "Personal Information",
                "Shopping & Money",
                "Food & Drinks",
                "Time & Dates",
                "Basic Conversations",
              ],
            },
            {
              name: "Elementary",
              stars: 3,
              topics: [
                "Past Simple Tense",
                "Future Plans",
                "Describing People & Places",
                "Travel & Transportation",
                "Weather & Seasons",
                "Simple Reading Texts",
              ],
            },
            {
              name: "Pre-Intermediate",
              stars: 4,
              topics: [
                "Present Perfect Tense",
                "Comparative & Superlative",
                "Modal Verbs",
                "Work & Professions",
                "Health & Body",
                "Intermediate Vocabulary",
              ],
            },
            {
              name: "Intermediate",
              stars: 5,
              topics: [
                "Complex Grammar Structures",
                "Conditional Sentences",
                "Passive Voice",
                "Business English Basics",
                "Academic Writing",
                "Listening Comprehension",
              ],
            },
            {
              name: "Upper-Intermediate",
              stars: 6,
              topics: [
                "Advanced Grammar",
                "Phrasal Verbs & Idioms",
                "Formal & Informal Writing",
                "Presentation Skills",
                "Critical Thinking",
                "Advanced Vocabulary",
              ],
            },
          ],
        },
        {
          heading: "Advanced Period",
          courses: [
            {
              name: "Pre-IELTS",
              topics: [
                "IELTS Test Format Overview",
                "Academic Writing Task 1",
                "Academic Writing Task 2",
                "Reading Strategies",
                "Listening Skills Development",
                "Speaking Practice Sessions",
              ],
            },
            {
              name: "Pre-Multi-level",
              topics: [
                "Mixed Level Teaching",
                "Differentiated Instruction",
                "Group Management",
                "Assessment Strategies",
                "Curriculum Adaptation",
                "Student Motivation Techniques",
              ],
            },
          ],
        },
        {
          heading: "Practice Period",
          courses: [
            {
              name: "IELTS",
              topics: [
                "Full IELTS Mock Tests",
                "Band Score Improvement",
                "Time Management Skills",
                "Advanced Writing Techniques",
                "Speaking Fluency Training",
                "Test Day Strategies",
              ],
            },
            {
              name: "Multi-level",
              topics: [
                "Advanced Teaching Methods",
                "Classroom Technology",
                "Student Assessment",
                "Curriculum Development",
                "Professional Development",
                "Teaching Certification",
              ],
            },
          ],
        },
      ],
    },
    EN: {
      title: "Our Courses",
      subtitle: "Professional education and modern teaching methods at every level",
      periods: [
        {
          heading: "Foundation Period",
          courses: [
            {
              name: "Starter",
              stars: 1,
              topics: [
                "Basic English Alphabet",
                "Simple Greetings & Introductions",
                "Numbers & Colors",
                "Family Members",
                "Daily Routines",
                "Basic Vocabulary (100 words)",
              ],
            },
            {
              name: "Beginner",
              stars: 2,
              topics: [
                "Present Simple Tense",
                "Personal Information",
                "Shopping & Money",
                "Food & Drinks",
                "Time & Dates",
                "Basic Conversations",
              ],
            },
            {
              name: "Elementary",
              stars: 3,
              topics: [
                "Past Simple Tense",
                "Future Plans",
                "Describing People & Places",
                "Travel & Transportation",
                "Weather & Seasons",
                "Simple Reading Texts",
              ],
            },
            {
              name: "Pre-Intermediate",
              stars: 4,
              topics: [
                "Present Perfect Tense",
                "Comparative & Superlative",
                "Modal Verbs",
                "Work & Professions",
                "Health & Body",
                "Intermediate Vocabulary",
              ],
            },
            {
              name: "Intermediate",
              stars: 5,
              topics: [
                "Complex Grammar Structures",
                "Conditional Sentences",
                "Passive Voice",
                "Business English Basics",
                "Academic Writing",
                "Listening Comprehension",
              ],
            },
            {
              name: "Upper-Intermediate",
              stars: 6,
              topics: [
                "Advanced Grammar",
                "Phrasal Verbs & Idioms",
                "Formal & Informal Writing",
                "Presentation Skills",
                "Critical Thinking",
                "Advanced Vocabulary",
              ],
            },
          ],
        },
        {
          heading: "Advanced Period",
          courses: [
            {
              name: "Pre-IELTS",
              topics: [
                "IELTS Test Format Overview",
                "Academic Writing Task 1",
                "Academic Writing Task 2",
                "Reading Strategies",
                "Listening Skills Development",
                "Speaking Practice Sessions",
              ],
            },
            {
              name: "Pre-Multi-level",
              topics: [
                "Mixed Level Teaching",
                "Differentiated Instruction",
                "Group Management",
                "Assessment Strategies",
                "Curriculum Adaptation",
                "Student Motivation Techniques",
              ],
            },
          ],
        },
        {
          heading: "Practice Period",
          courses: [
            {
              name: "IELTS",
              topics: [
                "Full IELTS Mock Tests",
                "Band Score Improvement",
                "Time Management Skills",
                "Advanced Writing Techniques",
                "Speaking Fluency Training",
                "Test Day Strategies",
              ],
            },
            {
              name: "Multi-level",
              topics: [
                "Advanced Teaching Methods",
                "Classroom Technology",
                "Student Assessment",
                "Curriculum Development",
                "Professional Development",
                "Teaching Certification",
              ],
            },
          ],
        },
      ],
    },
    RU: {
      title: "Наши курсы",
      subtitle: "Профессиональное образование и современные методы обучения на каждом уровне",
      periods: [
        {
          heading: "Foundation Period",
          courses: [
            {
              name: "Starter",
              stars: 1,
              topics: [
                "Basic English Alphabet",
                "Simple Greetings & Introductions",
                "Numbers & Colors",
                "Family Members",
                "Daily Routines",
                "Basic Vocabulary (100 words)",
              ],
            },
            {
              name: "Beginner",
              stars: 2,
              topics: [
                "Present Simple Tense",
                "Personal Information",
                "Shopping & Money",
                "Food & Drinks",
                "Time & Dates",
                "Basic Conversations",
              ],
            },
            {
              name: "Elementary",
              stars: 3,
              topics: [
                "Past Simple Tense",
                "Future Plans",
                "Describing People & Places",
                "Travel & Transportation",
                "Weather & Seasons",
                "Simple Reading Texts",
              ],
            },
            {
              name: "Pre-Intermediate",
              stars: 4,
              topics: [
                "Present Perfect Tense",
                "Comparative & Superlative",
                "Modal Verbs",
                "Work & Professions",
                "Health & Body",
                "Intermediate Vocabulary",
              ],
            },
            {
              name: "Intermediate",
              stars: 5,
              topics: [
                "Complex Grammar Structures",
                "Conditional Sentences",
                "Passive Voice",
                "Business English Basics",
                "Academic Writing",
                "Listening Comprehension",
              ],
            },
            {
              name: "Upper-Intermediate",
              stars: 6,
              topics: [
                "Advanced Grammar",
                "Phrasal Verbs & Idioms",
                "Formal & Informal Writing",
                "Presentation Skills",
                "Critical Thinking",
                "Advanced Vocabulary",
              ],
            },
          ],
        },
        {
          heading: "Advanced Period",
          courses: [
            {
              name: "Pre-IELTS",
              topics: [
                "IELTS Test Format Overview",
                "Academic Writing Task 1",
                "Academic Writing Task 2",
                "Reading Strategies",
                "Listening Skills Development",
                "Speaking Practice Sessions",
              ],
            },
            {
              name: "Pre-Multi-level",
              topics: [
                "Mixed Level Teaching",
                "Differentiated Instruction",
                "Group Management",
                "Assessment Strategies",
                "Curriculum Adaptation",
                "Student Motivation Techniques",
              ],
            },
          ],
        },
        {
          heading: "Practice Period",
          courses: [
            {
              name: "IELTS",
              topics: [
                "Full IELTS Mock Tests",
                "Band Score Improvement",
                "Time Management Skills",
                "Advanced Writing Techniques",
                "Speaking Fluency Training",
                "Test Day Strategies",
              ],
            },
            {
              name: "Multi-level",
              topics: [
                "Advanced Teaching Methods",
                "Classroom Technology",
                "Student Assessment",
                "Curriculum Development",
                "Professional Development",
                "Teaching Certification",
              ],
            },
          ],
        },
      ],
    },
  }
  const t = translations[selectedLang]

  const images = [
    [
      studentPlaceholder,
      studentPlaceholder,
      studentPlaceholder,
      studentPlaceholder,
      studentPlaceholder,
      studentPlaceholder,
    ],
    [preIeltsPlaceholder, preMultiPlaceholder],
    [ieltsPlaceholder, multiPlaceholder],
  ]

  function generateStar(num) {
    return Array.from({ length: num }, (_, i) => <FaStar key={i} className={`star ${i < num ? "filled" : ""}`} />)
  }

  const toggleCard = (cardId) => {
    setExpandedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const renderCourseCard = (course, index, periodIndex, type) => {
    const cardId = `${type}-${index}`
    const isExpanded = expandedCards.includes(cardId)

    return (
        <div
            key={index}
            className={`course-card ${isExpanded ? "expanded" : ""} ${type}-card`}
            style={{
              minHeight: isExpanded ? "auto" : window.innerWidth < 768 ? "220px" : "280px",
            }}
        >
          <div className="card-overlay"></div>

          <div className={`card-icon ${type}-icon`}>
            <img
                src={images[periodIndex][index] || "/placeholder.svg"}
                alt={course.name}
                width={type === "foundation" ? 40 : 50}
                height={type === "foundation" ? 40 : 50}
            />
          </div>

          <h3 className="course-name">{course.name}</h3>

          {course.stars && <div className="stars-container">{generateStar(course.stars)}</div>}

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
                {course.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="topic-item" style={{ animationDelay: `${topicIndex * 0.1}s` }}>
                      <CheckCircle className="topic-check-icon" />
                      <span>{topic}</span>
                    </div>
                ))}
              </div>
              <div className="course-meta">
                <div className="meta-item">
                  <Clock className="meta-icon" />
                  <span>12 hafta</span>
                </div>
                <div className="meta-item">
                  <UsersIcon className="meta-icon" />
                  <span>8-12 kishi</span>
                </div>
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

          {t.periods.map((period, pi) => (
              <section className="course-section" key={pi}>
                <div className="section-header">
                  <div className="section-line"></div>
                  <h2 className="section-title">
                    <span>{period.heading}</span>
                    <div className="section-title-shine"></div>
                  </h2>
                  <div className="section-line"></div>
                </div>

                <div className={`courses-grid ${pi === 0 ? "foundation-grid" : "other-grid"}`}>
                  {period.courses.map((course, ci) =>
                      renderCourseCard(course, ci, pi, pi === 0 ? "foundation" : pi === 1 ? "advanced" : "practice"),
                  )}
                </div>
              </section>
          ))}
        </div>
      </div>
  )
}

export default Courses
