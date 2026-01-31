"use client"

import {useEffect, useState} from "react"
import styles from "./attendanceR.module.css"
import {Calendar, Users, Filter, Download, Edit, Save, X} from "lucide-react"
import "./AttendanceR.scss"
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";

// Months in Uzbek (can remain as it's UI specific)
const months = [
    {value: 0, name: "Yanvar"},
    {value: 1, name: "Fevral"},
    {value: 2, name: "Mart"},
    {value: 3, name: "Aprel"},
    {value: 4, name: "May"},
    {value: 5, name: "Iyun"},
    {value: 6, name: "Iyul"},
    {value: 7, name: "Avgust"},
    {value: 8, name: "Sentabr"},
    {value: 9, name: "Oktabr"},
    {value: 10, name: "Noyabr"},
    {value: 11, name: "Dekabr"},
]

// Weekdays in Uzbek (can remain as it's UI specific)
const weekdays = [
    "Yakshanba", // Sunday
    "Dushanba", // Monday
    "Seshanba", // Tuesday
    "Chorshanba", // Wednesday
    "Payshanba", // Thursday
    "Juma", // Friday
    "Shanba", // Saturday
]

// Generate years (can remain as it's UI specific)
const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 1; i <= currentYear + 1; i++) {
        years.push(i)
    }
    return years
}

// Generate days for selected month/year (can remain as it's UI specific)
const generateDays = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
    }
    return days
}


function generateWeeksInMonth(month, year) {
    const weeks = [];
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    let current = new Date(firstDayOfMonth);

    // Haftaning 1-kunini dushanbaga surish
    const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay(); // Yakshanba -> 7
    current.setDate(current.getDate() - (dayOfWeek - 1));

    let weekNumber = 1;

    while (current <= lastDayOfMonth) {
        const startDay = new Date(current);
        const endDay = new Date(current);
        endDay.setDate(startDay.getDate() + 6);

        weeks.push({
            number: weekNumber,
            startDay: startDay.getMonth() === (month - 1) ? startDay.getDate() : 1,
            endDay: endDay.getMonth() === (month - 1) ? endDay.getDate() : lastDayOfMonth.getDate(),
            fullLabel: `${weekNumber}-hafta (${startDay.getMonth() === (month - 1) ? startDay.getDate() : 1}–${endDay.getMonth() === (month - 1) ? endDay.getDate() : lastDayOfMonth.getDate()})`
        });

        current.setDate(current.getDate() + 7);
        weekNumber++;
    }

    return weeks;
}



