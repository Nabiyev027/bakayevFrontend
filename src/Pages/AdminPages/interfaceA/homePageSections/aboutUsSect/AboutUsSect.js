import React, {useEffect, useRef, useState} from 'react';
import "./aboutUsSect.scss"
import {PiImageDuotone} from "react-icons/pi";
import {MdUploadFile} from "react-icons/md";
import {toast, ToastContainer} from "react-toastify";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {BiSolidVideoRecording} from "react-icons/bi";
import ApiCall from "../../../../../Utils/ApiCall";
import {useLang} from "../../langConfig/LangContext";

function AboutUsSect() {
    const [errors, setErrors] = useState({});
    const [desc1, setDesc1] = useState({descriptionUz:"", descriptionRu:"", descriptionEn:""});
    const [desc2, setDesc2] = useState({descriptionUz:"", descriptionRu:"", descriptionEn:""});
    const [info, setInfo] = useState({successfulStudents:0, averageScore:0, yearsExperience:0, successRate:0});
    const [imageFile, setImageFile] = useState(null);
    const [imageThumbFile, setImageThumb] = useState(null);
    const fileInputRefImg = useRef(null);
    const fileInputRefImgThumb = useRef(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selThumbImage, setSelThumbImage] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const fileInputRefVideo = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState("");

    const [imgUrl, setImgUrl] = useState("");
    const [imgThumbUrl, setImgThumbUrl] = useState("");
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
            const res = await ApiCall(`/aboutSection`, { method: "GET" });

            setImgUrl(res.data.imgUrl);
            setImgThumbUrl(res.data.videoThumbnailUrl)
            setVideoUrl(res.data.videoUrl);

            const translations = res.data.translations || [];

            const desc1Data = {
                descriptionUz: "",
                descriptionRu: "",
                descriptionEn: "",
            };
            const desc2Data = {
                descriptionUz: "",
                descriptionRu: "",
                descriptionEn: "",
            };

            translations.forEach((t) => {
                switch (t.lang) {
                    case "UZ":
                        desc1Data.descriptionUz = t.description1 || "";
                        desc2Data.descriptionUz = t.description2 || "";
                        break;
                    case "RU":
                        desc1Data.descriptionRu = t.description1 || "";
                        desc2Data.descriptionRu = t.description2 || "";
                        break;
                    case "EN":
                        desc1Data.descriptionEn = t.description1 || "";
                        desc2Data.descriptionEn = t.description2 || "";
                        break;
                    default:
                        break;
                }
            });

            setDesc1(desc1Data);
            setDesc2(desc2Data);
            setInfo({
                successfulStudents:res.data.successfulStudents,
                averageScore:res.data.averageScore,
                yearsExperience:res.data.yearsExperience,
                successRate:res.data.successRate
            })

        } catch (err) {
            const message = err.response?.data || "Ma'lumot mavjud emas";
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

    useEffect(() => {
        return () => {
            if (selectedImage) URL.revokeObjectURL(selectedImage);
            if (selThumbImage) URL.revokeObjectURL(selThumbImage);
        };
    }, [selectedImage, selThumbImage]);

    async function saveInfo() {
        if (!desc1.descriptionUz || !desc1.descriptionRu || !desc1.descriptionEn) {
            toast.warn("Description 1 barcha tillarda to‘ldirilishi kerak");
            return;
        }
        if (!desc2.descriptionUz || !desc2.descriptionRu || !desc2.descriptionEn) {
            toast.warn("Description 2 barcha tillarda to‘ldirilishi kerak");
            return;
        }
        if (!info.successfulStudents || !info.averageScore || !info.yearsExperience || !info.successRate) {
            toast.warn("Statistik ma'lumotlar to‘liq to‘ldirilishi kerak");
            return;
        }

        const formData = new FormData();
        if (imageFile) formData.append("img", imageFile);
        if (imageThumbFile) formData.append("videoImg", imageThumbFile);
        if (videoFile) formData.append("video", videoFile);
        formData.append("description1Uz", desc1.descriptionUz);
        formData.append("description1Ru", desc1.descriptionRu);
        formData.append("description1En", desc1.descriptionEn);
        formData.append("description2Uz", desc2.descriptionUz);
        formData.append("description2Ru", desc2.descriptionRu);
        formData.append("description2En", desc2.descriptionEn);
        formData.append("successfulStudents", info.successfulStudents);
        formData.append("averageScore", info.averageScore);
        formData.append("yearsExperience", info.yearsExperience);
        formData.append("successRate", info.successRate);

        try {
            const res = await ApiCall(`/aboutSection`, { method: "POST" }, formData);
            toast.success(res.data);

            setSelectedImage("");
            setSelThumbImage("");
            setSelectedVideo("");
            setInfo({ successfulStudents: 0, averageScore: 0, yearsExperience: 0, successRate: 0 });
            setImageFile(null);
            setVideoFile(null);
            await getAbout();
        } catch (err) {
            const message = err.response?.data || "Ma'lumotni qo'shishda xatolik yuz berdi";
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

    const handleThumbImageChange = async (e) => {
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
            setSelThumbImage(URL.createObjectURL(webpFile));
            setImageThumb(webpFile);
            setErrors((p) => ({...p, imageThumb: ""}));
        } catch (err) {
            console.error("Konvertatsiya/siqish xatosi:", err);
            setErrors((p) => ({...p, imageThumb: "Rasmni qayta ishlashda xato"}));
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
            <ToastContainer />
            <h1>About Us</h1>
            <div   className={"btn-floater"}>
                <button onClick={saveInfo} className={"btn"} >Save</button>
            </div>

            <div className={"wrap-scroll"}>
                <div className={"wrap-about-info"}>
                    <div className={"wrap-media"}>
                        <div className="img-sect-wrap">
                            <h3>About section image</h3>
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
                        </div>

                        <div className="img-sect-wrap">
                            <h3>Video Thumbnail image</h3>
                            <div className={"img-sect"}>
                                <label>
                                    <input onChange={handleThumbImageChange}
                                           ref={fileInputRefImgThumb}
                                           type="file" hidden
                                           accept=".png,.jpg,.jpeg,.svg,.webp,.heic" />
                                    <MdUploadFile  className={"icon-up"} />
                                </label>
                                <div className={"img-card"}>
                                    {selThumbImage ? (
                                        <img src={selThumbImage} className={"img"} alt="img" />
                                    ) : imgThumbUrl ? (
                                        <img src={`${BaseUrl}${imgThumbUrl}`} className={"img"} alt="img" />
                                    ) : (
                                        <PiImageDuotone className="icon" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={"img-sect-wrap"}>
                            <h3>Video</h3>
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


                    </div>
                    <div className={"wrap-err"}>
                        {errors.image && <span className={`error ${ errors.image ? "" : "hide" }`}>{errors.image}</span>}
                        {errors.video && <span className={`error ${ errors.video ? "" : "hide" }`}>{errors.video}</span>}
                    </div>
                    <div className={"wrap-text-desc"}>
                        <label>
                            <h3>Decription1 UZ</h3>
                            <textarea
                                placeholder={"Tavsifini kiriting..."}
                                onChange={(e)=>setDesc1({...desc1, descriptionUz: e.target.value})}
                                value={desc1.descriptionUz} className={"area"}></textarea>
                        </label>
                        <label>
                            <h3>Decription1 RU</h3>
                            <textarea
                                placeholder={"Введите описание..."}
                                onChange={(e)=>setDesc1({...desc1, descriptionRu: e.target.value})}
                                value={desc1.descriptionRu} className={"area"}></textarea>
                        </label>
                        <label>
                            <h3>Decription1 EN</h3>
                            <textarea
                                placeholder={"Enter description..."}
                                onChange={(e)=>setDesc1({...desc1, descriptionEn: e.target.value})}
                                value={desc1.descriptionEn} className={"area"}></textarea>
                        </label>
                        <label>
                            <h3>Decription2 UZ</h3>
                            <textarea
                                placeholder={"Tavsifini kiriting..."}
                                onChange={(e)=>setDesc2({...desc2, descriptionUz: e.target.value})}
                                value={desc2.descriptionUz} className={"area"}></textarea>
                        </label>
                        <label>
                            <h3>Decription2 RU</h3>
                            <textarea
                                placeholder={"Введите описание..."}
                                onChange={(e)=>setDesc2({...desc2, descriptionRu: e.target.value})}
                                value={desc2.descriptionRu} className={"area"}></textarea>
                        </label>
                        <label>
                            <h3>Decription2 EN</h3>
                            <textarea
                                placeholder={"Type description..."}
                                onChange={(e)=>setDesc2({...desc2, descriptionEn: e.target.value})}
                                value={desc2.descriptionEn} className={"area"}></textarea>
                        </label>

                    </div>
                    <div className={"wrap-infos"}>
                        <label>
                            <h3>Successful students</h3>
                            <input className={"inp"} type="number" value={info.successfulStudents} onChange={(e)=>setInfo({...info, successfulStudents: e.target.value})} />
                        </label>
                        <label>
                            <h3>Average score</h3>
                            <input className={"inp"} type="number" value={info.averageScore} onChange={(e)=>setInfo({...info, averageScore: e.target.value})} />
                        </label>
                        <label>
                            <h3>Years of experience</h3>
                            <input className={"inp"} type="number" value={info.yearsExperience} onChange={(e)=>setInfo({...info, yearsExperience: e.target.value})} />
                        </label>
                        <label>
                            <h3>Success rate (1-100 %) </h3>
                            <input className={"inp"} type="number" value={info.successRate} onChange={(e)=>setInfo({...info, successRate: e.target.value})} />
                        </label>

                    </div>
                </div>
            </div>


        </div>
    );
}

export default AboutUsSect;