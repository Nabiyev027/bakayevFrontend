import React, {useEffect, useState} from "react";
import "./footer.scss"
import { Phone, Mail, Instagram, Send, Facebook, GraduationCap, Clock, Award } from "lucide-react"

function Footer() {

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

  const texts = {
    UZ: {
      info1T:"Ta'lim sifatida eng yaxshisi",
      info2TitleH:"Biz sizga eng yaxshi natijalarqa erishishingizga yordam berishga tayyormiz.",
      info2TitleD:"Eng yuqori maqsadni qo'ying - hoziroq bepul sinov darsiga yoziling.",
      btn:"Yozilish...",
      card1:"Ish vaqti",
      card2:"Tajriba",
      card3:"O'quvchilar",
      title1:"Biz bilan bog'lanish",
      phone1:"Telefon raqam",
      phone2:"Qo'shimcha raqam",
      email:"Email manzil",
      title2:"Ijtimoiy tarmoqlar"
    },
    EN:{
      info1T:"The best as an education",
      info2TitleH:"We are ready to help you achieve the best results.",
      info2TitleD:"Set your sights high - sign up for a free trial lesson now.",
      btn:"Registration...",
      card1:"working time",
      card2:"Experience",
      card3:"Students",
      title1:"Contact us",
      phone1:"Phone number",
      phone2:"Additional phone number",
      email:"Email address",
      title2:"Social networks"
    },
    RU:{
      info1T:"Лучшее образование",
      info2TitleH:"Мы готовы помочь вам достичь наилучших результатов",
      info2TitleD:"Поставьте перед собой высокие цели — запишитесь на бесплатный пробный урок прямо сейчас",
      btn:"Регистрация...",
      card1:"Время работы",
      card2:"Опыт",
      card3:"Ученики",
      title1:"Связаться с нами",
      phone1:"Номер телефона",
      phone2:"Дополнительный номер телефона",
      email:"Адрес электронной почты",
      title2:"Социальные сети"
    }
  };

  const t = texts[selectedLang];

  return (
      <footer className="modern-footer">
        {/* Background Pattern */}
        <div className="background-pattern"></div>

        {/* Main Footer Content */}
        <div className="footer-container">
          <div className="footer-grid">
            {/* Company Info & Message */}
            <div className="company-section">
              {/* Company Header */}
              <div className="company-header">
                <div className="company-logo">
                  <GraduationCap className="logo-icon" />
                </div>
                <div className="company-info">
                  <h2 className="company-name">BAKAYEV EDUCATION</h2>
                  <p className="company-tagline">{t.info1T}</p>
                </div>
              </div>

              {/* Modern Message Card */}
              <div className="message-card">
                <div className="message-content">
                  <div className="message-icon">
                    <Award className="award-icon" />
                  </div>
                  <div className="message-text">
                    <p className="message-description">
                    <span className="message-title">
                      {t.info2TitleH}
                    </span>
                      <span className="message-subtitle">
                      {t.info2TitleD}
                    </span>
                    </p>
                    <button className="cta-button" onClick={() => alert("Yozilish formasi ochiladi!")}>
                      {t.btn}
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info Cards - Desktop only */}
              <div className="info-cards">
                <div className="info-card">
                  <Clock className="info-icon" />
                  <div className="info-label">{t.card1}</div>
                  <div className="info-value">9:00 - 18:00</div>
                </div>
                <div className="info-card">
                  <Award className="info-icon award" />
                  <div className="info-label">{t.card2}</div>
                  <div className="info-value">5+ yil</div>
                </div>
                <div className="info-card">
                  <GraduationCap className="info-icon graduation" />
                  <div className="info-label">{t.card3}</div>
                  <div className="info-value">1000+</div>
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="contact-section">
              {/* Contact Information */}
              <div className="contact-info">
                <h3 className="section-title">
                  <Phone className="title-icon" />
                  {t.title1}
                </h3>

                <div className="contact-items">
                  <div className="contact-item">
                    <div className="contact-card">
                      <div className="contact-icon">
                        <Phone className="phone-icon" />
                      </div>
                      <div className="contact-details">
                        <div className="contact-label">{t.phone1}</div>
                        <a href="tel:+998930676146" className="contact-link">
                          +998 93 067 61 46
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-card">
                      <div className="contact-icon">
                        <Phone className="phone-icon" />
                      </div>
                      <div className="contact-details">
                        <div className="contact-label">{t.phone2}</div>
                        <a href="tel:+998930676146" className="contact-link">
                          +998 93 067 61 46
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-card">
                      <div className="contact-icon">
                        <Mail className="mail-icon" />
                      </div>
                      <div className="contact-details">
                        <div className="contact-label">{t.email}</div>
                        <a href="mailto:bakayeveducation@gmail.com" className="contact-link email">
                          bakayeveducation@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-media">
                <h3 className="section-title">
                  <Instagram className="title-icon" />
                  {t.title2}
                </h3>

                <div className="social-items">
                  <a href="#" className="social-item instagram">
                    <div className="social-icon">
                      <Instagram className="instagram-icon" />
                    </div>
                    <div className="social-details">
                      <div className="social-name">Instagram</div>
                      <div className="social-handle">@bakayev_education</div>
                    </div>
                  </a>

                  <a href="#" className="social-item telegram">
                    <div className="social-icon">
                      <Send className="telegram-icon" />
                    </div>
                    <div className="social-details">
                      <div className="social-name">Telegram</div>
                      <div className="social-handle">@bakayev_edu</div>
                    </div>
                  </a>

                  <a href="#" className="social-item facebook">
                    <div className="social-icon">
                      <Facebook className="facebook-icon" />
                    </div>
                    <div className="social-details">
                      <div className="social-name">Facebook</div>
                      <div className="social-handle">Bakayev Education</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="bottom-container">
            <div className="copyright">Copyright © 2025. All Rights Reserved.</div>
            <div className="developer-credit">
              Developed by <span className="developer-name">Web Developer</span>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Gradient */}
        <div className="bottom-gradient"></div>
      </footer>
  )
}

export default Footer;
