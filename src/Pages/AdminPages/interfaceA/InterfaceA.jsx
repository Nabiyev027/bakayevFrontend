import React, { useState } from "react";
import "./InterfaceA.scss";
import "react-toastify/dist/ReactToastify.css";
import HeaderSect from "./homePageSections/headerSect/HeaderSect";
import DifferenceSect from "./homePageSections/differenceSect/DifferenceSect";
import AboutUsSect from "./homePageSections/aboutUsSect/AboutUsSect";
import FooterSect from "./homePageSections/footerSect/FooterSect";
import CoursesPage from "./coursesPage/CoursesPage";
import TeacherPage from "./teacherPage/TeacherPage";
import ResultPage from "./resultPage/ResultPage";
import { useLang } from "./langConfig/LangContext"; // lang context'dan foydalanamiz

export default function InterfaceA() {
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedSection, setSelectedSection] = useState(1);
    const { lang, setLang } = useLang(); // context orqali lang

    function changeSectionHome(e) {
        setSelectedSection(parseInt(e.target.value));
    }

    function changeLang(e) {
        setLang(e.target.value);
    }

    return (
        <div className="interfaceA">
            <h1>Interface settings</h1>

            <div className="wrap-btn-bar">
                <div className="interface-btn-bar">
                    <button onClick={() => setPageNumber(1)} className={`page-btn ${pageNumber === 1 ? "active" : ""}`}>Home Page</button>
                    <button onClick={() => setPageNumber(2)} className={`page-btn ${pageNumber === 2 ? "active" : ""}`}>Courses Page</button>
                    <button onClick={() => setPageNumber(3)} className={`page-btn ${pageNumber === 3 ? "active" : ""}`}>Teachers Page</button>
                    <button onClick={() => setPageNumber(4)} className={`page-btn ${pageNumber === 4 ? "active" : ""}`}>Students</button>
                </div>

                <select onChange={changeLang} value={lang} className="select-l">
                    <option value="UZ">UZ</option>
                    <option value="RU">RU</option>
                    <option value="EN">EN</option>
                </select>
            </div>

            <div className="interface-pagination">
                {pageNumber === 1 && (
                    <div className="home-page-wrapA">
                        <select className="select-section" onChange={changeSectionHome} value={selectedSection}>
                            <option value="1">Header</option>
                            <option value="2">Difference</option>
                            <option value="3">About Us</option>
                            <option value="4">Footer</option>
                        </select>

                        {selectedSection === 1 && <HeaderSect />}
                        {selectedSection === 2 && <DifferenceSect />}
                        {selectedSection === 3 && <AboutUsSect />}
                        {selectedSection === 4 && <FooterSect />}
                    </div>
                )}

                {pageNumber === 2 && <CoursesPage />}
                {pageNumber === 3 && <TeacherPage />}
                {pageNumber === 4 && <ResultPage />}
            </div>
        </div>
    );
}
