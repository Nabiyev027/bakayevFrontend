import React, { useState, useEffect, useRef } from "react";
import "./navbar.scss";
import Logo from "../../Images/Logos/bakayev1.png";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("lang") || "UZ"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const languages = [
    { code: "UZ", label: "O'zbekcha" },
    { code: "EN", label: "English" },
    { code: "RU", label: "Русский" },
  ];

  const translations = {
    UZ: {
      home: "Bosh sahifa",
      courses: "Kurslar",
      teachers: "O'qituvchilar",
      students: "O'quvchilar",
      login: "Kirish",
    },
    EN: {
      home: "Home",
      courses: "Courses",
      teachers: "Teachers",
      students: "Students",
      login: "Login",
    },
    RU: {
      home: "Главная",
      courses: "Курсы",
      teachers: "Учителя",
      students: "Ученики",
      login: "Войти",
    },
  };
  const t = translations[selectedLang];

  const handleSelect = (code) => {
    setSelectedLang(code);
    localStorage.setItem("lang", code);
    window.dispatchEvent(new Event("languageChanged"));
    setLangOpen(false);
  };

  // Close mobile menu when resizing above tablet width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // Close when clicking outside sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="navbar">
      <div className="container">
        <img src={Logo} alt="logo" onClick={() => navigate("/")} />

        <ul className="desktop-menu">
          <li onClick={() => navigate("/")}>{t.home}</li>
          <li onClick={() => navigate("/courses")}>{t.courses}</li>
          <li onClick={() => navigate("/teachers")}>{t.teachers}</li>
          <li onClick={() => navigate("/students")}>{t.students}</li>
        </ul>

        <div className="box-3">
          <div className="language-selector">
            <div className="selected" onClick={() => setLangOpen((o) => !o)}>
              {selectedLang}
            </div>
            {langOpen && (
              <ul className="dropdown">
                {languages.map((lang) => (
                  <li key={lang.code} onClick={() => handleSelect(lang.code)}>
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={() => navigate("/login")} className="btn">
            {t.login}
          </button>
          <div className="hamburger" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="overlay" />}

      {/* Sidebar */}
      <div ref={menuRef} className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {[t.home, t.courses, t.teachers, t.students, t.login].map((text, i) => (
          <li
            key={i}
            onClick={() => {
              const paths = [
                "/",
                "/courses",
                "/teachers",
                "/students",
                "/login",
              ];
              navigate(paths[i]);
              setMenuOpen(false);
            }}
          >
            {text}
          </li>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
