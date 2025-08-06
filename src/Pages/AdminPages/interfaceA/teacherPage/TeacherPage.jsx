import React, {useEffect, useRef, useState} from 'react';
import "./teacherPage.scss"
import {IoImage} from "react-icons/io5";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {MdDelete, MdEdit} from "react-icons/md";
import ApiCall from "../../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify";
import {useLang} from "../langConfig/LangContext";

function TeacherPage() {
    const [teachers, setTeachers] = useState([]);
    const [editTeacher, setEditTeacher] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState("");
    const [activeModal, setActiveModal] = useState(false);
    const fileInputRef = useRef(null)
    const [imageFile, setImageFile] = useState(null);
    const [newTeacher, setNewTeacher] = useState({firstName:"", lastName:"", ieltsBall:"",
        certificate:"", experience:"", numberOfStudents:"", descriptionUz:"", descriptionRu:"", descriptionEn:""});

    const [isEdit, setIsEdit] = useState(false);
    const [selTeacherId, setSelTeacherId] = useState("");
    const [unfilteredTeachers, setUnfilteredTeachers] = useState([]);
    const [imgUrl, setImgUrl] = useState("");

    const {lang, isReady} = useLang();

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        if (isReady && lang) {
            getTeachersInfo()
        }
    }, [isReady, lang]);

    useEffect(() => {
        if (Array.isArray(unfilteredTeachers) && unfilteredTeachers.length > 0 && lang) {
            filterTeachersByLang(unfilteredTeachers);
        }
    }, [unfilteredTeachers, lang]);

    function filterTeachersByLang(data) {
        const filtered = data.map((item) => {
            const matchedTranslation = item.translations.find(
                (t) => t.lang === lang
            );

            return {
                id: item.id,
                imgUrl: item.imgUrl,
                firstName: item.firstName,
                lastName: item.lastName,
                ieltsBall: item.ieltsBall,
                certificate: item.certificate,
                experience: item.experience,
                numberOfStudents: item.numberOfStudents,
                description: matchedTranslation?.description || ""
            };
        });

        setTeachers(filtered);
    }

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
        setImageFile(null)
        setImgUrl("")
        setErrors("")
        clearInputs()
        setActiveModal(p=>!p);
    }

    async function getTeachersInfo() {
        try {
            const res = await ApiCall("/teacherSection", {method: "GET"});
            setUnfilteredTeachers(res.data);
        }catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    async function handleSave(e) {
        e.preventDefault();

        // 🟡 Rasm validatsiyasi (faqat yangi qo‘shishda kerak)
        if (!imageFile && !isEdit) {
            setErrors(prev => ({ ...prev, image: "Rasmni tanlang!" }));
            return;
        }

        const formData = new FormData();
        formData.append("img", imageFile)
        formData.append("firstName", newTeacher.firstName);
        formData.append("lastName", newTeacher.lastName);
        formData.append("ieltsBall", newTeacher.ieltsBall);
        formData.append("certificate", newTeacher.certificate);
        formData.append("experience", newTeacher.experience);
        formData.append("numberOfStudents", newTeacher.numberOfStudents);
        formData.append("descriptionUz", newTeacher.descriptionUz);
        formData.append("descriptionRu", newTeacher.descriptionRu);
        formData.append("descriptionEn", newTeacher.descriptionEn);

        try {
            const res = isEdit
                ? await ApiCall(`/teacherSection/${selTeacherId}`, { method: "PUT" }, formData)
                : await ApiCall(`/teacherSection`, { method: "POST" }, formData);

            toast.success(res.data);
            await getTeachersInfo();
            toggleModal();
            setIsEdit(false);
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }

    function clearInputs() {
        setNewTeacher({
            firstName: "",
            lastName: "",
            ieltsBall: "",
            certificate: "",
            experience: "",
            numberOfStudents: "",
            descriptionUz: "",
            descriptionRu: "",
            descriptionEn: "",
        })
    }

    function editTeacherSect(id) {
        toggleModal()
        setIsEdit(true)
        setSelTeacherId(id)
        unfilteredTeachers.forEach((item)=>{
            if(item.id === id) {
                setImgUrl(item.imgUrl)
                setNewTeacher({
                    firstName: item.firstName,
                    lastName: item.lastName,
                    ieltsBall: item.ieltsBall,
                    certificate: item.certificate,
                    experience: item.experience,
                    numberOfStudents: item.numberOfStudents,
                    descriptionUz: item.translations.find(t => t.lang === "UZ")?.description || "",
                    descriptionRu: item.translations.find(t => t.lang === "RU")?.description || "",
                    descriptionEn: item.translations.find(t => t.lang === "EN")?.description || "",
                });
            }
        })

    }

    async function deleteTeacher(id) {
        try {
            const res = await ApiCall(`/teacherSection/${id}`, {method: "DELETE"});
            toast.success(res.data);
            await getTeachersInfo();
        } catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    return (
        <div className={"t-page-WrapA"}>
            <ToastContainer/>
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

                                {selectedImage || imgUrl ? (
                                    <img src={selectedImage || (BaseUrl + imgUrl)} alt="img" />
                                ) : (
                                    <IoImage className={"icon-d"} />
                                )}

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
                                            onChange={(e)=>setNewTeacher({...newTeacher, firstName: e.target.value})}
                                            value={newTeacher.firstName}
                                            className={"title-i"}
                                            placeholder={"Firstname"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Last name</h4>
                                        <input
                                            onChange={(e)=>setNewTeacher({...newTeacher, lastName: e.target.value})}
                                            value={newTeacher.lastName}
                                            className={"title-i"}
                                            placeholder={"Lastname"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>IELTS Ball</h4>
                                        <input
                                            onChange={(e)=>setNewTeacher({...newTeacher, ieltsBall: e.target.value})}
                                            value={newTeacher.ieltsBall}
                                            className={"title-i"}
                                            placeholder={"Score"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Certificate</h4>
                                        <input
                                            onChange={(e)=>setNewTeacher({...newTeacher, certificate: e.target.value})}
                                            value={newTeacher.certificate}
                                            className={"title-i"}
                                            placeholder={"Certificate name"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Experience</h4>
                                        <input
                                            onChange={(e)=>setNewTeacher({...newTeacher, experience: e.target.value})}
                                            value={newTeacher.experience}
                                            className={"title-i"}
                                            placeholder={"Experience"}
                                            type="number"/>
                                    </label>
                                    <label>
                                        <h4>Students number</h4>
                                        <input
                                            onChange={(e)=>setNewTeacher({...newTeacher, numberOfStudents: e.target.value})}
                                            value={newTeacher.numberOfStudents}
                                            className={"title-i"}
                                            placeholder={"Students num"}
                                            type="number"/>
                                    </label>
                                </div>

                                <div className={"wrap-descriptions"}>
                                    <label className={"lbl"}>
                                        <h4>Description UZ</h4>
                                        <textarea
                                            onChange={(e)=>setNewTeacher({...newTeacher, descriptionUz: e.target.value})}
                                            value={newTeacher.descriptionUz}
                                            className={"text-area"}
                                            placeholder={"Teacher description"}>

                                </textarea>
                                    </label>
                                    <label className={"lbl"}>
                                        <h4>Description RU</h4>
                                        <textarea
                                            onChange={(e)=>setNewTeacher({...newTeacher, descriptionRu: e.target.value})}
                                            value={newTeacher.descriptionRu}
                                            className={"text-area"}
                                            placeholder={"Teacher description"}>

                                </textarea>
                                    </label>
                                    <label className={"lbl"}>
                                        <h4>Description EN</h4>
                                        <textarea
                                            onChange={(e)=>setNewTeacher({...newTeacher, descriptionEn: e.target.value})}
                                            value={newTeacher.descriptionEn}
                                            className={"text-area"}
                                            placeholder={"Teacher description"}>

                                </textarea>
                                    </label>
                                </div>
                            </div>



                        </div>
                        <button onClick={handleSave} className={"btn"}>Save</button>
                    </div>
                </div>
            }

            <button className={"btn"} onClick={toggleModal}>Add New Teacher</button>

            <div className="teachers-wrap">
                {
                    teachers && teachers.map((t, i) => <div key={t.id} className={"t-card"}>
                    <div className={"c-head"}>
                        <div className={"icons-wrap"}>
                            <MdEdit onClick={()=>editTeacherSect(t.id)} className={"icon v1"}/>
                            <MdDelete onClick={()=>deleteTeacher(t.id)} className={"icon v2"}/>
                        </div>
                        <img src={BaseUrl+t.imgUrl} className={"img"} alt="img"/>
                        <div className={"info"}>
                            <h2>{t.firstName +" "+ t.lastName}</h2>
                            <div className={"wrap-skill"}>
                                <h3>IELTS: {t.ieltsBall} </h3>
                                <h3>Certificate: {t.certificate} </h3>
                                <h3>Experience: {t.experience} </h3>
                                <h3>Students: {t.numberOfStudents} </h3>
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