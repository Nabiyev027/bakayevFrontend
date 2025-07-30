import React, {useRef, useState} from 'react';
import "./resultPage.scss"
import {IoImage} from "react-icons/io5";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import {MdDelete, MdEdit} from "react-icons/md";

function ResultPage() {
    const [results, setResults] = useState([
        {
            id: 1,
            image: "https://images.ctfassets.net/unrdeg6se4ke/1xYhqY3QVFQMD5O2uo8rWU/f120854e1fae82d7b45b7a78f4396b8a/example-of-ielts-test-report-form.jpg?&w=1220",
            fullName: "Ali Valiyev",
            listening: 7.5,
            reading: 8.0,
            writing: 6.5,
            speaking: 7.0,
            overall: 7.25
        },
        {
            id: 2,
            image: "https://images.ctfassets.net/unrdeg6se4ke/1xYhqY3QVFQMD5O2uo8rWU/f120854e1fae82d7b45b7a78f4396b8a/example-of-ielts-test-report-form.jpg?&w=1220",
            fullName: "Dilnoza Karimova",
            listening: 8.0,
            reading: 7.5,
            writing: 7.0,
            speaking: 8.0,
            overall: 7.625
        },
        {
            id: 3,
            image: "https://images.ctfassets.net/unrdeg6se4ke/1xYhqY3QVFQMD5O2uo8rWU/f120854e1fae82d7b45b7a78f4396b8a/example-of-ielts-test-report-form.jpg?&w=1220",
            fullName: "Jasur Akramov",
            listening: 6.5,
            reading: 6.0,
            writing: 6.5,
            speaking: 6.0,
            overall: 6.25
        },
        {
            id: 4,
            image: "https://images.ctfassets.net/unrdeg6se4ke/1xYhqY3QVFQMD5O2uo8rWU/f120854e1fae82d7b45b7a78f4396b8a/example-of-ielts-test-report-form.jpg?&w=1220",
            fullName: "Gulnora Raximova",
            listening: 8.5,
            reading: 9.0,
            writing: 7.5,
            speaking: 8.0,
            overall: 8.25
        },
        {
            id: 5,
            image: "https://images.ctfassets.net/unrdeg6se4ke/1xYhqY3QVFQMD5O2uo8rWU/f120854e1fae82d7b45b7a78f4396b8a/example-of-ielts-test-report-form.jpg?&w=1220",
            fullName: "Sherzod Qodirov",
            listening: 5.5,
            reading: 6.0,
            writing: 5.0,
            speaking: 5.5,
            overall: 5.5
        },
        {
            id: 6,
            image: "https://images.ctfassets.net/unrdeg6se4ke/1xYhqY3QVFQMD5O2uo8rWU/f120854e1fae82d7b45b7a78f4396b8a/example-of-ielts-test-report-form.jpg?&w=1220",
            fullName: "Malika Yunusova",
            listening: 7.0,
            reading: 7.0,
            writing: 6.5,
            speaking: 7.5,
            overall: 7.0
        }
    ]);


    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState("");
    const fileInputRef = useRef(null)
    const [imageFile, setImageFile] = useState(null);


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

    return (
        <div className={"resultPage-Wrap"}>
            <div className={"box b1"}>
                <div className={"img-box"}>

                    {
                        selectedImage ? <img src={selectedImage} alt="img"/> : <IoImage className={"icon-d"} />
                    }

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
                        <input type="text" placeholder={"Firstname Lastname"} />
                    </label>

                        <label>
                            <h3>Listening</h3>
                            <input type="text" placeholder={"score"}/>
                        </label>
                        <label>
                            <h3>Reading</h3>
                            <input type="text" placeholder={"score"}/>
                        </label>
                        <label>
                            <h3>Writing</h3>
                            <input type="text" placeholder={"score"}/>
                        </label>
                        <label>
                            <h3>Speaking</h3>
                            <input type="text" placeholder={"score"}/>
                        </label>
                        <label>
                            <h3>Overall</h3>
                            <input type="text" placeholder={"score"}/>
                        </label>

                    <button className={"btn-s"}>Save</button>

                </div>
            </div>
            <div className={"box b2"}>
                {
                    results&&results.map((item, index) => (
                        <div className={"card-box"} key={index}>
                            <img src={item.image} alt="img"/>
                            <div className={"wrap-skills"}>
                                <div className={"icons-wrap"}>
                                    <MdEdit className={"icon v1"}/>
                                    <MdDelete className={"icon v2"}/>
                                </div>
                                <h2>{item.fullName}</h2>
                                <div className={"scores"}>
                                    <h3>Listening: <span>{item.listening}</span></h3>
                                    <h3>Reading: <span>{item.reading}</span></h3>
                                    <h3>Writing: <span>{item.writing}</span></h3>
                                    <h3>Speaking: <span>{item.speaking}</span></h3>
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