"use client"

import { useState, useEffect, useRef } from "react"
import "./teachers.css" // Fayl nomi .css ga qaytarildi

export default function Teachers() {
  const mainTeacher = {
    name: "Nabiyev Abduvali",
    title: "IELTS 9.0 Instructor",
    image: "/placeholder.svg?height=400&width=400",
    achievements: [
      { label: "IELTS ball", value: "9.0", icon: "🎯" },
      { label: "Sertifikati", value: "CELTA", icon: "🏆" },
      { label: "Tajribasi", value: "10+", icon: "📚" },
      { label: "O'quvchilari", value: "650+", icon: "👥" },
    ],
    description:
        "O'zbekistonda 8-bo'lib IELTS 9.0 ballni qo'lga kiritganman va bu o'zimga bo'lgan ishonchimni oshirgan...",
    fullDescription:
        "O'zbekistonda 8-bo'lib IELTS 9.0 ballni qo'lga kiritganman va bu o'zimga bo'lgan ishonchimni oshirgan. Hozirda 650+ o'quvchiga IELTS va ingliz tilini o'rgatib kelmoqdaman. CELTA sertifikatiga ega bo'lib, zamonaviy o'qitish metodlarini qo'llayman.",
  }

  const allTeachers = [
    {
      id: 1,
      name: "Sardor Aliyev",
      subject: "TOEFL 115",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Aziza Karimova",
      subject: "General English",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Nabiyev Abduvali",
      subject: "IELTS 9.0",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Malika Tosheva",
      subject: "IELTS 8.5",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      name: "Bobur Rahimov",
      subject: "Business English",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      name: "Nilufar Yusupova",
      subject: "Academic Writing",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const [activeTeacher, setActiveTeacher] = useState(0)
  const [isManuallySelected, setIsManuallySelected] = useState(false)
  const intervalRef = useRef(null)

  // Auto rotation function
  const startAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      if (!isManuallySelected) {
        setActiveTeacher((prev) => (prev + 1) % allTeachers.length)
      }
    }, 6000)
  }

  // Handle manual teacher selection
  const handleTeacherClick = (index) => {
    setActiveTeacher(index)
    setIsManuallySelected(true)

    // Resume auto rotation after 10 seconds of manual selection
    setTimeout(() => {
      setIsManuallySelected(false)
    }, 10000)
  }

  useEffect(() => {
    startAutoRotation()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isManuallySelected])

  return (
      <div className="teachers-page">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-background">
            <div className="floating-elements">
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
              <div className="floating-circle circle-3"></div>
            </div>
          </div>

          <div className="hero-content">
            <h1 className="main-title">Bizning O'qituvchilarimiz</h1>

            {/* Teachers Pills */}
            <div className="teachers-pills-container">
              {allTeachers.map((teacher, index) => (
                  <div
                      key={teacher.id}
                      className={`teacher-pill ${index === activeTeacher ? "active" : "inactive"}`}
                      onClick={() => handleTeacherClick(index)}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        transitionDelay: index === activeTeacher ? "0s" : `${Math.abs(index - activeTeacher) * 0.05}s`,
                      }}
                  >
                    <div className="pill-image">
                      <img src={teacher.image || "/placeholder.svg"} alt={teacher.name} />
                    </div>
                    <div className={`pill-info ${index === activeTeacher ? "show" : "hide"}`}>
                      <span className="pill-name">{teacher.name}</span>
                      <span className="pill-subject">{teacher.subject}</span>
                    </div>
                  </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="main-content">
              {/* Teacher Profile */}
              <div className="teacher-profile">
                <div className="profile-image-container">
                  <div className="profile-background"></div>
                  <div className="profile-image">
                    <img src={mainTeacher.image || "/placeholder.svg"} alt={mainTeacher.name} />
                  </div>
                  <div className="profile-glow"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-section">
                <div className="stats-grid">
                  {mainTeacher.achievements.map((achievement, index) => (
                      <div key={index} className="stat-card" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                        <div className="stat-icon">{achievement.icon}</div>
                        <div className="stat-value">{achievement.value}</div>
                        <div className="stat-label">{achievement.label}</div>
                      </div>
                  ))}
                </div>

                {/* Description Card */}
                <div className="description-card">
                  <div className="description-content">
                    <p>{mainTeacher.fullDescription}</p>
                    <div className="description-gradient"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Professional Sertifikat</h3>
              <p>CELTA va boshqa xalqaro sertifikatlarga ega</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Yuqori Natijalar</h3>
              <p>O'quvchilarning 95% muvaffaqiyat ko'rsatkichi</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Individual Yondashuv</h3>
              <p>Har bir o'quvchiga maxsus dastur</p>
            </div>
          </div>
        </div>
      </div>
  )
}
