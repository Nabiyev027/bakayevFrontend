import {useEffect, useState} from "react";
import "./group.scss";
import ApiCall from "../../../Utils/ApiCall";
import {MdEdit} from "react-icons/md";
import {RiDeleteBin5Fill} from "react-icons/ri";
import {IoIosUndo} from "react-icons/io";
import {toast, ToastContainer} from "react-toastify";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Group() {
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [branches, setBranches] = useState([]);
    const [branchRooms, setBranchRooms] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState("all");
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
        dayType:""
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10); // Har sahifada 10 ta guruh

    useEffect(() => {
        getRooms()
        getBranches()
    }, [])

    useEffect(() => {
        getGroups(selectedBranchId);
    }, [selectedBranchId, currentPage]);

    useEffect(() => {
        setCurrentPage(0);
    }, [selectedBranchId]);

    async function getRooms() {
        try {
            const res = await ApiCall("/room/getAll", {method: "GET"})
            setRooms(res.data)
        } catch (err) {
            console.log(err.message);
        }
    }

    async function getGroups(branchId) {
        try {
            // API-ga page va size parametrlarini yuboramiz
            const res = await ApiCall(`/group/getAll?filialId=${branchId}&page=${currentPage}&size=${pageSize}`, {method: "GET"});

            if (res.data) {
                // Agar backend Page ob'ekti qaytarsa:
                setGroups(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            }
        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

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
        const {name, degree, roomId, startTime, endTime, branchId} = group;

        if (!name.trim()) newErrors.name = "Guruh nomi majburiy.";
        if (!degree.trim()) newErrors.degree = "Daraja majburiy.";
        if (!branchId) newErrors.branchId = "Filial tanlanishi kerak.";
        if (!roomId) newErrors.roomId = "Xona tanlanishi kerak.";
        // if (!teacherIds || teacherIds.length === 0) newErrors.teacherIds = "Kamida bitta o‘qituvchi tanlanishi kerak.";
        if (!startTime) newErrors.startTime = "Boshlanish vaqti kerak.";
        if (!endTime) newErrors.endTime = "Tugash vaqti kerak.";
        if (startTime && endTime && startTime >= endTime) {
            newErrors.timeRange = "Boshlanish vaqti tugashidan oldin bo‘lishi kerak.";
        }

        return newErrors;
    }



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

        // If user changes branch in edit mode, update branchRooms and teachers accordingly
        if (name === 'branchId') {
            const selectedBranch = branches.find(b => String(b.id) === String(value));
            if (selectedBranch) {
                const roomsList = selectedBranch.rooms || selectedBranch.roomDtos || selectedBranch.roomDtoList || [];
                if (Array.isArray(roomsList)) setBranchRooms(roomsList);
                else setBranchRooms([]);
            } else {
                setBranchRooms([]);
            }

            // reset room selection when branch changes and auto-select first room if available
            const selectedBranchObj = branches.find(b => String(b.id) === String(value));
            const roomsList = selectedBranchObj ? (selectedBranchObj.rooms || selectedBranchObj.roomDtos || selectedBranchObj.roomDtoList || []) : [];
            const firstRoomId = Array.isArray(roomsList) && roomsList.length > 0 ? String(roomsList[0].id) : '';
            setEditedGroup(prev => ({...prev, branchId: String(value), roomId: firstRoomId}));

            // clear room-related errors
            setErrors(prev => ({...prev, roomId: undefined, branchId: undefined, general: undefined}));

            // fetch teachers for the selected branch
            if (value) getTeachersByFilial(value);
            return;
        }

        setEditedGroup(prev => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        // Validate edited group with existing validator to get specific errors
        const formErrors = validateGroupForm(editedGroup || {});
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            // show first error to user as a toast
            const firstKey = Object.keys(formErrors)[0];
            toast.error(formErrors[firstKey]);
            return;
        }

        try {
            const res = await ApiCall(`/group/${editedGroup.id}`, {method: "PUT"}, {
                name: editedGroup.name,
                degree: editedGroup.degree,
                roomId: editedGroup.roomId,
                filialId: editedGroup.branchId,
                startTime: editedGroup.startTime,
                endTime: editedGroup.endTime,
                teacherIds: editedGroup.teacherIds,
                dayType: editedGroup.dayType,
            });
            toast.success(res.data);
            await getGroups(selectedBranchId);
            setEditedGroup({});
            setEditingIndex(null);
            setErrors({});

        } catch (err) {
            toast.error(err.response?.data || err.message || 'Save error');
        }
    };


    const handleCancel = () => {
        setEditingIndex(null);
        setEditedGroup({});
    };

    async function getTeachersByFilial(id) {
        try {
            const res = await ApiCall(`/user/teacher/${id}`, {method: "GET"})
            setTeachers(res.data)
        } catch (err) {
            toast.error(err.response.data);
        }
    }

    const handleEdit = (idx) => {
        const group = groups[idx];

        getTeachersByFilial(group.filialNameDto.id)

        // Guruhga biriktirilgan o‘qituvchi ID‑lar ro‘yxati
        const teacherIds = (group.teacherNameDtos || []).map(t => t.id);

        setEditingIndex(idx);
        setEditedGroup({
            ...group,
            teacherIds,              // checkboxlar uchun ['id1', 'id2', …]

            // select uchun hozirgi filial va xona ID‑larini ham kiritib qo‘yish foydali
            branchId: group.filialNameDto?.id || "",
            roomId:   group.roomDto?.id        || "",
        });

        // --- NEW: set branchRooms so the room select shows only rooms for this group's branch ---
        try {
            const branchId = group.filialNameDto?.id;
            if (branchId && Array.isArray(branches)) {
                const selectedBranch = branches.find(b => String(b.id) === String(branchId));
                if (selectedBranch) {
                    const roomsList = selectedBranch.rooms || selectedBranch.roomDtos || selectedBranch.roomDtoList || [];
                    if (Array.isArray(roomsList)) setBranchRooms(roomsList);
                    else setBranchRooms([]);
                } else {
                    setBranchRooms([]);
                }
            } else {
                setBranchRooms([]);
            }
        } catch (err) {
            setBranchRooms([]);
        }
    };

    const handleDelete = async (g) => {
        if (window.confirm(`Are you confirm delete ${g.name}`)) {
            // o‘chirish funksiyasi

            try {
                const res = await ApiCall(`/group/${g.id}`, {method: "DELETE"});
                await getGroups(selectedBranchId);
                toast.success(res.data)
            } catch (err) {
                toast.error(err.response.data || "Something error!");
            }

        }


    };

    async function AddGroup() {
        const formErrors = validateGroupForm(newGroup);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const res = await ApiCall("/group/add", {method: "POST"}, {
                name: newGroup.name,
                degree: newGroup.degree,
                roomId: newGroup.roomId,
                filialId: newGroup.branchId,
                startTime: newGroup.startTime,
                endTime: newGroup.endTime,
                teacherIds: newGroup.teacherIds,
                dayType: newGroup.dayType,
            })
            await getGroups(selectedBranchId);

            setNewGroup({
                name: "",
                degree: "",
                roomId: "",
                teacherIds: [],
                startTime: "",
                endTime: "",
                branchId: "",
                dayType:""
            })
            setErrors({});
            toast.success(res.data);
        } catch (err) {
            toast.error(err.response.data || "Something error!");
        }

        setIsModalOpen(false);
    }

    function cancelAdd() {
        setIsModalOpen(false);
    }

    async function selectBranch(e) {
        const selectedBranchId = e.target.value;
        const selectedBranch = branches.find(branch => String(branch.id) === String(selectedBranchId));

        if (selectedBranch && Array.isArray(selectedBranch.rooms)) {
            setBranchRooms(selectedBranch.rooms);
        } else {
            setBranchRooms([]);
        }

        setNewGroup({...newGroup, branchId: selectedBranchId, roomId: ""}); // roomId ni ham tozalab yuboring

        // Bu yerda teacherlarni ham olib kelamiz
        if (selectedBranchId) {
            try {
                const res = await ApiCall(`/user/teacher/${selectedBranchId}`, { method: "GET" });
                setTeachers(res.data);
            } catch (err) {
                toast.error(err.message || "Teacherlarni olishda xatolik");
            }
        } else {
            setTeachers([]); // agar filial tanlanmasa, teacherlarni tozalash
        }
    }


    function selectRoom(e) {
        setNewGroup({...newGroup, roomId: e.target.value})
    }

    const formatTime = (timeStr) => {
        const date = new Date(`1970-01-01T${timeStr}`);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    function selectBranchGroups(e) {
        setSelectedBranchId(e.target.value);


    }

    function selectDayType(e) {
        setNewGroup({...newGroup, dayType: e.target.value})
    }

    return (
        <div className="group-page">
            <ToastContainer />
            {/* Branch Selector for Main User */}
            <div className="branch-selectG">
                <select id="branch" className="select-box" onChange={selectBranchGroups} value={selectedBranchId}>
                    <option value="all">All Groups</option>
                    {
                        branches?.map((branch) => (<option value={branch.id} key={branch.id}>{branch.name}</option>))
                    }
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
                            onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                        />
                        {errors.name && <p className="error-msg">{errors.name}</p>}

                        <input
                            type={"text"}
                            name="degree"
                            placeholder="Group degree"
                            value={newGroup.degree}
                            onChange={(e) => setNewGroup({...newGroup, degree: e.target.value})}/>
                        {errors.degree && <p className="error-msg">{errors.degree}</p>}

                        <select
                            name="branch"
                            value={newGroup.branchId || ""}
                            onChange={(e) => selectBranch(e)}
                        >
                            <option value="">Select Branch</option>
                            {
                                branches.map((branch) => <option value={branch.id}
                                                                 key={branch.id}>{branch.name}</option>)
                            }
                        </select>
                        {errors.branchId && <p className="error-msg">{errors.branchId}</p>}

                        <select
                            name="roomId"
                            value={newGroup.roomId}
                            onChange={(e) => selectRoom(e)}
                        >
                            <option value="">Select Room</option>
                            {
                                branchRooms && branchRooms.map((room) => <option value={room.id} key={room.id}>
                                    {room.number}-{room.name}
                                </option>)
                            }
                        </select>
                        {errors.roomId && <p className="error-msg">{errors.roomId}</p>}

                        {
                            teachers.length > 0 ? <div className="teacher-checkboxes">
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
                            </div> : <h3 className={"error-msg"}>No Teachers</h3>
                        }
                        {errors.teacherIds && <p className="error-msg">{errors.teacherIds}</p>}

                        <select
                            name="dayType"
                            value={newGroup.dayType}
                            onChange={(e) => selectDayType(e)}
                        >
                            <option value="">Select Daytype</option>
                            <option value="ALL">All</option>
                            <option value="EVEN">Even</option>
                            <option value="ODD">Odd</option>
                        </select>
                        {errors.dayType && <p className="error-msg">{errors.dayType}</p>}

                        <div className="time-row">
                            <input
                                type="time"
                                name="startTime"
                                value={newGroup.startTime}
                                onChange={(e) => setNewGroup({...newGroup, startTime: e.target.value})}
                            />
                            <span>-</span>
                            <input
                                type="time"
                                name="endTime"
                                value={newGroup.endTime}
                                onChange={(e) => setNewGroup({...newGroup, endTime: e.target.value})}
                            />
                        </div>
                        {errors.startTime && <p className="error-msg">{errors.startTime}</p>}
                        {errors.endTime && <p className="error-msg">{errors.endTime}</p>}
                        {errors.timeRange && <p className="error-msg">{errors.timeRange}</p>}

                        <div className="modal-actions">
                            <button
                                className="cancelBtn"
                                onClick={cancelAdd}
                            >
                                Cancel
                            </button>
                            <button className="saveBtn" onClick={AddGroup}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Groups Table */}
            <div className="table-boxx">
                <table className="GroupTable">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Degree</th>
                        <th>Day type</th>
                        <th>Branch</th>
                        <th>Room</th>
                        <th>Teachers</th>
                        <th>Students</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {groups.map((g, i) => (
                        <tr key={g.id}>
                            <td>{(currentPage * pageSize) + i + 1}</td>
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
                                    <input className={"inp-g"}
                                           type="text"
                                           name="degree"
                                           value={editedGroup.degree}
                                           onChange={handleInputChange}
                                    />
                                ) : (
                                    g.degree
                                )}
                            </td>
                            <td>
                                {editingIndex === i ? (
                                    <select
                                        name="dayType"
                                        className={"filial-select"}
                                        value={editedGroup.dayType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="ALL">All</option>
                                        <option value="EVEN">Even</option>
                                        <option value="ODD">Odd</option>
                                    </select>
                                ) : (
                                    g.dayType
                                )}
                            </td>

                            <td>
                                {editingIndex === i ? (
                                    <select
                                        name="branchId"
                                        className={"filial-select"}
                                        value={editedGroup.branchId}
                                        onChange={handleInputChange}
                                    >
                                        {
                                            branches&&branches.map((branch) => <option key={branch.id} value={branch.id} >{branch.name}</option>)
                                        }
                                    </select>
                                ) : (
                                    g.filialNameDto.name
                                )}
                            </td>

                            <td>
                                {editingIndex === i ? (
                                    <select
                                        name="roomId"
                                        className={"filial-select"}
                                        value={editedGroup.roomId}
                                        onChange={handleInputChange}
                                    >
                                        {
                                            // show rooms limited to branchRooms when editing; fallback to all rooms if branchRooms empty
                                            (branchRooms && branchRooms.length > 0 ? branchRooms : rooms).map((r) => <option key={r.id} value={r.id}>
                                                {`No${r.number}`} {r.name}
                                            </option>)
                                        }
                                    </select>
                                    ) : (
                                    "№" + g.roomDto.number + " " + g.roomDto.name
                                    )}
                            </td>

                            <td>
                                {editingIndex === i ? (
                                    <div className="table-checkboxes">
                                        {teachers.length>0 ? teachers.map((t) => (
                                            <label key={t.id}>
                                                <input
                                                    className="inp-check"
                                                    type="checkbox"
                                                    value={String(t.id)}
                                                    checked={Array.isArray(editedGroup.teacherIds) && editedGroup.teacherIds.includes(String(t.id))}
                                                    onChange={(e) => handleCheckboxChange(e, true)}
                                                />
                                                {t.name}
                                            </label>
                                        )) : "No teacher this branch" }
                                    </div>
                                ) : (
                                    g.teacherNameDtos.length>0 ?  g.teacherNameDtos.map((t) => <h3 key={t.id}>{t.name}</h3>) : "-"
                                )}
                            </td>

                            <td>{g.studentsNumber}</td>



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
                                            <IoIosUndo/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={"actions-g"}>
                                        <div className={"g-btn-edit btn-g"} onClick={() => handleEdit(i)}>
                                            <MdEdit/>
                                        </div>
                                        <div className={"g-btn-delete btn-g"} onClick={() => handleDelete(g)}>
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
            {totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        className="pagi-btn"
                        disabled={currentPage === 0}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <FaChevronLeft />
                    </button>

                    <div className="pagi-numbers">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`pagi-number-btn ${currentPage === index ? "active" : ""}`}
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="pagi-btn"
                        disabled={currentPage === totalPages - 1}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Group;

