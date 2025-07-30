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

            <div className={"wrap-scroll"}>
                <div className={"wrap-about-info"}>
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

                    <div className={"wrap-text-desc"}>
                        <label>
                            <h3>Decription1</h3>
                            <textarea className={"area"}></textarea>
                        </label>
                        <label>
                            <h3>Decription2</h3>
                            <textarea className={"area"}></textarea>
                        </label>

                    </div>
                </div>
            </div>





        </div>
    );
}

export default AboutUsSect;