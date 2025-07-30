import React, {useEffect, useRef, useState} from 'react';
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {PiImageDuotone} from "react-icons/pi";
import {LuImageUp} from "react-icons/lu";
import "./headerSect.scss"
import {useLang} from "../../langConfig/LangContext";
import ApiCall from "../../../../../Utils/ApiCall";
import {toast, ToastContainer} from 'react-toastify';

function HeaderSect() {
    // header section
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [errors, setErrors] = useState({});
    const [title, setTitle] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const { lang, isReady } = useLang(); // ✅ kontekstdan lang ni olish

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        if (isReady && lang) {
            getHeaderInfo();
        }
    }, [isReady, lang]);

    async function getHeaderInfo() {
        try {
            const res = await ApiCall(`/headerSection?lang=${lang}`, "GET");
            // title va rasmni set qilishni unutmayin
            setTitle(res.data.title);
            setImgUrl(res.data.imgUrl);
        } catch (err) {
            // AxiosError ichida response.data bo'lishi mumkin
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message); // ✅ Toastify xabari
        }
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

    async function handleSave() {

            try {
                const formData = new FormData();
                if (imageFile) {
                    formData.append("img", imageFile);
                }
                formData.append("title", title);

                const res = await ApiCall(`/headerSection/post?lang=${lang}`, {method:"POST"}, formData)
                toast.success("Malumotlar muvaffaqiyatli qo'shildi!");
                setTitle("")
                setSelectedImage("");
                await getHeaderInfo()

            } catch (err) {
                // AxiosError ichida response.data bo'lishi mumkin
                const message =
                    err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
                toast.error(message); // ✅ Toastify xabari
            }
    }

    return (
        <div className={"header-section"}>
            <ToastContainer />
            <h1>Header</h1>
            <div className={"btn-wrap"}>
                <button className={"btn"} onClick={handleSave} >Save</button>
            </div>

            <div className={"sect-box"}>

                <div className="upload-card">
                    <div className="image-card">
                        {
                            selectedImage ? (
                                <img src={selectedImage} alt="image" />
                            ) : imgUrl ? (
                                <img src={`${BaseUrl + imgUrl}`} alt="Img" />
                            ) : (
                                <PiImageDuotone className="icon" />
                            )
                        }
                    </div>
                    <span className={"err"}>{errors.image}</span>
                    <div
                        className="btn-group"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept=".png,.jpg,.jpeg,.svg,.webp"
                            onChange={handleImageChange}
                        />
                        <button className="btn" >
                            Upload <LuImageUp className="ico" />
                        </button>
                    </div>


                </div>

                <textarea onChange={(e)=>setTitle(e.target.value)} value={title} className={"text-area"}
                          cols="30"
                          rows="10"
                          placeholder="Enter Header title..."
                ></textarea>


            </div>


        </div>
    );
}

export default HeaderSect;