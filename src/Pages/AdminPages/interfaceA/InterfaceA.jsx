 import React, {useState, useEffect, useRef} from "react";
import "./InterfaceA.scss";
import "react-toastify/dist/ReactToastify.css";
 import HeaderSect from "./homePageSections/headerSect/HeaderSect";
 import DifferenceSect from "./homePageSections/differenceSect/DifferenceSect";
 import AboutUsSect from "./homePageSections/aboutUsSect/AboutUsSect";

const languages = ["uz", "ru", "en"];

export default function InterfaceA() {
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedSection, setSelectedSection] = useState(1);

    function changeSectionHome(e) {
        setSelectedSection(parseInt(e.target.value));
    }

    return (
    <div className="interfaceA">

        <h1>Interface settings</h1>
        <div className={"wrap-btn-bar"}>
            <div className={"interface-btn-bar"}>
                <button
                    onClick={() => setPageNumber(1)}
                    className={`page-btn ${pageNumber===1 ? "active" : ""}`}>Home Page</button>
                <button
                    onClick={() => setPageNumber(2)}
                    className={`page-btn ${pageNumber===2 ? "active" : ""}`}>Courses Page</button>
                <button
                    onClick={() => setPageNumber(3)}
                    className={`page-btn ${pageNumber===3 ? "active" : ""}`}>Teachers Page</button>
                <button
                    onClick={() => setPageNumber(4)}
                    className={`page-btn ${pageNumber===4 ? "active" : ""}`}>Students</button>
            </div>

            <select className={"select-l"}>
                <option value="uz">UZ</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
            </select>
        </div>


        <div className={"interface-pagination"}>

            {/*home page*/}
            {
                pageNumber===1 ? <div className={"home-page-wrapA"}>

                    <select className={"select-section"}
                        onChange={(e)=>changeSectionHome(e)}
                            value={selectedSection} >
                        <option value="1">Header</option>
                        <option value="2">Difference</option>
                        <option value="3">About Us</option>
                        <option value="4">Footer</option>

                    </select>

                {/*  Sections  */}

                    {/*headerSection*/}
                    {
                         selectedSection===1 ? <HeaderSect/> : null
                    }

                    {/*difSect*/}
                    {
                        selectedSection===2 ? <DifferenceSect/> : null
                    }

                    {/*aboutSect*/}
                    {
                        selectedSection===3 ? <AboutUsSect/> : null
                    }

                    {/*    */}
                    {
                        selectedSection===4 ? <div className={"footer-section"}>
                            <h1>Footer</h1>
                        </div> : null
                    }


                </div> : null
            }

            {/*course page*/}
            {
                pageNumber===2 ? <div className={"courses-page-WrapA"}>

                </div> : null
            }

            {/*teachers Page*/}
            {
                pageNumber===3 ? <div className={"teachers-page-WrapA"}>

                </div> : null
            }

            {/*students Page*/}
            {
                pageNumber===4 ? <div className={"students-page-WrapA"}>

                </div> : null
            }

        </div>

    </div>
  );
}
