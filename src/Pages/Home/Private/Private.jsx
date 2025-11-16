import "./private.scss";
import React, {useState, useEffect} from "react";
import img from "../../../Images/HomePageImages/rasm7.png";
import BCouncil from "../../../Images/Logos/pngwing.com.png";
import {Carousel} from "react-responsive-carousel";
import Comments from "../Comment2/Comments"
import {useOutletContext} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";
import {useLang} from "../../AdminPages/interfaceA/langConfig/LangContext";
import ApiCall from "../../../Utils/ApiCall";

function Private() {
    const {isOpen, setIsOpen} = useOutletContext();

    // 1) Read initial lang from localStorage
    const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "UZ");

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
            header: (<>
                    <span>IELTS</span> yordamida <br/>
                    kelajakdagi o’z <br/>
                    <span>maqsad</span> laringizga <br/>
                    erishing!
                </>),
            btn: "Sinov darsiga yozilish!",
            sect1: "Bizning manzilimiz",
            sect2: (<>
                    Nima bizni boshqalardan <br/>
                    ajratib turadi
                </>),
            sect3: "Biz Haqimizda",
            sect5: "Ba'zi o'quvchilarimizning izohlari",
            aboutT1: "Muvaffaqiyatli talabalar",
            aboutT2: "O'rtacha IELTS natijasi",
            aboutT3: "Yillik tajriba",
            aboutT4: "Muvaffaqiyat darajasi",
        }, EN: {
            header: (<>
                    Achieve your <span>goals</span> <br/>
                    of the future with <br/>
                    the help of <span>IELTS</span>!
                </>),
            btn: "Sign Up for a Trial Class!",
            sect1: "Our Locations",
            sect2: "What Sets Us Apart",
            sect3: "About Us",
            sect5: "Some Student Testimonials",
            aboutT1: "Successful students",
            aboutT2: "Average IELTS score",
            aboutT3: "Years of experience",
            aboutT4: "Success rate",
        }, RU: {
            header: (<>
                    Достигайте своих <span>целей</span> <br/>
                    будущего с помощью <br/>
                    <span>IELTS</span>!
                </>),
            btn: "Записаться на пробное занятие!",
            sect1: "Наши локации",
            sect2: "Что выделяет нас",
            sect3: "О нас",
            sect5: "Отзывы студентов",
            aboutT1: "Успешные студенты",
            aboutT2: "Средний балл IELTS",
            aboutT3: "Стаж работы",
            aboutT4: "Уровень успеваемости",
        },
    };

    const t = texts[selectedLang];

    // (Your informs, comments, modal logic all unchanged)
    const [informs] = useState([{
        img: "https://ieltszone.uz/_next/image?url=%2Fimages%2FwhyChooseUs%2F1.png&w=96&q=75",
        title: "Sifatli ta'lim",
        desc: "Bizning darslar qiziqarli va maroqli tarzda o'tiladi...",
    }, {
        img: "https://ieltszone.uz/_next/image?url=%2Fimages%2FwhyChooseUs%2F2.png&w=96&q=75",
        title: "Tajribali ustozlar",
        desc: "Darslar British Council sertifikatiga ega ustozlar tomonidan olib boriladi...",
    }, {
        img: "https://ieltszone.uz/_next/image?url=%2Fimages%2FwhyChooseUs%2F3.png&w=96&q=75",
        title: "Interaktiv metodlar",
        desc: "Gapirish ko'nikmasini rivojlantirish uchun interaktiv usullar qo'llaniladi...",
    },]);


    const [newComment, setNewComment] = useState({firstName: "", lastName: "", text: "", rate: 0});
    const [activeModal, setActiveModal] = useState(false);
    const [aboutSection, setAboutSection] = useState({});
    const [headerInfo, setHeaderInfo] = useState({});

    const [videoModal, setVideoModal] = useState(false);
    const [selVideoUrl, setSelVideoUrl] = useState("");

    const [differences, setDifferences] = useState([]);
    const [comments, setComments] = useState([]);

    const {lang, isReady} = useLang();

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        getHeaderInfo();
        getAboutSect();
        getDifferenceSect()
        getComments()
    }, [selectedLang])

    async function getHeaderInfo() {
        try {
            const res = await ApiCall(`/headerSection/home?lang=${selectedLang}`, {method: "GET"});
            setHeaderInfo(res.data);
        } catch (err) {
            const message = err.response?.data || "Ma'lumot mavjud emas";
            toast.warn(message);
        }
    }

    async function getAboutSect() {
        try {
            const res = await ApiCall(`/aboutSection/home?lang=${selectedLang}`, {method: "GET"});
            setAboutSection(res.data)
        } catch (err) {
            const message = err.response?.data || "No data";
            toast.warn(message);
        }
    }

    async function getDifferenceSect() {
        try {
            const res = await ApiCall(`/differenceSection/home?lang=${selectedLang}`, {method: "GET"});
            setDifferences(res.data);
        } catch (err) {
            const message = err.response?.data || "No data";
            toast.warn(message);
        }
    }

    async function getComments() {
        try {
            const res = await ApiCall(`/comment/home`, {method: "GET"});
            setComments(res.data);
        } catch (err) {
            const message = err.response?.data || "No data";
            toast.warn(message);
        }
    }


    function toggleModal() {
        setActiveModal(p => !p);
        setNewComment({firstName: "", lastName: "", text: "", rate: 0});
    }

    function showVideo(url) {
        setSelVideoUrl(url)
        setVideoModal(true)
    }

    function toggleVideoModal() {
        setVideoModal(!videoModal);
        setSelVideoUrl("")
    }

    function handlePostMessage() {
        try {
            axios.post("http://localhost:8080/comment", newComment).then(res => {
                toast.success(res.data);
                toggleModal()
            })
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }

    return (<div className="wrapper-home">
            <ToastContainer/>

            {activeModal && (<div className="custom-modal-overlay" onClick={toggleModal}>
                    <div
                        className="custom-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={toggleModal} className="custom-modal-close">
                            ×
                        </button>
                        <h2 className="custom-modal-title">
                            {selectedLang === "UZ" ? "Komment qoldirish" : selectedLang === "RU" ? "Оставьте комментарий" : "Post a comment"}
                        </h2>
                        <div className="custom-modal-body">
                            <div className={"wrap-inp"}>
                                <label>
                                    <h3>Firstname</h3>
                                    <input type="text" placeholder={"firstname"}
                                           onChange={(e) => setNewComment({...newComment, firstName: e.target.value})}
                                           value={newComment.firstName}
                                    />
                                </label>
                                <label>
                                    <h3>Lastname</h3>
                                    <input type="text" placeholder={"lastname"}
                                           onChange={(e) => setNewComment({...newComment, lastName: e.target.value})}
                                           value={newComment.lastName}
                                    />
                                </label>
                            </div>
                            <label>
                                <h3>Text</h3>
                                <textarea
                                    className="text-area"
                                    placeholder="type something..."
                                    onChange={(e) => {
                                        const words = e.target.value.trim().split(/\s+/); // bo'shliqlar bo'yicha bo'lish
                                        if (words.length <= 50) {
                                            setNewComment({...newComment, text: e.target.value});
                                        }
                                    }}
                                    value={newComment.text}
                                ></textarea>
                                <small>{newComment.text.trim().split(/\s+/).filter(w => w !== "").length}/50
                                    words</small>
                            </label>
                            <label>
                                <h3>Rating (1 - 5)</h3>
                                <input className={"rate"} type="number"
                                       onChange={(e) => setNewComment({...newComment, rate: e.target.value})}
                                       value={newComment.rate}
                                />
                            </label>

                            <button onClick={handlePostMessage} className={"btn"}>save</button>
                        </div>
                    </div>
                </div>)}

            {videoModal && (<div className="custom-modal-video-overlay" onClick={toggleVideoModal}>
                    <div
                        className="custom-modal-video-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={toggleVideoModal} className="custom-modal-video-close">
                            ×
                        </button>
                        <div className="custom-modal-video-body">
                            <video key={selVideoUrl} className="video-card" controls>
                                <source src={`${BaseUrl}${selVideoUrl}`} type="video/mp4"/>
                                Brauzeringiz videoni qo‘llab-quvvatlamaydi.
                            </video>
                        </div>
                    </div>
                </div>)}

            <div className="container-1"
                 style={{
                     backgroundImage: `url('${BaseUrl}${headerInfo.imgUrl}')`,
                 }}>
                <header className="header">
                    <div className="head-box">
                        <h2>
                            {headerInfo?.title
                                ?.split(" ")
                                .reduce((acc, word, i) => {
                                    const index = Math.floor(i / 3);
                                    if (!acc[index]) acc[index] = [];
                                    acc[index].push(word);
                                    return acc;
                                }, [])
                                .map((group, i) => (<span key={i}>
        {group.map((word, j) => (<React.Fragment key={j}>
            <span className={word.toLowerCase() === "ielts" ? "red-word" : ""}>
              {word}
            </span>{" "}
            </React.Fragment>))}
                                        <br/>
      </span>))}
                        </h2>


                    </div>
                    <img src={BCouncil} className="ico" alt="#british council"/>
                    <button onClick={() => setIsOpen((p) => !p)} className="btn">
                        {t.btn}
                    </button>
                </header>
            </div>

            <section className="sect-1">
                <div className="container-2">

                    <div className="head-text__header">
                        <h2 className="head-text__title">{t.sect1}</h2>
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
                            <img src={img} alt="Manzil 1"/>
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
                            <img src={img} alt="Manzil 2"/>
                        </div>
                    </Carousel>
                </div>
            </section>

            <section className="sect-2">
                <div className="container-2">

                    <div className="head-text__header">
                        <h2 className="head-text__title">{t.sect2}</h2>
                    </div>

                    <div className="grid-boxes">
                        {differences && differences.map((item, index) => (<div className="card-grid" key={index}>
                                <img src={`${BaseUrl}${item.imgUrl}`} alt={`img-${index}`}/>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>))}
                    </div>
                </div>
            </section>

        <section className="sect-3">
            <div className="container-2">
                <section className="about-us">

                    <div className="about-us__header">
                        <h2 className="about-us__title">{t.sect3}</h2>
                    </div>

                    <div className="about-us__content">
                        <div className="about-us__left">
                            <div className="about-us__image-container">
                                <img src={`${BaseUrl}${aboutSection.imgUrl}`} alt="IELTS wooden blocks"
                                     className="about-us__image"/>
                                <div className="about-us__image-overlay"></div>
                            </div>

                            <div className="about-us__text">
                                <p>
                                    {aboutSection.desc1}
                                </p>
                                <p>
                                    {aboutSection.desc2}
                                </p>
                            </div>
                        </div>

                        <div className="about-us__right">
                            <div className="about-us__video-container">

                                <img onClick={()=>showVideo(aboutSection.videoUrl)} src={`${BaseUrl}${aboutSection.videoThumbnailUrl}`} alt=""/>

                                <div className="video-play-overlay">
                                    <div className="play-button">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="about-us__stats">
                        <div className="stat-item">
                            <div className="stat-number">{aboutSection.successfulStudents}</div>
                            <div className="stat-label">{t.aboutT1}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{aboutSection.averageScore}</div>
                            <div className="stat-label">{t.aboutT2}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{aboutSection.yearsExperience}</div>
                            <div className="stat-label">{t.aboutT3}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{aboutSection.successRate}</div>
                            <div className="stat-label">{t.aboutT4}</div>
                        </div>
                    </div>
                </section>
            </div>
        </section>

            <section className="sect-5">
                <div className="container-2">

                    <div className="head-text__header">
                        <h2 className="head-text__title">{t.sect5}</h2>
                    </div>

                    <div className="wrap-comments">
                        <Comments comments={comments}/>
                    </div>

                    <button onClick={toggleModal} className={"btn-comment"}>
                        {selectedLang === "UZ" ? "Komment qoldirish" : selectedLang === "RU" ? "Оставьте комментарий" : "Post a comment"}
                    </button>

                </div>
            </section>


        </div>);
}

export default Private;
