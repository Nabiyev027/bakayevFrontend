import React, {useEffect, useRef, useState} from 'react';
import "./coursesPage.scss"
import {BiSolidShow} from "react-icons/bi";
import {MdDelete, MdEdit} from "react-icons/md";
import {IoMdAdd} from "react-icons/io";
import {IoImage} from "react-icons/io5";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {useLang} from "../langConfig/LangContext";
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../../Utils/ApiCall";

function CoursesPage() {
    const [newPeriod, setNewPeriod] = useState({titleUz: "", titleRu: "", titleEn: ""});
    const [periods, setPeriods] = useState([]);
    const [unfilteredPers, setUnfilteredPers] = useState([]);

    const [newLevel, setNewLevel] = useState({titleUz: "", titleRu: "", titleEn: "", rating: 0});
    const [levels, setLevels] = useState([]);
    const [unfilteredLevels, setUnfilteredLevels] = useState([]);

    const [newContain,setNewContain] = useState({titleUz: "", titleRu: "", titleEn: ""});
    const [levelContains, setLevelContains] = useState([]);
    const [unfilteredContains, setUnfilteredContains] = useState([]);

    const [activeModal, setActiveModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState("");
    const fileInputRef = useRef(null)
    const [imageFile, setImageFile] = useState(null);

    const [selPerId, setSelPerId] = useState("");
    const [selLevelId, setSelLevelId] = useState("");
    const [selLevelContId, setSelLevelContId] = useState("");

    const [editPeriod, setEditPeriod] = useState(false);
    const [editPerLevel, setEditPerLevel] = useState(false);
    const [editLevelCont, setEditLevelCont] = useState(false);
    const [imgUrl, setImgUrl] = useState("");

    const {lang, isReady} = useLang();

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        if (isReady && lang) {
            getPeriods()
        }
    }, [isReady, lang]);

    useEffect(() => {
        if (lang) {
            if (Array.isArray(unfilteredPers)) {
                filterPersByLang(unfilteredPers);
            }

            if (Array.isArray(unfilteredLevels)) {
                filterLevelsByLang(unfilteredLevels);
            }

            if (Array.isArray(unfilteredContains)) {
                filterContainsByLang(unfilteredContains);
            }
        }
    }, [unfilteredPers, unfilteredLevels, unfilteredContains, lang]);

    useEffect(() => {
        if (!activeModal) {
            // Modal yopilganda barcha statelarni tozalash
            setEditPeriod(false);
            setEditPerLevel(false);
            setEditLevelCont(false);

            setNewPeriod({ titleUz: "", titleRu: "", titleEn: "" });
            setNewLevel({ titleUz: "", titleRu: "", titleEn: "", rating: 0 });
            setNewContain({ titleUz: "", titleRu: "", titleEn: "" });

            setImageFile(null);
            setSelectedImage("");
            setErrors({});
            setImgUrl("");


            console.log("Modal yopildi — barcha statelar tozalandi.");
        }
    }, [activeModal]);

    function filterPersByLang(data) {
        const filtered = data.map((item) => {
            const matchedTranslation = item.translations.find(
                (t) => t.lang === lang
            );

            return {
                id: item.id,
                title: matchedTranslation?.title || ""
            };
        });

        setPeriods(filtered);
    }

    function filterLevelsByLang(data) {
        const filtered = data.map((item) => {
            const matchedTranslation = item.translations.find(
                (t) => t.lang === lang
            );

            return {
                id: item.id,
                imgUrl: item.imgUrl,
                title: matchedTranslation?.title || "",
                rating: item.rating
            };
        });

        setLevels(filtered);
    }

    function filterContainsByLang(data) {
        const filtered = data.map((item) => {
            const matchedTranslation = item.translations.find(
                (t) => t.lang === lang
            );

            return {
                id: item.id,
                title: matchedTranslation?.title || "",
            };
        });

        setLevelContains(filtered);
    }

    async function getPeriods() {
        try {
            const res = await ApiCall("/courseSection/get", {method: "GET"});
            console.log(res.data);
            setUnfilteredPers(res.data);
        } catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    async function getPerLevels(perId) {
        if (perId) {
            setLevelContains([]);
            setUnfilteredContains([]);
            setSelLevelId("");
            setSelPerId(perId);
            try {
                const res = await ApiCall(`/courseCard/${perId}`, { method: "GET" });
                setUnfilteredLevels(res.data || []); // bo‘sh bo‘lsa ham array sifatida set qilinsin
            } catch (err) {
                setUnfilteredLevels([]); // xatolik bo‘lsa ham eski holatda qolmasin
                const message =
                    err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
                toast.warn(message);
            }
        }

    }

    async function getLevelContains(levelId) {
        if (levelId) {
            setSelLevelId(levelId);
            try {
                const res = await ApiCall(`/cardSkill/${levelId}`, {method: "GET"});
                setUnfilteredContains(res.data || []); // <= doim yangilanadi
            } catch (err) {
                setUnfilteredContains([]); // <= hatolik bo‘lsa ham eski ma’lumot qolmasin
                const message =
                    err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
                toast.warn(message);
            }
        }

    }


    function toggleModal() {
        setActiveModal(p => !p);
    }


    function OpenModalNewPer() {
        setModalType("Period")
        toggleModal()
    }

    function OpenModalPerLevel() {
        setModalType("PerLevel")
        toggleModal()
    }

    function OpenModalLevelContains() {
        setModalType("LevelContains")
        toggleModal()
    }

    async function handleSavePeriod() {

        if(newPeriod.titleUz==="" || newPeriod.titleRu==="" || newPeriod.titleEn===""){
            toast.warn("Please fill in all required fields. Image is required for new items.");
            return;
        }

        const formData = new FormData();
        formData.append("titleUz", newPeriod.titleUz);
        formData.append("titleRu", newPeriod.titleRu);
        formData.append("titleEn", newPeriod.titleEn);

        try {
            const res = editPeriod
                ? await ApiCall(`/courseSection/${selPerId}`, {method: "PUT"}, formData)
                : await ApiCall(`/courseSection`, {method: "POST"}, formData);

            toast.success(res.data);
            await getPeriods()
            toggleModal();
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }

    }

    async function handleSavePerLevel() {
        if (
            newLevel.titleUz.trim() === "" ||
            newLevel.titleRu.trim() === "" ||
            newLevel.titleEn.trim() === "" ||
            (!imageFile && !editPerLevel)  // faqat yangi bo‘lsa rasm majburiy
        ) {
            toast.warn("Please fill in all required fields. Image is required for new items.");
            return;
        }

        const formData = new FormData();
        formData.append("img", imageFile)
        formData.append("titleUz", newLevel.titleUz);
        formData.append("titleRu", newLevel.titleRu);
        formData.append("titleEn", newLevel.titleEn);
        formData.append("rating", newLevel.rating);

        try {
            const res = editPerLevel
                ? await ApiCall(`/courseCard/${selLevelId}`, {method: "PUT"}, formData)
                : await ApiCall(`/courseCard/${selPerId}`, {method: "POST"}, formData);

            toast.success(res.data);
            await getPerLevels(selPerId);
            toggleModal();
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }

    async function handleSaveContain() {

        if(newContain.titleUz==="" || newContain.titleRu==="" || newContain.titleEn===""){
            toast.warn("Please fill in all required fields. Image is required for new items.");
            return;
        }

        const data = new FormData();
        data.append("titleUz", newContain.titleUz);
        data.append("titleRu", newContain.titleRu);
        data.append("titleEn", newContain.titleEn);

        try {
            const res = editLevelCont
                ? await ApiCall(`/cardSkill/${selLevelContId}`, {method: "PUT"}, data)
                : await ApiCall(`/cardSkill/${selLevelId}`, {method: "POST"}, data);

            toast.success(res.data);
            await getLevelContains(selLevelId)
            toggleModal();
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
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

    function handleEditPer(id) {
        OpenModalNewPer()
        setEditPeriod(true)
        setSelPerId(id)
        const item = unfilteredPers.find((item) => item.id === id);
        if (item) {
            setNewPeriod({
                titleUz: item.translations.find(t => t.lang === "UZ")?.title || "",
                titleRu: item.translations.find(t => t.lang === "RU")?.title || "",
                titleEn: item.translations.find(t => t.lang === "EN")?.title || "",
            });
        }

    }

    function addPerLevel() {
        if (selPerId) {
            OpenModalPerLevel()
        } else {
            alert("Period not selected");
        }

    }

    function addLevelContain(){
        if(selLevelId){
            OpenModalLevelContains()
        }else {
            alert("Level not selected")
        }
    }

    function handleEditPerlevel(id) {
        OpenModalPerLevel()
        setEditPerLevel(true);
        setSelLevelId(id)
        const item = unfilteredLevels.find((item) => item.id === id);
        if (item) {
            setImgUrl(item.imgUrl);
            setNewLevel({
                rating: item.rating,
                titleUz: item.translations.find(t => t.lang === "UZ")?.title || "",
                titleRu: item.translations.find(t => t.lang === "RU")?.title || "",
                titleEn: item.translations.find(t => t.lang === "EN")?.title || "",
            });
        }

    }

    function handleEditLevelContains(id) {
        OpenModalLevelContains()
        setEditLevelCont(true)
        setSelLevelContId(id)
        const item = unfilteredContains.find((item) => item.id === id);
        if (item) {
            setNewContain({
                titleUz: item.translations.find(t => t.lang === "UZ")?.title || "",
                titleRu: item.translations.find(t => t.lang === "RU")?.title || "",
                titleEn: item.translations.find(t => t.lang === "EN")?.title || "",
            })
        }

    }


    async function handleDeletePer(id) {
        try {
            const res = await ApiCall(`/courseSection/${id}`, {method: "DELETE"});
            toast.success(res.data);
            await getPeriods();
        } catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    async function handleDeletePerLevel(id) {
        try {
            const res = await ApiCall(`/courseCard/${id}`, {method: "DELETE"});
            toast.success(res.data);
            await getPerLevels(selPerId);
        } catch (err) {
            const message = err.response?.data || "Ma'lumotni o'chirishda xatolik yuz berdi";
            toast.warn(message);
        }
    }


    async function deleteContain(id) {
        try {
            const res = await ApiCall(`/cardSkill/${id}`, {method: "DELETE"});
            toast.success(res.data);
            await getPerLevels(selPerId)
        } catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    return (
        <div className={"courses-page-WrapA"}>
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

                        {
                            modalType === "Period" ?
                                <h2 className="custom-modal-title">{editPeriod ? "Edit Period" : "New period"}</h2> :
                                modalType === "PerLevel" ?
                                    <h2 className="custom-modal-title">{editPerLevel ? "Edit Period Level" : "New period Level"}</h2> :
                                    <h2 className="custom-modal-title">{editLevelCont ? "Edit Level Contain" : "New Level Contain"}</h2>
                        }


                        {
                            modalType === "Period" ? <div className="custom-modal-body">
                                    <div className={"wrap-info"}>
                                        <div className={"l-wrap"}>
                                            <label>
                                                <h4>Title UZ</h4>
                                                <input
                                                    onChange={(e) => setNewPeriod({...newPeriod, titleUz: e.target.value})}
                                                    value={newPeriod.titleUz}
                                                    className={"title-i"}
                                                    placeholder={"Davr nomini kiriting"}
                                                    type="text"/>
                                            </label>
                                            <label>
                                                <h4>Title RU</h4>
                                                <input
                                                    onChange={(e) => setNewPeriod({...newPeriod, titleRu: e.target.value})}
                                                    value={newPeriod.titleRu}
                                                    className={"title-i"}
                                                    placeholder={"Введите название периода"}
                                                    type="text"/>
                                            </label>
                                            <label>
                                                <h4>Title EN</h4>
                                                <input
                                                    onChange={(e) => setNewPeriod({...newPeriod, titleEn: e.target.value})}
                                                    value={newPeriod.titleEn}
                                                    className={"title-i"}
                                                    placeholder={"Enter Period Name"}
                                                    type="text"/>
                                            </label>
                                        </div>
                                    </div>

                                    <button onClick={handleSavePeriod} className={"btn"}>Save</button>
                                </div>
                                : modalType === "PerLevel" ? <div className="custom-modal-body">
                                    <div className={"img-box"}>

                                        {selectedImage || imgUrl ? (
                                            <img src={selectedImage || (BaseUrl + imgUrl)} alt="img"/>
                                        ) : (
                                            <IoImage className={"icon-d"}/>
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
                                                <h4>Title UZ</h4>
                                                <input
                                                    onChange={(e) => setNewLevel({...newLevel, titleUz: e.target.value})}
                                                    value={newLevel.titleUz}
                                                    className={"title-i"}
                                                    placeholder={"Davr nomini kiriting"}
                                                    type="text"/>
                                            </label>
                                            <label>
                                                <h4>Title RU</h4>
                                                <input
                                                    onChange={(e) => setNewLevel({...newLevel, titleRu: e.target.value})}
                                                    value={newLevel.titleRu}
                                                    className={"title-i"}
                                                    placeholder={"Введите название периода"}
                                                    type="text"/>
                                            </label>
                                            <label>
                                                <h4>Title EN</h4>
                                                <input
                                                    onChange={(e) => setNewLevel({...newLevel, titleEn: e.target.value})}
                                                    value={newLevel.titleEn}
                                                    className={"title-i"}
                                                    placeholder={"Enter Period Name"}
                                                    type="text"/>
                                            </label>
                                            <label className={"lbl-r"}>
                                                <h4>Rating Star</h4>
                                                <input
                                                    onChange={(e) => setNewLevel({...newLevel, rating: e.target.value})}
                                                    value={newLevel.rating}
                                                    className={"title-i"}
                                                    type="number"/>
                                            </label>
                                        </div>
                                    </div>

                                    <button onClick={handleSavePerLevel} className={"btn"}>Save</button>
                                </div> : <div className="custom-modal-body">
                                    <div className={"wrap-info"}>
                                        <div className={"l-wrap"}>
                                            <label>
                                                <h4>Title UZ</h4>
                                                <input
                                                    onChange={(e) => setNewContain({...newContain, titleUz: e.target.value})}
                                                    value={newContain.titleUz}
                                                    className={"title-i"}
                                                    placeholder={"Davr nomini kiriting"}
                                                    type="text"
                                                />
                                            </label>
                                            <label>
                                                <h4>Title RU</h4>
                                                <input
                                                    onChange={(e) => setNewContain({...newContain, titleRu: e.target.value})}
                                                    value={newContain.titleRu}
                                                    className={"title-i"}
                                                    placeholder={"Введите название периода"}
                                                    type="text"
                                                />
                                            </label>
                                            <label>
                                                <h4>Title EN</h4>
                                                <input
                                                    onChange={(e) => setNewContain({...newContain, titleEn: e.target.value})}
                                                    value={newContain.titleEn}
                                                    className={"title-i"}
                                                    placeholder={"Enter Period Name"}
                                                    type="text"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <button onClick={handleSaveContain} className={"btn"}>Save</button>
                                </div>
                        }


                    </div>
                </div>
            }
            <button onClick={OpenModalNewPer} className={"btn-a"}>Add New</button>

            <div className={"wrap-box-sects"}>
                <div className={"box"}>
                    <h3 className={"box-head"}>Period</h3>
                    <div className={"box-scroll"}>
                        {
                            periods && periods.map((item, index) => <div className={"per-card"} key={item.id}>
                                <h3 className={"title"}>{item.title}</h3>
                                <div className={"wrap-icons"}>

                                    <MdEdit onClick={() => handleEditPer(item.id)} className={"icon v1"}/>
                                    <MdDelete onClick={() => handleDeletePer(item.id)} className={"icon v2"}/>
                                    <BiSolidShow onClick={() => getPerLevels(item.id)} className={"icon v3"}/>
                                </div>
                            </div>)
                        }
                    </div>

                </div>
                <div className={"box"}>
                    <h3 className={"box-head"}>
                        Period level
                        <IoMdAdd onClick={addPerLevel} className={"iconAdd"}/>
                    </h3>

                    <div className={"box-scroll-2"}>
                        {
                            levels && levels.map((item, index) => <div className={"per-card-box"} key={item.id}>
                                <div className={"wrap-icons"}>
                                    <MdEdit onClick={() => handleEditPerlevel(item.id)} className={"icon v1"}/>
                                    <MdDelete onClick={() => handleDeletePerLevel(item.id)} className={"icon v2"}/>
                                    <BiSolidShow onClick={() => getLevelContains(item.id)} className={"icon v3"}/>
                                </div>
                                <img src={BaseUrl + item.imgUrl} alt="img"/>
                                <h3 className={"title"}>{item.title}</h3>
                                <span>star: {item.rating}</span>
                            </div>)
                        }
                    </div>
                </div>
                <div className={"box"}>
                    <h3 className={"box-head"}>
                        Level contains
                        <IoMdAdd onClick={addLevelContain} className={"iconAdd"}/>
                    </h3>
                    <div className={"box-scroll"}>
                        {
                            levelContains && levelContains.map((item, index) => <div className={"per-card"} key={item.id}>
                                <h3 className={"title"}>{item.title}</h3>
                                <div className={"wrap-icons"}>

                                    <MdEdit onClick={()=>handleEditLevelContains(item.id)} className={"icon v1"}/>
                                    <MdDelete onClick={()=>deleteContain(item.id)} className={"icon v2"}/>
                                </div>
                            </div>)
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CoursesPage;