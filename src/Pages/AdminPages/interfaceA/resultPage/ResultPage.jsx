import React, {useEffect, useRef, useState} from 'react';
import "./resultPage.scss"
import {IoImage} from "react-icons/io5";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {MdDelete, MdEdit} from "react-icons/md";
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../../Utils/ApiCall";

function ResultPage() {
    const [results, setResults] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState("");
    const fileInputRef = useRef(null)
    const [imageFile, setImageFile] = useState(null);
    const [imgUrl, setImgUrl] = useState("");
    const [newResStudent, setNewResStudent] = useState({
        name: "",
        listening: "",
        writing: "",
        reading: "",
        speaking: "",
        overall: ""
    });
    const [selStudentId, setSelStudentId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        getStudentResults()
    }, [])



    async function getStudentResults() {
        try {
            const res = await ApiCall("/studentSection/getInfo", {method: "GET"});
            setResults(res.data);
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


    function clearInputs() {
        setSelectedImage("");
        setImageFile(null);
        setImgUrl("");
        setNewResStudent({
            name: "",
            listening: "",
            writing: "",
            reading: "",
            speaking: "",
            overall: "",
        })
    }

    async function handleSaveStudent(e) {
        e.preventDefault();

        if (!imageFile && !isEdit) {
            setErrors(prev => ({...prev, image: "Rasmni tanlang!"}));
            return;
        }

        const formData = new FormData();
        formData.append("img", imageFile)
        formData.append("name", newResStudent.name);
        formData.append("listening", newResStudent.listening);
        formData.append("writing", newResStudent.writing);
        formData.append("reading", newResStudent.reading);
        formData.append("speaking", newResStudent.speaking);
        formData.append("overall", newResStudent.overall);

        try {
            const res = isEdit
                ? await ApiCall(`/studentSection/${selStudentId}`, {method: "PUT"}, formData)
                : await ApiCall(`/studentSection`, {method: "POST"}, formData);

            toast.success(res.data);
            await getStudentResults()
            clearInputs()
            setIsEdit(false);
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }

    function editStudentRes(item) {
        setIsEdit(true);
        setSelStudentId(item.id)
        setImgUrl(item.imgUrl)
        setNewResStudent({
            name: item.name,
            listening: item.listening,
            writing: item.writing,
            reading: item.reading,
            speaking: item.speaking,
            overall: item.overall,

        })
    }

    async function deleteStudentRes(id) {
        try {
            const res = await ApiCall(`/studentSection/${id}`, {method: "DELETE"});
            toast.success(res.data);
            await getStudentResults();
        } catch (err) {
            const message =
                err.response?.data || "Ma'lumotni olishda xatolik yuz berdi";
            toast.warn(message);
        }
    }

    return (
        <div className={"resultPage-Wrap"}>
            <ToastContainer/>
            <div className={"box b1"}>
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
                    <label>
                        <h3>FullName</h3>
                        <input
                            onChange={(e) => setNewResStudent({...newResStudent, name: e.target.value})}
                            value={newResStudent.name}
                            type="text" placeholder={"Firstname Lastname"}/>
                    </label>

                    <label>
                        <h3>Listening</h3>
                        <input
                            onChange={(e) => setNewResStudent({...newResStudent, listening: e.target.value})}
                            value={newResStudent.listening}
                            type="number" placeholder={"score"}/>
                    </label>
                    <label>
                        <h3>Reading</h3>
                        <input
                            onChange={(e) => setNewResStudent({...newResStudent, reading: e.target.value})}
                            value={newResStudent.reading}
                            type="number" placeholder={"score"}/>
                    </label>
                    <label>
                        <h3>Writing</h3>
                        <input
                            onChange={(e) => setNewResStudent({...newResStudent, writing: e.target.value})}
                            value={newResStudent.writing}
                            type="number" placeholder={"score"}/>
                    </label>
                    <label>
                        <h3>Speaking</h3>
                        <input
                            onChange={(e) => setNewResStudent({...newResStudent, speaking: e.target.value})}
                            value={newResStudent.speaking}
                            type="number" placeholder={"score"}/>
                    </label>
                    <label>
                        <h3>Overall</h3>
                        <input
                            onChange={(e) => setNewResStudent({...newResStudent, overall: e.target.value})}
                            value={newResStudent.overall}
                            type="number" placeholder={"score"}/>
                    </label>

                    <button onClick={handleSaveStudent} className={"btn-s"}>Save</button>

                </div>
            </div>
            <div className={"box b2"}>
                {
                    results && results.map((item, index) => (
                        <div className={"card-box"} key={item.id}>
                            <img src={BaseUrl+item.imgUrl} alt="img"/>
                            <div className={"wrap-skills"}>
                                <div className={"icons-wrap"}>
                                    <MdEdit onClick={()=>editStudentRes(item)} className={"icon v1"}/>
                                    <MdDelete onClick={()=>deleteStudentRes(item.id)} className={"icon v2"}/>
                                </div>
                                <h2>{item.name}</h2>
                                <div className={"scores"}>
                                    <h3>Listening: <span>{item.listening}</span></h3>
                                    <h3>Reading: <span>{item.reading}</span></h3>
                                    <h3>Writing: <span>{item.writing}</span></h3>
                                    <h3>Speaking: <span>{item.speaking}</span></h3>
                                    <h3>Overall: <span>{item.overall}</span></h3>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ResultPage;