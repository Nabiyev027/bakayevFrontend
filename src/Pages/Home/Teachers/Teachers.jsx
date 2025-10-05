import { useState, useEffect } from "react"
import "./teachers.css"
import ApiCall from "../../../Utils/ApiCall"
import { toast, ToastContainer } from "react-toastify"

// 🌍 Tilga bog‘liq matnlar
const translations = {
  UZ: {
    title: "Bizning O'qituvchilarimiz",
    certTitle: "Professional Sertifikat",
    certDesc: "CELTA va boshqa xalqaro sertifikatlarga ega",
    resultsTitle: "Yuqori Natijalar",
    resultsDesc: "O'quvchilarning 95% muvaffaqiyat ko'rsatkichi",
    approachTitle: "Individual Yondashuv",
    approachDesc: "Har bir o'quvchiga maxsus dastur",
    stats: {
      ielts: "IELTS ball",
      cert: "Sertifikati",
      exp: "Tajribasi",
      students: "O'quvchilari",
    },
  },
  EN: {
    title: "Our Teachers",
    certTitle: "Professional Certificate",
    certDesc: "Holds CELTA and other international certifications",
    resultsTitle: "High Results",
    resultsDesc: "95% success rate among students",
    approachTitle: "Individual Approach",
    approachDesc: "Personalized program for every student",
    stats: {
      ielts: "IELTS Score",
      cert: "Certificate",
      exp: "Experience",
      students: "Students",
    },
  },
  RU: {
    title: "Наши Преподаватели",
    certTitle: "Профессиональный Сертификат",
    certDesc: "Имеет CELTA и другие международные сертификаты",
    resultsTitle: "Высокие Результаты",
    resultsDesc: "95% успеха среди студентов",
    approachTitle: "Индивидуальный Подход",
    approachDesc: "Персональная программа для каждого ученика",
    stats: {
      ielts: "Результат IELTS",
      cert: "Сертификат",
      exp: "Опыт",
      students: "Студенты",
    },
  },
}

export default function Teachers() {
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "UZ")
  const BaseUrl = "http://localhost:8080"

  const [teachers, setTeachers] = useState([])
  const [selTeacher, setSelTeacher] = useState(null)
  const [teacherData, setTeacherData] = useState({})

  // Til o‘zgarganda kuzatuvchi
  useEffect(() => {
    const onLangChange = () => {
      setSelectedLang(localStorage.getItem("lang") || "UZ")
    }
    window.addEventListener("languageChanged", onLangChange)
    return () => window.removeEventListener("languageChanged", onLangChange)
  }, [])

  // O‘qituvchilarni olish
  useEffect(() => {
    getTeachers()
  }, [])

  // Tanlangan o‘qituvchi yoki til o‘zgarsa — ma’lumotni qayta yuklash
  useEffect(() => {
    getTeacherData()
  }, [selTeacher, selectedLang])

  async function getTeachers() {
    try {
      const res = await ApiCall(`/teacherSection/getHome`, { method: "GET" })
      setTeachers(res.data)
      if (res.data.length > 0) {
        const firstTeacher = res.data[0]
        setSelTeacher(firstTeacher)
        await getTeacherData(firstTeacher)
      }
    } catch (err) {
      const message = err.response?.data || "No data"
      toast.warn(message)
    }
  }

  async function getTeacherData(teacher = selTeacher) {
    if (!teacher || !teacher.id) return
    try {
      const res = await ApiCall(
          `/teacherSection/getInfo/${teacher.id}?lang=${selectedLang}`,
          { method: "GET" }
      )
      setTeacherData(res.data)
    } catch (err) {
      const message = err.response?.data || "No teacher data"
      toast.warn(message)
    }
  }

  const handleTeacherClick = (teacher) => {
    setSelTeacher(teacher)
  }

  const t = translations[selectedLang] || translations.UZ

  return (
      <div className="teachers-page">
        <ToastContainer />
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
            <h1 className="main-title">{t.title}</h1>

            {/* Teachers Pills */}
            <div className="teachers-pills-container">
              {teachers.map((teacher, index) => (
                  <div
                      key={teacher.id}
                      className={`teacher-pill ${
                          teacher.id === selTeacher?.id ? "active" : "inactive"
                      }`}
                      onClick={() => handleTeacherClick(teacher)}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        transitionDelay:
                            teacher.id === selTeacher?.id
                                ? "0s"
                                : `${Math.abs(teacher.id - selTeacher?.id) * 0.05}s`,
                      }}
                  >
                    <div className="pill-image">
                      <img src={`${BaseUrl}${teacher.imageUrl}`} alt={teacher.name} />
                    </div>
                    <div
                        className={`pill-info ${
                            teacher.id === selTeacher?.id ? "show" : "hide"
                        }`}
                    >
                      <span className="pill-name">{teacher.name}</span>
                      <span className="pill-subject">IELTS: {teacher.ieltsBall}</span>
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
                    <img
                        src={
                          teacherData?.imgUrl
                              ? `${BaseUrl}${teacherData.imgUrl}`
                              : "/placeholder.svg"
                        }
                        alt={`${teacherData?.firstName || ""} ${
                            teacherData?.lastName || ""
                        }`}
                    />
                  </div>
                  <div className="profile-glow"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-section">
                <div className="stats-grid">
                  {[
                    { label: t.stats.ielts, value: teacherData?.ieltsBall, icon: "🎯" },
                    { label: t.stats.cert, value: teacherData?.certificate, icon: "🏆" },
                    {
                      label: t.stats.exp,
                      value: `${teacherData?.experience}+ yil`,
                      icon: "📚",
                    },
                    {
                      label: t.stats.students,
                      value: `${teacherData?.numberOfStudents}+`,
                      icon: "👥",
                    },
                  ].map((achievement, index) => (
                      <div
                          key={index}
                          className="stat-card"
                          style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                      >
                        <div className="stat-icon">{achievement.icon}</div>
                        <div className="stat-value">{achievement.value}</div>
                        <div className="stat-label">{achievement.label}</div>
                      </div>
                  ))}
                </div>

                {/* Description Card */}
                <div className="description-card">
                  <div className="description-content">
                    <p>{teacherData?.description}</p>
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
              <h3>{t.certTitle}</h3>
              <p>{t.certDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>{t.resultsTitle}</h3>
              <p>{t.resultsDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>{t.approachTitle}</h3>
              <p>{t.approachDesc}</p>
            </div>
          </div>
        </div>
      </div>
  )
}
