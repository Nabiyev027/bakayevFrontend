import React,{useState} from 'react';
import { Calendar, Users, Filter, Download, Edit, Save, X, Plus } from "lucide-react"
import "./AttendanceR.scss"
import styles from "./attendanceR.module.css"

function AttendanceR() {
    const mockGroups = [
        { id: 1, name: "Computer Science - Year 1" },
        { id: 2, name: "Mathematics - Year 2" },
        { id: 3, name: "Physics - Year 3" },
    ]

    const mockStudents = [
        { id: 1, name: "Alice Johnson", rollNo: "CS001", groupId: 1 },
        { id: 2, name: "Bob Smith", rollNo: "CS002", groupId: 1 },
        { id: 3, name: "Charlie Brown", rollNo: "CS003", groupId: 1 },
        { id: 4, name: "Diana Prince", rollNo: "CS004", groupId: 1 },
        { id: 5, name: "Edward Norton", rollNo: "CS005", groupId: 1 },
        { id: 6, name: "Fiona Green", rollNo: "CS006", groupId: 1 },
        { id: 7, name: "George Wilson", rollNo: "CS007", groupId: 1 },
        { id: 8, name: "Hannah Davis", rollNo: "CS008", groupId: 1 },
    ]

// Months in Uzbek
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

// Weekdays in Uzbek
    const weekdays = [
        "Yakshanba", // Sunday
        "Dushanba", // Monday
        "Seshanba", // Tuesday
        "Chorshanba", // Wednesday
        "Payshanba", // Thursday
        "Juma", // Friday
        "Shanba", // Saturday
    ]

// Generate years (current year and previous/next years)
    const generateYears = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let i = currentYear - 2; i <= currentYear + 1; i++) {
            years.push(i)
        }
        return years
    }

// Generate days for selected month/year
    const generateDays = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const days = []
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i)
        }
        return days
    }

// Add a function to generate weeks for a selected month/year after the generateDays function:

    const generateWeeksInMonth = (month, year) => {
        const weeks = []
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        // Find the first Monday of the month (or the first day if it starts on Monday)
        let currentWeek = 1
        const currentDate = new Date(firstDay)

        while (currentDate <= lastDay) {
            const weekStart = new Date(currentDate)
            const weekEnd = new Date(currentDate)
            weekEnd.setDate(weekEnd.getDate() + 6)

            // If week end goes beyond the month, adjust it
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

// Mock attendance data generator
    const generateAttendanceData = (
        filter,
        selectedMonth = null,
        selectedYear = null,
        selectedDay = null,
        selectedWeek = null,
    ) => {
        const dates = []
        const today = new Date()

        if (filter === "daily") {
            if (selectedMonth !== null && selectedYear !== null && selectedDay !== null) {
                // Tanlangan aniq kun
                const targetDate = new Date(selectedYear, selectedMonth, selectedDay)
                dates.push(targetDate.toISOString().split("T")[0])
            } else {
                // Default: bugungi kun
                dates.push(today.toISOString().split("T")[0])
            }
        } else if (filter === "weekly") {
            if (selectedMonth !== null && selectedYear !== null && selectedWeek !== null) {
                // Tanlangan oyning tanlangan haftasi
                const weeksInMonth = generateWeeksInMonth(selectedMonth, selectedYear)
                const selectedWeekData = weeksInMonth.find((week) => week.number === selectedWeek)

                if (selectedWeekData) {
                    // Generate days for the selected week
                    const startDate = selectedWeekData.startDate
                    const endDate = selectedWeekData.endDate

                    for (let day = startDate; day <= endDate; day++) {
                        const date = new Date(selectedYear, selectedMonth, day)
                        const weekdayName = weekdays[date.getDay()]
                        dates.push({
                            date: date.toISOString().split("T")[0],
                            dayNumber: day,
                            weekday: weekdayName,
                            displayText: `${day} (${weekdayName})`,
                        })
                    }
                }
            } else {
                // Default: so'nggi 4 hafta
                for (let i = 3; i >= 0; i--) {
                    const date = new Date(today)
                    date.setDate(date.getDate() - i * 7)
                    dates.push({
                        date: `Hafta ${date.getDate()}/${date.getMonth() + 1}`,
                        dayNumber: date.getDate(),
                        weekday: weekdays[date.getDay()],
                        displayText: `Hafta ${date.getDate()}/${date.getMonth() + 1}`,
                    })
                }
            }
        } else if (filter === "monthly") {
            if (selectedMonth !== null && selectedYear !== null) {
                // Generate all days for the selected month
                const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(selectedYear, selectedMonth, day)
                    dates.push(date.toISOString().split("T")[0])
                }
            } else {
                // Default monthly view (last 6 months)
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(today)
                    date.setMonth(date.getMonth() - i)
                    dates.push(date.toLocaleDateString("en-US", { month: "short", year: "numeric" }))
                }
            }
        }

        return dates.map((dateInfo) => ({
            date: typeof dateInfo === "string" ? dateInfo : dateInfo.date,
            dayNumber: typeof dateInfo === "string" ? null : dateInfo.dayNumber,
            weekday: typeof dateInfo === "string" ? null : dateInfo.weekday,
            displayText: typeof dateInfo === "string" ? dateInfo : dateInfo.displayText,
            attendance: mockStudents.reduce((acc, student) => {
                const status = Math.random() > 0.3 ? "present" : "absent"
                acc[student.id] = {
                    status: status,
                    reason: status === "absent" ? getRandomReason() : null,
                }
                return acc
            }, {}),
        }))
    }

