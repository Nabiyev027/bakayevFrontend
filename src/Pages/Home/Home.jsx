import React, {useState} from 'react';
import Navbar from "../Navbar/Navbar";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {Outlet} from "react-router-dom";
import MyModal from "./MyModal";
import Footer from "../Footer/Footer";


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
            <Footer setIsOpen={setIsOpen} />

        </div>
);
}

export default Home;