"use client"

import { useState, useEffect } from "react"
import { CreditCard, DollarSign, Calendar, User, BookOpen, Users, GraduationCap, ChevronDown } from "lucide-react"
import styles from "./payments-list.module.scss"

// Mock data for teachers, groups, and students
const teachers = [
    { id: "1", name: "Aziz Karimov", subject: "Frontend Development" },
    { id: "2", name: "Malika Tosheva", subject: "Backend Development" },
    { id: "3", name: "Bobur Rahimov", subject: "Mobile Development" },
    { id: "4", name: "Dilnoza Ahmadova", subject: "UI/UX Design" },
    { id: "5", name: "Jasur Tursunov", subject: "Data Science" },
]

const groups = [
    { id: "1", name: "Frontend-01", teacherId: "1", course: "Frontend Development" },
    { id: "2", name: "Frontend-02", teacherId: "1", course: "Frontend Development" },
    { id: "3", name: "Backend-01", teacherId: "2", course: "Backend Development" },
    { id: "4", name: "Backend-02", teacherId: "2", course: "Backend Development" },
    { id: "5", name: "Mobile-01", teacherId: "3", course: "Mobile Development" },
    { id: "6", name: "UI/UX-01", teacherId: "4", course: "UI/UX Design" },
    { id: "7", name: "DataScience-01", teacherId: "5", course: "Data Science" },
]

const students = [
    { id: "1", name: "Alisher Karimov", groupId: "1" },
    { id: "2", name: "Malika Tosheva", groupId: "1" },
    { id: "3", name: "Bobur Rahimov", groupId: "1" },
    { id: "4", name: "Dilnoza Ahmadova", groupId: "2" },
    { id: "5", name: "Jasur Tursunov", groupId: "3" },
    { id: "6", name: "Nigora Karimova", groupId: "3" },
    { id: "7", name: "Sardor Umarov", groupId: "4" },
    { id: "8", name: "Feruza Nazarova", groupId: "5" },
    { id: "9", name: "Otabek Salimov", groupId: "6" },
    { id: "10", name: "Madina Yusupova", groupId: "7" },
]

