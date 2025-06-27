import {useEffect, useState} from "react";
import "./group.scss";
import ApiCall from "../../../Utils/ApiCall";
import {FaCheck} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {IoIosUndo} from "react-icons/io";

function Group_Main() {
    const [teachers, setTeachers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [branchRooms,setBranchRooms] = useState([]);
    const [groups, setGroups] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedGroup, setEditedGroup] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [newGroup, setNewGroup] = useState({
        name: "",
        degree: "",
        roomId: "",
        teacherIds: [],
        startTime: "",
        endTime: "",
        branchId: "",
    });

    useEffect(() => {
        getGroups()
        getTeachers()
        getBranches()
    }, [])

    async function getGroups() {
        try {
            const res = await ApiCall("/group/getAll", {method: "GET"})
            console.log(res.data)
            setGroups(res.data)
        } catch (err) {
            console.log(err.message);
        }
    }

    async function getTeachers() {
        try {
            const res = await ApiCall("/user/teacher", {method: "GET"})
            setTeachers(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    async function getBranches() {
        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"})
            setBranches(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    function validateGroupForm(group) {
        const newErrors = {};
        const { name, degree, roomId, teacherIds, startTime, endTime, branchId } = group;

        if (!name.trim()) newErrors.name = "Guruh nomi majburiy.";
        if (!degree.trim()) newErrors.degree = "Daraja majburiy.";
        if (!branchId) newErrors.branchId = "Filial tanlanishi kerak.";
        if (!roomId) newErrors.roomId = "Xona tanlanishi kerak.";
        if (!teacherIds || teacherIds.length === 0) newErrors.teacherIds = "Kamida bitta o‘qituvchi tanlanishi kerak.";
        if (!startTime) newErrors.startTime = "Boshlanish vaqti kerak.";
        if (!endTime) newErrors.endTime = "Tugash vaqti kerak.";
        if (startTime && endTime && startTime >= endTime) {
            newErrors.timeRange = "Boshlanish vaqti tugashidan oldin bo‘lishi kerak.";
        }

        return newErrors;
    }

    const handleEdit = (idx) => {
        const group = groups[idx];

        const teacherIds = group.teacherNameDtos.map(t => t.id); // id larni ajratib olamiz

        setEditingIndex(idx);
        setEditedGroup({
            ...group,
            teacherIds: teacherIds,
            roomId: group.roomDto?.id || "",
            branchId: group.branchId || "", // mavjud bo‘lsa
        });
        setIsModalOpen(false);
    };

    const handleCheckboxChange = (e, isEditing = false) => {
        const {value, checked} = e.target;
        const selected = isEditing
            ? [...editedGroup.teacherIds]
            : [...newGroup.teacherIds];

        if (checked) {
            if (!selected.includes(value)) selected.push(value);
        } else {
            const index = selected.indexOf(value);
            if (index > -1) selected.splice(index, 1);
        }

        if (isEditing) {
            setEditedGroup({...editedGroup, teacherIds: selected});
        } else {
            setNewGroup({...newGroup, teacherIds: selected});
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedGroup({...editedGroup, [name]: value});
    };

    const handleSave = () => {
        const updated = [...groups];
        updated[editingIndex] = editedGroup;
        setGroups(updated);
        setEditingIndex(null);
        setEditedGroup({});
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditedGroup({});
    };

    const handleDelete = (idx) => {
        const updated = [...groups];
        updated.splice(idx, 1);
        setGroups(updated);
    };

    async function AddGroup() {

        const formErrors = validateGroupForm(newGroup);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const res = await ApiCall("/group/add", {method: "POST"},{
                name: newGroup.name,
                degree: newGroup.degree,
                roomId: newGroup.roomId,
                filialId: newGroup.branchId,
                startTime: newGroup.startTime,
                endTime: newGroup.endTime,
                teacherIds: newGroup.teacherIds,
            })
            await getGroups()
            console.log(res.data)
            setErrors({});
        } catch (err) {
            console.log(err.message);
        }

        setIsModalOpen(false);
    }

    function cancelAdd() {
        setIsModalOpen(false);
    }

    function selectBranch(e) {
        const selectedBranchId = e.target.value;
        const selectedBranch = branches.find(branch => branch.id === selectedBranchId);

        if (selectedBranch && Array.isArray(selectedBranch.rooms)) {
            setBranchRooms(selectedBranch.rooms);
        } else {
            setBranchRooms([]);
        }

        setNewGroup({...newGroup, branchId: selectedBranchId, roomId: ""}); // roomId ni ham tozalab yuboring
    }

    function selectRoom(e) {
        console.log(e.target.value);
        setNewGroup({...newGroup, roomId: e.target.value})
    }

    const formatTime = (timeStr) => {
        const date = new Date(`1970-01-01T${timeStr}`);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="group-page">
            {/* Branch Selector for Main User */}
                <div className="branch-selectG">
                    <select id="branch" className="select-box">
                        <option value="1">Filial 1</option>
                        <option value="2">Filial 2</option>
                    </select>
                </div>

            <h1 className="groupTitle">Groups</h1>
                <button className="addBtn" onClick={() => setIsModalOpen(true)}>
                    + Add Group
                </button>


            {/* Add Group Modal */}
            {isModalOpen && (
                <div className="modal-rec-overlay">
                    <div className="modal-rec">
                        <h2>Add New Group</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Group Name"
                            value={newGroup.name}
                            onChange={(e)=>setNewGroup({...newGroup, name: e.target.value})}
                        />
                        {errors.name && <p className="error-msg">{errors.name}</p>}

                        <input
                            type={"text"}
                            name="degree"
                            placeholder="Group degree"
                            value={newGroup.degree}
                            onChange={(e)=>setNewGroup({...newGroup, degree: e.target.value})}/>
                        {errors.degree && <p className="error-msg">{errors.degree}</p>}

                            <select
                                name="branch"
                                value={newGroup.branchId || ""}
                                onChange={(e)=>selectBranch(e)}
                            >
                                <option value="">Select Branch</option>
                                {
                                    branches.map((branch) => <option value={branch.id}  key={branch.id} >{branch.name}</option>)
                                }
                            </select>
                        {errors.branchId && <p className="error-msg">{errors.branchId}</p>}

                        <select
                            name="roomId"
                            value={newGroup.roomId}
                            onChange={(e)=>selectRoom(e)}
                        >
                            <option value="">Select Room</option>
                            {
                                branchRooms && branchRooms.map((room) => <option value={room.id} key={room.id} >
                                    {room.number}-{room.name}
                                </option>)
                            }
                        </select>
                        {errors.roomId && <p className="error-msg">{errors.roomId}</p>}

                        <div className="teacher-checkboxes">
                            {teachers.map((t) => (
                                <label key={t.id}>
                                    <input
                                        type="checkbox"
                                        value={t.id}
                                        checked={newGroup.teacherIds.includes(t.id)}
                                        onChange={(e) => handleCheckboxChange(e, false)}
                                    />
                                    {t.name}
                                </label>
                            ))}
                        </div>
                        {errors.teacherIds && <p className="error-msg">{errors.teacherIds}</p>}

                        <div className="time-row">
                            <input
                                type="time"
                                name="startTime"
                                value={newGroup.startTime}
                                onChange={(e)=>setNewGroup({...newGroup, startTime: e.target.value})}
                            />
                            <span>-</span>
                            <input
                                type="time"
                                name="endTime"
                                value={newGroup.endTime}
                                onChange={(e)=>setNewGroup({...newGroup, endTime: e.target.value})}
                            />
                        </div>
                        {errors.startTime && <p className="error-msg">{errors.startTime}</p>}
                        {errors.endTime && <p className="error-msg">{errors.endTime}</p>}
                        {errors.timeRange && <p className="error-msg">{errors.timeRange}</p>}

                        <div className="modal-actions">
                            <button className="saveBtn" onClick={AddGroup}>
                                Add
                            </button>
                            <button
                                className="cancelBtn"
                                onClick={cancelAdd}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Groups Table */}
            <div className="table-boxx">
                <table className="GroupTable" border={1}>
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Degree</th>
                        <th>Room</th>
                        <th>Teachers</th>
                        <th>Students</th>
                        <th>Branch</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {groups.map((g, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                                {editingIndex === i ? (
                                    <input className={"inp-g"}
                                        type="text"
                                        name="name"
                                        value={editedGroup.name}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    g.name
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <select
                                        name="degree"
                                        value={editedGroup.degree}
                                        onChange={handleInputChange}
                                    >
                                        {Array.from({length: 4}, (_, idx) => (
                                            <option
                                                key={idx}
                                                value={`Degree ${idx + 1}`}
                                            >{`Degree ${idx + 1}`}</option>
                                        ))}
                                    </select>
                                ) : (
                                    g.degree
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <select
                                        name="RoomId"
                                        value={editedGroup.RoomId}
                                        onChange={handleInputChange}
                                    >
                                        {Array.from({length: 4}, (_, idx) => (
                                            <option key={idx} value={`Room ${idx + 1}`}>{`Room ${
                                                idx + 1
                                            }`}</option>
                                        ))}
                                    </select>
                                ) : (
                                    `${"№" + g.roomDto.number +" "+ g.roomDto.name}`
                                )}
                            </td>

                            <td>
                                {editingIndex === i ? (
                                    <div className="teacher-checkboxes">
                                        {g.teacherNameDtos.map((t) => (
                                            <label key={t.id}>
                                                <input
                                                    className={"inp-g"}
                                                    type="checkbox"
                                                    value={t.id}
                                                    checked={editedGroup.teacherIds.includes(t.id)}
                                                    onChange={(e) => handleCheckboxChange(e, true)}
                                                />
                                                {t.name}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {
                                            g.teacherNameDtos.map((t) => (
                                                <h5 key={t.id}>
                                                    {t.name}
                                                </h5>
                                            ))
                                        }
                                    </>
                                )}
                            </td>
                            <td>{g.studentsNumber}</td>

                            <td>
                                    {editingIndex === i ? (
                                        <select
                                            name="branch"
                                            value={editedGroup.branch}
                                            onChange={handleInputChange}
                                        >
                                            <option value="1-filial">1-filial</option>
                                            <option value="2-filial">2-filial</option>
                                        </select>
                                    ) : (
                                        g.filialName
                                    )}
                                </td>

                            <td>
                                {editingIndex === i ? (
                                    <div className="time-row">
                                        <input
                                            className={"inp-g"}
                                            type="time"
                                            name="startTime"
                                            value={editedGroup.startTime}
                                            onChange={handleInputChange}
                                        />
                                        <br/>
                                        <input
                                            className={"inp-g"}
                                            type="time"
                                            name="endTime"
                                            value={editedGroup.endTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ) : (
                                    `${formatTime(g.startTime)} - ${formatTime(g.endTime)}`
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <div className="actions-g">
                                        <div className={"g-btn-check btn-g"} onClick={handleSave}>
                                            <FaCheck/>
                                        </div>
                                        <div className={"g-btn-cancel btn-g"} onClick={handleCancel}>
                                            <IoIosUndo />
                                        </div>
                                    </div>
                                ) : (
                                    <div className={"actions-g"}>
                                        <div className={"g-btn-edit btn-g"} onClick={() => handleEdit(i)}>
                                            <MdEdit/>
                                        </div>
                                        <div className={"g-btn-delete btn-g"} onClick={() => handleDelete(i)}>
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
        </div>
    );
}

export default Group_Main;

