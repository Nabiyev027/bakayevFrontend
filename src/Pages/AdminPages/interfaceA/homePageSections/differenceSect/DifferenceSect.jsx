import React, {useEffect, useRef, useState} from 'react';
import "./differenceSect.scss"
import {IoMdAdd} from "react-icons/io";
import {IoImage} from "react-icons/io5";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {MdModeEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";
import ApiCall from "../../../../../Utils/ApiCall";
import {useLang} from "../../langConfig/LangContext";
import {toast, ToastContainer} from "react-toastify";

function DifferenceSect() {
    const [activeModal, setActiveModal] = useState(false);
    const [errorsD, setErrorsD] = useState({});
    const [editDif, setEditDif] = useState(false);
    const [imageFileD, setImageFileD] = useState(null);
    const fileInputRefD = useRef(null);
    const [selectedImageD, setSelectedImageD] = useState("");
    const [titleUz, setTitleUz] = useState("");
    const [titleRu, setTitleRu] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [descriptionUz, setDescriptionUz] = useState("");
    const [descriptionRu, setDescriptionRu] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [differences, setDifferences] = useState([]);
    const [unfilteredDif, setUnfilteredDif] = useState([]);

    const [isEdit,setIsEdit] = useState(false);
    const [selDifId, setSelDifId] = useState("");
    const [editDifImgUrl, setEditDifImgUrl] = useState("");

    const {lang, isReady} = useLang();

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        if (isReady && lang) {
            getDifferences()
        }
    }, [isReady, lang]);

    useEffect(() => {
        if (Array.isArray(unfilteredDif) && unfilteredDif.length > 0 && lang) {
            filterDifferencesByLang(unfilteredDif);
        }
    }, [unfilteredDif, lang]);


    function toggleModal() {
        setSelectedImageD("");
        setImageFileD(null);
        setEditDifImgUrl("")
        setErrorsD("");
        clearInputs()
        setActiveModal(p => !p);
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
            setSelectedImageD(URL.createObjectURL(webpFile));
            setImageFileD(webpFile);
            setErrorsD((p) => ({...p, image: ""}));
        } catch (err) {
            console.error("Konvertatsiya/siqish xatosi:", err);
            setErrorsD((p) => ({...p, image: "Rasmni qayta ishlashda xato"}));
        }
    };

    function filterDifferencesByLang(data) {
        const filtered = data.map((item) => {
            const matchedTranslation = item.differenceTranslationResDtos.find(
                (t) => t.lang === lang
            );

            return {
                id: item.id,
                imgUrl: item.imgUrl,
                title: matchedTranslation?.title || "",
                description: matchedTranslation?.description || ""
            };
        });

        setDifferences(filtered);
    }


    async function getDifferences() {
        try {
            const res = await ApiCall("/differenceSection/get", {method: "GET"});
            setUnfilteredDif(res.data)

        } catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message); // ✅ Toastify xabari
        }
    }

    async function handleSave(e) {
        e.preventDefault();

        // 🟡 Rasm validatsiyasi (faqat yangi qo‘shishda kerak)
        if (!imageFileD && !isEdit) {
            setErrorsD(prev => ({ ...prev, image: "Rasmni tanlang!" }));
            return;
        }

        const formData = new FormData();
        formData.append("img", imageFileD);
        formData.append("titleUz", titleUz);
        formData.append("descriptionUz", descriptionUz);
        formData.append("titleRu", titleRu);
        formData.append("descriptionRu", descriptionRu);
        formData.append("titleEn", titleEn);
        formData.append("descriptionEn", descriptionEn);

        try {
            const res = isEdit
                ? await ApiCall(`/differenceSection/update/${selDifId}`, { method: "PUT" }, formData)
                : await ApiCall(`/differenceSection/post`, { method: "POST" }, formData);

            toast.success(res.data);
            await getDifferences();
            toggleModal();
            setIsEdit(false);
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }


    function clearInputs() {
        setTitleUz("");
        setDescriptionUz("");
        setTitleRu("")
        setDescriptionRu("")
        setTitleEn("");
        setDescriptionEn("");
        setImageFileD(null)
        setSelectedImageD(null)
    }

    function editDifference(id) {
        toggleModal()
        setIsEdit(true)
        setSelDifId(id)
        unfilteredDif.forEach((item) => {
            if(item.id === id){
                setEditDifImgUrl(item.imgUrl);
                item.differenceTranslationResDtos.forEach((translation) => {
                    if(translation.lang === "UZ") {
                        setTitleUz(translation.title);
                        setDescriptionUz(translation.description);
                    }
                    if (translation.lang === "RU") {
                        setTitleRu(translation.title);
                        setDescriptionRu(translation.description);
                    }
                    if(translation.lang === "EN") {
                        setTitleEn(translation.title);
                        setDescriptionEn(translation.description);
                    }
                })

            }
        })

    }

    async function deleteDif(id) {
        const confirmed = window.confirm("Bu elementni o'chirishga ishonchingiz komilmi?");
        if (!confirmed) return;

        try {
            const res = await ApiCall(`/differenceSection/delete/${id}`,{method: "DELETE"});
            toast.success(res.data);
            await getDifferences()
        }catch(err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    return (
        <div className={"dif-section"}>
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
                        <h2 className="custom-modal-title">{editDif ? "Edit Difference" : "New Difference"}</h2>
                        <div className="custom-modal-body">
                            <div className={"img-box"}>

                                {
                                    selectedImageD ? (
                                        <img src={selectedImageD} alt="img"/>
                                    ) : isEdit && editDifImgUrl ? (
                                        <img src={BaseUrl + editDifImgUrl} alt="img"/>
                                    ) : (
                                        <IoImage className={"icon-d"} />
                                    )
                                }

                                {errorsD.image && <span className="error">{errorsD.image}</span>}

                                <label htmlFor="file">
                                    <button
                                        onClick={() => fileInputRefD.current.click()}
                                        className={"btn-up"}
                                    >
                                        upload
                                    </button>
                                    <input
                                        ref={fileInputRefD}
                                        type="file" hidden
                                        accept=".png,.jpg,.jpeg,.svg,.webp,.heic"
                                        onChange={handleImageChange}
                                    />

                                </label>
                            </div>

                            <div className={"wrap-info"}>
                                <div className={"wrap-label"}>
                                    <label>
                                        <h4>Title UZ</h4>
                                        <input
                                            onChange={(e) => setTitleUz(e.target.value)}
                                            value={titleUz}
                                            className={"title-i"}
                                            placeholder={"Sarlavha Uz..."}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Description UZ</h4>
                                        <textarea
                                            onChange={(e) => setDescriptionUz(e.target.value)}
                                            value={descriptionUz}
                                            className={"text-area"}
                                            placeholder={"Tavsifni kiriting..."}>

                                </textarea>
                                    </label>
                                </div>
                                <div className={"wrap-label"}>
                                    <label>
                                        <h4>Title RU</h4>
                                        <input
                                            onChange={(e) => setTitleRu(e.target.value)}
                                            value={titleRu}
                                            className={"title-i"}
                                            placeholder={"Заголовок"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Description RU</h4>
                                        <textarea
                                            onChange={(e) => setDescriptionRu(e.target.value)}
                                            value={descriptionRu}
                                            className={"text-area"}
                                            placeholder={"Введите описание..."}>

                                </textarea>
                                    </label>
                                </div>
                                <div className={"wrap-label"}>
                                    <label>
                                        <h4>Title EN</h4>
                                        <input
                                            onChange={(e) => setTitleEn(e.target.value)}
                                            value={titleEn}
                                            className={"title-i"}
                                            placeholder={"Enter title"}
                                            type="text"/>
                                    </label>
                                    <label>
                                        <h4>Description EN</h4>
                                        <textarea
                                            onChange={(e) => setDescriptionEn(e.target.value)}
                                            value={descriptionEn}
                                            className={"text-area"}
                                            placeholder={"Enter description..."}>

                                </textarea>
                                    </label>
                                </div>

                            </div>

                            <button className={"btn"} onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            }


            <h1>Difference</h1>
            <div className={"btn-floater"}>
                <button onClick={() => setActiveModal(true)}
                        className={"btn-a"}>Add <IoMdAdd/></button>
            </div>

            <div className={"wrap-dif-cards"}>
                {
                    differences && differences.map((d, i) => <div  key={d.id} className={"dif-card"}>
                        <img src={BaseUrl+ d.imgUrl} alt="img"/>
                        <h3>{d.title}</h3>
                        <p>{d.description}</p>
                        <MdModeEdit onClick={()=>editDifference(d.id)} className={"icon-e icon"}/>
                        <RiDeleteBin5Fill onClick={()=>deleteDif(d.id)} className={"icon-d icon"}/>
                    </div>)
                }
            </div>
        </div>
    );
}

export default DifferenceSect;