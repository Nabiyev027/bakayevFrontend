import React from "react";
import "./footer.scss"
import { Phone, Mail, Instagram, Send, Facebook, GraduationCap, Clock, Award } from "lucide-react"

function Footer() {
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
                  <p className="company-tagline">Ta'lim sifatida eng yaxshisi</p>
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
                      Biz sizga eng yaxshi natijalarqa erishishingizga yordam berishga tayyormiz.
                    </span>
                      <span className="message-subtitle">
                      Eng yuqori maqsadni qo'ying - hoziroq bepul sinov darsiga yoziling.
                    </span>
                    </p>
                    <button className="cta-button" onClick={() => alert("Yozilish formasi ochiladi!")}>
                      Yozilish...
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info Cards - Desktop only */}
              <div className="info-cards">
                <div className="info-card">
                  <Clock className="info-icon" />
                  <div className="info-label">Ish vaqti</div>
                  <div className="info-value">9:00 - 18:00</div>
                </div>
                <div className="info-card">
                  <Award className="info-icon award" />
                  <div className="info-label">Tajriba</div>
                  <div className="info-value">5+ yil</div>
                </div>
                <div className="info-card">
                  <GraduationCap className="info-icon graduation" />
                  <div className="info-label">O'quvchilar</div>
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
                  Biz bilan bog'lanish
                </h3>

                <div className="contact-items">
                  <div className="contact-item">
                    <div className="contact-card">
                      <div className="contact-icon">
                        <Phone className="phone-icon" />
                      </div>
                      <div className="contact-details">
                        <div className="contact-label">Telefon raqam</div>
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
                        <div className="contact-label">Qo'shimcha raqam</div>
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
                        <div className="contact-label">Email manzil</div>
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
                  Ijtimoiy tarmoqlar
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
