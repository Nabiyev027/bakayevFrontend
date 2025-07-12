// src/pages/Private/Private.jsx
import "./private.scss";
import React, {useState, useEffect} from "react";
import img from "../../../Images/HomePageImages/rasm7.png";
import BCouncil from "../../../Images/Logos/pngwing.com.png";
import {Carousel} from "react-responsive-carousel";
import IeltsImg from "../../../Images/HomePageImages/ielts.webp";
import Comments from "../Comments/Comments";
import {useOutletContext} from "react-router-dom";

function Private() {
    const {isOpen, setIsOpen} = useOutletContext();

    // 1) Read initial lang from localStorage
    const [selectedLang, setSelectedLang] = useState(
        localStorage.getItem("lang") || "UZ"
    );

    // 2) Listen for Navbar’s languageChanged event
    useEffect(() => {
        const onLangChange = () => {
            setSelectedLang(localStorage.getItem("lang") || "UZ");
        };
        window.addEventListener("languageChanged", onLangChange);
        return () => window.removeEventListener("languageChanged", onLangChange);
    }, []);

    // 3) Title/text lookup
    const texts = {
        UZ: {
            header: (
                <>
                    <span>IELTS</span> yordamida <br/>
                    kelajakdagi o’z <br/>
                    <span>maqsad</span> laringizga <br/>
                    erishing!
                </>
            ),
            btn: "Sinov darsiga yozilish!",
            sect1: "Bizning manzilimiz",
            sect2: (
                <>
                    Nima bizni boshqalardan <br/>
                    ajratib turadi
                </>
            ),
            sect3: "Biz Haqimizda",
            sect5: "Ba'zi o'quvchilarimizning izohlari",
        },
        EN: {
            header: (
                <>
                    Achieve your <span>goals</span> <br/>
                    of the future with <br/>
                    the help of <span>IELTS</span>!
                </>
            ),
            btn: "Sign Up for a Trial Class!",
            sect1: "Our Locations",
            sect2: "What Sets Us Apart",
            sect3: "About Us",
            sect5: "Some Student Testimonials",
        },
        RU: {
            header: (
                <>
                    Достигайте своих <span>целей</span> <br/>
                    будущего с помощью <br/>
                    <span>IELTS</span>!
                </>
            ),
            btn: "Записаться на пробное занятие!",
            sect1: "Наши локации",
            sect2: "Что выделяет нас",
            sect3: "О нас",
            sect5: "Отзывы студентов",
        },
    };
    const t = texts[selectedLang];

    // (Your informs, comments, modal logic all unchanged)
    const [informs] = useState([
        {
            img: "https://ieltszone.uz/_next/image?url=%2Fimages%2FwhyChooseUs%2F1.png&w=96&q=75",
            title: "Sifatli ta'lim",
            desc: "Bizning darslar qiziqarli va maroqli tarzda o'tiladi...",
        },
        {
            img: "https://ieltszone.uz/_next/image?url=%2Fimages%2FwhyChooseUs%2F2.png&w=96&q=75",
            title: "Tajribali ustozlar",
            desc: "Darslar British Council sertifikatiga ega ustozlar tomonidan olib boriladi...",
        },
        {
            img: "https://ieltszone.uz/_next/image?url=%2Fimages%2FwhyChooseUs%2F3.png&w=96&q=75",
            title: "Interaktiv metodlar",
            desc: "Gapirish ko'nikmasini rivojlantirish uchun interaktiv usullar qo'llaniladi...",
        },
    ]);

    const [comments] = useState([
        {
            name: "Javlonbek Xojayev",
            rate: "5",
            desc: "Bakayev education o'quv markazi juda ajoyib ekan...",
        },
        {
            name: "Amirbek Nosirov",
            rate: "5",
            desc: "IELTS kurslari uchun juda yaxshi muhit yaratilgan...",
        },
        {
            name: "Ozoda Ibragimova",
            rate: "5",
            desc: "Bu markaz sizga ko‘p imkoniyatlar yaratadi...",
        },
    ]);

    const [activeModal, setActiveModal] = useState(null);
    const openModal = (id) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    return (
        <div className="wrapper-home">
            <div className="container-1">
                <header className="header">
                    <div className="head-box">
                        <h2>{t.header}</h2>
                    </div>
                    <img src={BCouncil} className="ico" alt="#british council"/>
                    <button onClick={() => setIsOpen((p) => !p)} className="btn">
                        {t.btn}
                    </button>
                </header>
            </div>

            <section className="sect-1">
                <div className="container-2">
                    <div className="head-text">
                        <h1>{t.sect1}</h1>
                    </div>
                    <Carousel

                        swipeable={true}
                        emulateTouch={true}
                        autoPlay
                        centerMode
                        centerSlidePercentage={100}
                        dynamicHeight={false}
                        infiniteLoop
                        useKeyboardArrows
                        interval={2000}
                    >
                        {/* slides unchanged */}
                        <div className={"card-wrap"}>
                            <img src={img} alt="Manzil 1" />
                            <div className="mapswrapper">
                                <iframe
                                    title="Manzil 1 xarita"
                                    width="600"
                                    height="450"
                                    loading="lazy"
                                    allowFullScreen
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Bakayev&zoom=10&maptype=roadmap"
                                ></iframe>
                            </div>
                        </div>
                        <div className={"card-wrap"}>
                            <div className="mapswrapper">
                                <iframe
                                    title="Manzil 2 xarita"
                                    width="600"
                                    height="450"
                                    loading="lazy"
                                    allowFullScreen
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Bakayev&zoom=10&maptype=roadmap"
                                ></iframe>
                            </div>
                            <img src={img} alt="Manzil 2" />
                        </div>
                    </Carousel>
                </div>
            </section>

            <section className="sect-2">
                <div className="container-2">
                    <div className="head-text">
                        <h1>{t.sect2}</h1>
                    </div>
                    <div className="grid-boxes">
                        {informs.map((item, index) => (
                            <div className="card-grid" key={index}>
                                <img src={item.img} alt={`img-${index}`}/>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="sect-3">
                <div className="container-2">
                    <section className="about-us">

                            <div className="about-us__header">
                                <h2 className="about-us__title">Biz Haqimizda</h2>
                            </div>

                            <div className="about-us__content">
                                <div className="about-us__left">
                                    <div className="about-us__image-container">
                                        <img src="/placeholder.svg?height=300&width=400" alt="IELTS wooden blocks" className="about-us__image" />
                                        <div className="about-us__image-overlay"></div>
                                    </div>

                                    <div className="about-us__text">
                                        <p>
                                            IELTS imtihoniga tayyorgarlik ko'rish uchun eng zamonaviy va samarali usullardan foydalanamiz. Bizning
                                            tajribali o'qituvchilarimiz sizga yuqori natijaga erishishda yordam beradi.
                                            IELTS imtihoniga tayyorgarlik ko'rish uchun eng zamonaviy va samarali usullardan foydalanamiz. Bizning
                                            tajribali o'qituvchilarimiz sizga yuqori natijaga erishishda yordam beradi.
                                        </p>
                                        <p>
                                            Har bir talabaning individual ehtiyojlarini hisobga olib, maxsus dasturlar ishlab chiqamiz va
                                            muvaffaqiyatli natijalar kafolatlaymiz.IELTS imtihoniga tayyorgarlik ko'rish uchun eng zamonaviy va samarali usullardan foydalanamiz. Bizning
                                            tajribali o'qituvchilarimiz sizga yuqori natijaga erishishda yordam beradi.
                                        </p>
                                    </div>
                                </div>

                                <div className="about-us__right">
                                    <div className="about-us__video-container">
                                        <div className="video-wrapper">
                                            <iframe
                                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                                title="About Us Video"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="about-us__video"
                                            ></iframe>
                                        </div>
                                        <div className="video-play-overlay">
                                            <div className="play-button">
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="about-us__stats">
                                <div className="stat-item">
                                    <div className="stat-number">500+</div>
                                    <div className="stat-label">Muvaffaqiyatli talabalar</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">7.5</div>
                                    <div className="stat-label">O'rtacha IELTS natijasi</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">5+</div>
                                    <div className="stat-label">Yillik tajriba</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">98%</div>
                                    <div className="stat-label">Muvaffaqiyat darajasi</div>
                                </div>
                            </div>
                    </section>
                </div>
            </section>

            <section className="sect-5">
                <div className="container-2">
                    <div className="head-text">
                        <h1>{t.sect5}</h1>
                    </div>
                    <div className="wrap-comments">
                        <Comments comments={comments}/>
                    </div>
                </div>
            </section>

            {/* Modals unchanged */}
            {activeModal === 1 && (
                <div className="custom-modal-overlay" onClick={closeModal}>
                    <div
                        className="custom-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeModal} className="custom-modal-close">
                            ×
                        </button>
                        <h2 className="custom-modal-title">Manzil 1 haqida</h2>
                        <div className="custom-modal-body">
                            <p>Bu yerda Manzil 1 haqida batafsil ma'lumot beriladi.</p>
                        </div>
                    </div>
                </div>
            )}
            {activeModal === 2 && (
                <div className="custom-modal-overlay" onClick={closeModal}>
                    <div
                        className="custom-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeModal} className="custom-modal-close">
                            ×
                        </button>
                        <h2 className="custom-modal-title">Manzil 2 haqida</h2>
                        <div className="custom-modal-body">
                            <p>Bu yerda Manzil 2 haqida batafsil ma'lumot beriladi.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Private;
