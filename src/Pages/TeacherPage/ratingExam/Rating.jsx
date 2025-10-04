import React, {useEffect, useState} from 'react';
import "./rating.scss"
import {IoArrowBack} from "react-icons/io5";
import ApiCall from "../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";

function Rating() {

    const examId = localStorage.getItem("examId");
    const completed = localStorage.getItem("completed") === "true";


    const [examTypes, setExamTypes] = useState([]);
    const [studentsRatings, setStudentsRatings] = useState([]);
    const [studentMarks, setStudentMarks] = useState({}); // { studentId: { typeName: mark } }
    const navigate = useNavigate();
    const [edit, setEdit] = useState(!completed);

    useEffect(() => {
        getExamTypes()
        getStudentRatings()
    }, []);


    useEffect(() => {
        if (examTypes.length > 0 && studentsRatings.length > 0) {
            const initialMarks = {};
            studentsRatings.forEach(student => {
                initialMarks[student.id] = {};
                examTypes.forEach(type => {
                    // type.name bilan solishtiramiz
                    const foundMark = student.marks?.find(m => m.typeName === type.name);
                    initialMarks[student.id][type.id] = foundMark ? foundMark.mark : 0;
                });
            });
            setStudentMarks(initialMarks);
        }
    }, [examTypes, studentsRatings]);

    useEffect(() => {
        setEdit(!completed);
    }, [completed]);



    async function getExamTypes() {
        try {
            const res = await ApiCall(`/exam/types/${examId}`, {method: 'GET'});
            setExamTypes(res.data);
        } catch (err) {
            const res = err.message;
            toast.error(res);
        }
    }

    async function getStudentRatings() {
        try {
            const res = await ApiCall(`/examGrade/rating/${examId}`, {method: 'GET'});
            setStudentsRatings(res.data);

            // studentMarks ni backenddagi baholar bilan to'ldiramiz
            const initialMarks = {};
            res.data.forEach(student => {
                initialMarks[student.id] = {};
                examTypes.forEach(type => {
                    const foundMark = student.marks?.find(m => m.typeId === type.id);
                    initialMarks[student.id][type.id] = foundMark ? foundMark.mark : 0;
                });
            });
            setStudentMarks(initialMarks);

        } catch (err) {
            const res = err.message;
            toast.error(res);
        }
    }

    function handleMarkChange(studentId, typeId, value) {
        setStudentMarks((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [typeId]: value, // endi id to'g'ri ishlatiladi
            },
        }));
    }

    const saveMarks = async () => {
        const formattedMarks = [];

        Object.entries(studentMarks).forEach(([studentId, marks]) => {
            Object.entries(marks).forEach(([typeId, mark]) => {
                formattedMarks.push({
                    studentId,
                    typeId: String(typeId), // bu yerda typeId ni string qilib yuboryapmiz
                    mark: Number(mark),
                });
            });
        });

        try {
            const res = await ApiCall(
                `/examGrade/saveMarks/${examId}`,
                {method: "POST"},
                formattedMarks
            );
            toast.success(res.data);
            await getStudentRatings()
            localStorage.setItem("completed", "false")
        } catch (err) {
            const res = err.message;
            toast.error(res);
        }
    };

    function goBack() {
        navigate("/teacher/exam")
    }

    return (
        <div className={"rating-exam-page"}>
            <ToastContainer />

            <h1>Mark students</h1>

            <div className={"rating-navbar"}>
                <button onClick={goBack} className={"back-btn btn"}>
                    <IoArrowBack/>
                    <h3>Go back</h3>
                </button>

                <div className="wrap-btn">
                    {edit ? (
                        <button
                            onClick={() => {
                                saveMarks();
                                setEdit(false); // Save bosilgach Edit tugmasiga o'tadi
                            }}
                            className="s-btn btn b2"
                        >
                            Save
                        </button>
                    ) : (
                        <button onClick={() => setEdit(true)} className="e-btn btn b2">
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <table className="table-lesson">
                <thead>
                <tr>
                    <th>No</th>
                    <th>Full name</th>
                    {
                        examTypes.length > 0 && examTypes.map(type =>
                            <th key={type.id}>{type.name}</th>
                        )
                    }
                </tr>
                </thead>
                <tbody>
                {
                    studentsRatings && studentsRatings.map((s, i) => (<tr key={s.id}>
                        <td>{i + 1}</td>
                        <td>{s.name}</td>
                        {
                            examTypes && examTypes.map(type => (
                                <td key={type.id}>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        required
                                        value={studentMarks[s.id]?.[type.id] ?? 0}
                                        onChange={(e) => handleMarkChange(s.id, type.id, e.target.value)}
                                        className="inp"
                                        disabled={!edit}
                                    />
                                    %
                                </td>
                            ))
                        }
                    </tr>))
                }
                </tbody>

            </table>


        </div>
    );
}

export default Rating;