export function PaymentsList({ payments }) {
    // Get current month's start and end dates
    const getCurrentMonthRange = () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
        }
    }

    const [filters, setFilters] = useState({
        teacherId: "",
        groupId: "",
        studentId: "",
        dateFrom: getCurrentMonthRange().start,
        dateTo: getCurrentMonthRange().end,
        paymentMethod: "all",
    })

    const [filteredGroups, setFilteredGroups] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([])
    const [dropdowns, setDropdowns] = useState({
        teacher: false,
        group: false,
        student: false,
    })

    // Filter groups based on selected teacher
    useEffect(() => {
        if (filters.teacherId) {
            const filtered = groups.filter((group) => group.teacherId === filters.teacherId)
            setFilteredGroups(filtered)
            setFilters((prev) => ({ ...prev, groupId: "", studentId: "" }))
        } else {
            setFilteredGroups([])
        }
    }, [filters.teacherId])

    // Filter students based on selected group
    useEffect(() => {
        if (filters.groupId) {
            const filtered = students.filter((student) => student.groupId === filters.groupId)
            setFilteredStudents(filtered)
            setFilters((prev) => ({ ...prev, studentId: "" }))
        } else {
            setFilteredStudents([])
        }
    }, [filters.groupId])

    const filteredPayments = payments.filter((payment) => {
        // Student filter
        const matchesStudent =
            !filters.studentId || students.find((s) => s.id === filters.studentId)?.name === payment.studentName

        // Payment method filter
        const matchesMethod = filters.paymentMethod === "all" || payment.paymentMethod === filters.paymentMethod

        // Date range filter
        const paymentDate = new Date(payment.date)
        const fromDate = new Date(filters.dateFrom)
        const toDate = new Date(filters.dateTo)
        const matchesDate = paymentDate >= fromDate && paymentDate <= toDate

        return matchesStudent && matchesMethod && matchesDate
    })

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getPaymentMethodIcon = (method) => {
        return method === "card" ? (
            <CreditCard className={styles.methodIcon} />
        ) : (
            <DollarSign className={styles.methodIcon} />
        )
    }

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }))
    }

    const selectOption = (dropdown, value, field) => {
        setFilters((prev) => ({ ...prev, [field]: value }))
        setDropdowns((prev) => ({ ...prev, [dropdown]: false }))
    }

    const getSelectedText = (type) => {
        switch (type) {
            case "teacher":
                return filters.teacherId ? teachers.find((t) => t.id === filters.teacherId)?.name : "O'qituvchini tanlang"
            case "group":
                return filters.groupId
                    ? filteredGroups.find((g) => g.id === filters.groupId)?.name
                    : filters.teacherId
                        ? "Guruhni tanlang"
                        : "Avval o'qituvchini tanlang"
            case "student":
                return filters.studentId
                    ? filteredStudents.find((s) => s.id === filters.studentId)?.name
                    : filters.groupId
                        ? "Talabani tanlang"
                        : "Avval guruhni tanlang"
            default:
                return ""
        }
    }

    return (
        <div className={styles.container}>
            {/* Filters */}
            <div className={styles.filtersSection}>
                {/* Teacher, Group, Student Selects */}
                <div className={styles.selectFilters}>
                    <div className={styles.selectGroup}>
                        <label className={styles.label}>
                            <GraduationCap className={styles.labelIcon} />
                            O'qituvchi
                        </label>
                        <div className={styles.selectWrapper}>
                            <button type="button" className={styles.select} onClick={() => toggleDropdown("teacher")}>
                                <span>{getSelectedText("teacher")}</span>
                                <ChevronDown className={styles.chevron} />
                            </button>
                            {dropdowns.teacher && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownItem} onClick={() => selectOption("teacher", "", "teacherId")}>
                                        Barchasi
                                    </div>
                                    {teachers.map((teacher) => (
                                        <div
                                            key={teacher.id}
                                            className={styles.dropdownItem}
                                            onClick={() => selectOption("teacher", teacher.id, "teacherId")}
                                        >
                                            <div className={styles.teacherOption}>
                                                <span className={styles.teacherName}>{teacher.name}</span>
                                                <span className={styles.teacherSubject}>{teacher.subject}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>
                            <Users className={styles.labelIcon} />
                            Guruh
                        </label>
                        <div className={styles.selectWrapper}>
                            <button
                                type="button"
                                className={`${styles.select} ${!filters.teacherId ? styles.disabled : ""}`}
                                onClick={() => filters.teacherId && toggleDropdown("group")}
                                disabled={!filters.teacherId}
                            >
                                <span>{getSelectedText("group")}</span>
                                <ChevronDown className={styles.chevron} />
                            </button>
                            {dropdowns.group && filters.teacherId && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownItem} onClick={() => selectOption("group", "", "groupId")}>
                                        Barchasi
                                    </div>
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

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>
                            <User className={styles.labelIcon} />
                            Talaba
                        </label>
                        <div className={styles.selectWrapper}>
                            <button
                                type="button"
                                className={`${styles.select} ${!filters.groupId ? styles.disabled : ""}`}
                                onClick={() => filters.groupId && toggleDropdown("student")}
                                disabled={!filters.groupId}
                            >
                                <span>{getSelectedText("student")}</span>
                                <ChevronDown className={styles.chevron} />
                            </button>
                            {dropdowns.student && filters.groupId && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownItem} onClick={() => selectOption("student", "", "studentId")}>
                                        Barchasi
                                    </div>
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

                {/* Date Range and Payment Method Filters */}
                <div className={styles.dateAndMethodFilters}>
                    <div className={styles.dateFilters}>
                        <div className={styles.dateGroup}>
                            <label className={styles.label}>
                                <Calendar className={styles.labelIcon} />
                                Dan
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                                className={styles.dateInput}
                            />
                        </div>
                        <div className={styles.dateGroup}>
                            <label className={styles.label}>
                                <Calendar className={styles.labelIcon} />
                                Gacha
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                                className={styles.dateInput}
                            />
                        </div>
                    </div>

                    <div className={styles.methodFilters}>
                        <button
                            className={`${styles.filterButton} ${filters.paymentMethod === "all" ? styles.active : ""}`}
                            onClick={() => setFilters((prev) => ({ ...prev, paymentMethod: "all" }))}
                        >
                            Barchasi
                        </button>
                        <button
                            className={`${styles.filterButton} ${filters.paymentMethod === "card" ? styles.active : ""}`}
                            onClick={() => setFilters((prev) => ({ ...prev, paymentMethod: "card" }))}
                        >
                            <CreditCard className={styles.filterIcon} />
                            Karta
                        </button>
                        <button
                            className={`${styles.filterButton} ${filters.paymentMethod === "cash" ? styles.active : ""}`}
                            onClick={() => setFilters((prev) => ({ ...prev, paymentMethod: "cash" }))}
                        >
                            <DollarSign className={styles.filterIcon} />
                            Naqd
                        </button>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableContent}>
                    {filteredPayments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <BookOpen className={styles.emptySearchIcon} />
                            </div>
                            <h3 className={styles.emptyTitle}>To'lovlar topilmadi</h3>
                            <p className={styles.emptyDescription}>Filter shartlaringizni o'zgartiring yoki yangi to'lov qo'shing</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                <tr className={styles.headerRow}>
                                    <th className={styles.headerCell}>
                                        <div className={styles.headerContent}>
                                            <User className={styles.headerIcon} />
                                            Talaba
                                        </div>
                                    </th>
                                    <th className={styles.headerCell}>
                                        <div className={styles.headerContent}>
                                            <BookOpen className={styles.headerIcon} />
                                            Kurs
                                        </div>
                                    </th>
                                    <th className={styles.headerCell}>Miqdor</th>
                                    <th className={styles.headerCell}>To'lov Turi</th>
                                    <th className={styles.headerCell}>
                                        <div className={styles.headerContent}>
                                            <Calendar className={styles.headerIcon} />
                                            Sana
                                        </div>
                                    </th>
                                    <th className={styles.headerCell}>Holat</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className={styles.dataRow}>
                                        <td className={styles.studentName}>{payment.studentName}</td>
                                        <td className={styles.courseName}>{payment.courseName}</td>
                                        <td className={styles.amount}>{payment.amount.toLocaleString()} so'm</td>
                                        <td>
                        <span
                            className={`${styles.methodBadge} ${payment.paymentMethod === "card" ? styles.cardBadge : styles.cashBadge}`}
                        >
                          <div className={styles.badgeContent}>
                            {getPaymentMethodIcon(payment.paymentMethod)}
                              {payment.paymentMethod === "card" ? "Karta" : "Naqd"}
                          </div>
                        </span>
                                        </td>
                                        <td className={styles.date}>{formatDate(payment.date)}</td>
                                        <td>
                        <span
                            className={`${styles.statusBadge} ${payment.status === "completed" ? styles.completedBadge : styles.pendingBadge}`}
                        >
                          {payment.status === "completed" ? "Bajarildi" : "Kutilmoqda"}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            {filteredPayments.length > 0 && (
                <div className={styles.summaryCard}>
                    <div className={styles.summaryContent}>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <p className={styles.summaryLabel}>Jami To'lovlar</p>
                                <p className={styles.summaryValue}>{filteredPayments.length}</p>
                            </div>
                            <div className={styles.summaryItem}>
                                <p className={styles.summaryLabel}>Jami Miqdor</p>
                                <p className={styles.summaryValue}>
                                    {filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} so'm
                                </p>
                            </div>
                            <div className={styles.summaryItem}>
                                <p className={styles.summaryLabel}>Bajarilgan To'lovlar</p>
                                <p className={`${styles.summaryValue} ${styles.completedValue}`}>
                                    {filteredPayments.filter((p) => p.status === "completed").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
