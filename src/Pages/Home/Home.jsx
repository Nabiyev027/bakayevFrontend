import React, {useState} from 'react';
import "./home.scss"
import Navbar from "../Navbar/Navbar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import img from "../../Images/HomePageImages/rasm7.png"
import Logo from "../../Images/Logos/logo.png";
import Cloud from "../../Images/Logos/Cloud.png"
import {IoMdCall} from "react-icons/io";
import {IoMail} from "react-icons/io5";
import {FaFacebookSquare, FaInstagram, FaTelegram} from "react-icons/fa";
import {Outlet} from "react-router-dom";
import Modal from "react-modal";
import MyModal from "./MyModal";


function Home() {
    const [isOpen, setIsOpen] = useState(false);

    function onClose() {
        setIsOpen(false);
    }

    return (
        <div className={"wrapper-all"}>
            <MyModal isOpen={isOpen} onClose={onClose} />
            <Navbar setIsOpen={setIsOpen} />
            <Outlet context={{ isOpen, setIsOpen }} />
            <footer className={"footer"}>
                <div className={"container-f"}>
                    <div className={"head-box"}>
                        <div className={"box-1"}>
                            <img src={Logo} alt="#logo"/>
                            <h1>BAKAYEV EDUCATION</h1>
                        </div>
                        <div className={"box-2"}>
                            <img src={Cloud} alt="#cloud"/>
                            <p className={"text"}>Biz sizga eng yaxshi natijalarga erishishingizga
                                yordam berish uchun doim siz bilanmiz. Eng
                                yuqori maqsadni qo'ying - hoziroq bepul sinov
                                darsiga yoziling.</p>
                            <button className="btn-w">Yozilish...</button>
                        </div>
                    </div>
                    <div className={"body-box"}>
                    <div className={"box-1"}>
                            <h1>Biz bilan bog'lanish</h1>
                            <div className={"t-wrap"} >
                                <IoMdCall className="ico call" />
                                +998 93 067 61 46
                            </div>
                            <div className={"t-wrap"} >
                                <IoMdCall className="ico call" />
                                +998 93 067 61 46
                            </div>
                            <div className={"t-wrap"} >
                                <IoMail className={"ico mail"} />
                                bakayeveducation@gmail.com
                            </div>
                        </div> 
                        <div className={"box-2"}>
                            <h1>Ijtimoiy tarmoqlar</h1>
                            <div className={"t-wrap"} >
                                <FaInstagram className="ico inst" />
                                <p className={"text-i"}>
                                    Instagram
                                </p>

                            </div>
                            <div className={"t-wrap"} >
                                <FaTelegram className="ico tele" />
                                <p className="text-t">
                                    Telegram
                                </p>
                            </div>
                            <div className={"t-wrap"} >
                                <FaFacebookSquare className="ico face" />
                                <p className="text-f">
                                    Facebook
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={"foot-box"}>
                        <h2>Copyright © 2025. All Rights Reserved.</h2>
                        <h2>Developed by Web Developer</h2>
                    </div>
                </div>
            </footer>
        </div>
);
}

export default Home;