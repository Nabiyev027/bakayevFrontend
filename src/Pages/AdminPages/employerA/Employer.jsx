import React, {useEffect, useState} from 'react';
import "./employer.scss"
import ApiCall from "../../../Utils/ApiCall";
import {FaCheck, FaImage} from "react-icons/fa";
import {IoIosUndo} from "react-icons/io";
import {MdEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {toast, ToastContainer} from "react-toastify";

function Employer() {
    const [teachers, setTeachers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedEmployer, setEditedEmployer] = useState({});
    const [infoStudent, setInfoStudent] = useState(null);
    const [roles, setRoles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [selRoleId, setSelRoleId] = useState("all");
    const [selBranchId, setSelBranchId] = useState("all");
    const [filteredEmployers, setFilteredEmployers] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selId, setSelId] = useState("");
    const [selectedEmployerlogin, setSelectedEmployerlogin] = useState("");

    const BaseUrl = "http://localhost:8080";

    useEffect(() => {
        getFilials()
        getEmpRoles()
    },[])

    useEffect(()=>{
        getEmployers()
    },[selBranchId, selRoleId])

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
            const res = await ApiCall(`/user/employer?filialId=${selBranchId}&roleId=${selRoleId}`, {method: "GET"})
            console.log(res.data)
            setEmployers(res.data)
        }catch(error) {
            console.log(error);
        }
    }

    function filterEmployers(branchId, roleId) {
        if (branchId === "all" && roleId === "all" ) {
            setFilteredEmployers(employers)
        }
        if (branchId === "all" && roleId === selRoleId ) {

        }
        if(branchId === selBranchId && roleId === "all" ) {

        }

    }


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedEmployer({...editedEmployer, [name]: value});
    };

    const handleCheckboxChange = (e, isEditing = false) => {
        const { value, checked } = e.target;

        // Role IDs bilan ishlaymiz
        let selectedRoles = isEditing ? [...editedEmployer.roleIds] : [];

        if (checked) {
            if (!selectedRoles.includes(value)) selectedRoles.push(value);
        } else {
            selectedRoles = selectedRoles.filter(id => id !== value);
        }

        setEditedEmployer({
            ...editedEmployer,
            roleIds: selectedRoles
        });
    };



    function handleCancel() {
        setEditingIndex(null);
        setEditedEmployer({});
    }

    const handleEdit = (idx) => {
        const emp = employers[idx];   // <-- to‘g‘ri massiv

        // Filiallar ID-lari
        const branchIds = (emp.filialNameDtos || []).map(b => b.id);

        // Role ID-lari
        const roleIds = (emp.roles || []).map(r => r.id);

        setEditingIndex(idx);
        setEditedEmployer({
            ...emp,
            branchIds,
            roleIds,
        });
    };



    async function handleDelete(st) {
        if (window.confirm(`Are you confirm delete ${st.firstName} ${st.lastName}`)) {
            // o‘chirish funksiyasi

            try {
                const res = await ApiCall(`/user/delete/${st.id}`, {method: "DELETE"});
                console.log(res.data)
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

    const handleCheckboxChangeBranches = (e) => {
        const { value, checked } = e.target;

        // ROLE_RECEPTION tekshiruvi
        const isReception = editedEmployer.roleIds.includes(
            roles.find(r => r.name === "ROLE_RECEPTION")?.id
        );

        let selected = [...editedEmployer.branchIds];

        if (isReception) {
            // Agar ROLE_RECEPTION bo‘lsa faqat bitta checkbox tanlansin
            if (checked) {
                selected = [value]; // faqat yangi tanlangan branch qoladi
            } else {
                selected = []; // agar uncheck qilinsa bo‘sh qoladi
            }
        } else {
            // ROLE_RECEPTION bo‘lmasa, oddiy multiple select
            if (checked) {
                if (!selected.includes(value)) selected.push(value);
            } else {
                selected = selected.filter(id => id !== value);
            }
        }

        setEditedEmployer({
            ...editedEmployer,
            branchIds: selected
        });
    };



    async function handleSave() {
        console.log(editedEmployer);
        if (editedEmployer.firstName === "" || editedEmployer.lastName === "" || editedEmployer.phone === "") {
            alert("Please fill all blanks")
        }

        try {
            const res = await ApiCall(`/user/employer/${editedEmployer.id}`, {method: "PUT"}, {
                firstName: editedEmployer.firstName,
                lastName: editedEmployer.lastName,
                phone: editedEmployer.phone,
                username: editedEmployer.username,
                filialIds: editedEmployer.branchIds,
                roleIds: editedEmployer.roleIds,

            });

            if (res.data) {
                await getEmployers();
                setEditingIndex(null);
                setEditedEmployer({});
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className="employer-page">
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

            <h2>Employers</h2>
            <div className="employer-header">
                <select id="branch" className="filial-select"
                    onChange={(e)=>setSelBranchId(e.target.value)}
                >
                    <option value="all">Select Branch</option>
                    {
                        branches?.map((b) => <option value={b.id} key={b.id}>{b.name}</option>)
                    }
                </select>
                <select className="role-select"
                        onChange={(e)=>setSelRoleId(e.target.value)}
                >
                    <option value="all">Select Role</option>
                    {
                        roles?.map((r) => <option value={r.id} key={r.id}>{

                            r.name==="ROLE_RECEPTION" ? "RECEPTION" :
                                r.name==="ROLE_MAIN_RECEPTION" ? "MAIN RECEPTION" : "TEACHER"
                        }</option>)
                    }
                </select>
            </div>

            <div className="table-wrap-box">
                <table className="employer-table">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Photo</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Phone</th>
                        <th>Filial</th>
                        <th>Roles</th>
                        <th>Login</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employers?.map((t, i) => (
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
                                    <div className={"table-group-checkboxes"}>
                                        {
                                            branches?.map((b) => (
                                                <label key={b.id}>
                                                    <input
                                                        className={"inp-check"}
                                                        type="checkbox"
                                                        value={b.id}
                                                        checked={editedEmployer.branchIds.includes(b.id)}
                                                        onChange={(e)=>handleCheckboxChangeBranches(e, true)}
                                                    />
                                                    {b.name}
                                                </label>
                                            ))
                                        }
                                    </div>
                                ) : (

                                    t.filialNameDtos?.map((b) => <h4 key={b.id}>{b.name}</h4>)
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
                                    t.roles?.map((r) => <h4>
                                            {r.name.replace("ROLE_", "").replace("_", " ")}
                                    </h4>)
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