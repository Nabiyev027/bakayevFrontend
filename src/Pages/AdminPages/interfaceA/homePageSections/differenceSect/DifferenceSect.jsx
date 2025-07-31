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
import * as toastr from "react-toastify";

function DifferenceSect() {
    const [activeModal, setActiveModal] = useState(false);
    const [errorsD, setErrorsD] = useState({});
    const [editDif, setEditDif] = useState(false);
    const [imageFileD, setImageFileD] = useState(null);
    const fileInputRefD = useRef(null);
    const [selectedImageD, setSelectedImageD] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [differences, setDifferences] = useState([]);

    const { lang, isReady } = useLang(); // ✅ kontekstdan lang ni olish

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        if (isReady && lang) {
            getDifferences()
        }
    }, [isReady, lang]);


    function closeModal(){
        setActiveModal(p=>!p);
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

    async function getDifferences() {
        try {

        }catch(err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message); // ✅ Toastify xabari
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("img", imageFileD);
        formData.append("title", title);
        formData.append("description", description);


        try {
          const res = ApiCall(`/differenceSection/post?lang=${lang}`, {method:"POST"}, formData);
          toast.success(res.data);
          closeModal()
          setTitle("")
          setDescription("")
          setImageFileD(null)
          setSelectedImageD(null)

        }catch (err){
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message); // ✅ Toastify xabari
        }
    }

    return (
        <div className={"dif-section"}>
            <ToastContainer/>
            {
                activeModal && <div className="custom-modal-overlay" onClick={closeModal}>
                    <div
                        className="custom-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeModal} className="custom-modal-close">
                            ×
                        </button>
                        <h2 className="custom-modal-title">{editDif ? "Edit Difference" : "New Difference" }</h2>
                        <div className="custom-modal-body">
                            <div className={"img-box"}>

                                {
                                    selectedImageD ? <img src={selectedImageD} alt="img"/> : <IoImage className={"icon-d"} />
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
                                <label>
                                    <h4>Title</h4>
                                    <input
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                        className={"title-i"}
                                        placeholder={"Enter title"}
                                        type="text"/>
                                </label>

                                <label>
                                    <h4>Description</h4>
                                    <textarea
                                        onChange={(e) => setDescription(e.target.value)}
                                        value={description}
                                        className={"text-area"}
                                        placeholder={"Enter description"}>

                                </textarea>
                                </label>
                            </div>

                            <button className={"btn"} onClick={handleSave} >Save</button>
                        </div>
                    </div>
                </div>
            }


            <h1>Difference</h1>
            <div   className={"btn-floater"}>
                <button onClick={()=>setActiveModal(true)}
                        className={"btn-a"} >Add <IoMdAdd /> </button>
            </div>

            <div className={"wrap-dif-cards"}>
                {
                    differences&&differences.map((d,i)=> <div className={"dif-card"}>
                        <img src={d.imgUrl} alt="img"/>
                        <h3>{d.title}</h3>
                        <p>{d.description}</p>
                        <MdModeEdit className={"icon-e icon"} />
                        <RiDeleteBin5Fill className={"icon-d icon"} />
                    </div>)
                }
            </div>
        </div>
    );
}

export default DifferenceSect;