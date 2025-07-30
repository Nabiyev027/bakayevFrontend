import React, {useRef, useState} from 'react';
import "./differenceSect.scss"
import {IoMdAdd} from "react-icons/io";
import Modal from "react-modal";
import {IoImage} from "react-icons/io5";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {MdModeEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";

function DifferenceSect() {
    //Difference Section
    const [activeModal, setActiveModal] = useState(false);
    const [errorsD, setErrorsD] = useState({});

    const [editDif, setEditDif] = useState(false);
    const [imageFileD, setImageFileD] = useState(null);
    const fileInputRefD = useRef(null);
    const [selectedImageD, setSelectedImageD] = useState("");

    const differences = [
        {
            imgUrl: "data:image/jpeg;base64,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",
            title: "Birinchi obyekt",
            description: "Bu birinchi obyektning tavsifi."
        },
        {
            imgUrl: "data:image/jpeg;base64,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",
            title: "Ikkinchi obyekt",
            description: "Bu ikkinchi obyektning tavsifi."
        },
        {
            imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqTGehrL7r2n5mGfKBFsGOq9hHnbIqCRH1EA&s",
            title: "Uchinchi obyekt",
            description: "Bu uchinchi obyektning tavsifi."
        },
        {
            imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctWTvyuW95I8x9ImHXS0OK_r5iznc7ILa4Q&s",
            title: "To'rtinchi obyekt",
            description: "Bu 4 obyektning tavsifi."
        },
        {
            imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctWTvyuW95I8x9ImHXS0OK_r5iznc7ILa4Q&s",
            title: "beshinchi obyekt",
            description: "Bu 5 obyektning tavsifi."
        },
        {
            imgUrl: "https://freepngdesign.com/content/uploads/images/abstract-logo-marks-5872041526.png",
            title: "oltinchi obyekt",
            description: "Bu 6 obyektning tavsifi."
        }
    ];

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

    return (
        <div className={"dif-section"}>
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
                                        className={"title-i"}
                                        placeholder={"Enter title"}
                                        type="text"/>
                                </label>

                                <label>
                                    <h4>Description</h4>
                                    <textarea
                                        className={"text-area"}
                                        placeholder={"Enter description"}>

                                </textarea>
                                </label>
                            </div>



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