"use client"

import {useEffect, useState} from "react"
import styles from "./attendanceR.module.css"
import { Calendar, Users, Filter, Download, Edit, Save, X, Plus } from "lucide-react"
import "./AttendanceR.scss"
import apiCall from "../../../Utils/ApiCall";



// Months in Uzbek (can remain as it's UI specific)
const months = [
    { value: 0, name: "Yanvar" },
    { value: 1, name: "Fevral" },
    { value: 2, name: "Mart" },
    { value: 3, name: "Aprel" },
    { value: 4, name: "May" },
    { value: 5, name: "Iyun" },
    { value: 6, name: "Iyul" },
    { value: 7, name: "Avgust" },
    { value: 8, name: "Sentabr" },
    { value: 9, name: "Oktabr" },
    { value: 10, name: "Noyabr" },
    { value: 11, name: "Dekabr" },
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
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
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

// Generate weeks for a selected month/year (can remain as it's UI specific)
const generateWeeksInMonth = (month, year) => {
    const weeks = []
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    let currentWeek = 1
    const currentDate = new Date(firstDay)

    while (currentDate <= lastDay) {
        const weekStart = new Date(currentDate)
        const weekEnd = new Date(currentDate)
        weekEnd.setDate(weekEnd.getDate() + 6)

        if (weekEnd > lastDay) {
            weekEnd.setTime(lastDay.getTime())
        }

        weeks.push({
            number: currentWeek,
            label: `${currentWeek}-hafta`,
            startDate: weekStart.getDate(),
            endDate: weekEnd.getDate(),
            fullLabel: `${currentWeek}-hafta (${weekStart.getDate()}-${weekEnd.getDate()})`,
        })

        currentDate.setDate(currentDate.getDate() + 7)
        currentWeek++
    }

    return weeks
}

// Mock attendance data generator and related mock data are removed.
// This data will be fetched from your backend.
// const generateAttendanceData = (...) => { ... }
// const absentReasons = [...]
// const getRandomReason = () => { ... }


export default function AttendanceTable() {
    // Mock data is removed, these would come from your backend.
    const [mockGroups,setMockGroups] = useState([])
    const [mockStudents,setMockStudents] = useState([])
    // State for selected group (will need to be initialized from backend groups)
    const [selectedGroup, setSelectedGroup] = useState(null) // Initialize with null or a default from backend
    const [groups, setGroups] = useState([]) // State to store groups fetched from backend
    const [students, setStudents] = useState([]) // State to store students fetched from backend

    const [filterType, setFilterType] = useState("daily")
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedDay, setSelectedDay] = useState(new Date().getDate())
    const [selectedWeek, setSelectedWeek] = useState(1)

    // attendanceData will now be fetched from the backend based on filters
    const [attendanceData, setAttendanceData] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editingData, setEditingData] = useState([]) // For local changes before saving
    const [newDate, setNewDate] = useState("")

    // Array for absent reasons (can be fetched from backend or hardcoded if static)
    const absentReasons = ["Kasallik", "Oilaviy sabab", "Transport muammosi", "Boshqa sabab", "Sababsiz"]

    // Effect to fetch initial data (groups, students, and initial attendance)
    // This will run once on component mount and whenever filters change.
    // Replace with your actual API calls.
    // Example: Use useEffect to fetch data when selectedGroup, filterType, selectedMonth, etc. change.
    // You'll need to handle loading states and errors.
    // For example:
    useEffect(() => {
        const fetchInitialData = async () => {
            // Fetch groups
            const groupsResponse = await apiCall('/group/getAll',{method: "Get"});
            const groupsData = await groupsResponse.data;
            setGroups(groupsData);
            if (groupsData.length > 0 && selectedGroup === null) {
                setSelectedGroup(groupsData[0].id);
            }

           if(groups.length>0){
               // Fetch students for the selected group
               const studentsResponse = await apiCall(`/group/${selectedGroup}`,{method: "GET"});
               const studentsData = await studentsResponse.data;
               setStudents(studentsData);

               // Fetch attendance data based on current filters
               const attendanceResponse = await fetch(`/attendance/get?group=${selectedGroup}&viewType=${filterType}&year=${selectedYear}&month=${selectedMonth}&day=${selectedDay}`);
               console.log(selectedGroup)
               console.log(selectedYear)
               console.log(selectedDay)
               console.log(selectedMonth)
               const attendanceData = await attendanceResponse.json();
               setAttendanceData(attendanceData);
               setEditingData(attendanceData); // Initialize editing data with fetched data
           }
        };
            fetchInitialData();
    }, [selectedGroup, filterType, selectedMonth, selectedYear, selectedDay, selectedWeek]);

    const handleFilterChange = (newFilter) => {
        setFilterType(newFilter)
        // TODO: Call backend API to fetch attendance data based on newFilter
        // Example: fetchData(selectedGroup, newFilter, selectedMonth, selectedYear, selectedDay, selectedWeek);
        setIsEditing(false) // Exit editing mode when filter changes
    }

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
        setIsEditing(true)
        // Create a deep copy of current attendanceData for editing
        // This ensures changes are only applied when 'Save' is clicked
        setEditingData(JSON.parse(JSON.stringify(attendanceData)))
    }

    const cancelEditing = () => {
        setIsEditing(false)
        setEditingData([]) // Clear editing data
    }

    const saveChanges = async () => {
        // TODO: Send editingData to your backend API to persist changes
        // Example:
        // try {
        //     const response = await fetch('/api/attendance/update', {
        //         method: 'POST', // Or PUT, depending on your API
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(editingData),
        //     });
        //     if (response.ok) {
        //         // If save successful, update the main attendanceData and exit editing mode
        //         setAttendanceData(editingData);
        //         setIsEditing(false);
        //         setEditingData([]);
        //         console.log("Saving attendance data:", editingData);
        //     } else {
        //         console.error("Failed to save changes:", await response.text());
        //         // Handle error, e.g., show an alert to the user
        //     }
        // } catch (error) {
        //     console.error("Error saving changes:", error);
        //     // Handle network or other errors
        // }
    }

    const updateAttendance = (dateIndex, studentId, status, reason = null) => {
        const newEditingData = [...editingData]
        newEditingData[dateIndex].attendance[studentId] = {
            status: status,
            reason: status === "absent" ? reason : null,
        }
        setEditingData(newEditingData)
    }

    const updateReason = (dateIndex, studentId, reason) => {
        const newEditingData = [...editingData]
        if (newEditingData[dateIndex].attendance[studentId].status === "absent") {
            newEditingData[dateIndex].attendance[studentId].reason = reason
            setEditingData(newEditingData)
        }
    }

    const markAllForDate = (dateIndex, status) => {
        const newEditingData = [...editingData]
        // This assumes 'students' state is populated from backend
        students.forEach((student) => {
            newEditingData[dateIndex].attendance[student.id] = {
                status: status,
                reason: status === "absent" ? "Sababsiz" : null, // Default reason
            }
        })
        setEditingData(newEditingData)
    }

    const addNewDate = () => {
        if (!newDate) return

        // TODO: Prepare data to be sent to backend to add a new attendance entry for this date
        // This might involve creating a new entry with default 'present' for all students
        const newAttendanceEntry = {
            date: newDate,
            attendance: students.reduce((acc, student) => { // Use 'students' from backend
                acc[student.id] = {
                    status: "present",
                    reason: null,
                }
                return acc
            }, {}),
        }

        const newData = [...editingData, newAttendanceEntry]
        setEditingData(newData)
        setNewDate("")
        // TODO: You might want to immediately save this new date to backend or wait for general save
        // If immediate save: await fetch('/api/attendance/add-date', { method: 'POST', body: JSON.stringify(newAttendanceEntry) });
    }

    const getAttendanceIcon = (attendanceData) => {
        return <div className={`${styles.statusDot} ${styles[attendanceData.status]}`} />
    }

    const getAttendanceBadge = (attendanceData) => {
        const statusText = attendanceData.status === "present" ? "Kelgan" : "Kelmagan"
        return <span className={`${styles.attendanceBadge} ${styles[attendanceData.status]}`}>{statusText}</span>
    }

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

    // `groups` array will be populated from backend
    const selectedGroupName = groups.find((group) => group.id.toString() === selectedGroup)?.name || "Guruh tanlanmagan"
    const selectedMonthName = months.find((month) => month.value === selectedMonth)?.name
    const dataToDisplay = isEditing ? editingData : attendanceData
    const availableDays = generateDays(selectedMonth, selectedYear)
    const availableWeeks = generateWeeksInMonth(selectedMonth, selectedYear)

    const getPeriodInfo = () => {
        if (filterType === "monthly") {
            return `${selectedMonthName} ${selectedYear} - ${dataToDisplay.length} kun`
        } else if (filterType === "weekly") {
            const weeksInMonth = generateWeeksInMonth(selectedMonth, selectedYear)
            const selectedWeekData = weeksInMonth.find((week) => week.number === selectedWeek)
            return `${selectedMonthName} ${selectedYear}, ${selectedWeekData?.fullLabel || `${selectedWeek}-hafta`} - haftalik ko'rinish`
        } else {
            return `${selectedDay} ${selectedMonthName} ${selectedYear} - kunlik ko'rinish`
        }
    }

    // Helper to calculate total/present/absent students for stats cards
    const getTotalPresentAbsentForSelectedPeriod = () => {
        let presentCount = 0;
        let absentCount = 0;
        const dataForPeriod = dataToDisplay; // This is already filtered by filterType and selected date/week/month

        if (dataForPeriod.length > 0) {
            // For daily view, it's just one day. For weekly/monthly, average over the days shown
            // For stats, we usually want totals for the specific selected period (e.g., this exact day, or average across days in week/month)
            // For simplicity, let's assume the stats cards refer to the *last day loaded in dataToDisplay* if it's a multi-day view (weekly/monthly).
            // A more precise approach would be to calculate averages or sums based on the filter.
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
        return { presentCount, absentCount };
    };

    const { presentCount, absentCount } = getTotalPresentAbsentForSelectedPeriod();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={"white-text"}>Talabalar Davomat Jadvali</h1>
                    <p className={"white-text"}>Talabalar davomatini kuzatish va boshqarish</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        className={`${styles.editButton} ${isEditing ? styles.editing : ""}`}
                        onClick={isEditing ? cancelEditing : startEditing}
                    >
                        {isEditing ? <X size={16} /> : <Edit size={16} />}
                        {isEditing ? "Bekor qilish" : "Tahrirlash"}
                    </button>
                    {/* TODO: Add export functionality here (e.g., export to CSV) */}
                    <button className={styles.exportButton}>
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                        <Filter size={20} />
                        Filtrlar
                    </h2>
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.filtersContainer}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <Users size={16} />
                                Guruhni tanlang
                            </label>
                            <select
                                className={styles.select}
                                value={selectedGroup || ""} // Handle null selectedGroup initially
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                disabled={isEditing || groups.length === 0} // Disable if editing or no groups loaded
                            >
                                <option value="" disabled>Guruhni tanlang</option> {/* Placeholder */}
                                {groups.map((group) => ( // Use 'groups' state
                                    <option key={group.id} value={group.id.toString()}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>
                                <Calendar size={16} />
                                Vaqt davri
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
                                    <Calendar size={16} />
                                    Yil, oy va kunni tanlang
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
                                    <Calendar size={16} />
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
                                    <Calendar size={16} />
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

                    {isEditing && filterType === "daily" && (
                        <div className={styles.dateSelector}>
                            <label>Sana qo'shish:</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className={styles.dateInput}
                            />
                            <button onClick={addNewDate} className={styles.addDateButton}>
                                <Plus size={16} />
                                Qo'shish
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.cardTitle}>
                            Davomat jadvali - {selectedGroupName}
                            {isEditing && <span style={{ color: "#f59e0b", marginLeft: "0.5rem" }}>(Tahrirlash rejimi)</span>}
                        </h2>
                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <div className={`${styles.statusDot} ${styles.present}`} />
                                <span>Kelgan</span>
                            </div>
                            <div className={styles.legendItem}>
                                <div className={`${styles.statusDot} ${styles.absent}`} />
                                <span>Kelmagan</span>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div>
                            <h3 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>Ommaviy amallar:</h3>
                            <div className={styles.bulkActions}>
                                {dataToDisplay.slice(0, 10).map((day, dateIndex) => (
                                    <div key={dateIndex} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ fontSize: "0.75rem", minWidth: "80px" }}>
                                            {filterType === "monthly" ? new Date(day.date).getDate() : day.date}:
                                        </span>
                                        <button
                                            className={`${styles.bulkButton} ${styles.present}`}
                                            onClick={() => markAllForDate(dateIndex, "present")}
                                        >
                                            Hammasi kelgan
                                        </button>
                                        <button
                                            className={`${styles.bulkButton} ${styles.absent}`}
                                            onClick={() => markAllForDate(dateIndex, "absent")}
                                        >
                                            Hammasi kelmagan
                                        </button>
                                    </div>
                                ))}
                                {dataToDisplay.length > 10 && (
                                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
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
                                <th className={styles.stickyColumn}>Talaba</th>
                                <th className={styles.center}>Guruh raqami</th>
                                {filterType === "daily" && <th className={styles.center}>Sabab</th>}
                                {dataToDisplay.map((day, index) => (
                                    <th key={index} className={`${styles.center} ${styles.dateHeader}`}>
                                            <span className={styles.dateType}>
                                                {filterType === "daily" ? "Kun" : filterType === "weekly" ? "Hafta kuni" : "Kun"}
                                            </span>
                                        <span className={styles.dateValue}>
                                                {filterType === "weekly" && day.weekday ? (
                                                    <>
                                                        <div className={styles.weekdayName}>{day.weekday}</div>
                                                        <div className={styles.dayNumber}>{day.dayNumber}</div>
                                                    </>
                                                ) : filterType === "monthly" ? (
                                                    new Date(day.date).getDate()
                                                ) : (
                                                    day.date
                                                )}
                                            </span>
                                    </th>
                                ))}
                                <th className={styles.center}>Davomat %</th>
                            </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                            {/* Ensure 'students' state is populated from backend before rendering */}
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td className={`${styles.studentCell} ${styles.stickyColumn}`}>
                                        <div className={styles.studentInfo}>
                                            <div className={styles.avatar}>
                                                {student.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <span>{student.name}</span>
                                        </div>
                                    </td>
                                    <td className={styles.rollNumber}>{student.rollNo}</td>

                                    {filterType === "daily" && (
                                        <td className={styles.reasonCell}>
                                            {dataToDisplay.length > 0 && dataToDisplay[0].attendance[student.id]?.status === "absent" && (
                                                <>
                                                    {isEditing ? (
                                                        <select
                                                            value={dataToDisplay[0].attendance[student.id]?.reason || "Sababsiz"}
                                                            onChange={(e) => updateReason(0, student.id, e.target.value)}
                                                            className={styles.reasonSelect}
                                                        >
                                                            {absentReasons.map((reason) => (
                                                                <option key={reason} value={reason}>
                                                                    {reason}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className={styles.reasonText}>
                                                                {dataToDisplay[0].attendance[student.id]?.reason || "Sababsiz"}
                                                            </span>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    )}

                                    {dataToDisplay.map((day, dayIndex) => (
                                        <td key={dayIndex} className={`${styles.attendanceCell} ${isEditing ? styles.editingCell : ""}`}>
                                            <div className={styles.attendanceIndicator}>
                                                {isEditing ? (
                                                    <select
                                                        value={day.attendance[student.id]?.status || "present"} // Default to present if status is undefined
                                                        onChange={(e) =>
                                                            updateAttendance(
                                                                dayIndex,
                                                                student.id,
                                                                e.target.value,
                                                                e.target.value === "absent" ? day.attendance[student.id]?.reason || "Sababsiz" : null,
                                                            )
                                                        }
                                                        className={styles.attendanceSelect}
                                                    >
                                                        <option value="present">Kelgan</option>
                                                        <option value="absent">Kelmagan</option>
                                                    </select>
                                                ) : (
                                                    <div className={styles.attendanceDisplay}>
                                                        {day.attendance[student.id] ? getAttendanceIcon(day.attendance[student.id]) : null}
                                                        {day.attendance[student.id] ? getAttendanceBadge(day.attendance[student.id]) : null}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                    <td className={styles.percentageCell}>
                                            <span
                                                className={`${styles.percentageBadge} ${styles[getPercentageClass(calculateAttendanceStats(student.id))]}`}
                                            >
                                                {calculateAttendanceStats(student.id)}%
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
                                <Save size={16} />
                                Saqlash
                            </button>
                            <button onClick={cancelEditing} className={styles.cancelButton}>
                                <X size={16} />
                                Bekor qilish
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>Jami talabalar</p>
                            <p className={styles.statValue}>{students.length}</p> {/* Use 'students' state */}
                        </div>
                        <div className={`${styles.statIcon} ${styles.blue}`}>
                            <Users size={20} />
                        </div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>O'rtacha davomat</p>
                            <p className={`${styles.statValue} ${styles.green}`}>
                                {/* This calculation should reflect the actual loaded attendance for all students */}
                                {students.length > 0
                                    ? Math.round(
                                        students.reduce((acc, student) => acc + calculateAttendanceStats(student.id), 0) /
                                        students.length,
                                    )
                                    : 0}
                                %
                            </p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.green}`} />
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>Tanlangan kunda kelganlar</p>
                            <p className={`${styles.statValue} ${styles.blue}`}>
                                {presentCount}
                            </p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.blue}`} />
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statContent}>
                        <div className={styles.statText}>
                            <p>Tanlangan kunda kelmaganlar</p>
                            <p className={`${styles.statValue} ${styles.red}`}>
                                {absentCount}
                            </p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.red}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}