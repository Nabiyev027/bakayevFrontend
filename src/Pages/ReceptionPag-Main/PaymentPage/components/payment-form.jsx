import { useState, useEffect } from "react"
import { CreditCard, DollarSign, Plus, Building, Users, User, ChevronDown } from "lucide-react"
import styles from "./payment-form.module.scss"
import ApiCall from "../../../../Utils/ApiCall";
import {toast,ToastContainer} from "react-toastify";

export function PaymentForm() {
    const [branches, setBranches] = useState([]);
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);


    const [formData, setFormData] = useState({
        branchId: "",
        groupId: "",
        studentId: "",
        amount: "",
        paymentMethod: "CARD",
    })

    const [filteredGroups, setFilteredGroups] = useState(groups)
    const [filteredStudents, setFilteredStudents] = useState(students)
    const [dropdowns, setDropdowns] = useState({
        branch: false,
        group: false,
        student: false,
    })

    useEffect(() => {
        getFilials()

        if(formData.branchId){
            getFilialGroups()
        }

        if(formData.groupId){
            getGroupStudents()
        }

    }, [formData.branchId, formData.groupId]);


    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll",{method:"GET"})
            setBranches(res.data)
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }

    async function getFilialGroups() {
        try {
            const res = await ApiCall(`/group?filialId=${formData.branchId}`, {method: "GET"})
            setGroups(res.data)
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }

    async function getGroupStudents() {
        try {
            const res = await ApiCall(`/user/student?groupId=${formData.groupId}`, {method: "GET"})
            setStudents(res.data)
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.branchId || !formData.groupId || !formData.studentId || !formData.amount) {
            toast.warn("Please fill all inputs")
            return
        }

        const selectedStudent = students.find((s) => s.id === formData.studentId)
        const selectedGroup = groups.find((g) => g.id === formData.groupId)

        if (!selectedStudent || !selectedGroup) {
            toast.warn("Student or group not found")
            return
        }

        const payment = {
            studentId: selectedStudent.id,
            amount: Number(formData.amount),
            paymentMethod: formData.paymentMethod,
        }

        try {
            const res = await ApiCall("/payment/addPayment", { method: "POST" }, payment)
            toast.success(res.data)
        } catch (err) {
            const message = err.response?.data || "Xatolik yuz berdi";
            toast.warn(message);
        }


        // Reset form
        setFormData({
            branchId: "",
            groupId: "",
            studentId: "",
            amount: "",
            paymentMethod: "card",
        })
    }

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }))
    }

    const selectOption = (dropdown, value, id) => {
        setFormData((prev) => ({ ...prev, [id]: value }))
        setDropdowns((prev) => ({ ...prev, [dropdown]: false }))
    }

    const getSelectedText = (type) => {
        switch (type) {
            case "branch":
                return formData.branchId ? branches.find((b) => b.id === formData.branchId)?.name : "Filialni tanlang"
            case "group":
                return formData.groupId
                    ? groups.find((g) => g.id === formData.groupId)?.name
                    : formData.branchId
                        ? "Guruhni tanlang"
                        : "Avval filialni tanlang"
            case "student":
                return formData.studentId
                    ? students.find((s) => s.id === formData.studentId)?.name
                    : formData.groupId
                        ? "Talabani tanlang"
                        : "Avval guruhni tanlang"
            default:
                return ""
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <ToastContainer/>
            {/* Branch, Group, Student Filters */}
            <div className={styles.filtersGrid}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        <Building className={styles.labelIcon} />
                        Filial
                    </label>
                    <div className={styles.selectWrapper}>
                        <button type="button" className={styles.select} onClick={() => toggleDropdown("branch")}>
                            <span>{getSelectedText("branch")}</span>
                            <ChevronDown className={styles.chevron} />
                        </button>
                        {dropdowns.branch && (
                            <div className={styles.dropdown}>
                                {branches.map((branch) => (
                                    <div
                                        key={branch.id}
                                        className={styles.dropdownItem}
                                        onClick={() => selectOption("branch", branch.id, "branchId")}
                                    >
                                        {branch.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        <Users className={styles.labelIcon} />
                        Guruh
                    </label>
                    <div className={styles.selectWrapper}>
                        <button
                            type="button"
                            className={`${styles.select} ${!formData.branchId ? styles.disabled : ""}`}
                            onClick={() => formData.branchId && toggleDropdown("group")}
                            disabled={!formData.branchId}
                        >
                            <span>{getSelectedText("group")}</span>
                            <ChevronDown className={styles.chevron} />
                        </button>
                        {dropdowns.group && formData.branchId && (
                            <div className={styles.dropdown}>
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className={styles.dropdownItem}
                                        onClick={() => selectOption("group", group.id, "groupId")}
                                    >
                                        <div className={styles.groupOption}>
                                            <span className={styles.groupName}>{group.name}</span>
                                            <span className={styles.courseName}>{group.course}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        <User className={styles.labelIcon} />
                        Talaba
                    </label>
                    <div className={styles.selectWrapper}>
                        <button
                            type="button"
                            className={`${styles.select} ${!formData.groupId ? styles.disabled : ""}`}
                            onClick={() => formData.groupId && toggleDropdown("student")}
                            disabled={!formData.groupId}
                        >
                            <span>{getSelectedText("student")}</span>
                            <ChevronDown className={styles.chevron} />
                        </button>
                        {dropdowns.student && formData.groupId && (
                            <div className={styles.dropdown}>
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        className={styles.dropdownItem}
                                        onClick={() => selectOption("student", student.id, "studentId")}
                                    >
                                        {student.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Amount Input */}
            <div className={styles.fieldGroup}>
                <label className={styles.label}>To'lov Miqdori (so'm)</label>
                <input
                    type="number"
                    placeholder="Miqdorni kiriting"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    className={styles.input}
                />
            </div>

            {/* Payment Method */}
            <div className={styles.paymentMethodGroup}>
                <label className={styles.label}>To'lov Turi</label>
                <div className={styles.radioGroup}>
                    <div>
                        <input
                            type="radio"
                            id="card"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === "card"}
                            onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                            className={styles.radioInput}
                        />
                        <label htmlFor="card" className={styles.radioLabel}>
                            <CreditCard className={styles.radioIcon} />
                            <span className={styles.radioText}>Plastik Karta</span>
                        </label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="cash"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === "cash"}
                            onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                            className={styles.radioInput}
                        />
                        <label htmlFor="cash" className={styles.radioLabel}>
                            <DollarSign className={styles.radioIcon} />
                            <span className={styles.radioText}>Naqd Pul</span>
                        </label>
                    </div>
                </div>
            </div>

            <button type="submit" className={styles.submitButton}>
                <Plus className={styles.buttonIcon} />
                To'lovni Qo'shish
            </button>
        </form>
    )
}
