import { useState, useEffect } from "react";
import {
    CreditCard,
    DollarSign,
    Plus,
    Building,
    Users,
    User,
    ChevronDown,
} from "lucide-react";
import styles from "./payment-form.module.scss";
import ApiCall from "../../../../Utils/ApiCall";
import { toast, ToastContainer } from "react-toastify";

export function PaymentForm() {
    const [branches, setBranches] = useState([]);
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);

    const [dropdowns, setDropdowns] = useState({
        branch: false,
        group: false,
        student: false,
    });

    const resId = localStorage.getItem("userId");
    const selectedRole = localStorage.getItem("selectedRole");

    const [formData, setFormData] = useState({
        branchId: "",
        groupId: "",
        studentId: "",
        amount: "",
        paymentMethod: "card",
    });

    // 🔹 Filialni olish
    useEffect(() => {
        if (selectedRole === "ROLE_RECEPTION") getFilialByReceptionId();
        else getFilials();
    }, []);

    // 🔹 Filial tanlanganda guruhlarni olish
    useEffect(() => {
        if (formData.branchId) getGroups();
    }, [formData.branchId]);

    // 🔹 Guruh tanlanganda talabalarni olish
    useEffect(() => {
        if (formData.groupId) getStudents();
    }, [formData.groupId]);

    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll", { method: "GET" });
            setBranches(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Filiallarni olishda xatolik");
        }
    }

    async function getFilialByReceptionId() {
        try {
            const res = await ApiCall(`/filial/getOne/${resId}`, { method: "GET" });
            setBranches([res.data]);
            setFormData((prev) => ({ ...prev, branchId: res.data.id }));
        } catch (err) {
            toast.error(err.response?.data || "Filial topilmadi");
        }
    }

    async function getGroups() {
        try {
            const res = await ApiCall(`/group?filialId=${formData.branchId}`, {
                method: "GET",
            });
            setGroups(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get Groups!");
        }
    }

    async function getStudents() {
        try {
            const res = await ApiCall(`/user/student?groupId=${formData.groupId}`, {
                method: "GET",
            });
            setStudents(res.data);
        } catch (err) {
            toast.error(err.response?.data || "Error to get students!");
        }
    }

    const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
    };

    const selectOption = (dropdown, value, id) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
        setDropdowns((prev) => ({ ...prev, [dropdown]: false }));
    };

    const getSelectedText = (type) => {
        switch (type) {
            case "branch":
                return formData.branchId
                    ? branches.find((b) => b.id === formData.branchId)?.name
                    : "Select Branch";
            case "group":
                return formData.groupId
                    ? groups.find((g) => g.id === formData.groupId)?.name
                    : formData.branchId
                        ? "Select Group"
                        : "The first need to choose branch";
            case "student":
                return formData.studentId
                    ? students.find((s) => s.id === formData.studentId)?.name
                    : formData.groupId
                        ? "Select Student"
                        : "The first need to choose group";
            default:
                return "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { branchId, groupId, studentId, amount, paymentMethod } = formData;
        if (!branchId || !groupId || !studentId || !amount) {
            toast.warn("Barcha maydonlarni to‘ldiring");
            return;
        }

        const payment = {
            studentId,
            amount: Number(amount),
            paymentMethod,
        };

        try {
            const res = await ApiCall(
                "/payment/addPayment",
                { method: "POST" },
                payment
            );
            toast.success(res.data || "To‘lov muvaffaqiyatli qo‘shildi");
            setFormData({
                branchId: "",
                groupId: "",
                studentId: "",
                amount: "",
                paymentMethod: "card",
            });
        } catch (err) {
            toast.error(err.response?.data || "Error to add Payment");
        }
    };


    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <ToastContainer />
            <div className={styles.filtersGrid}>
                {/* Filial tanlash */}
                {(selectedRole === "ROLE_MAIN_RECEPTION" || selectedRole === "ROLE_ADMIN") &&
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            <Building className={styles.labelIcon} />
                            Filial
                        </label>
                        <div className={styles.selectWrapper}>
                            <button
                                type="button"
                                className={styles.select}
                                onClick={() => toggleDropdown("branch")}
                            >
                                <span>{getSelectedText("branch")}</span>
                                <ChevronDown className={styles.chevron} />
                            </button>
                            {dropdowns.branch && (
                                <div className={styles.dropdown}>
                                    {branches.map((branch) => (
                                        <div
                                            key={branch.id}
                                            className={styles.dropdownItem}
                                            onClick={() =>
                                                selectOption("branch", branch.id, "branchId")
                                            }
                                        >
                                            {branch.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                }

                {/* Guruh tanlash */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        <Users className={styles.labelIcon} />
                        Guruh
                    </label>
                    <div className={styles.selectWrapper}>
                        <button
                            type="button"
                            className={`${styles.select} ${
                                !formData.branchId ? styles.disabled : ""
                            }`}
                            onClick={() => formData.branchId && toggleDropdown("group")}
                            disabled={!formData.branchId}
                        >
                            <span>{getSelectedText("group")}</span>
                            <ChevronDown className={styles.chevron} />
                        </button>
                        {dropdowns.group && (
                            <div className={styles.dropdown}>
                                {groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className={styles.dropdownItem}
                                        onClick={() =>
                                            selectOption("group", group.id, "groupId")
                                        }
                                    >
                                        {group.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Talaba tanlash */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        <User className={styles.labelIcon} />
                        Talaba
                    </label>
                    <div className={styles.selectWrapper}>
                        <button
                            type="button"
                            className={`${styles.select} ${
                                !formData.groupId ? styles.disabled : ""
                            }`}
                            onClick={() => formData.groupId && toggleDropdown("student")}
                            disabled={!formData.groupId}
                        >
                            <span>{getSelectedText("student")}</span>
                            <ChevronDown className={styles.chevron} />
                        </button>
                        {dropdowns.student && (
                            <div className={styles.dropdown}>
                                {students.map((student) => (
                                    <div
                                        key={student.id}
                                        className={styles.dropdownItem}
                                        onClick={() =>
                                            selectOption("student", student.id, "studentId")
                                        }
                                    >
                                        {student.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* To‘lov miqdori */}
            <div className={styles.fieldGroup}>
                <label className={styles.label}>To‘lov Miqdori (so‘m)</label>
                <input
                    type="number"
                    placeholder="Miqdorni kiriting"
                    value={formData.amount}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    className={styles.input}
                />
            </div>

            {/* To‘lov turi */}
            <div className={styles.paymentMethodGroup}>
                <label className={styles.label}>To‘lov turi</label>
                <div className={styles.radioGroup}>
                    <div>
                        <input
                            type="radio"
                            id="card"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === "card"}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    paymentMethod: e.target.value,
                                }))
                            }
                            className={styles.radioInput}
                        />
                        <label htmlFor="card" className={styles.radioLabel}>
                            <CreditCard className={styles.radioIcon} />
                            <span className={styles.radioText}>Plastik karta</span>
                        </label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="cash"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === "cash"}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    paymentMethod: e.target.value,
                                }))
                            }
                            className={styles.radioInput}
                        />
                        <label htmlFor="cash" className={styles.radioLabel}>
                            <DollarSign className={styles.radioIcon} />
                            <span className={styles.radioText}>Naqd pul</span>
                        </label>
                    </div>
                </div>
            </div>

            <button type="submit" className={styles.submitButton}>
                <Plus className={styles.buttonIcon} />
                To‘lovni qo‘shish
            </button>
        </form>
    );
}
