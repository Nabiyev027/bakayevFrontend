"use client"

import {useState, useEffect} from "react"
import {CreditCard, DollarSign, Calendar, User, BookOpen, Users, GraduationCap, ChevronDown} from "lucide-react"
import styles from "./payments-list.module.scss"
import ApiCall from "../../../../Utils/ApiCall";
import {toast, ToastContainer} from "react-toastify";
import {FaCheckCircle} from "react-icons/fa";
import {GiSandsOfTime} from "react-icons/gi";


export function PaymentsList() {
    const resId = localStorage.getItem("userId");
    const selectedRole = localStorage.getItem("selectedRole");
    const [branches, setBranches] = useState([])
    const [selBranch, setSelBranch] = useState(null)
    const [teachers, setTeachers] = useState([])
    const [selTeacher, setSelTeacher] = useState(null)
    const [groups, setGroups] = useState([])
    const [selGroup, setSelGroup] = useState(null);
    const [students, setStudents] = useState([])
    const [selStudent, setSelStudent] = useState(null);

    const [payments, setPayments] = useState([])

    const [selectedPayment, setSelectedPayment] = useState(null);


    // Get current month's start and end dates
    const getCurrentMonthRange = () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)

        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
        }
    }

    const [filters, setFilters] = useState({
        filialId: "",
        teacherId: "",
        groupId: "",
        studentId: "",
        dateFrom: getCurrentMonthRange().start,
        dateTo: getCurrentMonthRange().end,
        paymentMethod: "all",
    })

    useEffect(() => {
        if (selGroup && selGroup.id) {
            getPayments(selGroup);
        }
    }, [selGroup, selStudent, filters.dateFrom, filters.dateTo, filters.paymentMethod]);

    const getPayments = async (group) => {
        if (!group || !group.id) return;

        try {
            let url = `/payment/getPayments?groupId=${group.id}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&paymentMethod=${filters.paymentMethod}`;
            if (selStudent !== null) {
                url += `&studentId=${selStudent.id}`;
            }

            const res = await ApiCall(url, {method: "GET"});
            if (res.data) {
                setPayments(res.data);
            } else {
                setPayments([]);
                toast.warning("Data not found");
            }
        } catch (err) {
            toast.error(err.response?.message || "Failed to get Data");
        }
    };

    const [dropdowns, setDropdowns] = useState({
        branch: false,
        teacher: false,
        group: false,
        student: false,
    })

    useEffect(() => {
        if (selectedRole === "ROLE_MAIN_RECEPTION") {
            getFilials()
        } else {
            getFilialByReceptionId();
        }
    }, []);


    useEffect(() => {
        if (filters.filialId) {
            getTeacherByFilial(filters.filialId);
        }
    }, [filters.filialId]);

    useEffect(() => {
        if (selTeacher && selTeacher.id) {
            getGroups()
        }
    }, [selTeacher]);

    useEffect(() => {
        if (selGroup && selGroup.id) {
            getStudents()
        }
    }, [selGroup]);


    async function getFilials() {

        try {
            const res = await ApiCall("/filial/getAll", {method: "GET"});
            setBranches(res.data);
            setTeachers([])
            setSelTeacher(null)
            setGroups([])
            setSelGroup(null)
            setStudents([])
            setSelStudent(null)
        } catch (err) {
            const errorMsg = err.response?.data || err.message || "Filial not found";
            toast.error(errorMsg);
        }
    }

    async function getFilialByReceptionId() {
        try {
            const res = await ApiCall(`/filial/getOne/${resId}`, {method: "GET"});
            setSelBranch(res.data);
        } catch (err) {
            const errorMsg = err.response?.data || err.message || "Filial not found";
            toast.error(errorMsg);
        }
    }

    async function getTeacherByFilial(selBranchId) {
        try {
            const res = await ApiCall(`/user/teacher/${selBranchId}`, {method: "GET"});
            if (res.data.length === 0) {
                // 🔥 O'qituvchi topilmagan holatda tozalaymiz
                setTeachers([]);
                setSelTeacher(null);
                setGroups([]);
                setSelGroup(null);
                setStudents([]);
                setSelStudent(null);
                setFilters(prev => ({
                    ...prev,
                    teacherId: "",
                    groupId: "",
                    studentId: ""
                }));
            } else {
                // 🔥 Normal holatda o‘qituvchilarni o‘rnatamiz
                setTeachers(res.data);
            }
        } catch (err) {
            toast.error(err.response?.data || "Error to get teachers");
        }
    }


    async function getGroups() {
        try {
            const res = await ApiCall(`/group/teacher/${selTeacher.id}`, {
                method: "GET",
            });
            setGroups(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get groups");
        }
    }

    async function getStudents() {
        try {
            const res = await ApiCall(`/user/student?groupId=${selGroup.id}`, {
                method: "GET",
            });
            setStudents(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get students");
        }
    }

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
            <CreditCard className={styles.methodIcon}/>
        ) : (
            <DollarSign className={styles.methodIcon}/>
        )
    }

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown],
        }))
    }

    const selectOption = (dropdown, value, field) => {
        setFilters((prev) => ({...prev, [field]: value}))
        setDropdowns((prev) => ({...prev, [dropdown]: false}))
    }

    const getSelectedText = (type) => {
        switch (type) {
            case "branch":
                return selBranch
                    ? branches.find((f) => f.id === selBranch.id)?.name || "Filial tanlanmagan"
                    : "Filialni tanlang";
            case "teacher":
                if (!filters.filialId) {
                    return "Avval filialni tanlang";
                }
                if (teachers.length === 0) {
                    return "Filialda o‘qituvchi topilmadi";
                }
                return filters.teacherId
                    ? teachers.find((t) => t.id === filters.teacherId)?.name
                    : "O'qituvchini tanlang";
            case "group":
                return filters.groupId
                    ? groups.find((g) => g.id === filters.groupId)?.name
                    : filters.teacherId
                        ? "Guruhni tanlang"
                        : "Avval o'qituvchini tanlang";

            case "student":
                return filters.studentId
                    ? students.find((s) => s.id === filters.studentId)?.name
                    : filters.groupId
                        ? "Talabani tanlang"
                        : "Avval guruhni tanlang";
            default:
                return "";
        }
    };


    return (
        <div className={styles.container}>
            <ToastContainer/>
            {/* Filters */}
            <div className={styles.filtersSection}>
                {/* Teacher, Group, Student Selects */}
                <div className={styles.selectFilters}>

                    {
                        selectedRole === "ROLE_MAIN_RECEPTION" && <div className={styles.selectGroup}>
                            <label className={styles.label}>
                                <BookOpen className={styles.labelIcon}/>
                                Filial
                            </label>
                            <div className={styles.selectWrapper}>
                                <button
                                    type="button"
                                    className={styles.select}
                                    onClick={() => toggleDropdown("branch")}
                                >
                                    <span>{getSelectedText("branch")}</span>
                                    <ChevronDown className={styles.chevron}/>
                                </button>
                                {dropdowns.branch && (
                                    <div className={styles.dropdown}>
                                        {branches.map((filial) => (
                                            <div
                                                key={filial.id}
                                                className={styles.dropdownItem}
                                                onClick={() => {
                                                    setSelBranch(filial); // filial obyektini saqlaymiz
                                                    selectOption("branch", filial.id, "filialId");
                                                    setDropdowns((prev) => ({...prev, branch: false}));
                                                }}
                                            >
                                                {filial.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    }


                    <div className={styles.selectGroup}>
                        <label className={styles.label}>
                            <GraduationCap className={styles.labelIcon}/>
                            O'qituvchi
                        </label>
                        <div className={styles.selectWrapper}>
                            <button type="button"
                                    className={`${styles.select} ${(!filters.filialId || teachers.length === 0) ? styles.disabled : ""}`}
                                    onClick={() => toggleDropdown("teacher")}>
                                <span>{getSelectedText("teacher")}</span>
                                <ChevronDown className={styles.chevron}/>
                            </button>
                            {dropdowns.teacher && (
                                <div className={styles.dropdown}>
                                    {teachers.map((teacher) => (
                                        <div
                                            key={teacher.id}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                selectOption("teacher", teacher.id, "teacherId");
                                                setSelTeacher(teacher); // 🔥 bu kerak
                                            }}
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
                            <Users className={styles.labelIcon}/>
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
                                <ChevronDown className={styles.chevron}/>
                            </button>
                            {dropdowns.group && filters.teacherId && (
                                <div className={styles.dropdown}>
                                    {groups.map((group) => (
                                        <div
                                            key={group.id}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                selectOption("group", group.id, "groupId");
                                                setSelGroup(group); // 🔥 qo‘shish kerak
                                            }}
                                        >
                                            <span>{group.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.selectGroup}>
                        <label className={styles.label}>
                            <User className={styles.labelIcon}/>
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
                                <ChevronDown className={styles.chevron}/>
                            </button>
                            {dropdowns.student && filters.groupId && (
                                <div className={styles.dropdown}>
                                    {students.map((student) => (
                                        <div
                                            key={student.id}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                selectOption("student", student.id, "studentId");
                                                setSelStudent(student); // 🔥 qo‘shish kerak
                                            }}
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
                                <Calendar className={styles.labelIcon}/>
                                Dan
                            </label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters((prev) => ({...prev, dateFrom: e.target.value}))}
                                className={styles.dateInput}
                            />
                        </div>
                        <div className={styles.dateGroup}>
                            <label className={styles.label}>
                                <Calendar className={styles.labelIcon}/>
                                Gacha
                            </label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters((prev) => ({...prev, dateTo: e.target.value}))}
                                className={styles.dateInput}
                            />
                        </div>
                    </div>

                    <div className={styles.methodFilters}>
                        <button
                            className={`${styles.filterButton} ${filters.paymentMethod === "all" ? styles.active : ""}`}
                            onClick={() => setFilters((prev) => ({...prev, paymentMethod: "all"}))}
                        >
                            Barchasi
                        </button>
                        <button
                            className={`${styles.filterButton} ${filters.paymentMethod === "card" ? styles.active : ""}`}
                            onClick={() => setFilters((prev) => ({...prev, paymentMethod: "card"}))}
                        >
                            <CreditCard className={styles.filterIcon}/>
                            Karta
                        </button>
                        <button
                            className={`${styles.filterButton} ${filters.paymentMethod === "cash" ? styles.active : ""}`}
                            onClick={() => setFilters((prev) => ({...prev, paymentMethod: "cash"}))}
                        >
                            <DollarSign className={styles.filterIcon}/>
                            Naqd
                        </button>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableContent}>
                    {payments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <BookOpen className={styles.emptySearchIcon}/>
                            </div>
                            <h3 className={styles.emptyTitle}>To'lovlar topilmadi</h3>
                            <p className={styles.emptyDescription}>Filter shartlaringizni o'zgartiring yoki yangi to'lov
                                qo'shing</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                <tr className={styles.headerRow}>
                                    <th className={styles.headerCell}>
                                        <div className={styles.headerContent}>
                                            <User className={styles.headerIcon}/>
                                            Student
                                        </div>
                                    </th>
                                    <th className={styles.headerCell}>Amount</th>
                                    <th className={styles.headerCell}>Discount</th>
                                    <th className={styles.headerCell}>Info</th>
                                    <th className={styles.headerCell}>
                                        <div className={styles.headerContent}>
                                            <Calendar className={styles.headerIcon}/>
                                            Sana
                                        </div>
                                    </th>
                                    <th className={styles.headerCell}>Status</th>
                                </tr>
                                </thead>
                                <tbody>

                                {/*Modal*/}
                                {selectedPayment && (
                                    <div className={styles.modalOverlay} onClick={() => setSelectedPayment(null)}>
                                        <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                                            <h2>Transactions</h2>

                                            <p><strong>Student:</strong> {selectedPayment.fullName}</p>
                                            <p><strong>Amount:</strong> {selectedPayment.paidAmount} so'm</p>
                                            <p><strong>Date:</strong> {selectedPayment.paymentDate}</p>

                                            {/* Agar backenddan transactionlar massiv keladigan bo‘lsa */}
                                            {selectedPayment.transactions?.length > 0 ? (
                                                <div className={styles.transactionsWrap}>
                                                    {selectedPayment.transactions.map((tr) => (
                                                        <div className={styles.transactionCard} key={tr.id}>
                                                            <h3>
                                                                {tr.paymentMethod === "CARD" ? <span>CARD</span> : <span>CASH</span>}
                                                            </h3>
                                                                <h3>{tr.paymentDate}</h3>
                                                                <h2>{tr.paidAmount}</h2>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>Transactions not found</p>
                                            )}

                                            <button className={styles.closeBtn} onClick={() => setSelectedPayment(null)}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {/*--Modal--*/}

                                {payments?.map((payment) => (
                                    <tr key={payment.id} className={styles.dataRow}>
                                        <td className={styles.studentName}>{payment?.fullName}</td>
                                        <td className={styles.amount}>{payment?.paidAmount} so'm</td>
                                        <td className={styles.amount}>{payment?.discountAmount} so'm</td>
                                        <td>
                                            {/*<span*/}
                                            {/*    className={`${styles.methodBadge} ${payment.paymentMethod === "card" ? styles.cardBadge : styles.cashBadge}`}*/}
                                            {/*>*/}
                                            {/*  <div className={styles.badgeContent}>*/}
                                            {/*    {getPaymentMethodIcon(payment.paymentMethod)}*/}
                                            {/*      {payment.paymentMethod === "CARD" ? "Karta" : "Naqd"}*/}
                                            {/*  </div>*/}
                                            {/*</span>*/}
                                            <button
                                                className={styles.showTransactionBtn}
                                                onClick={() => setSelectedPayment(payment)}
                                            >Transactions</button>
                                        </td>
                                        <td className={styles.date}>{payment?.paymentDate}</td>
                                        <td>
                        <span
                            className={`${styles.statusBadge} ${payment.paymentStatus === "PAID" ? styles.completedBadge : styles.pendingBadge}`}
                        >
                          {payment.paymentStatus === "PAID" ? <FaCheckCircle/> : <GiSandsOfTime/>}
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
            {payments.length > 0 && (
                <div className={styles.summaryCard}>
                    <div className={styles.summaryContent}>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <p className={styles.summaryLabel}>Jami To'lovlar</p>
                                <p className={styles.summaryValue}>{payments.length}</p>
                            </div>
                            <div className={styles.summaryItem}>
                                <p className={styles.summaryLabel}>Jami Miqdor</p>
                                <p className={styles.summaryValue}>
                                    {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} so'm
                                </p>
                            </div>
                            <div className={styles.summaryItem}>
                                <p className={styles.summaryLabel}>Bajarilgan To'lovlar</p>
                                <p className={`${styles.summaryValue} ${styles.completedValue}`}>
                                    {payments.filter((p) => p.status === "PAID").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
