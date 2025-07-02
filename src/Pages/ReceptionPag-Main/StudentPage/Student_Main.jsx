import React, {useEffect, useState} from "react";
import "./student.scss";
import ApiCall from "../../../Utils/ApiCall";
import {FaCheck} from "react-icons/fa";
import {IoIosUndo} from "react-icons/io";
import {MdEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";

function Student_Main() {
    const [students, setStudents] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedStudent, setEditedStudent] = useState({});
    const [infoStudent, setInfoStudent] = useState(null);
    const [groups, setGroups] = useState([]);
    const [branches, setBranches] = useState([]);
    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        getGroups()
        getStudents()
        getFilials()
    }, []);

    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"})
            setBranches(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getGroups() {
        try {
            const res = await ApiCall("/group/getNames", {method: "GET"})
            setGroups(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getStudents() {
        try {
            const res = await ApiCall("/user/students", {method: "GET"});
            setStudents(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedStudent({...editedStudent, [name]: value});
    };

    const handleCheckboxChange = (e, isEditing = false) => {
        const {value, checked} = e.target;
        const selected = isEditing
            && [...editedStudent.groupIds]

        if (checked) {
            if (!selected.includes(value)) selected.push(value);
        } else {
            const index = selected.indexOf(value);
            if (index > -1) selected.splice(index, 1);
        }

        if (isEditing) {
            setEditedStudent({...editedStudent, groupIds: selected});
        }
    };

    async function handleSave() {
        console.log(editedStudent);
        if (editedStudent.firstName === "" || editedStudent.lastName === "" || editedStudent.phone === "" || editedStudent.branchId === "") {
            alert("Please fill all blanks")
        }

        try {
            const res = await ApiCall(`/user/student/${editedStudent.id}`, {method: "PUT"}, {
                firstName: editedStudent.firstName,
                lastName: editedStudent.lastName,
                phone: editedStudent.phone,
                parentPhone: editedStudent.parentPhone,
                filialId: editedStudent.branchId,
                groupIds: editedStudent.groupIds,
                username: editedStudent.username,
            });

            if(res.data){
                await getGroups();          // yangilangan ro‘yxatni olib kelamiz
                setEditingIndex(null);
                setEditedStudent({});
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    function handleCancel() {
        setEditingIndex(null);
        setEditedStudent({});
    }

    const handleEdit = (idx) => {
        const student = students[idx];

        // Guruhga biriktirilgan o‘qituvchilar ID‑lar ro‘yxati
        const groupIds = (student.groups || []).map(g => g.id);

        setEditingIndex(idx);
        setEditedStudent({
            ...student,
            groupIds,              // checkboxlar uchun ['id1', 'id2', …]

            // select uchun hozirgi filial va xona ID‑larini ham kiritib qo‘yish foydali
            branchId: student.filialNameDto?.id || "",

        });
    };

    async function handleDelete(st) {
        if (window.confirm(`Are you confirm delete ${st.firstName} ${st.lastName}`)) {
            // o‘chirish funksiyasi

            try {
                const res = await ApiCall(`/user/delete/${st.id}`, {method: "DELETE"});
                console.log(res.data)
                await getStudents()
            } catch (err) {
                console.log(err);
            }

        }
    }

    return (
        <div className="student-page">
            <h2>Students</h2>
            <div className="student-header">
                <select id="branch" className="filial-select">
                    <option value="all">All filials</option>
                    {
                        branches?.map((b) => <option value={b.id} key={b.id}>{b.name}</option>)
                    }
                </select>
                <select className="group-select">
                    <option value="all">All Groups</option>
                    {
                        groups?.map((g) => <option value={g.id} key={g.id}>{g.name}</option>)
                    }
                </select>
            </div>

            <div className="table-boxx">
                <table className="student-table">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Photo</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Phone</th>
                        <th>Parent Phone</th>
                        <th>Filial</th>
                        <th>Group</th>
                        <th>login</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students?.map((st, i) => (
                        <tr key={st.id}>
                            <td>{i + 1}</td>
                            <td>
                                <img src={`${BaseUrl + st.imgUrl}`} alt={"Img"}/>
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        name="firstName"
                                        type={"text"}
                                        value={editedStudent.firstName}
                                        onChange={handleInputChange}
                                        className="input-edit"
                                    />
                                ) : (
                                    st.firstName
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        name="lastName"
                                        value={editedStudent.lastName}
                                        onChange={handleInputChange}
                                        className="input-edit"
                                    />
                                ) : (
                                    st.lastName
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        name="phone"
                                        type="text"
                                        value={editedStudent.phone}
                                        onChange={handleInputChange}
                                        className="input-edit"
                                    />
                                ) : (
                                    st.phone
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        name="parentPhone"
                                        value={editedStudent.parentPhone}
                                        onChange={handleInputChange}
                                        className="input-edit"
                                    />
                                ) : (
                                    st.parentPhone
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <select
                                        name="branchId"
                                        className={"select-g"}
                                        value={editedStudent.branchId}
                                        onChange={handleInputChange}
                                    >
                                        {
                                            branches&&branches.map((b) => <option key={b.id} value={b.id}>
                                                {b?.name}
                                            </option>)
                                        }
                                    </select>
                                ):(
                                        st.filialNameDto?.name
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <div className="table-group-checkboxes">
                                        {groups?.map((g) => (
                                            <label key={g.id}>
                                                <input
                                                    className="inp-check"
                                                    type="checkbox"
                                                    value={g.id}
                                                    checked={editedStudent.groupIds.includes(g.id)}
                                                    onChange={(e) => handleCheckboxChange(e, true)}
                                                />
                                                {g.name}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    st.groups?.map((g) => <h4>{g.name}</h4>)
                                )}
                            </td>
                            <td>
                                {
                                    editingIndex === i ? (
                                        <input
                                            name="username"
                                            value={editedStudent.username}
                                            onChange={handleInputChange}
                                            className="input-edit"
                                        />
                                    ) : (
                                        st.username
                                    )
                                }
                            </td>
                            <td>
                                <button className={"change-p-btn"}>Change</button>
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <div className="actions-g">
                                        <div className={"g-btn-check btn-g"} onClick={handleSave}>
                                            <FaCheck/>
                                        </div>
                                        <div className={"g-btn-cancel btn-g"} onClick={handleCancel}>
                                            <IoIosUndo/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={"actions-g"}>
                                        <div className={"g-btn-edit btn-g"} onClick={() => handleEdit(i)}>
                                            <MdEdit/>
                                        </div>
                                        <div className={"g-btn-delete btn-g"} onClick={() => handleDelete(st)}>
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

            {infoStudent && (
                <div className="modal-overlay" onClick={() => setInfoStudent(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Student Info</h3>
                        <img src={infoStudent.photo} alt={infoStudent.name}/>
                        <p>
                            <strong>ID:</strong> {infoStudent.id}
                        </p>
                        <p>
                            <strong>Name:</strong> {infoStudent.name}
                        </p>
                        <p>
                            <strong>Age:</strong> {infoStudent.age}
                        </p>
                        <p>
                            <strong>Phone:</strong> {infoStudent.phone}
                        </p>
                        <p>
                            <strong>Group:</strong> {infoStudent.group}
                        </p>
                        <p>
                            <strong>Password:</strong> {infoStudent.password}
                        </p>
                        <button className="closeBtn" onClick={() => setInfoStudent(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Student_Main;
