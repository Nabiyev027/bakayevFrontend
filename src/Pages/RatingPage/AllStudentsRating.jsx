import React, {useEffect, useState} from 'react';
import "./allStudentsRating.scss"
import ApiCall from "../../Utils/ApiCall";
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";

function AllStudentsRating() {

    const [filials, setFilials] = useState([]);
    const [selFilialId, setSelFilialId] = useState("");

    const [groups, setGroups] = useState([]);
    const [selGroupId, setSelGroupId] = useState("");

    const selectedRole = localStorage.getItem("selectedRole");

    const userToken = localStorage.getItem("token");
    const userId = jwtDecode(userToken).userId;

    const [lessons, setLessons] = useState([]);
    const [filter, setFilter] = useState("today");


    // ============================
    // FILIAL YUKLASH
    // ============================
    useEffect(() => {
        if (selectedRole === "ROLE_RECEPTION" || selectedRole === "ROLE_TEACHER") {
            getFilialByReceptionId();
        } else {
            getFilials();
        }
    }, []);

    // Filial → guruh yuklash
    useEffect(() => {
        if (selFilialId && selFilialId !== "all") {
            getGroupsByFilial();
        }
    }, [selFilialId]);

    // Guruh → darslarni yuklash
    useEffect(() => {
        if (selGroupId && selGroupId !== "all") {
            getLessonsWithMark();
        }
    }, [selGroupId, filter]);


    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"});
            setFilials(res.data);
            if (res.data.length > 0) setSelFilialId(res.data[0].id);
        } catch (error) {
            toast.error(error.response?.data || "Error loading filials");
        }
    }

    async function getFilialByReceptionId() {
        try {
            const res = await ApiCall(`/filial/getOne/${userId}`, {method: "GET"});
            setSelFilialId(res.data.id);
        } catch (err) {
            toast.error(err.response?.data || "Filial not found");
        }
    }

    async function getGroupsByFilial() {
        try {
            const res = await ApiCall(`/group?filialId=${selFilialId}`, {method: "GET"});
            setGroups(res.data);
            if (res.data.length > 0) setSelGroupId(res.data[0].id);
        } catch (err) {
            toast.error("Groups not found");
        }
    }

    async function getLessonsWithMark() {
        try {
            const res = await ApiCall(
                `/lesson/studentMarks?groupId=${selGroupId}&type=${filter}`,
                {method: "GET"}
            );
            setLessons(res.data);
        } catch (err) {
            toast.error("Lessons not found");
        }
    }


    // ============================
    // 1) Barcha typeName larni olish
    // ============================
    const allTypes = Array.from(
        new Set(
            lessons.flatMap(st => st.lessonMarks.map(m => m.typeName))
        )
    );


    // ============================
    // 2) O'quvchi bo‘yicha umumlashtirilgan o‘rtacha baho hisoblash
    // (today/week/month – hammasini hisoblaydi)
    // ============================
    function calculateStudentOverallMarks(student) {

        const typeGroups = {}; // { "Grammar": [5,4,3], "Listening":[4,4] }

        student.lessonMarks.forEach(m => {
            if (!typeGroups[m.typeName]) {
                typeGroups[m.typeName] = [];
            }
            typeGroups[m.typeName].push(m.mark);
        });

        // o‘rtacha qiymat qaytaradi
        const result = {};
        Object.keys(typeGroups).forEach(typeName => {
            const arr = typeGroups[typeName];
            const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
            result[typeName] = Math.round(avg);
        });

        return result; // {"Grammar":4, "Listening":4, ...}
    }


    return (
        <div className="all-rating-page">
            <h2>All student ratings</h2>

            <div className="employer-header">

                {/* FILIAL SELECT */}
                {
                    filials.length > 0 && <select
                        className="filial-select"
                        value={selFilialId || ""}
                        onChange={(e) => setSelFilialId(e.target.value)}
                    >
                        {filials.map(b => (
                            <option value={b.id} key={b.id}>{b.name}</option>
                        ))}
                    </select>
                }


                {/* GROUP SELECT */}
                <select
                    className="filial-select"
                    value={selGroupId || ""}
                    onChange={(e) => setSelGroupId(e.target.value)}
                >
                    {groups.map(g => (
                        <option value={g.id} key={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>

            {/* FILTER BUTTONLAR */}
            <div className="filter-buttons">
                {["today", "week", "month"].map(type => (
                    <button
                        key={type}
                        className={filter === type ? "active" : ""}
                        onClick={() => setFilter(type)}
                    >
                        {type === "today"
                            ? "Today"
                            : type === "week"
                                ? "Last Week"
                                : "Last Month"}
                    </button>
                ))}
            </div>

            {/* TABLE */}
            <div className="table-wrap-box">
                <table className="employer-table">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Fullname</th>

                        {allTypes.map(type => (
                            <th key={type}>{type}</th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>

                    {lessons.length === 0 ? (
                        <tr>
                            <td colSpan={2 + allTypes.length} style={{textAlign: "center"}}>
                                No data
                            </td>
                        </tr>
                    ) : (
                        lessons.map((st, index) => {
                            const overall = calculateStudentOverallMarks(st);

                            return (
                                <tr key={st.id}>
                                    <td>{index + 1}</td>
                                    <td>{st.name}</td>

                                    {allTypes.map(type => (
                                        <td key={type}>
                                            {overall[type] ? overall[type] : "-"}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })
                    )}

                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default AllStudentsRating;
