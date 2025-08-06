import React, {useEffect, useRef, useState} from 'react';
import "./aboutUsSect.scss"
import {PiImageDuotone} from "react-icons/pi";
import {MdUploadFile} from "react-icons/md";
import {toast} from "react-toastify";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {BiSolidVideoRecording} from "react-icons/bi";
import ApiCall from "../../../../../Utils/ApiCall";
import {useLang} from "../../langConfig/LangContext";

function AboutUsSect() {
    const [errors, setErrors] = useState({});
    const [description1, setDescription1] = useState("");
    const [description2, setDescription2] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const fileInputRefImg = useRef(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const fileInputRefVideo = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState("");

    const [imgUrl, setImgUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState(null);

    const {lang, isReady} = useLang();

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        if (isReady && lang) {
            getAbout()
        }
    }, [isReady, lang]);

    async function getAbout() {
        try {
            const res = await ApiCall(`/aboutSection?lang=${lang}`,{method:"GET"})

            setImgUrl(res.data.imgUrl)
            setVideoUrl(res.data.videoUrl)
            setDescription1(res.data.description1)
            setDescription2(res.data.description2)

        } catch (err) {
            const message =
                err.response?.data || "Ma'lumot mavjud emas";
            toast.warn(message);
        }
    }

    useEffect(() => {
        return () => {
            if (selectedVideo) {
                URL.revokeObjectURL(selectedVideo);
            }
        };
    }, [selectedVideo]);

    async function saveInfo() {
        const formData = new FormData();
        formData.append("img", imageFile);
        formData.append("video", videoFile);
        formData.append("description1", description1);
        formData.append("description2", description2);

        try {
            const res = await ApiCall(`/aboutSection?lang=${lang}`,{method:"POST"}, formData)
            toast.success(res.data);

            setSelectedImage("");
            setSelectedVideo("");
            setImageFile(null);
            setVideoFile(null);
            setDescription1("");
            setDescription2("");
        } catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
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


    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const allowedTypes = [
                "video/mp4",
                "video/quicktime",
                "video/x-matroska",
                "video/webm"
            ];

            if (!allowedTypes.includes(file.type)) {
                toast.warn("Faqat MP4, MOV, MKV yoki WEBM formatdagi video yuklang");
                return;
            }

            // 🔥 Eski preview URL ni bo‘shatamiz
            if (selectedVideo) {
                URL.revokeObjectURL(selectedVideo);
            }

            // ✅ Yangi preview URL ni belgilaymiz
            const videoURL = URL.createObjectURL(file);
            setSelectedVideo(videoURL);
            setVideoFile(file);
            setErrors((p) => ({...p, video: ""}));

        } catch (err) {
            console.error("Videoni yuklashda xatolik:", err);
            toast.error("Videoni yuklashda xatolik yuz berdi");
        }
    };




    return (
        <div className={"about-section"}>
            <h1>About Us</h1>
            <div   className={"btn-floater"}>
                <button onClick={saveInfo} className={"btn"} >Save</button>
            </div>

            <div className={"wrap-scroll"}>
                <div className={"wrap-about-info"}>
                    <div className={"wrap-media"}>
                        <div className={"img-sect"}>
                            <label>
                                <input onChange={handleImageChange}
                                       ref={fileInputRefImg}
                                       type="file" hidden
                                       accept=".png,.jpg,.jpeg,.svg,.webp,.heic" />
                                <MdUploadFile  className={"icon-up"} />
                            </label>
                            <div className={"img-card"}>
                                {selectedImage ? (
                                    <img src={selectedImage} className={"img"} alt="img" />
                                ) : imgUrl ? (
                                    <img src={`${BaseUrl}${imgUrl}`} className={"img"} alt="img" />
                                ) : (
                                    <PiImageDuotone className="icon" />
                                )}
                            </div>
                        </div>
                        <div className="video-sect">
                            <label>
                                <input
                                    onChange={handleVideoChange}
                                    ref={fileInputRefVideo}
                                    type="file"
                                    hidden
                                    accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
                                />
                                <MdUploadFile className="icon-up" />
                            </label>

                            {selectedVideo ? (
                                <video key={selectedVideo} className="video-card" controls>
                                    <source src={selectedVideo} type="video/mp4" />
                                    Brauzeringiz videoni qo‘llab-quvvatlamaydi.
                                </video>
                            ) : videoUrl ? (
                                <video key={videoUrl} className="video-card" controls>
                                    <source src={`${BaseUrl}${videoUrl}`} type="video/mp4" />
                                    Brauzeringiz videoni qo‘llab-quvvatlamaydi.
                                </video>
                            ) : (
                                <div className="video-card placeholder">
                                    <BiSolidVideoRecording className={"icon"} />
                                </div>
                            )}

                        </div>
                    </div>
                    <div className={"wrap-err"}>
                        {errors.image && <span className={`error ${ errors.image ? "" : "hide" }`}>{errors.image}</span>}
                        {errors.video && <span className={`error ${ errors.video ? "" : "hide" }`}>{errors.video}</span>}
                    </div>
                    <div className={"wrap-text-desc"}>
                        <label>
                            <h3>Decription1</h3>
                            <textarea
                                placeholder={"Type description..."}
                                onChange={(e)=>setDescription1(e.target.value)}
                                value={description1} className={"area"}></textarea>
                        </label>
                        <label>
                            <h3>Decription2</h3>
                            <textarea
                                placeholder={"Type description..."}
                                onChange={(e)=>setDescription2(e.target.value)}
                                value={description2} className={"area"}></textarea>
                        </label>

                    </div>
                </div>
            </div>


        </div>
    );
}

export default AboutUsSect;