import { useState, useEffect } from "react"
import { CreditCard, DollarSign, Plus, Building, Users, User, ChevronDown } from "lucide-react"
import styles from "./payment-form.module.scss"

// Mock data for branches, groups, and students
const branches = [
    { id: "1", name: "Toshkent filiali" },
    { id: "2", name: "Samarqand filiali" },
    { id: "3", name: "Buxoro filiali" },
    { id: "4", name: "Andijon filiali" },
]

const groups = [
    { id: "1", name: "Frontend-01", branchId: "1", course: "Frontend Development" },
    { id: "2", name: "Backend-01", branchId: "1", course: "Backend Development" },
    { id: "3", name: "Mobile-01", branchId: "1", course: "Mobile Development" },
    { id: "4", name: "Frontend-02", branchId: "2", course: "Frontend Development" },
    { id: "5", name: "FullStack-01", branchId: "2", course: "Full Stack Development" },
    { id: "6", name: "UI/UX-01", branchId: "3", course: "UI/UX Design" },
    { id: "7", name: "DataScience-01", branchId: "4", course: "Data Science" },
]

const students = [
    { id: "1", name: "Alisher Karimov", groupId: "1" },
    { id: "2", name: "Malika Tosheva", groupId: "1" },
    { id: "3", name: "Bobur Rahimov", groupId: "1" },
    { id: "4", name: "Dilnoza Ahmadova", groupId: "2" },
    { id: "5", name: "Jasur Tursunov", groupId: "2" },
    { id: "6", name: "Nigora Karimova", groupId: "3" },
    { id: "7", name: "Sardor Umarov", groupId: "3" },
    { id: "8", name: "Feruza Nazarova", groupId: "4" },
    { id: "9", name: "Otabek Salimov", groupId: "5" },
    { id: "10", name: "Madina Yusupova", groupId: "6" },
    { id: "11", name: "Bekzod Rahmonov", groupId: "7" },
]

export function PaymentForm({ onAddPayment }) {
    const [formData, setFormData] = useState({
        branchId: "",
        groupId: "",
        studentId: "",
        amount: "",
        paymentMethod: "card",
    })

    const [filteredGroups, setFilteredGroups] = useState(groups)
    const [filteredStudents, setFilteredStudents] = useState(students)
    const [dropdowns, setDropdowns] = useState({
        branch: false,
        group: false,
        student: false,
    })

    // Filter groups based on selected branch
    useEffect(() => {
        if (formData.branchId) {
            const filtered = groups.filter((group) => group.branchId === formData.branchId)
            setFilteredGroups(filtered)
            setFormData((prev) => ({ ...prev, groupId: "", studentId: "" }))
        } else {
            setFilteredGroups([])
        }
    }, [formData.branchId])

    // Filter students based on selected group
    useEffect(() => {
        if (formData.groupId) {
            const filtered = students.filter((student) => student.groupId === formData.groupId)
            setFilteredStudents(filtered)
            setFormData((prev) => ({ ...prev, studentId: "" }))
        } else {
            setFilteredStudents([])
        }
    }, [formData.groupId])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.branchId || !formData.groupId || !formData.studentId || !formData.amount) {
            alert("Iltimos, barcha maydonlarni to'ldiring")
            return
        }

        const selectedStudent = students.find((s) => s.id === formData.studentId)
        const selectedGroup = groups.find((g) => g.id === formData.groupId)

        if (!selectedStudent || !selectedGroup) {
            alert("Talaba yoki guruh topilmadi")
            return
        }

        const payment = {
            studentName: selectedStudent.name,
            courseName: selectedGroup.course,
            amount: Number.parseInt(formData.amount),
            paymentMethod: formData.paymentMethod,
            date: new Date().toISOString().split("T")[0],
            status: "completed",
        }

        onAddPayment(payment)
        alert("To'lov muvaffaqiyatli qo'shildi!")

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
                    ? filteredGroups.find((g) => g.id === formData.groupId)?.name
                    : formData.branchId
                        ? "Guruhni tanlang"
                        : "Avval filialni tanlang"
            case "student":
                return formData.studentId
                    ? filteredStudents.find((s) => s.id === formData.studentId)?.name
                    : formData.groupId
                        ? "Talabani tanlang"
                        : "Avval guruhni tanlang"
            default:
                return ""
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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
                                {filteredGroups.map((group) => (
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
                                {filteredStudents.map((student) => (
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
