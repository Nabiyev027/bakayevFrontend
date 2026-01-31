import React, {useEffect, useState} from 'react';
import "./salary.scss"
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";
import {FaRegEdit} from "react-icons/fa";
import {FaHandHoldingDollar} from "react-icons/fa6";
import {IoMdInformationCircleOutline} from "react-icons/io";

function Salary() {
    const [branches, setBranches] = useState([]);
    const [selRole, setSelRole] = useState("ROLE_TEACHER");
    const [selBranchId, setSelBranchId] = useState("all");
    const [salaries, setSalaries] = useState([]);
    const [selTeacherId, setSelTeacherId] = useState("");

    const [teacherPayments, setTeacherPayments] = useState([]);
    const [receptionPayments, setReceptionPayments] = useState([]);

    const [selTeacherSalaryId, setSelTeacherSalaryId] = useState(null);
    const [selReceptionSalaryId, setSelReceptionSalaryId] = useState(null);

    const userRole = localStorage.getItem("selectedRole");

    const [newSalaryPayment, setNewSalaryPayment] = useState({
        groupId: "",
        amount: ""
    });

    const [newRecPayment, setNewRecPayment] = useState({
        amount: ""
    });


    const [salaryInfos, setSalaryInfos] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [groups, setGroups] = useState([]);

    const [showModalInfo, setShowModalInfo] = useState(false);
    const [showModalRec, setShowModalRec] = useState(false);

    const now = new Date();

    const [selYear, setSelYear] = useState(now.getFullYear());
    const [selMonth, setSelMonth] = useState(now.getMonth());

    const [editId, setEditId] = useState(null);
    const [editPercentage, setEditPercentage] = useState("");

    const [editReceptionId, setEditReceptionId] = useState(null);
    const [editSalaryAmount, setEditSalaryAmount] = useState("");



    const months = [
        {value: 0, name: "January"},
        {value: 1, name: "February"},
        {value: 2, name: "March"},
        {value: 3, name: "April"},
        {value: 4, name: "May"},
        {value: 5, name: "June"},
        {value: 6, name: "July"},
        {value: 7, name: "August"},
        {value: 8, name: "September"},
        {value: 9, name: "October"},
        {value: 10, name: "November"},
        {value: 11, name: "December"},
    ]

    useEffect(() => {
        getFilials()
    }, [])

    useEffect(() => {
        getSalaries();
    }, [selRole, selBranchId, selYear, selMonth]);

    useEffect(() => {
        if (selTeacherSalaryId) {
            getSalaryPayments(selTeacherSalaryId);
        }
    }, [selTeacherSalaryId]);



    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"})
            setBranches(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getSalaries() {
        try {
            const res = await ApiCall(
                `/salary/get?filialId=${selBranchId}&role=${selRole}&year=${selYear}&month=${selMonth}`,
                { method: "GET" }
            );
            setSalaries(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const generateYears = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let i = currentYear - 1; i <= currentYear + 1; i++) {
            years.push(i)
        }
        return years
    }

    async function getGroupsByTeacher(teacherId) {
        try {
            const res = await ApiCall(`/group/teacher/${teacherId}`, {method: "GET"});
            setGroups(res.data || []);
        } catch (err) {
            toast.error(err.response?.data || "Error to get groups");
        }
    }

    async function getSalaryPayments(salaryId) {
        try {
            const res = await ApiCall(`/salary/teacher/${salaryId}`, {
                method: "GET"
            });
            setTeacherPayments(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get payments");
        }
    }


    async function addSalaryPayments() {
        if (!newSalaryPayment.amount || Number(newSalaryPayment.amount) <= 0) {
            toast.error("Amount kiriting");
            return;
        }

        try {
            const res = await ApiCall(
                `/salary/teacher/payment/${selTeacherSalaryId}?groupId=${newSalaryPayment.groupId}&amount=${newSalaryPayment.amount}`,
                { method: "POST" }
            );

            toast.success(res.data);

            // qayta yangilash
            getSalaryPayments(selTeacherSalaryId);

            // inputni tozalash
            setNewSalaryPayment({
                groupId: "",
                amount: ""  // bo‘sh string
            });

        } catch (err) {
            toast.error(err.response?.data || "Error to post");
        }
    }



    async function deleteSalaryPayment(id) {
        const isConfirmed = window.confirm("Rostdan ham bu to‘lovni o‘chirmoqchimisiz?");

        if (!isConfirmed) return; // bekor qilindi

        try {
            const res = await ApiCall(
                `/salary/teacher/payment/del/${id}`,
                { method: "DELETE" }
            );
            toast.success(res.data);
            getSalaryPayments(selTeacherSalaryId);
        } catch (err) {
            toast.error(err.response?.data || "Error to delete");
        }
    }



    async function getSalaryGroupInfo(teacherId) {
        try {
            const res = await ApiCall(`/salary/teacher/info?teacherId=${teacherId}&&year=${selYear}&&month=${selMonth}`, {method: "GET"});
            setSalaryInfos(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get payments");
        }
    }

    function openModal(salaryId, teacherId) {
        setSelTeacherSalaryId(salaryId);
        setShowModal(true);

        getSalaryPayments(salaryId);
        getGroupsByTeacher(teacherId);
    }


    function closeModal() {
        setShowModal(false);
    }

    function openModalInfo(salaryId,teacherId) {
        setSelTeacherId(teacherId)
        setShowModalInfo(true);
        getSalaryGroupInfo(teacherId);
    }

    function closeModalInfo() {
        setShowModalInfo(false);
    }

    async function getRecSalaryPayments(salaryId) {
        try {
            const res = await ApiCall(`/salary/reception/payment/${salaryId}`, {
                method: "GET"
            });
            setReceptionPayments(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get payments");
        }
    }

    function openModalRec(salaryId){
        setShowModalRec(true)
        setSelReceptionSalaryId(salaryId);
        getRecSalaryPayments(salaryId);
    }

    function closeModalRec() {
        setShowModalRec(false);
    }

    async function updatePercentage(id) {
        if (!editPercentage || editPercentage <= 0) {
            toast.error("Percentage noto‘g‘ri");
            return;
        }

        try {
            const res = await ApiCall(
                `/salary/teacher/info/percentage/${id}?percentage=${editPercentage}`,
                { method: "PUT" }
            );

            toast.success(res.data);

            // table’ni yangilash
            getSalaryGroupInfo(selTeacherId);

            // edit holatni yopish
            setEditId(null);
        } catch (err) {
            toast.error(err.response?.data || "Error to update percentage");
        }
    }

    async function updateReceptionSalaryAmount(id) {
        if (!editSalaryAmount || editSalaryAmount <= 0) {
            toast.error("Salary amount noto‘g‘ri");
            return;
        }

        try {
            const res = await ApiCall(
                `/salary/reception/amount/${id}?amount=${editSalaryAmount}`,
                { method: "PUT" }
            );

            toast.success(res.data);

            // table refresh
            getSalaries();

            // edit holatni yopish
            setEditReceptionId(null);
        } catch (err) {
            toast.error(err.response?.data || "Error to update salary");
        }
    }


    async function deleteRecSalaryPayment(id) {
        const isConfirmed = window.confirm("Rostdan ham bu to‘lovni o‘chirmoqchimisiz?");

        if (!isConfirmed) return; // bekor qilindi

        try {
            const res = await ApiCall(
                `/salary/reception/payment/del/${id}`,
            {method: "DELETE"}
            );
            toast.success(res.data);
            getRecSalaryPayments(selReceptionSalaryId);
            getSalaries()
        } catch (err) {
            toast.error(err.response?.data || "Error to delete");
        }
    }

    async function addRecSalaryPayment() {
        if (!newRecPayment.amount || Number(newRecPayment.amount) <= 0) {
            toast.error("Amount kiriting");
            return;
        }

        try {
            const res = await ApiCall(
                `/salary/reception/payment/${selReceptionSalaryId}?amount=${newRecPayment.amount}`,
                {method: "POST"}
            );

            toast.success(res.data);

            // qayta yangilash
            getRecSalaryPayments(selReceptionSalaryId)

            getSalaries()

            setNewRecPayment({
                amount: ""
            })

        } catch (err) {
            toast.error(err.response?.data || "Error to post");
        }
    }

    return (
        <div className={"salary-page"}>
            <ToastContainer/>

                {showModal && (
                    <div className="modal-backdrop">
                        <div className="modal">
                            <h2>Give money</h2>

                            <div className={"nav-salary-modal"}>
                                    <select className={"sel-g"} onChange={(e)=>setNewSalaryPayment({...newSalaryPayment,groupId: e.target.value})} value={newSalaryPayment.groupId}>
                                        <option value="">Select Group</option>
                                        {groups&&groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                    <input className={"inp-amount"} placeholder={"0 (so'm)"}
                                           onChange={(e)=>setNewSalaryPayment({...newSalaryPayment,
                                               amount: e.target.value
                                           })}

                                           value={newSalaryPayment.amount} type="number"/>
                                    <button className={"btn-add"} onClick={addSalaryPayments}>Add</button>
                            </div>

                            <div className={"modal-table"}>
                                <div className={"table-nav"}>
                                    <div className={"nav-col"}>No</div>
                                    <div className={"nav-col"}>Group name</div>
                                    <div className={"nav-col"}>Amount</div>
                                    <div className={"nav-col"}>Date</div>
                                    <div className={"nav-col"}>Action</div>
                                </div>
                                <div className="table-body">
                                    {
                                        teacherPayments&&teacherPayments.map((sp,i) => <div className={"table-row"} key={sp.id}>
                                            <div className={"col"}>{i+1}</div>
                                            <div className={"col"}>{sp.groupName}</div>
                                            <div className={"col"}>{sp.amount} so'm</div>
                                            <div className={"col"}>{sp.date}</div>

                                            {
                                                (userRole ==="ROLE_ADMIN" || userRole === "ROLE_MAIN_RECEPTION") &&
                                                <div className={"col"}>
                                                    <button className={"btn-del"} onClick={()=>deleteSalaryPayment(sp.id)}>Delete</button>
                                                </div>
                                            }

                                        </div>)
                                    }
                                </div>
                            </div>

                            <div className={"modal-actions"}>
                                <button className={"btn btn-close"} onClick={closeModal}>Close</button>
                            </div>


                        </div>
                    </div>
                )}

            {showModalInfo && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Salary Information</h2>

                        <div className={"modal-table"}>
                            <div className={"table-nav"}>
                                <div className={"nav-col-2"} >No</div>
                                <div className={"nav-col-2"}>Group name</div>
                                <div className={"nav-col-2"}>Percentage</div>
                                <div className={"nav-col-2"}>Paid amount</div>
                                <div className={"nav-col-2"}>Must paid</div>
                                <div className={"nav-col-2"}>Date</div>
                                <div className={"nav-col-2"}>Action</div>
                            </div>
                            <div className="table-body">
                                {
                                    salaryInfos&&salaryInfos.map((sp,i) => <div className={"table-row"} key={sp.id}>
                                        <div className={"col-2"}>{i+1}</div>
                                        <div className={"col-2"}>{sp.groupName}</div>
                                        <div className={"col-2"}>
                                            {editId === sp.id ? (
                                                <input
                                                    type="number"
                                                    className="inp-percentage"
                                                    value={editPercentage}
                                                    onChange={(e) => setEditPercentage(e.target.value)}
                                                />
                                            ) : (
                                                `${sp.percentage} %`
                                            )}
                                        </div>

                                        <div className={"col-2"}>{sp.amount} so'm</div>
                                        <div className={"col-2"}>{sp.mustPaid} so'm</div>
                                        <div className={"col-2"}>{sp.date}</div>
                                        <div className={"col-2"}>
                                            {editId === sp.id ? (
                                                <>
                                                    <button
                                                        className="btn btn-s"
                                                        onClick={() => updatePercentage(sp.id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-cancel"
                                                        onClick={() => setEditId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => {
                                                        setEditId(sp.id);
                                                        setEditPercentage(sp.percentage);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                    </div>)
                                }
                            </div>
                        </div>

                        <div className={"modal-actions"}>
                            <button className={"btn btn-close"} onClick={closeModalInfo}>Close</button>
                        </div>


                    </div>
                </div>
            )}

            {showModalRec && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Give money</h2>

                        <div className={"nav-salary-modal"}>
                            <input className={"inp-amount"} placeholder={"0 (so'm)"}
                                   onChange={(e)=>setNewRecPayment({...newRecPayment,
                                       amount: e.target.value
                                   })}

                                   value={newRecPayment.amount} type="number"/>
                            <button className={"btn-add"} onClick={addRecSalaryPayment}>Add</button>
                        </div>

                        <div className={"modal-table"}>
                            <div className={"table-nav"}>
                                <div className={"nav-col"}>No</div>
                                <div className={"nav-col"}>Amount</div>
                                <div className={"nav-col"}>Date</div>
                                <div className={"nav-col"}>Action</div>
                            </div>
                            <div className="table-body">
                                {
                                    receptionPayments&&receptionPayments.map((sp,i) => <div className={"table-row"} key={sp.id}>
                                        <div className={"col"}>{i+1}</div>
                                        <div className={"col"}>{sp.amount} so'm</div>
                                        <div className={"col"}>{sp.date}</div>
                                            {
                                                (userRole ==="ROLE_ADMIN" || userRole === "ROLE_MAIN_RECEPTION") &&
                                                <div className={"col"}>
                                                    <button className={"btn-del"} onClick={()=>deleteRecSalaryPayment(sp.id)}>Delete</button>
                                                </div>
                                            }

                                    </div>)
                                }
                            </div>
                        </div>

                        <div className={"modal-actions"}>
                            <button className={"btn btn-close"} onClick={closeModalRec}>Close</button>
                        </div>


                    </div>
                </div>
            )}


            <h2>Salary</h2>
            <div className={"salary-header"}>
                <div className={'monthYearSelector'}>
                    <select
                        className={"select"}
                        value={selYear}
                        onChange={(e) => setSelYear(Number(e.target.value))}
                    >
                        {generateYears().map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <select
                        className={"select"}
                        value={selMonth}
                        onChange={(e) => setSelMonth(Number(e.target.value))}
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>

                </div>

                <div className={"wrap-btn"}>
                    <button onClick={()=>setSelRole("ROLE_TEACHER")} className={`role-select ${selRole === "ROLE_TEACHER" ? "active" : ""}`}>Teacher</button>
                    <button onClick={()=>setSelRole("ROLE_RECEPTION")} className={`role-select ${selRole === "ROLE_RECEPTION" ? "active" : ""}`}>Reception</button>
                </div>
                <select onChange={(e)=>setSelBranchId(e.target.value)} className={"filial-select"}>
                    <option value="all">Select branch</option>
                    {branches.map((b) => <option value={b.id} key={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div className={"salary-table-wrap"}>
                {selRole === "ROLE_TEACHER" ?
                    <table className={"salary-table"}>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Full name</th>
                            <th>Groups</th>
                            <th>Salary date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            salaries.map((s,i) =><tr>
                                <td>{i+1}</td>
                                <td>{s.fullName}</td>
                                <td>
                                    {s.groupNames?.map((gn, idx) => (
                                        <h4 key={idx}>{gn}</h4>
                                    ))}
                                </td>
                                <td>{s.date}</td>
                                <td>
                                    <button className={"btn-g btn"} onClick={()=>openModal(s.id,s.teacherId)}>
                                        <FaHandHoldingDollar />
                                    </button>
                                    <button className={"btn-i btn"} onClick={()=>openModalInfo(s.id,s.teacherId)}>
                                        <IoMdInformationCircleOutline />
                                    </button>
                                </td>
                            </tr>)
                        }
                        </tbody>
                    </table> :
                    <table className={"salary-table"}>
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Full name</th>
                            <th>Salary amount</th>
                            <th>Paid</th>
                            <th>Salary date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            salaries.map((s,i) =><tr>
                                <td>{i+1}</td>
                                <td>{s.fullName}</td>
                                <td>
                                    {editReceptionId === s.id ? (
                                        <input
                                            type="number"
                                            className="inp-amount"
                                            value={editSalaryAmount}
                                            onChange={(e) => setEditSalaryAmount(e.target.value)}
                                        />
                                    ) : (
                                        `${s.salaryAmount} so'm`
                                    )}
                                </td>
                                <td>{s.paidAmount}</td>
                                <td>{s.date}</td>
                                <td>
                                    <button
                                        className={"btn-g btn"}
                                        onClick={() => openModalRec(s.id)}
                                    >
                                        <FaHandHoldingDollar />
                                    </button>

                                    {editReceptionId === s.id ? (
                                        <>
                                            <button
                                                className="btn btn-s"
                                                onClick={() => updateReceptionSalaryAmount(s.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-cancel"
                                                onClick={() => setEditReceptionId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className={"btn-i btn"}
                                            onClick={() => {
                                                setEditReceptionId(s.id);
                                                setEditSalaryAmount(s.salaryAmount);
                                            }}
                                        >
                                            <FaRegEdit />
                                        </button>
                                    )}
                                </td>
                            </tr>)
                        }
                        </tbody>
                    </table>
                }

            </div>
        </div>
    );
}

export default Salary;