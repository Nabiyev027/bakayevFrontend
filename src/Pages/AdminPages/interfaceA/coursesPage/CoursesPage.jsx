import React, {useEffect, useState} from 'react';
import "./coursesPage.scss"
import {FaDeleteLeft} from "react-icons/fa6";
import {FaCheckSquare} from "react-icons/fa";
import {BiSolidShow} from "react-icons/bi";
import {MdDelete, MdEdit} from "react-icons/md";
import {IoMdAdd} from "react-icons/io";

function CoursesPage() {

    const [periods, setPeriods] = useState([
        {id: 1, title: "Foundation Period 1"},
        {id: 2, title: "Period 2"},
        {id: 3, title: "Period 3"},

    ]);
    const [levels, setLevels] = useState([
        {id: 1, title: "Starter", img: "https://www.img-int.org/sites/default/files/img-logo.png", rating:"1"},
        {id: 2, title: "Beginner", img: "https://www.img-int.org/sites/default/files/img-logo.png", rating:"2"},
        {id: 3, title: "Elementary", img: "https://www.img-int.org/sites/default/files/img-logo.png", rating:"3"},
    ]);
    const [levelContains, setLevelContains] = useState([
        {id: 1, title: "Foundation Period 1"},
        {id: 2, title: "Period 2"},
        {id: 3, title: "Period 3"},
    ]);


    return (
        <div className={"courses-page-WrapA"}>
            <div className={"inp-wrap"}>
                <label className={"lbl-1"}>
                    <h3>Add New Period</h3>
                    <input className={"inp"} type="text" placeholder={"Period name..."}/>
                </label>
                <FaCheckSquare className={"icon v1"}/>
                <FaDeleteLeft className={"icon v2"}/>
            </div>

            <div className={"wrap-box-sects"}>
                <div className={"box"}>
                    <h3 className={"box-head"}>Period</h3>
                    <div className={"box-scroll"}>
                        {
                            periods && periods.map((item, index) => <div className={"per-card"}>
                                <h3 className={"title"}>{item.title}</h3>
                                <div className={"wrap-icons"}>

                                    <MdEdit className={"icon v1"}/>
                                    <MdDelete className={"icon v2"}/>
                                    <BiSolidShow className={"icon v3"}/>
                                </div>
                            </div>)
                        }
                    </div>

                </div>
                <div className={"box"}>
                    <h3 className={"box-head"}>
                        Period level
                        <IoMdAdd className={"iconAdd"} />
                    </h3>

                    <div className={"box-scroll-2"}>
                        {
                            levels && levels.map((item, index) => <div className={"per-card-box"}>
                                <div className={"wrap-icons"}>
                                    <MdEdit className={"icon v1"}/>
                                    <MdDelete className={"icon v2"}/>
                                    <BiSolidShow className={"icon v3"}/>
                                </div>
                                <img src={item.img} alt="img"/>
                                <h3 className={"title"}>{item.title}</h3>
                                <span>star: {item.rating}</span>
                            </div>)
                        }
                    </div>
                </div>
                <div className={"box"}>
                    <h3 className={"box-head"}>
                        Period level
                        <IoMdAdd className={"iconAdd"} />
                    </h3>
                    <div className={"box-scroll"}>
                        {
                            levelContains && levelContains.map((item, index) => <div className={"per-card"}>
                                <h3 className={"title"}>{item.title}</h3>
                                <div className={"wrap-icons"}>

                                    <MdEdit className={"icon v1"}/>
                                    <MdDelete className={"icon v2"}/>
                                </div>
                            </div>)
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CoursesPage;