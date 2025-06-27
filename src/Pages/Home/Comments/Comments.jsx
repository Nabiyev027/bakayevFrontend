import React from 'react';
import "./comments.scss"
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import {FaRegStar} from "react-icons/fa";

function Comments({comments}) {

    const responsive = {
        superLargeDesktop: {
            breakpoint: {max: 4000, min: 1400},
            items: 1
        },
        middleDesktop: {
            breakpoint: {max: 1400, min: 1024},
            items: 1,
        },
        desktop: {
            breakpoint: {max: 1024, min: 860},
            items: 1,
        },
        middleTablet: {
            breakpoint: {max: 860, min: 768},
            items: 1,
        },
        tablet: {
            breakpoint: {max: 768, min: 464},
            items: 1,
        },
        mobile: {
            breakpoint: {max: 464, min: 0},
            items: 1,
        },
    };

    return(<Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        autoPlay={true}
        centerMode={true}
        autoPlaySpeed={7000}
    >
        {
            comments&&comments.map(comment => <div className={"comment-card"} key={comment.id}>
                <div className={"comment-title"}>
                    <div className={"wrap-name"}>
                        <div className={"circle"}>
                            <h2>{comment.name.split(" ").map(word => word[0]).join("")}</h2>
                        </div>
                        <h2>{comment.name}</h2>
                    </div>

                    <div className={"rating"}>
                        <h3>{comment.rate}</h3>
                        <FaRegStar className={"ico"} />
                    </div>
                </div>
                <div className="comment-desc">
                    <p>{comment.desc}</p>
                </div>
            </div>)
        }


    </Carousel>);
}

export default Comments;