import React, {useEffect, useState} from 'react';
import "./teacherMain.scss"
import ApiCall from "../../../Utils/ApiCall";
import {FaCheck, FaImage} from "react-icons/fa";
import {IoIosUndo} from "react-icons/io";
import {MdEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {toast, ToastContainer} from "react-toastify";

function TeacherMain() {
    const [teachers, setTeachers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedTeacher, setEditedTeacher] = useState({});
    const [infoTeacher, setInfoTeacher] = useState(null);
    const [groups, setGroups] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selBranchId, setSelBranchId] = useState("all");
    const [newPassword, setNewPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selId, setSelId] = useState("");
    const [selectedEmployerlogin, setSelectedEmployerlogin] = useState("");
    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        getFilials()
    }, []);

    useEffect(() => {
        getTeachers()
    }, [selBranchId]);

    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"})
            setBranches(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getGroupsByFilials(filialIds) {
        try {
            if (!filialIds || filialIds.length === 0) {
                setGroups({});
                return;
            }

            const query = filialIds.join(",");
            const res = await ApiCall(`/group/getByFilials?ids=${query}`, { method: "GET" });

            const grouped = {};

            res.data.forEach(g => {
                if (!grouped[g.filialId]) {
                    grouped[g.filialId] = {
                        filialName: g.filialName,
                        groups: []
                    };
                }
                grouped[g.filialId].groups.push(g);
            });

            setGroups(grouped);

        } catch (err) {
            console.log(err);
        }
    }



    async function getTeachers() {
        try {
            const res = await ApiCall(`/user/teachers?filialId=${selBranchId}`, {method: "GET"});
            setTeachers(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedTeacher({...editedTeacher, [name]: value});
    };

    const handleCheckboxChange = (e, isEditing = false) => {
        const {value, checked} = e.target;
        // const selected = isEditing && [...editedTeacher.groupIds]
        const selected = isEditing ? [...editedTeacher.groupIds] : [];


        if (checked) {
            if (!selected.includes(value)) selected.push(value);
        } else {
            const index = selected.indexOf(value);
            if (index > -1) selected.splice(index, 1);
        }

        if (isEditing) {
            setEditedTeacher({...editedTeacher, groupIds: selected});
        }
    };


    const handleCheckboxChangeBranches = (e, isEditing = false) => {
        const { value, checked } = e.target;
        let selectedBranches = isEditing ? [...editedTeacher.branchIds] : [];
        let selectedGroups = isEditing ? [...editedTeacher.groupIds] : [];

        if (checked) {
            if (!selectedBranches.includes(value)) selectedBranches.push(value);
            // Tanlangan filial bo‘yicha gruppalarni olish
            getGroupsByFilials(selectedBranches);
        } else {
            // Filial uncheck bo‘lsa
            const branchIndex = selectedBranches.indexOf(value);
            if (branchIndex > -1) selectedBranches.splice(branchIndex, 1);

            // Shu filialga tegishli gruppalarni uncheck qilish
            Object.keys(groups).forEach(filialId => {
                if (filialId === value) {
                    groups[filialId].groups.forEach(g => {
                        const groupIndex = selectedGroups.indexOf(g.id);
                        if (groupIndex > -1) selectedGroups.splice(groupIndex, 1);
                    });
                }
            });
        }

        setEditedTeacher({
            ...editedTeacher,
            branchIds: selectedBranches,
            groupIds: selectedGroups,
        });
    };

    async function handleSave() {
        console.log(editedTeacher);
        if (editedTeacher.firstName === "" || editedTeacher.lastName === "" || editedTeacher.phone === "") {
            alert("Please fill all blanks")
        }

        try {
            const res = await ApiCall(`/user/teacher/${editedTeacher.id}`, {method: "PUT"}, {
                firstName: editedTeacher.firstName,
                lastName: editedTeacher.lastName,
                phone: editedTeacher.phone,
                filialIds: editedTeacher.branchIds,
                groupIds: editedTeacher.groupIds,
                username: editedTeacher.username,
            });

            if (res.data) {
                await getTeachers();
                setEditingIndex(null);
                setEditedTeacher({});
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    function handleCancel() {
        setEditingIndex(null);
        setEditedTeacher({});
    }


    const handleEdit = (idx) => {
        const teacher = teachers[idx];

        const groupIds = (teacher.groups || []).map(g => g.id);
        const branchIds = (teacher.branches || []).map(b => b.id);

        setEditingIndex(idx);
        setEditedTeacher({
            ...teacher,
            groupIds,
            branchIds,
        });

        // ⬅️ O‘qituvchiga tegishli filiallardan gruppalarni olib kelamiz
        getGroupsByFilials(branchIds);
    };


    async function handleDelete(st) {
        if (window.confirm(`Are you confirm delete ${st.firstName} ${st.lastName}`)) {

            try {
                const res = await ApiCall(`/user/delete/${st.id}`, {method: "DELETE"});
                console.log(res.data)
                await getTeachers()
            } catch (err) {
                console.log(err);
            }

        }
    }

    async function changePassword(t) {
        setSelectedEmployerlogin(t.username)
        setSelId(t.id)
        setIsModalOpen(true);
    }

    async function savePassword() {
        // Frontend tekshiruvlar
        if (!newPassword || newPassword.trim() === "") {
            toast.error("Password bo'sh bo'lishi mumkin emas");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password kamida 8 belgidan iborat bo'lishi kerak");
            return;
        }


        // Agar hammasi to'g'ri bo'lsa, backendga yuborish
        try {
            const res = await ApiCall(`/user/changePassword/${selId}?newPassword=${newPassword}`, { method: "PUT" });
            toast.success(res.data);
            setIsModalOpen(false);
            setSelId("");
            setNewPassword("");
            setSelectedEmployerlogin("")
        } catch (err) {
            toast.error(err.response?.data || err.message);
        }
    }

    function cancelChangePassword() {
        setIsModalOpen(false);
        setSelId("")
        setNewPassword("")
        setSelectedEmployerlogin("")
    }

    return (
        <div className="teacherM-page">
            <ToastContainer />

            {isModalOpen && (
                <div className="modal-rec-overlay">
                    <div className="modal-rec">
                        <h3>Set new password for: {selectedEmployerlogin}</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter new Password"
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button
                                className="cancelBtn"
                                onClick={cancelChangePassword}
                            >
                                Cancel
                            </button>
                            <button onClick={savePassword} className="saveBtn">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2>Teachers</h2>
            <div className="teacherM-header">
                <select id="branch" className="filial-select"
                    onChange={(e)=>setSelBranchId(e.target.value)}
                >
                    <option value="all">All filials</option>
                    {
                        branches?.map((b) => <option value={b.id} key={b.id}>{b.name}</option>)
                    }
                </select>
            </div>

            <div className="table-boxx">
                <table className="teacherM-table">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Photo</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Phone</th>
                        <th>Filial</th>
                        <th>Group</th>
                        <th>login</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teachers?.map((t, i) => (
                        <tr key={t.id}>
                            <td>{i + 1}</td>
                            <td>
                                {
                                    t.imgUrl ? <img src={`${BaseUrl + t.imgUrl}`} alt={"Img"}/> : <FaImage/>
                                }

                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        className={"inp-g"}
                                        name="firstName"
                                        type={"text"}
                                        value={editedTeacher.firstName}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    t.firstName
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        className={"inp-g"}
                                        name="lastName"
                                        value={editedTeacher.lastName}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    t.lastName
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        className={"inp-g"}
                                        name="phone"
                                        type="text"
                                        value={editedTeacher.phone}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    t.phone
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <div className={"table-group-checkboxes"}>
                                        {
                                            branches?.map((b) => (
                                                <label key={b.id}>
                                                    <input
                                                        className={"inp-check"}
                                                        type="checkbox"
                                                        value={b.id}
                                                        checked={editedTeacher.branchIds.includes(b.id)}
                                                        onChange={(e)=>handleCheckboxChangeBranches(e, true)}
                                                    />
                                                    {b.name}
                                                </label>
                                            ))
                                        }
                                    </div>
                                ) : (

                                    t.branches?.map((b) => <h4 key={b.id}>{b.name}</h4>)
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <div className="table-group-checkboxes">

                                        {Object.keys(groups)
                                            .filter(filialId => editedTeacher.branchIds.includes(filialId)) // ⬅ faqat tanlangan filiallar
                                            .map(filialId => (
                                                <div key={filialId} className="filial-block">
                                                    <h4 className="filial-title">📍 {groups[filialId].filialName}</h4>
                                                    {groups[filialId].groups.map(g => (
                                                        <label key={g.id} className="group-item">
                                                            <input
                                                                className="inp-check"
                                                                type="checkbox"
                                                                value={g.id}
                                                                checked={editedTeacher.groupIds.includes(g.id)}
                                                                onChange={(e) => handleCheckboxChange(e, true)}
                                                            />
                                                            {g.name}
                                                        </label>
                                                    ))}
                                                </div>
                                            ))}

                                    </div>
                                ) : (
                                    t.groups?.map((g) => <h4 key={g.id}>{g.name}</h4>)
                                )}
                            </td>

                            <td>
                                {
                                    editingIndex === i ? (
                                        <input
                                            className={"inp-g"}
                                            name="username"
                                            value={editedTeacher.username}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        t.username
                                    )
                                }
                            </td>
                            <td>
                                <button onClick={()=>changePassword(t)} className={"change-p-btn"}>Change</button>
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <div className="actions-t">
                                        <div className={"t-btn-check btn-t"} onClick={handleSave}>
                                            <FaCheck/>
                                        </div>
                                        <div className={"t-btn-cancel btn-t"} onClick={handleCancel}>
                                            <IoIosUndo/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={"actions-t"}>
                                        <div className={"t-btn-edit btn-t"} onClick={() => handleEdit(i)}>
                                            <MdEdit/>
                                        </div>
                                        <div className={"t-btn-delete btn-t"} onClick={() => handleDelete(t)}>
                                            <RiDeleteBin5Fill/>
                                        </div>
                                    </div>

                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {infoTeacher && (
                <div className="modal-overlay" onClick={() => setInfoTeacher(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Student Info</h3>
                        <img src={infoTeacher.photo} alt={infoTeacher.name}/>
                        <p>
                            <strong>ID:</strong> {infoTeacher.id}
                        </p>
                        <p>
                            <strong>Name:</strong> {infoTeacher.name}
                        </p>
                        <p>
                            <strong>Age:</strong> {infoTeacher.age}
                        </p>
                        <p>
                            <strong>Phone:</strong> {infoTeacher.phone}
                        </p>
                        <p>
                            <strong>Group:</strong> {infoTeacher.group}
                        </p>
                        <p>
                            <strong>Password:</strong> {infoTeacher.password}
                        </p>
                        <button className="closeBtn" onClick={() => setInfoTeacher(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeacherMain;