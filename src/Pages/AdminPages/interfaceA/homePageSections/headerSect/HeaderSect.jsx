import React, { useEffect, useRef, useState } from 'react';
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import { PiImageDuotone } from "react-icons/pi";
import { LuImageUp } from "react-icons/lu";
import "./headerSect.scss";
import { useLang } from "../../langConfig/LangContext";
import ApiCall from "../../../../../Utils/ApiCall";
import { toast, ToastContainer } from 'react-toastify';

function HeaderSect() {
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [errors, setErrors] = useState({});
    const [headInfo, setHeadInfo] = useState({ titleUz: "", titleRu: "", titleEn: "" });
    const [imgUrl, setImgUrl] = useState("");

    const { lang, isReady } = useLang();
    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        if (isReady && lang) {
            getHeaderInfo();
        }
    }, [isReady, lang]);

    async function getHeaderInfo() {
        try {
            const res = await ApiCall(`/headerSection`, "GET");
            setHeadInfo({
                titleUz: res.data.translations?.find(t => t.lang === 'UZ')?.title || '',
                titleRu: res.data.translations?.find(t => t.lang === 'RU')?.title || '',
                titleEn: res.data.translations?.find(t => t.lang === 'EN')?.title || '',
            });
            setImgUrl(res.data.imgUrl);
        } catch (err) {
            const message = err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            let workingBlob = file;
            if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
                workingBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.9,
                });
            }

            const webpBlob = await imageCompression(workingBlob, {
                maxSizeMB: 0.7,
                maxWidthOrHeight: 1280,
                fileType: "image/webp",
                initialQuality: 0.8,
                useWebWorker: true,
            });

            const webpFile = new File(
                [webpBlob],
                `${file.name.replace(/\.[^.]+$/, "")}.webp`,
                { type: "image/webp" }
            );

            setSelectedImage(URL.createObjectURL(webpFile));
            setImageFile(webpFile);
            setErrors(prev => ({ ...prev, image: "" }));
        } catch (err) {
            console.error("Rasmni qayta ishlashda xato:", err);
            setErrors(prev => ({ ...prev, image: "Rasmni qayta ishlashda xatolik yuz berdi" }));
        }
    };

    async function handleSave() {
        const { titleUz, titleRu, titleEn } = headInfo;

        if (!titleUz.trim() || !titleRu.trim() || !titleEn.trim()) {
            toast.warn("Barcha til maydonlarini to'ldiring!");
            return;
        }

        try {
            const formData = new FormData();
            if (imageFile) {
                formData.append("img", imageFile);
            }

            formData.append("titleUz", titleUz);
            formData.append("titleRu", titleRu);
            formData.append("titleEn", titleEn);

            const res = await ApiCall(`/headerSection/post`, { method: "POST" }, formData);
            toast.success(res.data);

            setHeadInfo({ titleUz: "", titleRu: "", titleEn: "" });
            setSelectedImage("");
            await getHeaderInfo();
        } catch (err) {
            const message = err.response?.data || "Saqlashda xatolik yuz berdi";
            toast.error(message);
        }
    }

    return (
        <div className="header-section">
            <ToastContainer />
            <h1>Header</h1>

            <div className="btn-wrap">
                <button className="btn" onClick={handleSave}>Save</button>
            </div>

            <div className="sect-box">
                <div className="upload-card">
                    <div className="image-card">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Preview" />
                        ) : imgUrl ? (
                            <img src={`${BaseUrl}${imgUrl}`} alt="Server Img" />
                        ) : (
                            <PiImageDuotone className="icon" />
                        )}
                    </div>
                    <span className="err">{errors.image}</span>
                    <div
                        className="btn-group"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept=".png,.jpg,.jpeg,.svg,.webp,.heic"
                            onChange={handleImageChange}
                        />
                        <button className="btn">
                            Upload <LuImageUp className="ico" />
                        </button>
                    </div>
                </div>

                <div className="card-area">
                    <textarea
                        value={headInfo.titleUz}
                        onChange={(e) => setHeadInfo({ ...headInfo, titleUz: e.target.value })}
                        className="text-area"
                        placeholder="Sarlavha (Uzbekcha)..."
                        rows="5"
                    />
                    <textarea
                        value={headInfo.titleRu}
                        onChange={(e) => setHeadInfo({ ...headInfo, titleRu: e.target.value })}
                        className="text-area"
                        placeholder="Заголовок (Русский)..."
                        rows="5"
                    />
                    <textarea
                        value={headInfo.titleEn}
                        onChange={(e) => setHeadInfo({ ...headInfo, titleEn: e.target.value })}
                        className="text-area"
                        placeholder="Header Title (English)..."
                        rows="5"
                    />
                </div>
            </div>
        </div>
    );
}

export default HeaderSect;
