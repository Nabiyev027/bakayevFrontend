import React, { useState, useEffect } from "react";
import "./InterfaceA.scss";
import { UploadCloud } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const languages = ["uz", "ru", "en"];

export default function InterfaceA() {
  const [activeSection, setActiveSection] = useState(1);
  const [selectedLang, setSelectedLang] = useState("uz");

  // Sections 1–5
  const [section1, setSection1] = useState({
    uz: { title: "", text: "" },
    ru: { title: "", text: "" },
    en: { title: "", text: "" },
  });
  const [section2, setSection2] = useState({
    uz: { title: "", image: null, url: "" },
    ru: { title: "", image: null, url: "" },
    en: { title: "", image: null, url: "" },
  });
  const [section3, setSection3] = useState({
    uz: { title: "", image: null, description: "" },
    ru: { title: "", image: null, description: "" },
    en: { title: "", image: null, description: "" },
  });
  const [section4, setSection4] = useState({
    uz: { title: "", image: null },
    ru: { title: "", image: null },
    en: { title: "", image: null },
  });
  const [section5, setSection5] = useState({
    uz: { image: null, text: "" },
    ru: { image: null, text: "" },
    en: { image: null, text: "" },
  });

  // Section 6: Course
  const emptyCourse = {
    id: "",
    periodId: "",
    order: "",
    name: "",
    stars: "",
    image: null,
  };
  const [section6, setSection6] = useState({
    uz: { ...emptyCourse },
    ru: { ...emptyCourse },
    en: { ...emptyCourse },
  });

  // Section 7: Student
  const emptyStudent = {
    image: null,
    name: "",
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
    overall: "",
  };
  const [section7, setSection7] = useState({
    uz: { ...emptyStudent },
    ru: { ...emptyStudent },
    en: { ...emptyStudent },
  });

  // Section 8: Teacher
  const emptyTeacher = {
    id: "",
    name: "",
    ball: "",
    certificate: "",
    experience: "",
    pupils: "",
    image: null,
    text: "",
  };
  const [section8, setSection8] = useState({
    uz: { ...emptyTeacher },
    ru: { ...emptyTeacher },
    en: { ...emptyTeacher },
  });

  // Section 9: Footer
  const [section9, setSection9] = useState({
    uz: {
      title: "",
      description: "",
      facebook: "",
      instagram: "",
      telegram: "",
    },
    ru: {
      title: "",
      description: "",
      facebook: "",
      instagram: "",
      telegram: "",
    },
    en: {
      title: "",
      description: "",
      facebook: "",
      instagram: "",
      telegram: "",
    },
  });

  useEffect(() => {
    const onLangChange = () =>
      setSelectedLang(localStorage.getItem("lang") || "uz");
    window.addEventListener("languageChanged", onLangChange);
    return () => window.removeEventListener("languageChanged", onLangChange);
  }, []);

  const handleSectionChange = (id) => setActiveSection(id);
  const handleLangChange = (e) => setSelectedLang(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const setters = {
      1: setSection1,
      2: setSection2,
      3: setSection3,
      4: setSection4,
      5: setSection5,
      6: setSection6,
      7: setSection7,
      8: setSection8,
      9: setSection9,
    };
    const setter = setters[activeSection];
    setter((prev) => ({
      ...prev,
      [selectedLang]: {
        ...prev[selectedLang],
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const setters = {
      2: setSection2,
      3: setSection3,
      4: setSection4,
      5: setSection5,
      6: setSection6,
      7: setSection7,
      8: setSection8,
    };
    const setter = setters[activeSection];
    setter((prev) => ({
      ...prev,
      [selectedLang]: {
        ...prev[selectedLang],
        image: file,
      },
    }));
  };

  const handleSave = () => {
    if (activeSection <= 5) {
      toast.success(`Section ${activeSection} saved!`);
    } else if (activeSection === 6) {
      toast.success("Course added!");
    } else if (activeSection === 7) {
      toast.success("Student added!");
    } else if (activeSection === 8) {
      toast.success("Teacher added!");
    } else {
      toast.success("Footer saved!");
    }
  };

  return (
    <div className="interfaceA">
      {/* Language Selector */}
      <div className="language-selector">
        <select value={selectedLang} onChange={handleLangChange}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Section Buttons */}
      <div className="section-buttons">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
          <button
            key={id}
            className={activeSection === id ? "active" : ""}
            onClick={() => handleSectionChange(id)}
          >
            {id <= 5
              ? `Section ${id}`
              : id === 6
              ? "Course"
              : id === 7
              ? "Student"
              : id === 8
              ? "Teacher"
              : "Footer"}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="section-content">
        {/* SECTION 1 */}
        {activeSection === 1 && (
          <div className="section">
            <label>
              Title:
              <input
                name="title"
                value={section1[selectedLang].title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Text:
              <textarea
                name="text"
                value={section1[selectedLang].text}
                onChange={handleInputChange}
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              Save Section 1
            </button>
          </div>
        )}

        {/* SECTION 2 */}
        {activeSection === 2 && (
          <div className="section">
            <label>
              Title:
              <input
                name="title"
                value={section2[selectedLang].title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              URL:
              <input
                name="url"
                value={section2[selectedLang].url}
                onChange={handleInputChange}
              />
            </label>
            <div className="image-upload">
              <label htmlFor="img2" className="upload-label">
                {section2[selectedLang].image ? (
                  <img
                    src={URL.createObjectURL(section2[selectedLang].image)}
                    className="preview-img"
                    alt=""
                  />
                ) : (
                  <UploadCloud className="upload-icon" />
                )}
                <span>Upload Image</span>
              </label>
              <input id="img2" type="file" hidden onChange={handleFileChange} />
            </div>
            <button className="save-button" onClick={handleSave}>
              Save Section 2
            </button>
          </div>
        )}

        {/* SECTION 3 */}
        {activeSection === 3 && (
          <div className="section">
            <label>
              Title:
              <input
                name="title"
                value={section3[selectedLang].title}
                onChange={handleInputChange}
              />
            </label>
            <div className="image-upload">
              <label htmlFor="img3" className="upload-label">
                {section3[selectedLang].image ? (
                  <img
                    src={URL.createObjectURL(section3[selectedLang].image)}
                    className="preview-img"
                    alt=""
                  />
                ) : (
                  <UploadCloud className="upload-icon" />
                )}
                <span>Upload Image</span>
              </label>
              <input id="img3" type="file" hidden onChange={handleFileChange} />
            </div>
            <label>
              Description:
              <textarea
                name="description"
                value={section3[selectedLang].description}
                onChange={handleInputChange}
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              Save Section 3
            </button>
          </div>
        )}

        {/* SECTION 4 */}
        {activeSection === 4 && (
          <div className="section">
            <label>
              Title:
              <input
                name="title"
                value={section4[selectedLang].title}
                onChange={handleInputChange}
              />
            </label>
            <div className="image-upload">
              <label htmlFor="img4" className="upload-label">
                {section4[selectedLang].image ? (
                  <img
                    src={URL.createObjectURL(section4[selectedLang].image)}
                    className="preview-img"
                    alt=""
                  />
                ) : (
                  <UploadCloud className="upload-icon" />
                )}
                <span>Upload Image</span>
              </label>
              <input id="img4" type="file" hidden onChange={handleFileChange} />
            </div>
            <button className="save-button" onClick={handleSave}>
              Save Section 4
            </button>
          </div>
        )}

        {/* SECTION 5 */}
        {activeSection === 5 && (
          <div className="section">
            <div className="image-upload">
              <label htmlFor="img5" className="upload-label">
                {section5[selectedLang].image ? (
                  <img
                    src={URL.createObjectURL(section5[selectedLang].image)}
                    className="preview-img"
                    alt=""
                  />
                ) : (
                  <UploadCloud className="upload-icon" />
                )}
                <span>Upload Image</span>
              </label>
              <input id="img5" type="file" hidden onChange={handleFileChange} />
            </div>
            <label>
              Text:
              <textarea
                name="text"
                value={section5[selectedLang].text}
                onChange={handleInputChange}
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              Save Section 5
            </button>
          </div>
        )}

        {/* SECTION 6 */}
        {activeSection === 6 && (
          <div className="section">
            <label>
              ID:
              <input
                name="id"
                value={section6[selectedLang].id}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Period ID:
              <input
                name="periodId"
                value={section6[selectedLang].periodId}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Order:
              <input
                type="number"
                name="order"
                value={section6[selectedLang].order}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Name:
              <input
                name="name"
                value={section6[selectedLang].name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Stars:
              <input
                type="number"
                name="stars"
                value={section6[selectedLang].stars}
                onChange={handleInputChange}
              />
            </label>
            <div className="image-upload">
              <label htmlFor="img6" className="upload-label">
                {section6[selectedLang].image ? (
                  <img
                    src={URL.createObjectURL(section6[selectedLang].image)}
                    className="preview-img"
                    alt=""
                  />
                ) : (
                  <UploadCloud className="upload-icon" />
                )}
                <span>Upload Image</span>
              </label>
              <input id="img6" type="file" hidden onChange={handleFileChange} />
            </div>
            <button className="save-button" onClick={handleSave}>
              Add Course
            </button>
          </div>
        )}

        {/* SECTION 7 */}
        {activeSection === 7 && (
          <div className="section">
            <label>
              Name:
              <input
                name="name"
                value={section7[selectedLang].name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Listening:
              <input
                name="listening"
                value={section7[selectedLang].listening}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Reading:
              <input
                name="reading"
                value={section7[selectedLang].reading}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Writing:
              <input
                name="writing"
                value={section7[selectedLang].writing}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Speaking:
              <input
                name="speaking"
                value={section7[selectedLang].speaking}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Overall:
              <input
                name="overall"
                value={section7[selectedLang].overall}
                onChange={handleInputChange}
              />
            </label>
            <div className="image-upload">
              <label htmlFor="img7" className="upload-label">
                {section7[selectedLang].image ? (
                  <img
                    src={URL.createObjectURL(section7[selectedLang].image)}
                    className="preview-img"
                    alt=""
                  />
                ) : (
                  <UploadCloud className="upload-icon" />
                )}
                <span>Upload Image</span>
              </label>
              <input id="img7" type="file" hidden onChange={handleFileChange} />
            </div>
            <button className="save-button" onClick={handleSave}>
              Add Student
            </button>
          </div>
        )}

        {/* SECTION 8 */}
        {activeSection === 8 && (
          <div className="section">
            <label>
              ID:
              <input
                name="id"
                value={section8[selectedLang].id}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Name:
              <input
                name="name"
                value={section8[selectedLang].name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              IELTS Score:
              <input
                name="ball"
                value={section8[selectedLang].ball}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Certificate:
              <input
                name="certificate"
                value={section8[selectedLang].certificate}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Experience:
              <input
                name="experience"
                value={section8[selectedLang].experience}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Pupils:
              <input
                name="pupils"
                value={section8[selectedLang].pupils}
                onChange={handleInputChange}
              />
            </label>
            <div className="image-upload">
              <label htmlFor="img8" className="upload-label">
                {section8[selectedLang].image ? (
                  <img
                    src={URL.createObjectURL(section8[selectedLang].image)}
                    className="preview-img"
                    alt=""
                  />
                ) : (
                  <UploadCloud className="upload-icon" />
                )}
                <span>Upload Image</span>
              </label>
              <input id="img8" type="file" hidden onChange={handleFileChange} />
            </div>
            <label>
              Bio:
              <textarea
                name="text"
                value={section8[selectedLang].text}
                onChange={handleInputChange}
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              Add Teacher
            </button>
          </div>
        )}

        {/* SECTION 9: Footer */}
        {activeSection === 9 && (
          <div className="section">
            <label>
              Title:
              <input
                name="title"
                value={section9[selectedLang].title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={section9[selectedLang].description}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Facebook Link:
              <input
                name="facebook"
                value={section9[selectedLang].facebook}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Instagram Link:
              <input
                name="instagram"
                value={section9[selectedLang].instagram}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Telegram Link:
              <input
                name="telegram"
                value={section9[selectedLang].telegram}
                onChange={handleInputChange}
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              Save Footer
            </button>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
