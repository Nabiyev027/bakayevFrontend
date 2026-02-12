import React, {useEffect, useRef, useState} from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './comments.scss';
import {FaStar} from "react-icons/fa";


const ImageCarousel = ({comments}) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // Effect to handle the resize event
    useEffect(() => {
        // Function to update the state with the current window width
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    let settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 1,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };



    return (
        <div className="carousel-container">
            {comments.length === 1 ? (
                comments.map((comment) => (
                    <div key={comment.id} className={"commentCard1"}>
                        <div className={"comment-text"}>
                            <div className={"text-header"}>
                                <div className="circle">
                                    <h2>{comment.name.split(" ").map(word => word[0]).join("")}</h2>
                                </div>
                                <h3 className={"commentName2"}>{comment.name}</h3>
                                <div className="rating">
                                    {comment.rate}
                                    <FaStar className="ico" />
                                </div>
                            </div>
                            <div className={"text-footer"}>
                                {comment.text}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <Slider {...settings}>
                    {comments.map((comment) => (
                        <div key={comment.id} className={"commentCard"}>
                            <div className={"comment-text"}>
                                <div className={"text-header"}>
                                    <div className="circle">
                                        <h2>{comment.name.split(" ").map(word => word[0]).join("")}</h2>
                                    </div>
                                    <h3 className={"commentName2"}>{comment.name}</h3>
                                    <div className="rating">
                                        {comment.rate}
                                        <FaStar className="ico" />
                                    </div>
                                </div>
                                <div className={"text-footer"}>
                                    {comment.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}

        </div>
    );
};
export default ImageCarousel;