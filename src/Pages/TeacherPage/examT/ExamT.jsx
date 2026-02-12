import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {FaEdit} from "react-icons/fa";
import "./examT.scss";
import ApiCall from "../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify";
import {MdClose} from "react-icons/md";
import {IoClose} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function ExamT() {
    const userToken = localStorage.getItem("token");
    const teacherId = jwtDecode(userToken).userId;

    const [exams, setExams] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [newExam, setNewExam] = useState({
        title: "",
        date: "",
        time: "",
        typeIds: [],   // faqat typeIds ishlatamiz
    });

    const [typeName, setTypeName] = useState("");
    const [types, setTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]); // checkbox orqali tanlangan typelar
    const [edit,setEdit] = useState(false);
    const [examId, setExamId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getGroups();
        getExamTypes()
    }, [])

    useEffect(() => {
        if (selectedGroup?.id) {
            getExams();
        }
    }, [selectedGroup]);

    async function getExams() {
        try {
            const res = await ApiCall(`/exam/${selectedGroup.id}`, {method: "GET"});
            setExams(res.data);
        } catch (err) {
            const res = err.message || "Groups not found";
            toast.error(res);
        }
    }

    async function getGroups() {
        try {
            const res = await ApiCall(`/group/teacher/${teacherId}`, {method: "GET"});
            setGroups(res.data);
            if (res.data.length > 0) {
                setSelectedGroup(res.data[0]);
            }
        } catch (err) {
            const res = err.message || "Groups not found";
            toast.error(res);
        }
    }

    async function getExamTypes() {
        try {
            const res = await ApiCall(`/examTypes`, {method: "GET"});
            setTypes(res.data);
        } catch (err) {
            const res = err.message || "Types not found";
            toast.error(res);
        }
    }

    async function addType() {
        try {
            const res = await ApiCall(`/examTypes?typeName=${typeName}`, {
                method: "POST",
            });
            toast.success(res.data);
            await getExamTypes();
            setTypeName("");
        } catch (err) {
            const res = err.message;
            toast.error(res);
        }
    }

    const toggleTypeSelection = (typeId) => {
        setSelectedTypes((prev) => {
            if (prev.includes(typeId)) {
                return prev.filter((id) => id !== typeId);
            } else {
                return [...prev, typeId];
            }
        });

        setNewExam((prev) => {
            const updatedTypes = (prev.typeIds || []).includes(typeId)
                ? prev.typeIds.filter((id) => id !== typeId)
                : [...(prev.typeIds || []), typeId];
            return {...prev, typeIds: updatedTypes};
        });
    };

    async function deleteType(id) {
        const confirmDelete = window.confirm("Do you really want to delete this type?");
        if (!confirmDelete) return;

        try {
            const res = await ApiCall(`/examTypes/${id}`, {method: "DELETE"});
            toast.success(res.data);
            await getExamTypes();
        } catch (err) {
            toast.error(err.message);
        }
    }

    // Save new or edited exam
    const handleSave = async () => {
        if (!newExam.title || !newExam.time || !newExam.date) {
            toast.error("Please enter all information");
            return;
        }

        if (selectedTypes.length === 0) {
            toast.error("Type not selected!");
            return;
        }

        if(edit){
            try {
                const res = await ApiCall(
                    `/exam/edit/${examId}`,
                    {method: "PUT"},
                    newExam
                );
                toast.success(res.data);
                await getExams()
            } catch (err) {
                const res = err.message;
                toast.error(res);
            }
        }else {
            try {
                const res = await ApiCall(
                    `/exam/add/${selectedGroup.id}`,
                    {method: "POST"},
                    newExam
                );
                toast.success(res.data);
                await getExams()
            } catch (err) {
                const res = err.message;
                toast.error(res);
            }
        }

        setNewExam({title: "", date: "", time: "", typeIds: []});
        setSelectedTypes([]);
        setShowForm(false);
    };


    const handleEdit = (exam) => {
        setEdit(true)
        setExamId(exam.id)

        const examTypeIds = (exam.examTypes || []).map((t) => String(t.id));
        setSelectedTypes(examTypeIds);
        setNewExam({
            id: exam.id,
            title: exam.title,
            date: exam.date,
            time: exam.time || exam.startTime,
            typeIds: examTypeIds,
        });

        setSelectedTypes(examTypeIds); // checkboxlar belgilanadi
        setShowForm(true);


    };

    const pastExams = exams.filter(
        (ex) => ex.completed === true || ex.completed === "true"
    );

    const upcoming = exams.filter(
        (ex) => ex.completed === false || ex.completed === "false"
    );

    async function handleDelete(id) {
        const confirmDelete = window.confirm("Do you really want to delete this exam?");
        if (!confirmDelete) return;

        try {
            const res = await ApiCall(
                `/exam/${id}`,
                {method: "DELETE"}
            );
            toast.success(res.data);
            await getExams()
        } catch (err) {
            const res = err.message;
            toast.error(res);
        }
    }

    function goToMarkPage(ex) {
        localStorage.setItem("completed", JSON.stringify(ex.completed));
        localStorage.setItem("examId", ex.id)
        navigate("/teacher/rating")

    }

    return (
        <div className="exam-page">
            <ToastContainer />
            <header className="top-bar-exam">
                <h1 className="h1">Exams</h1>

                <div className="wrap-btn-bar">
                    <select
                        value={selectedGroup ? selectedGroup.id : ""}
                        onChange={(e) => {
                            const selected = groups.find((g) => g.id === e.target.value);
                            setSelectedGroup(selected);
                        }}
                    >
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`btn-add-exam ${showForm ? "active" : ""}`}
                        onClick={() => {
                            setShowForm((v) => !v);
                            if (!showForm) {
                                setNewExam({
                                    title: "",
                                    date: "",
                                    time: "",
                                    typeIds: [],
                                });
                                setSelectedTypes([]);
                            }
                        }}
                    >
                        {showForm ? "✕ Close Form" : "+ Add Exam"}
                    </button>
                </div>
            </header>

            <div className="panels">
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            className="form-panel"
                            initial={{y: -20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: -20, opacity: 0}}
                            transition={{duration: 0.2}}
                        >
                            <input
                                type="text"
                                placeholder="Exam Title"
                                value={newExam.title}
                                onChange={(e) =>
                                    setNewExam((prev) => ({...prev, title: e.target.value}))
                                }
                                className="input-full"
                            />
                            <div className="datetime-row">
                                <input
                                    type="date"
                                    value={newExam.date}
                                    onChange={(e) =>
                                        setNewExam((prev) => ({...prev, date: e.target.value}))
                                    }
                                    className="input-date"
                                />
                                <input
                                    type="time"
                                    value={newExam.time}
                                    onChange={(e) =>
                                        setNewExam((prev) => ({...prev, time: e.target.value}))
                                    }
                                    className="input-time"
                                />
                            </div>

                            <div className="add-type">
                                <input
                                    type="text"
                                    value={typeName}
                                    onChange={(e) => setTypeName(e.target.value)}
                                    placeholder="Add Type"
                                    className="input-type"
                                />
                                <button type="submit" className="btn-type" onClick={addType}>
                                    ＋
                                </button>
                            </div>

                            <div className="types-lists">
                                {types.map((t, index) => (
                                    <div key={t.id} className="type-tag">
                                        <h1>
                                            {index + 1} {t.name}
                                        </h1>

                                        <div className="btn-wrap">

                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                checked={selectedTypes.includes(String(t.id))}
                                                onChange={() => toggleTypeSelection(String(t.id))}
                                            />
                                            <MdClose
                                                className="btn-delete"
                                                onClick={() => deleteType(t.id)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-save" onClick={handleSave}>
                                ↑ Save Exam
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="panel past-panel">
                    <h2>Past Exams</h2>
                    {pastExams.length === 0 ? (
                        <p className="empty">No past exams</p>
                    ) : (
                        pastExams.map((ex) => (
                            <div key={ex.id} className="exam-item">
                                <div className={"wrap-btns"}>
                                    <button className="d-btn btn"
                                        onClick={()=>handleDelete(ex.id)}
                                    >
                                        <IoClose className={"icon"} />
                                    </button>
                                </div>
                                <button onClick={()=>goToMarkPage(ex)} className={"mark-students"}>See results</button>
                                <div className="exam-header">
                                    <strong>{ex.title}</strong>
                                </div>
                                <div className="exam-meta">
                                    <time>{ex.date}</time>
                                    <span className="dot">•</span>
                                    <time>{ex.startTime.slice(0, 5)}</time>
                                </div>

                                <div className="exam-types-small">
                                    {(ex.examTypes || []).map((t) => (
                                        <span key={t.id} className="type-tag">
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="panel upcoming-panel">
                    <h2>Upcoming Exams</h2>
                    {upcoming.length === 0 ? (
                        <p className="empty">No upcoming exams</p>
                    ) : (
                        upcoming.map((ex) => (
                            <div key={ex.id} className="exam-item">
                                <div className={"wrap-btns"}>
                                    <button
                                        className="e-btn btn"
                                        onClick={() => handleEdit(ex)}
                                        aria-label="Edit"
                                    >
                                        <FaEdit className={"icon"}/>
                                    </button>
                                    <button className="d-btn btn"
                                            onClick={()=>handleDelete(ex.id)}
                                    >
                                        <IoClose className={"icon"} />
                                    </button>
                                </div>
                                <button onClick={()=>goToMarkPage(ex)} className={"mark-students"}>Mark Students</button>
                                <div className="exam-header">
                                    <strong>{ex.title}</strong>
                                </div>
                                <div className="exam-meta">
                                    <time>{ex.date}</time>
                                    <span className="dot">•</span>
                                    <time>{ex.startTime.slice(0, 5)}</time>
                                </div>

                                <div className="exam-types-small">
                                    {(ex.examTypes || []).map((t) => (
                                        <span key={t.id} className="type-tag">
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
