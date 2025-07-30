import React, {useEffect, useState} from 'react';
import "./employer.scss"
import ApiCall from "../../../Utils/ApiCall";
import {FaCheck, FaImage} from "react-icons/fa";
import {IoIosUndo} from "react-icons/io";
import {MdEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";

function Employer() {
    const [teachers, setTeachers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedEmployer, setEditedEmployer] = useState({});
    const [infoStudent, setInfoStudent] = useState(null);
    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
       getFilials()
        getEmpRoles()
        getEmployers()
    },[])

    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"})
            setBranches(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getEmpRoles() {
        try {
            const res= await ApiCall("/user/getEmpRoles", {method: "GET"})
            console.log(res.data)
            setRoles(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getEmployers() {
        try {
            const res = await ApiCall("/user/employer", {method: "GET"})
            console.log(res.data)
        }catch(error) {
            console.log(error);
        }
    }


    async function getTeachers() {
        try {
            const res = await ApiCall("/user/teacherWithData", {method: "GET"});
            console.log(res.data);
            setTeachers(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedEmployer({...editedEmployer, [name]: value});
    };

    const handleCheckboxChange = (e, isEditing = false) => {
        const {value, checked} = e.target;
        const selected = isEditing
            && [...editedEmployer.groupIds]

        if (checked) {
            if (!selected.includes(value)) selected.push(value);
        } else {
            const index = selected.indexOf(value);
            if (index > -1) selected.splice(index, 1);
        }

        if (isEditing) {
            setEditedEmployer({...editedEmployer, groupIds: selected});
        }
    };

    async function handleSave() {
        console.log(editedEmployer);
        if (editedEmployer.firstName === "" || editedEmployer.lastName === "" || editedEmployer.phone === "" || editedEmployer.branchId === "") {
            alert("Please fill all blanks")
        }

        try {
            const res = await ApiCall(`/user/student/${editedEmployer.id}`, {method: "PUT"}, {
                firstName: editedEmployer.firstName,
                lastName: editedEmployer.lastName,
                phone: editedEmployer.phone,
                parentPhone: editedEmployer.parentPhone,
                filialId: editedEmployer.branchId,
                groupIds: editedEmployer.groupIds,
                username: editedEmployer.username,
            });

            if(res.data){
                await getTeachers();
                setEditingIndex(null);
                setEditedEmployer({});
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    function handleCancel() {
        setEditingIndex(null);
        setEditedEmployer({});
    }

    const handleEdit = (idx) => {
        const teacher = teachers[idx];

        // Guruhga biriktirilgan o‘qituvchilar ID‑lar ro‘yxati
        const groupIds = (teacher.groups || []).map(g => g.id);

        setEditingIndex(idx);
        setEditedEmployer({
            ...teacher,
            groupIds,              // checkboxlar uchun ['id1', 'id2', …]

            // select uchun hozirgi filial va xona ID‑larini ham kiritib qo‘yish foydali
            branchId: teacher.filialNameDto?.id || "",

        });
    };

    async function handleDelete(st) {
        if (window.confirm(`Are you confirm delete ${st.firstName} ${st.lastName}`)) {
            // o‘chirish funksiyasi

            try {
                const res = await ApiCall(`/user/delete/${st.id}`, {method: "DELETE"});
                console.log(res.data)
                await getTeachers()
            } catch (err) {
                console.log(err);
            }

        }
    }

    return (
        <div className="teacherM-page">
            <h2>Employers</h2>
            <div className="teacherM-header">
                <select id="branch" className="filial-select">
                    <option value="all">Select Branch</option>
                    {
                        branches?.map((b) => <option value={b.id} key={b.id}>{b.name}</option>)
                    }
                </select>
                <select className="group-select">
                    <option value="all">Select Role</option>
                    {
                        roles?.map((r) => <option value={r.id} key={r.id}>{

                            r.name==="ROLE_RECEPTION" ? "RECEPTION" :
                                r.name==="ROLE_MAIN_RECEPTION" ? "MAIN RECEPTION" : "TEACHER"
                        }</option>)
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
                        <th>Role</th>
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
                                        name="firstName"
                                        type={"text"}
                                        value={editedEmployer.firstName}
                                        onChange={handleInputChange}
                                        className="input-edit"
                                    />
                                ) : (
                                    t.firstName
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        name="lastName"
                                        value={editedEmployer.lastName}
                                        onChange={handleInputChange}
                                        className="input-edit"
                                    />
                                ) : (
                                    t.lastName
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <input
                                        name="phone"
                                        type="text"
                                        value={editedEmployer.phone}
                                        onChange={handleInputChange}
                                        className="input-edit"
                                    />
                                ) : (
                                    t.phone
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <select
                                        name="branchId"
                                        className={"select-g"}
                                        value={editedEmployer.branchId}
                                        onChange={handleInputChange}
                                    >
                                        <option  value="">SelectBranch</option>
                                        {
                                            branches&&branches.map((b,i) => <option key={i} value={b?.id}>
                                                {b?.name}
                                            </option>)
                                        }
                                    </select>
                                ):(
                                    t.filialNameDto != null ? t.filialNameDto.name : "No"
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <div className="table-group-checkboxes">
                                        {roles?.map((r) => (
                                            <label key={r.id}>
                                                <input
                                                    className="inp-check"
                                                    type="checkbox"
                                                    value={r.id}
                                                    checked={editedEmployer.roleIds.includes(r.id)}
                                                    onChange={(e) => handleCheckboxChange(e, true)}
                                                />
                                                {r.name}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    t.groups?.map((g) => <h4>{g.name}</h4>)
                                )}
                            </td>
                            <td>
                                {
                                    editingIndex === i ? (
                                        <input
                                            name="username"
                                            value={editedEmployer.username}
                                            onChange={handleInputChange}
                                            className="input-edit"
                                        />
                                    ) : (
                                        t.username
                                    )
                                }
                            </td>
                            <td>
                                <button className={"change-p-btn"}>Change</button>
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

export default Employer;