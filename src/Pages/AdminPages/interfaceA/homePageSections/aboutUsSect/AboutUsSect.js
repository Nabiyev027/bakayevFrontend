import React from 'react';
import "./aboutUsSect.scss"
import {FaEdit} from "react-icons/fa";
import {PiImageDuotone} from "react-icons/pi";

function AboutUsSect() {
    const [info, setInfo] = React.useState({});

    return (
        <div className={"about-section"}>
            <h1>About Us</h1>
            <div   className={"btn-floater"}>
                <button className={"btn-e"} >Edit <FaEdit /> </button>
            </div>

            <div className={""}>

            </div>

            <div className={"wrap-media"}>

                {
                    info.imgUrl ? <img src={info.imgUrl} alt="" /> : <div className={"img-card"}>
                        <PiImageDuotone className="icon" />
                    </div>
                }

                <video className={"video-card"} controls>
                    <source src="video.mp4" type="video/mp4"/>
                    Sizingiz brauzeringiz videoni qo‘llab-quvvatlamaydi.
                </video>
            </div>

            <div className={"wrap-desc"}>

            </div>


        </div>
    );
}

export default AboutUsSect;