// Kelmagan talabalar uchun sabab ro'yxati
    const absentReasons = ["Kasallik", "Oilaviy sabab", "Transport muammosi", "Boshqa sabab", "Sababsiz"]

    const getRandomReason = () => {
        return absentReasons[Math.floor(Math.random() * absentReasons.length)]
    }

    const [selectedGroup, setSelectedGroup] = useState("1")
    const [filterType, setFilterType] = useState("daily")
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedDay, setSelectedDay] = useState(new Date().getDate())
    // Add selectedWeek state after selectedDay:
    const [selectedWeek, setSelectedWeek] = useState(1)
    const [attendanceData, setAttendanceData] = useState(() => generateAttendanceData("daily"))
    const [isEditing, setIsEditing] = useState(false)
    const [editingData, setEditingData] = useState([])
    const [newDate, setNewDate] = useState("")

    // Update handleFilterChange function:
    const handleFilterChange = (newFilter) => {
        setFilterType(newFilter)
        let newData
        if (newFilter === "daily") {
            newData = generateAttendanceData(newFilter, selectedMonth, selectedYear, selectedDay)
        } else if (newFilter === "weekly") {
            newData = generateAttendanceData(newFilter, selectedMonth, selectedYear, null, selectedWeek)
        } else if (newFilter === "monthly") {
            newData = generateAttendanceData(newFilter, selectedMonth, selectedYear)
        } else {
            newData = generateAttendanceData(newFilter)
        }
        setAttendanceData(newData)
        setEditingData(newData)
        setIsEditing(false)
    }

    // Update handleMonthChange function to reset selectedWeek:
    const handleMonthChange = (month) => {
        const newMonth = Number.parseInt(month)
        setSelectedMonth(newMonth)

        // Kun tanlangan oyga mos kelishini tekshirish
        const daysInNewMonth = new Date(selectedYear, newMonth + 1, 0).getDate()
        if (selectedDay > daysInNewMonth) {
            setSelectedDay(daysInNewMonth)
        }

        // Reset week selection for new month
        setSelectedWeek(1)

        let newData
        if (filterType === "daily") {
            const dayToUse = selectedDay > daysInNewMonth ? daysInNewMonth : selectedDay
            newData = generateAttendanceData(filterType, newMonth, selectedYear, dayToUse)
        } else if (filterType === "weekly") {
            newData = generateAttendanceData(filterType, newMonth, selectedYear, null, 1)
        } else {
            newData = generateAttendanceData(filterType, newMonth, selectedYear)
        }
        setAttendanceData(newData)
        setEditingData(newData)
        setIsEditing(false)
    }

    // Update handleYearChange function to reset selectedWeek:
    const handleYearChange = (year) => {
        const newYear = Number.parseInt(year)
        setSelectedYear(newYear)

        // Kun tanlangan yilga mos kelishini tekshirish (kabisa yili uchun)
        const daysInMonth = new Date(newYear, selectedMonth + 1, 0).getDate()
        if (selectedDay > daysInMonth) {
            setSelectedDay(daysInMonth)
        }

        // Reset week selection for new year
        setSelectedWeek(1)

        let newData
        if (filterType === "daily") {
            const dayToUse = selectedDay > daysInMonth ? daysInMonth : selectedDay
            newData = generateAttendanceData(filterType, selectedMonth, newYear, dayToUse)
        } else if (filterType === "weekly") {
            newData = generateAttendanceData(filterType, selectedMonth, newYear, null, 1)
        } else {
            newData = generateAttendanceData(filterType, selectedMonth, newYear)
        }
        setAttendanceData(newData)
        setEditingData(newData)
        setIsEditing(false)
    }

    const handleDayChange = (day) => {
        const newDay = Number.parseInt(day)
        setSelectedDay(newDay)

        if (filterType === "daily") {
            const newData = generateAttendanceData(filterType, selectedMonth, selectedYear, newDay)
            setAttendanceData(newData)
            setEditingData(newData)
            setIsEditing(false)
        }
    }

    // Add handleWeekChange function after handleDayChange:
    const handleWeekChange = (week) => {
        const newWeek = Number.parseInt(week)
        setSelectedWeek(newWeek)

        if (filterType === "weekly") {
            const newData = generateAttendanceData(filterType, selectedMonth, selectedYear, null, newWeek)
            setAttendanceData(newData)
            setEditingData(newData)
            setIsEditing(false)
        }
    }

    const startEditing = () => {
        setIsEditing(true)
        setEditingData(JSON.parse(JSON.stringify(attendanceData)))
    }

    const cancelEditing = () => {
        setIsEditing(false)
        setEditingData([])
    }

    const saveChanges = () => {
        setAttendanceData(editingData)
        setIsEditing(false)
        setEditingData([])
        console.log("Saving attendance data:", editingData)
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
        mockStudents.forEach((student) => {
            newEditingData[dateIndex].attendance[student.id] = {
                status: status,
                reason: status === "absent" ? "Sababsiz" : null,
            }
        })
        setEditingData(newEditingData)
    }

    const addNewDate = () => {
        if (!newDate) return

        const newAttendanceEntry = {
            date: newDate,
            attendance: mockStudents.reduce((acc, student) => {
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
        const studentAttendance = dataToUse.map((day) => day.attendance[studentId].status)
        const present = studentAttendance.filter((status) => status === "present").length
        const total = studentAttendance.length
        return Math.round((present / total) * 100)
    }

    const getPercentageClass = (percentage) => {
        if (percentage >= 80) return "high"
        if (percentage >= 60) return "medium"
        return "low"
    }

    const selectedGroupName = mockGroups.find((group) => group.id.toString() === selectedGroup)?.name
    const selectedMonthName = months.find((month) => month.value === selectedMonth)?.name
    const dataToDisplay = isEditing ? editingData : attendanceData
    const availableDays = generateDays(selectedMonth, selectedYear)
    // Add availableWeeks variable after availableDays:
    const availableWeeks = generateWeeksInMonth(selectedMonth, selectedYear)

    // Update the getPeriodInfo function:
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

    return (
        <div className={"attendanceR-page"}>
            <h1>Groups Attendance</h1>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1>Talabalar Davomat Jadvali</h1>
                        <p>Talabalar davomatini kuzatish va boshqarish</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            className={`${styles.editButton} ${isEditing ? styles.editing : ""}`}
                            onClick={isEditing ? cancelEditing : startEditing}
                        >
                            {isEditing ? <X size={16} /> : <Edit size={16} />}
                            {isEditing ? "Bekor qilish" : "Tahrirlash"}
                        </button>
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
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    disabled={isEditing}
                                >
                                    {mockGroups.map((group) => (
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
                                {mockStudents.map((student) => (
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
                                                {dataToDisplay.length > 0 && dataToDisplay[0].attendance[student.id].status === "absent" && (
                                                    <>
                                                        {isEditing ? (
                                                            <select
                                                                value={dataToDisplay[0].attendance[student.id].reason || "Sababsiz"}
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
                                {dataToDisplay[0].attendance[student.id].reason || "Sababsiz"}
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
                                                            value={day.attendance[student.id].status}
                                                            onChange={(e) =>
                                                                updateAttendance(
                                                                    dayIndex,
                                                                    student.id,
                                                                    e.target.value,
                                                                    e.target.value === "absent" ? day.attendance[student.id].reason || "Sababsiz" : null,
                                                                )
                                                            }
                                                            className={styles.attendanceSelect}
                                                        >
                                                            <option value="present">Kelgan</option>
                                                            <option value="absent">Kelmagan</option>
                                                        </select>
                                                    ) : (
                                                        <div className={styles.attendanceDisplay}>
                                                            {getAttendanceIcon(day.attendance[student.id])}
                                                            {getAttendanceBadge(day.attendance[student.id])}
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
                                <p className={styles.statValue}>{mockStudents.length}</p>
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
                                    {Math.round(
                                        mockStudents.reduce((acc, student) => acc + calculateAttendanceStats(student.id), 0) /
                                        mockStudents.length,
                                    )}
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
                                    {dataToDisplay.length > 0
                                        ? Object.values(dataToDisplay[dataToDisplay.length - 1].attendance).filter(
                                            (att) => att.status === "present",
                                        ).length
                                        : 0}
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
                                    {dataToDisplay.length > 0
                                        ? Object.values(dataToDisplay[dataToDisplay.length - 1].attendance).filter(
                                            (att) => att.status === "absent",
                                        ).length
                                        : 0}
                                </p>
                            </div>
                            <div className={`${styles.statIcon} ${styles.red}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AttendanceR;