export default function AttendanceGroup() {
    const resId = localStorage.getItem("userId");
    const selectedRole = localStorage.getItem("selectedRole");
    // State for selected group (will need to be initialized from backend groups)
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([])
    const [filials, setFilials] = useState([])
    const [selectedFilial, setSelectedFilial] = useState(null)

    const [filterType, setFilterType] = useState("daily")
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedDay, setSelectedDay] = useState(new Date().getDate())
    const today = new Date().getDate();
    const [selectedWeek, setSelectedWeek] = useState(1)
    const weekDays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];


    // attendanceData will now be fetched from the backend based on filters
    const [attendanceData, setAttendanceData] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editingData, setEditingData] = useState([]) // For local changes before saving
    const [editedAttendance, setEditedAttendance] = useState([]);

    // Array for absent reasons (can be fetched from backend or hardcoded if static)
    const absentReasons = ["Illness", "Family reason", "Transport problem", "Other reason", "No reason"]

    useEffect(() => {
        if(selectedRole==="ROLE_MAIN_RECEPTION"){
            getFilials()
        }else {
            getFilialByReceptionId();
        }
    }, []); // faqat bir marta chaqiriladi

    useEffect(() => {
        if (selectedGroup && selectedGroup.id) {
            getAttendanceData(selectedGroup);
        }
    }, [selectedGroup, filterType, selectedMonth, selectedYear, selectedDay, selectedWeek]);

    useEffect(() => {
        if (!selectedFilial) return;

        // 🔄 Avval guruhni reset qilamiz
        setSelectedGroup(null);

        // 🔽 Keyin yangi filial guruhlarini yuklaymiz
        getGroupsByFilial();
    }, [selectedFilial]);


    async function getFilials() {
        try {
            const res = await ApiCall("/filial/getAll",{method:"GET"});
            setFilials(res.data);
        } catch (err) {
            const errorMsg = err.response?.data || err.message || "Filial not found";
            toast.error(errorMsg);
        }
    }

    async function getFilialByReceptionId() {
        try {
            const res = await ApiCall(`/filial/getOne/${resId}`, { method: "GET" });
            setSelectedFilial(res.data);
        } catch (err) {
            const errorMsg = err.response?.data || err.message || "Filial not found";
            toast.error(errorMsg);
        }
    }



    const getGroupsByFilial = async () => {
        if (!selectedFilial || !selectedFilial.id) return;

        try {
            const res = await ApiCall(`/group?filialId=${selectedFilial.id}`, {method: "GET"});
            setGroups(res.data);

            if (res.data.length > 0) {
                // 🆕 Har doim birinchi guruhni tanlaymiz (filial o‘zgarganda)
                setSelectedGroup(res.data[0]);
                await getAttendanceData(res.data[0]);
            } else {
                // ⚠️ Guruhlar bo‘lmasa, tozalaymiz
                setSelectedGroup(null);
                setAttendanceData([]);
            }
        } catch (err) {
            toast.error(err.message || "Groups not found");
        }
    };



    const handleFilterChange = (newFilter) => {
        setFilterType(newFilter)
        // TODO: Call backend API to fetch attendance data based on newFilter
        // Example: fetchData(selectedGroup, newFilter, selectedMonth, selectedYear, selectedDay, selectedWeek);
        setIsEditing(false) // Exit editing mode when filter changes
    }

    const getAttendanceData = async (group) => {
        if (!group || !group.id) return;

        try {
            let url = `/attendance/get?groupId=${group.id}&viewType=${filterType}`;
            if (filterType === "daily") {
                url += `&year=${selectedYear}&month=${selectedMonth + 1}&day=${selectedDay}`;
            } else if (filterType === "weekly") {
                url += `&year=${selectedYear}&month=${selectedMonth + 1}&week=${selectedWeek}`;
            } else if (filterType === "monthly") {
                url += `&year=${selectedYear}&month=${selectedMonth + 1}`;
            }

            const res = await ApiCall(url, {method: "GET"});
            if (res.data) {
                setAttendanceData(res.data);
            } else {
                setAttendanceData([]);
                toast.warning("Ma'lumot topilmadi");
            }
        } catch (err) {
            toast.error(err.message || "Davomat ma'lumotlarini olishda xatolik");
        }
    };


    const handleMonthChange = (month) => {
        const newMonth = Number.parseInt(month)
        setSelectedMonth(newMonth)

        // Adjust day if it's out of bounds for the new month
        const daysInNewMonth = new Date(selectedYear, newMonth + 1, 0).getDate()
        if (selectedDay > daysInNewMonth) {
            setSelectedDay(daysInNewMonth)
        }
        setSelectedWeek(1) // Reset week selection for new month

        // TODO: Call backend API to fetch attendance data for the new month
        // Example: fetchData(selectedGroup, filterType, newMonth, selectedYear, selectedDay, 1);
        setIsEditing(false)
    }

    const handleYearChange = (year) => {
        const newYear = Number.parseInt(year)
        setSelectedYear(newYear)

        // Adjust day if it's out of bounds for the new year (leap year)
        const daysInMonth = new Date(newYear, selectedMonth + 1, 0).getDate()
        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth)
        }
        setSelectedWeek(1) // Reset week selection for new year

        // TODO: Call backend API to fetch attendance data for the new year
        // Example: fetchData(selectedGroup, filterType, selectedMonth, newYear, selectedDay, 1);
        setIsEditing(false)
    }

    const handleDayChange = (day) => {
        const newDay = Number.parseInt(day)
        setSelectedDay(newDay)

        if (filterType === "daily") {
            // TODO: Call backend API to fetch attendance data for the new day
            // Example: fetchData(selectedGroup, filterType, selectedMonth, selectedYear, newDay, selectedWeek);
            setIsEditing(false)
        }
    }

    const handleWeekChange = (week) => {
        const newWeek = Number.parseInt(week)
        setSelectedWeek(newWeek)

        if (filterType === "weekly") {
            // TODO: Call backend API to fetch attendance data for the new week
            // Example: fetchData(selectedGroup, filterType, selectedMonth, selectedYear, selectedDay, newWeek);
            setIsEditing(false)
        }
    }

    const startEditing = () => {
        setIsEditing(true);

        // dataToDisplay dan deep copy olish
        const deepCopy = JSON.parse(JSON.stringify(dataToDisplay));
        setEditingData(deepCopy);

        // Har bir student uchun hozirgi holatni editedAttendance ga yozamiz
        const initialEdited = deepCopy.flatMap(day =>
            day.attendance.map(a => ({
                studentId: a.studentId,
                status: a.status,
                cause: a.cause || "",
            }))
        );

        setEditedAttendance(initialEdited);
        console.log("Initial editedAttendance:", initialEdited);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditingData([]);
    };

    const calculateAttendanceStats = (studentId) => {
        const dataToUse = isEditing ? editingData : attendanceData
        if (!dataToUse || dataToUse.length === 0) return 0; // Handle empty data
        const studentAttendance = dataToUse.map((day) => day.attendance[studentId]?.status) // Use optional chaining
        const present = studentAttendance.filter((status) => status === "present").length
        const total = studentAttendance.length
        return total > 0 ? Math.round((present / total) * 100) : 0
    }

    const getPercentageClass = (percentage) => {
        if (percentage >= 80) return "high"
        if (percentage >= 60) return "medium"
        return "low"
    }


    // const selectedGroupName = selectedGroup
    //     ? groups.find((group) => group.id === selectedGroup.id)?.name || "Guruh tanlanmagan"
    //     : "Guruh tanlanmagan";

    const selectedGroupName =
        selectedGroup && selectedGroup.name
            ? selectedGroup.name
            : "Guruh tanlanmagan";

    const selectedMonthName = months.find((month) => month.value === selectedMonth)?.name
    const dataToDisplay = isEditing ? editingData : attendanceData;
    const students = dataToDisplay[0]?.attendance || [];
    const availableDays = generateDays(selectedMonth, selectedYear)
    const availableWeeks = generateWeeksInMonth(selectedMonth, selectedYear)


    const getPeriodInfo = () => {
        if (filterType === "monthly") {
            return `${selectedMonthName} ${selectedYear} - ${dataToDisplay.length} day`
        } else if (filterType === "weekly") {
            const weeksInMonth = generateWeeksInMonth(selectedMonth, selectedYear)
            const selectedWeekData = weeksInMonth.find((week) => week.number === selectedWeek)
            return `${selectedMonthName} ${selectedYear}, ${selectedWeekData?.fullLabel || `${selectedWeek}-week`} - weekly`
        } else {
            return `${selectedDay} ${selectedMonthName} ${selectedYear} - daily`
        }
    }

    // Helper to calculate total/present/absent students for stats cards
    const getTotalPresentAbsentForSelectedPeriod = () => {
        let presentCount = 0;
        let absentCount = 0;
        const dataForPeriod = dataToDisplay; // This is already filtered by filterType and selected date/week/month

        if (dataForPeriod.length > 0) {
            const lastDayData = dataForPeriod[dataForPeriod.length - 1];
            if (lastDayData && lastDayData.attendance) {
                Object.values(lastDayData.attendance).forEach(att => {
                    if (att.status === "present") {
                        presentCount++;
                    } else if (att.status === "absent") {
                        absentCount++;
                    }
                });
            }
        }
        return {presentCount, absentCount};
    };

    const {presentCount, absentCount} = getTotalPresentAbsentForSelectedPeriod();

    async function saveChanges() {
        try {
            // 1️⃣ Backend kutayotgan formatga o‘tkazamiz
            const payload = editedAttendance.map(item => ({
                studentId: item.studentId,
                status: item.status || "none",
                cause: item.cause || "",
            }));

            // 2️⃣ So‘rov yuboramiz
            const response = await ApiCall(
                `/attendance/save/${selectedGroup.id}`,   // ✅ Backend mappingiga to‘liq mos
                { method: "PUT" },                        // ✅ axios uchun method
                payload,                                  // ✅ bu 'data' sifatida yuboriladi
                { "Content-Type": "application/json" }    // ✅ header
            );

            // 3️⃣ Natijani tekshiramiz
            if (response.status === 200) {
                toast.success("Davomat muvaffaqiyatli saqlandi!");
                setIsEditing(false);
                setEditedAttendance([]);
                getAttendanceData(selectedGroup);
            } else {
                toast.error("Xatolik: " + response.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Server bilan bog‘lanishda xatolik");
        }
    }

    const markAllForDate = (status) => {
        // 1️⃣ Har bir student uchun statusni tahrir ro‘yxatiga yozamiz
        setEditedAttendance((prev) => {
            const updatedList = students.map((student) => ({
                studentId: student.studentId || student.id,
                status,
                cause: "",
            }));
            return updatedList;
        });

        // 2️⃣ Jadvaldagi `select`lar ham darhol o‘zgarishi uchun
        setEditingData((prevData) =>
            prevData.map((student) => ({
                ...student,
                attendance: student.attendance.map((att) => ({
                    ...att,
                    status, // faqat statusni yangilaymiz
                })),
            }))
        );
    };




    function updateAttendance(dayIndex,studentId, status) {
        setEditedAttendance(prev => {
            console.log("updateAttendance chaqirildi:", { studentId, status, prev });

            // mavjud studentni qidiramiz
            const existingIndex = prev.findIndex(item => item.studentId === studentId);

            if (existingIndex !== -1) {
                // mavjud studentni yangilaymiz
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], status };
                return updated;
            } else {
                // yangi student qo‘shamiz
                return [...prev, { studentId, status, cause: "" }];
            }
        });
    }

    function updateReason(studentId, cause) {
        setEditedAttendance(prev => {
            console.log("updateReason chaqirildi:", { studentId, cause, prev });

            const existingIndex = prev.findIndex(item => item.studentId === studentId);

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], cause };
                return updated;
            } else {
                return [...prev, { studentId, status: "none", cause }];
            }
        });
    }



    function renderReasonCell(day, dayIndex, student) {
        const record = day.attendance.find(a => a.studentId === student.studentId);

        return (
            <td key={dayIndex} className={`${styles.reasonCell} ${isEditing ? styles.editingCell : ""}`}>
                <div className={styles.attendanceIndicator}>
                    {isEditing ? (
                        <select
                            defaultValue={record?.reason || ""}
                            className={styles.reasonSelect}
                            onChange={(e)=>updateReason(student.studentId, e.target.value)}
                        >
                            <option value="">Select</option>
                            {absentReasons.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className={styles.attendanceDisplay}>

                            <span className={styles.reasonText}>
                                {(record?.reason && record?.reason.trim() !== "") ? record.reason : "Unmarked"}

                            </span>

                        </div>
                    )}
                </div>
            </td>
        );
    }

    const renderAttendanceCell = (day, dayIndex, student) => {
        const record = isEditing
            ? editedAttendance.find(a => a.studentId === student.studentId)
            : day.attendance.find(a => a.studentId === student.studentId);

        return (
            <td key={dayIndex} className={`${styles.attendanceCell} ${isEditing ? styles.editingCell : ""}`}>
                <div className={styles.attendanceIndicator}>
                    {isEditing ? (
                        <select
                            value={record?.status || ""}
                            className={styles.attendanceSelect}
                            onChange={(e) => updateAttendance(dayIndex, student.studentId, e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </select>
                    ) : (
                        <div className={styles.attendanceDisplay}>
                            {record?.status!=="none" ?
                                                            <span className={
                                                                record?.status === "present"
                                                                    ? styles.attendanceGreen
                                                                        : styles.attendanceRed
                                                            }>
                                                                {record?.status}
                                                            </span> :
                                                            <span className={styles.attendanceGray}>
                                                                Unmarked
                                                            </span> }
                        </div>
                    )}
                </div>
            </td>
        );
    };

    // O'rtacha davomatni hisoblaydigan umumiy funksiya
    const calculateAverageAttendance = (type) => {
        if (!dataToDisplay || dataToDisplay.length === 0) return 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - now.getDay());
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

        let totalStudents = 0;
        let totalPresent = 0;

        dataToDisplay.forEach(day => {
            const dayDate = new Date(day.date);

            // filterType bo'yicha filtrlash
            const include =
                type === "daily"
                    ? dayDate.toDateString() === now.toDateString()
                    : type === "weekly"
                        ? dayDate >= currentWeekStart && dayDate <= currentWeekEnd
                        : dayDate.getMonth() === currentMonth; // monthly default

            if (include && Array.isArray(day.attendance)) {
                day.attendance.forEach(record => {
                    totalStudents++;
                    if (record.status === "present") totalPresent++;
                });
            }
        });

        if (totalStudents === 0) return 0;
        return ((totalPresent / totalStudents) * 100).toFixed(2);
    };


    return (
        <div className={styles.container}>
            <ToastContainer/>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={"white-text"}>Talabalar Davomat Jadvali</h1>
                    <p className={"white-text"}>Talabalar davomatini kuzatish va boshqarish</p>
                </div>
                <div style={{display: "flex", gap: "0.5rem"}}>
                    {(filterType === "daily" && Number(selectedDay) === today) && (
                        <button
                            className={`${styles.editButton} ${isEditing ? styles.editing : ""}`}
                            onClick={isEditing ? cancelEditing : startEditing}
                        >
                            {isEditing ? <X size={16} /> : <Edit size={16} />}
                            {isEditing ? "Bekor qilish" : "Tahrirlash"}
                        </button>
                    )}
                    {/* TODO: Add export functionality here (e.g., export to CSV) */}
                    <button className={styles.exportButton}>
                        <Download size={16}/>
                        Export
                    </button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                        <Filter size={20}/>
                        Filtrlar
                    </h2>
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.filtersContainer}>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <Users size={16}/>
                                Select Brach and Group
                            </label>
                            <div className={styles.flexContainer}>
                                {
                                    (selectedRole === "ROLE_MAIN_RECEPTION" || selectedRole==="ROLE_ADMIN") && <select
                                        className={styles.select}
                                        value={selectedFilial?.id || ""} // Handle null selectedGroup initially
                                        onChange={(e) => {
                                            const filial = filials.find(f => f.id === e.target.value);
                                            setSelectedFilial(filial);
                                        }}

                                        disabled={isEditing || filials.length === 0} // Disable if editing or no groups loaded
                                    >
                                        <option value="" disabled>Select branch</option>
                                        {/* Placeholder */}
                                        {filials.map((filial) => (
                                            <option key={filial.id} value={filial.id}>
                                                {filial.name}
                                            </option>
                                        ))}
                                    </select>
                                }
                                <select
                                    className={styles.select}
                                    value={selectedGroup?.id || ""} // Handle null selectedGroup initially
                                    onChange={(e) => {
                                        const group = groups.find(g => g.id === e.target.value);
                                        setSelectedGroup(group);
                                        getAttendanceData(group);
                                    }}

                                    disabled={isEditing || groups.length === 0} // Disable if editing or no groups loaded
                                >
                                    <option value="" disabled>Guruhni tanlang</option>
                                    {/* Placeholder */}
                                    {groups.map((group) => ( // Use 'groups' state
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <Calendar size={16}/>
                                Time period
                            </label>
                            <select
                                className={styles.select}
                                value={filterType}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                disabled={isEditing}
                            >
                                <option value="daily">Kunlik ko'rinish</option>
                                <option value="weekly">Haftalik ko'rinish</option>
                                <option value="monthly">Oylik ko'rinish</option>
                            </select>
                        </div>

                        {filterType === "daily" && (
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>
                                    <Calendar size={16}/>
                                    Select Year, month, day
                                </label>
                                <div className={styles.dateSelector}>
                                    <select
                                        className={styles.yearSelect}
                                        value={selectedYear}
                                        onChange={(e) => handleYearChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {generateYears().map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.monthSelect}
                                        value={selectedMonth}
                                        onChange={(e) => handleMonthChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {months.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.daySelect}
                                        value={selectedDay}
                                        onChange={(e) => handleDayChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {availableDays.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {filterType === "weekly" && (
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>
                                    <Calendar size={16}/>
                                    Yil, oy va haftani tanlang
                                </label>
                                <div className={styles.weekSelector}>
                                    <select
                                        className={styles.yearSelect}
                                        value={selectedYear}
                                        onChange={(e) => handleYearChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {generateYears().map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.monthSelect}
                                        value={selectedMonth}
                                        onChange={(e) => handleMonthChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {months.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.weekSelect}
                                        value={selectedWeek}
                                        onChange={(e) => handleWeekChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {generateWeeksInMonth(selectedMonth, selectedYear).map((week) => (
                                            <option key={week.number} value={week.number}>
                                                {week.fullLabel}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {filterType === "monthly" && (
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>
                                    <Calendar size={16}/>
                                    Oy va yilni tanlang
                                </label>
                                <div className={styles.monthYearSelector}>
                                    <select
                                        className={styles.monthSelect}
                                        value={selectedMonth}
                                        onChange={(e) => handleMonthChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {months.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className={styles.yearSelect}
                                        value={selectedYear}
                                        onChange={(e) => handleYearChange(e.target.value)}
                                        disabled={isEditing}
                                    >
                                        {generateYears().map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.selectedPeriodInfo}>
                        <h4 className={styles.periodTitle}>Tanlangan davr:</h4>
                        <p className={styles.periodDetails}>{getPeriodInfo()}</p>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.cardTitle}>
                            Davomat jadvali - {selectedGroupName}
                            {isEditing &&
                                <span style={{color: "#f59e0b", marginLeft: "0.5rem"}}>(Tahrirlash rejimi)</span>}
                        </h2>
                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <div className={`${styles.statusDot} ${styles.present}`}/>
                                <span>Kelgan</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={`${styles.statusDot} ${styles.absent}`}/>
                                <span>Kelmagan</span>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div>
                            <h3 style={{fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem"}}>Ommaviy amallar:</h3>
                            <div className={styles.bulkActions}>
                                {dataToDisplay.slice(0, 10).map((day, dateIndex) => (
                                    <div key={dateIndex} style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                                        <span style={{fontSize: "0.75rem", minWidth: "80px"}}>
                                            {filterType === "monthly" ? new Date(day.date).getDate() : day.date}:
                                        </span>
                                        <button
                                            className={`${styles.bulkButton} ${styles.present}`}
                                            onClick={() => markAllForDate("present")}
                                        >
                                            All present
                                        </button>
                                        <button
                                            className={`${styles.bulkButton} ${styles.absent}`}
                                            onClick={() => markAllForDate("absent")}
                                        >
                                            All absent
                                        </button>
                                    </div>
                                ))}
                                {dataToDisplay.length > 10 && (
                                    <p style={{fontSize: "0.75rem", color: "#6b7280"}}>
                                        ... va yana {dataToDisplay.length - 10} ta kun
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                            <tr>
                                <th className={styles.stickyColumn + " "}>Student</th>
                                {filterType === "daily" && <th className={styles.center}>Phone</th>}
                                {filterType === "daily" && <th className={styles.center}>Reason</th>}
                                {dataToDisplay.map((day, index) => {
                                    const dateObj = new Date(day.date);
                                    const weekdayName = weekDays[dateObj.getDay()]; // 0=Yakshanba, 1=Dushanba, ...

                                    return (
                                        <th key={index} className={`${styles.center} ${styles.dateHeader}`}>
            <span className={styles.dateType}>
                {filterType === "daily" ? "Date" : filterType === "weekly" ? "" : "Day"}
            </span>
                                            <span className={styles.dateValue}>
                {filterType === "weekly" ? (
                    <>
                        <div className={styles.weekdayName}>{weekdayName}</div>
                        <div className={styles.dayNumber}>{dateObj.getDate()}</div>
                    </>
                ) : filterType === "monthly" ? (
                    dateObj.getDate()
                ) : (
                    day.date
                )}
            </span>
                                        </th>
                                    );
                                })}

                                <th className={styles.center}>Attendance %</th>
                            </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                            {/* Ensure 'students' state is populated from backend before rendering */}
                            {dataToDisplay[0]?.attendance && dataToDisplay[0].attendance.map((student) => (
                                <tr key={student.studentId}>
                                    {/* === Talaba ma'lumotlari === */}
                                    <td className={`${styles.studentCell} ${styles.stickyColumn2}`}>
                                        <div className={styles.studentInfo}>
                                            <span>{student.fullName}</span>
                                        </div>
                                    </td>

                                    {filterType === "daily" && (
                                        <td className={styles.center}>
                                            <h3 className={styles.text}>{student.phone || "-"}</h3>
                                        </td>
                                    )}

                                    {/* === Sabab (faqat daily uchun) === */}
                                    {filterType === "daily" && (
                                        dataToDisplay.map((day, dayIndex)=> renderReasonCell(day, dayIndex, student))
                                    )}


                                    {/* === Har bir sana uchun attendance cell === */}
                                    {dataToDisplay.map((day, dayIndex) => renderAttendanceCell(day, dayIndex, student))}

                                    {/* === Foiz (%) === */}
                                    <td className={styles.percentageCell}>
                                        <span
                                        className={`${styles.percentageBadge} ${styles[getPercentageClass(calculateAttendanceStats(student.studentId))]}`}
                                        >
                                            {student.percent}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            </tbody>
                        </table>
                    </div>

                    {isEditing && (
                        <div className={styles.editingActions}>
                            <span className={styles.editingMessage}>
                                Siz hozir davomat yozuvlarini tahrirlamoqdasiz. O'zgarishlar "Saqlash" tugmasini bosganda saqlanadi.
                            </span>
                            <button onClick={saveChanges} className={styles.saveButton}>
                                <Save size={16}/>
                                Save
                            </button>
                            <button onClick={cancelEditing} className={styles.cancelButton}>
                                <X size={16}/>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>All students</p>
                            <p className={styles.statValue}>{students.length}</p> {/* Use 'students' state */}
                        </div>
                        <div className={`${styles.statIcon} ${styles.blue}`}>
                            <Users size={20}/>
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>Average attendance</p>
                            <p className={`${styles.statValue} ${styles.green}`}>
                                {/* Group Average attendance */}
                                {calculateAverageAttendance(filterType)}%
                            </p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.green}`}/>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>Arrivals on the selected day</p>
                            <p className={`${styles.statValue} ${styles.blue}`}>
                                {presentCount}
                            </p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.blue}`}/>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>Those who did not arrive on the selected day</p>
                            <p className={`${styles.statValue} ${styles.red}`}>
                                {absentCount}
                            </p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.red}`}/>
                    </div>
                </div>
            </div>
        </div>
    )
}