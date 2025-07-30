import React, {useRef, useState} from 'react';
import "./teacherPage.scss"
import {IoImage} from "react-icons/io5";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {MdDelete, MdEdit} from "react-icons/md";

function TeacherPage() {
    const [teachers, setTeachers] = useState([
        {
            id: 1,
            name: "Sardor Mamatov",
            image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            ieltsBall: 8.0,
            certificate: "TESOL",
            experience: 5,
            studentsNumber: 250,
            description: "Ingliz tili grammatikasi va IELTS bo‘yicha tajribali mentor." +
                "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi." +
                "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi." +
                "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi."
        },
        {
            id: 2,
            name: "Dilnoza Karimova",
            image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            ieltsBall: 7.5,
            certificate: "CELTA",
            experience: 4,
            studentsNumber: 180,
            description: "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi." +
                "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi." +
                "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi." +
                "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi." +
                "Suhbatlashuv va yozish bo‘yicha mutaxassis, talabalar bilan samimiy muomala qiladi."
        },
        {
            id: 3,
            name: "Shahzod Yusupov",
            image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            ieltsBall: 8.5,
            certificate: "TEFL",
            experience: 6,
            studentsNumber: 320,
            description: "IELTS Reading va Listening bo‘yicha kuchli trener."
        },
        {
            id: 4,
            name: "Nodira Rasulova",
            image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            ieltsBall: 7.0,
            certificate: "DELTA",
            experience: 3,
            studentsNumber: 150,
            description: "Ingliz tili boshlang‘ich darajalarini o‘rgatishda tajribali ustoz."
        },
        {
            id: 5,
            name: "Javlonbek Qodirov",
            image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            ieltsBall: 8.0,
            certificate: "TESOL",
            experience: 7,
            studentsNumber: 400,
            description: "Tinglab tushunish va yozma ishlanmalar bo‘yicha IELTS mutaxassisi."
        },
        {
            id: 6,
            name: "Malika Tursunova",
            image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            ieltsBall: 7.5,
            certificate: "CELTA",
            experience: 5,
            studentsNumber: 220,
            description: "O‘quvchilarning talaffuzini va og‘zaki nutqini yaxshilashda yordam beradi."
        },
        {
            id: 7,
            name: "Malika Tursunova",
            image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
            ieltsBall: 7.5,
            certificate: "CELTA",
            experience: 5,
            studentsNumber: 220,
            description: "O‘quvchilarning talaffuzini va og‘zaki nutqini yaxshilashda yordam beradi."
        }
    ]);
    const [editTeacher, setEditTeacher] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState("");
    const [activeModal, setActiveModal] = useState(false);
    const fileInputRef = useRef(null)
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            /* ---------- 1) HEIC bo‘lsa JPEG ga o‘tkazamiz ---------- */
            let workingBlob = file;
            if (file.type === "image/heic") {
                workingBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.9,          // JPEG sifati
                });
            }

            /* ---------- 2) Barcha formatlarni WebP ga siqamiz ---------- */
            const webpBlob = await imageCompression(workingBlob, {
                maxSizeMB: 0.7,          // Maks. 700 KB (xohlagancha o‘zgartiring)
                maxWidthOrHeight: 1280,  // Uzun tomoni ≤ 1280 px
                fileType: "image/webp",  // WebP formatda chiqsin
                initialQuality: 0.8,     // Boshlang‘ich sifat
                useWebWorker: true,
            });

            /* ---------- 3) Blob'ni File ko‘rinishiga keltiramiz ---------- */
            const webpFile = new File(
                [webpBlob],
                `${file.name.replace(/\.[^.]+$/, "")}.webp`,
                {type: "image/webp"}
            );

            /* ---------- 4) Preview va state ---------- */
            setSelectedImage(URL.createObjectURL(webpFile));
            setImageFile(webpFile);
            setErrors((p) => ({...p, image: ""}));
        } catch (err) {
            console.error("Konvertatsiya/siqish xatosi:", err);
            setErrors((p) => ({...p, image: "Rasmni qayta ishlashda xato"}));
        }
    };

    function toggleModal(){
        setSelectedImage("")
        setImageFile("")
        setErrors("")
        setActiveModal(p=>!p);
    }

    return (
        <div className={"t-page-WrapA"}>

            {
                activeModal && <div className="custom-modal-overlay" onClick={toggleModal}>
                    <div
                        className="custom-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={toggleModal} className="custom-modal-close">
                            ×
                        </button>
                        <h2 className="custom-modal-title">{editTeacher ? "Edit Teacher" : "New Teacher" }</h2>
                        <div className="custom-modal-body">
                            <div className={"img-box"}>

                                {
                                    selectedImage ? <img src={selectedImage} alt="img"/> : <IoImage className={"icon-d"} />
                                }

                                {errors.image && <span className="error">{errors.image}</span>}

                                <label htmlFor="file">
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className={"btn-up"}
                                    >
                                        upload
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file" hidden
                                        accept=".png,.jpg,.jpeg,.svg,.webp,.heic"
                                        onChange={handleImageChange}
                                    />

                                </label>
                            </div>

                            <div className={"wrap-info"}>
                                <div className={"l-wrap"}>
                                    <label>
                                        <h4>First name</h4>
                                        <input
                                            className={"title-i"}
                                            placeholder={"Firstname"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Last name</h4>
                                        <input
                                            className={"title-i"}
                                            placeholder={"Lastname"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>IELTS Ball</h4>
                                        <input
                                            className={"title-i"}
                                            placeholder={"Score"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Certificate</h4>
                                        <input
                                            className={"title-i"}
                                            placeholder={"Certificate name"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Experience</h4>
                                        <input
                                            className={"title-i"}
                                            placeholder={"Experience"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Students number</h4>
                                        <input
                                            className={"title-i"}
                                            placeholder={"Students num"}
                                            type="text"/>
                                    </label>
                                </div>


                                <label>
                                    <h4>Description</h4>
                                    <textarea
                                        className={"text-area"}
                                        placeholder={"Teacher description"}>

                                </textarea>
                                </label>
                            </div>



                        </div>
                    </div>
                </div>
            }

            <button className={"btn"} onClick={toggleModal}>Add New Teacher</button>

            <div className="teachers-wrap">
                {
                    teachers && teachers.map((t, i) => <div className={"t-card"}>
                    <div className={"c-head"}>
                        <div className={"icons-wrap"}>
                            <MdEdit className={"icon v1"}/>
                            <MdDelete className={"icon v2"}/>
                        </div>
                        <img src={t.image} className={"img"} alt="img"/>
                        <div className={"info"}>
                            <h2>{t.name}</h2>
                            <div className={"wrap-skill"}>
                                <h3>IELTS: {t.ieltsBall} </h3>
                                <h3>Certificate: {t.certificate} </h3>
                                <h3>Experience: {t.experience} </h3>
                                <h3>Students: {t.studentsNumber} </h3>
                            </div>
                        </div>

                    </div>

                        <div className={"info-text"}>
                            {t.description}
                        </div>

                    </div>)
                }
            </div>

        </div>
    );
}

export default TeacherPage;