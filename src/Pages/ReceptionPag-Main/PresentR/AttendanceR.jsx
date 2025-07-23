// import React, {useEffect, useState} from 'react';
// import { Calendar, Users, Filter, Download, Edit, Save, X, Plus } from "lucide-react"
// import "./AttendanceR.scss"
// import styles from "./attendanceR.module.css"
// import ApiCall from "../../../Utils/ApiCall";
//
// function AttendanceR() {
//
//     const [selectedDate, setSelectedDate] = useState("");
//     const [selectedViewType, setSelectedViewType] = useState("daily");
//     const [mockGroups, setMockGroups] = useState([]);
//     const [selectedGroup, setSelectedGroup] = useState({})
//     const [mockStudents, setMockStudents] = useState([]);
//
//     useEffect(() => {
//         getGroups()
//     }, []);
//
//     async function getGroups() {
//         try {
//             const res = await ApiCall("/group/getAll", {method: "GET"})
//
//             if (res.data && res.data.length > 0) {
//                 setSelectedGroup(res.data[0]);
//                 setMockGroups(res.data);
//                 getAttendance(res.data[0]);
//             } else {
//                 console.warn("Gruhlar topilmadi");
//             }
//         } catch (err) {
//             console.log(err.message);
//         }
//     }
//
//
//
//     function getAttendance(group) {
//
//         if(selectedViewType === "daily") {
//             const today = new Date();
//             const queryParams = new URLSearchParams({
//                 group: group.id,
//                 viewType: selectedViewType,
//                 year: today.getFullYear(),
//                 month: today.getMonth() + 1,
//                 day: selectedDate === "" ? today.getDate() : new Date(selectedDate).getDate()
//             });
//
//             try {
//                 ApiCall(`/attendance/get?${queryParams.toString()}`, { method: "GET" }).then(res=>{
//                     console.log(res.data);
//
//                     const newMockStudents = res.data.map(attendance => ({
//                         name: attendance.studentFullName,
//                         reason: attendance.cause,
//                         status: attendance.status,
//                     }));
//
//                     setMockStudents(newMockStudents);
//                     setAttendanceData(res.data);
//
//                 });
//
//
//             } catch (err) {
//                 console.error('Xatolik:', err.message);
//             }
//         }else if(selectedViewType === "weekly") {
//
//         }else if(selectedViewType === "monthly") {
//
//         }
//
//     }
//
// // Months in Uzbek
//     const months = [
//         { value: 0, name: "yanvar" },
//         { value: 1, name: "fevral" },
//         { value: 2, name: "mart" },
//         { value: 3, name: "aprel" },
//         { value: 4, name: "may" },
//         { value: 5, name: "iyun" },
//         { value: 6, name: "iyul" },
//         { value: 7, name: "avgust" },
//         { value: 8, name: "sentabr" },
//         { value: 9, name: "oktabr" },
//         { value: 10, name: "noyabr" },
//         { value: 11, name: "dekabr" },
//     ]
//
// // Weekdays in Uzbek
//     const weekdays = [
//         "Yakshanba", // Sunday
//         "Dushanba", // Monday
//         "Seshanba", // Tuesday
//         "Chorshanba", // Wednesday
//         "Payshanba", // Thursday
//         "Juma", // Friday
//         "Shanba", // Saturday
//     ]
//
//
// // Generate days for selected month/year
//     const generateDays = (month, year) => {
//         const daysInMonth = new Date(year, month + 1, 0).getDate()
//         const days = []
//         for (let i = 1; i <= daysInMonth; i++) {
//             days.push(i)
//         }
//         return days
//     }
//
// // Add a function to generate weeks for a selected month/year after the generateDays function:
//
//     const generateWeeksInMonth = (month, year) => {
//         const weeks = []
//         const firstDay = new Date(year, month, 1)
//         const lastDay = new Date(year, month + 1, 0)
//
//         // Find the first Monday of the month (or the first day if it starts on Monday)
//         let currentWeek = 1
//         const currentDate = new Date(firstDay)
//
//         while (currentDate <= lastDay) {
//             const weekStart = new Date(currentDate)
//             const weekEnd = new Date(currentDate)
//             weekEnd.setDate(weekEnd.getDate() + 6)
//
//             // If week end goes beyond the month, adjust it
//             if (weekEnd > lastDay) {
//                 weekEnd.setTime(lastDay.getTime())
//             }
//
//             weeks.push({
//                 number: currentWeek,
//                 label: `${currentWeek}-hafta`,
//                 startDate: weekStart.getDate(),
//                 endDate: weekEnd.getDate(),
//                 fullLabel: `${currentWeek}-hafta (${weekStart.getDate()}-${weekEnd.getDate()})`,
//             })
//
//             currentDate.setDate(currentDate.getDate() + 7)
//             currentWeek++
//         }
//
//         return weeks
//     }
//
//
//
//
// // Kelmagan talabalar uchun sabab ro'yxati
//
//
//     const [filterType, setFilterType] = useState("daily")
//     const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
//     const [selectedDay, setSelectedDay] = useState(new Date().getDate())
//     // Add selectedWeek state after selectedDay:
//     const [selectedWeek, setSelectedWeek] = useState(1)
//     const [attendanceData, setAttendanceData] = useState()
//     const [isEditing, setIsEditing] = useState(false)
//     const [editingData, setEditingData] = useState([])
//     const [newDate, setNewDate] = useState("")
//
//     const addNewDate = async () => {
//         try {
//             const res = await ApiCall(`/attendance/day/${selectedGroup.id}`, {method: "POST"});
//             console.log(res.data);
//         } catch (error) {
//             console.log(error)
//         }
//     }
//
//     // Update handleFilterChange function:
//     const handleFilterChange = (newFilter) => {
//         // setFilterType(newFilter)
//         // let newData
//         // if (newFilter === "daily") {
//         //     newData = generateAttendanceData(newFilter, selectedMonth, selectedYear, selectedDay)
//         // } else if (newFilter === "weekly") {
//         //     newData = generateAttendanceData(newFilter, selectedMonth, selectedYear, null, selectedWeek)
//         // } else if (newFilter === "monthly") {
//         //     newData = generateAttendanceData(newFilter, selectedMonth, selectedYear)
//         // } else {
//         //     newData = generateAttendanceData(newFilter)
//         // }
//         // setAttendanceData(newData)
//         // setEditingData(newData)
//         // setIsEditing(false)
//     }
//
//     // Update handleMonthChange function to reset selectedWeek:
//     const handleMonthChange = (month) => {
//         const newMonth = Number.parseInt(month)
//         setSelectedMonth(newMonth)
//
//         // Kun tanlangan oyga mos kelishini tekshirish
//         const daysInNewMonth = new Date(selectedYear, newMonth + 1, 0).getDate()
//         if (selectedDay > daysInNewMonth) {
//             setSelectedDay(daysInNewMonth)
//         }
//
//         // Reset week selection for new month
//         setSelectedWeek(1)
//
//         let newData
//         if (filterType === "daily") {
//             const dayToUse = selectedDay > daysInNewMonth ? daysInNewMonth : selectedDay
//             newData = generateAttendanceData(filterType, newMonth, selectedYear, dayToUse)
//         } else if (filterType === "weekly") {
//             newData = generateAttendanceData(filterType, newMonth, selectedYear, null, 1)
//         } else {
//             newData = generateAttendanceData(filterType, newMonth, selectedYear)
//         }
//         setAttendanceData(newData)
//         setEditingData(newData)
//         setIsEditing(false)
//     }
//
//     // Update handleYearChange function to reset selectedWeek:
//     const handleYearChange = (year) => {
//         // const newYear = Number.parseInt(year)
//         // setSelectedYear(newYear)
//         //
//         // // Kun tanlangan yilga mos kelishini tekshirish (kabisa yili uchun)
//         // const daysInMonth = new Date(newYear, selectedMonth + 1, 0).getDate()
//         // if (selectedDay > daysInMonth) {
//         //     setSelectedDay(daysInMonth)
//         // }
//         //
//         // // Reset week selection for new year
//         // setSelectedWeek(1)
//         //
//         // let newData
//         // if (filterType === "daily") {
//         //     const dayToUse = selectedDay > daysInMonth ? daysInMonth : selectedDay
//         //     newData = generateAttendanceData(filterType, selectedMonth, newYear, dayToUse)
//         // } else if (filterType === "weekly") {
//         //     newData = generateAttendanceData(filterType, selectedMonth, newYear, null, 1)
//         // } else {
//         //     newData = generateAttendanceData(filterType, selectedMonth, newYear)
//         // }
//         // setAttendanceData(newData)
//         // setEditingData(newData)
//         // setIsEditing(false)
//     }
//
//     const handleDayChange = (day) => {
//         // const newDay = Number.parseInt(day)
//         // setSelectedDay(newDay)
//         //
//         // if (filterType === "daily") {
//         //     const newData = generateAttendanceData(filterType, selectedMonth, selectedYear, newDay)
//         //     setAttendanceData(newData)
//         //     setEditingData(newData)
//         //     setIsEditing(false)
//         // }
//     }
//
//     // Add handleWeekChange function after handleDayChange:
//     const handleWeekChange = (week) => {
//         // const newWeek = Number.parseInt(week)
//         // setSelectedWeek(newWeek)
//         //
//         // if (filterType === "weekly") {
//         //     const newData = generateAttendanceData(filterType, selectedMonth, selectedYear, null, newWeek)
//         //     setAttendanceData(newData)
//         //     setEditingData(newData)
//         //     setIsEditing(false)
//         // }
//     }
//
//     const startEditing = () => {
//         setIsEditing(true)
//         setEditingData(JSON.parse(JSON.stringify(attendanceData)))
//     }
//
//     const cancelEditing = () => {
//         setIsEditing(false)
//         setEditingData([])
//     }
//
//     const saveChanges = () => {
//         setAttendanceData(editingData)
//         setIsEditing(false)
//         setEditingData([])
//         console.log("Saving attendance data:", editingData)
//     }
//
//     const updateAttendance = (dateIndex, studentId, status, reason = null) => {
//         // const newEditingData = [...editingData]
//         // newEditingData[dateIndex].attendance[studentId] = {
//         //     status: status,
//         //     reason: status === "absent" ? reason : null,
//         // }
//         // setEditingData(newEditingData)
//     }
//
//     const updateReason = (dateIndex, studentId, reason) => {
//         // const newEditingData = [...editingData]
//         // if (newEditingData[dateIndex].attendance[studentId].status === "absent") {
//         //     newEditingData[dateIndex].attendance[studentId].reason = reason
//         //     setEditingData(newEditingData)
//         // }
//     }
//
//     const markAllForDate = (dateIndex, status) => {
//         // const newEditingData = [...editingData]
//         // mockStudents.forEach((student) => {
//         //     newEditingData[dateIndex] = {
//         //         status: status,
//         //         reason: status === "absent" ? "Sababsiz" : null,
//         //     }
//         // })
//         // setEditingData(newEditingData)
//     }
//
//
//
//     const getAttendanceIcon = (attendanceData) => {
//         return <div className={`${styles.statusDot} ${styles[attendanceData.status]}`} />
//     }
//
//     const getAttendanceBadge = (attendanceData) => {
//         const statusText = attendanceData.status === true ? "Kelgan" : "Kelmagan"
//         return <span className={`${styles.attendanceBadge} ${styles[attendanceData.status]}`}>{statusText}</span>
//     }
//
//     const calculateAttendanceStats = (studentId) => {
//         const dataToUse = isEditing ? editingData : attendanceData
//         const studentAttendance = dataToUse.map((day) => day.status)
//         const present = studentAttendance.filter((status) => status === true).length
//         const total = studentAttendance.length
//         return Math.round((present / total) * 100)
//     }
//
//     const getPercentageClass = (percentage) => {
//         if (percentage >= 80) return "high"
//         if (percentage >= 60) return "medium"
//         return "low"
//     }
//
//     const selectedGroupName = mockGroups.find((group) => group.id.toString() === selectedGroup)?.name
//     const selectedMonthName = months.find((month) => month.value === selectedMonth)?.name
//     const dataToDisplay = isEditing ? editingData : attendanceData
//     const availableDays = generateDays(selectedMonth, selectedYear)
//     // Add availableWeeks variable after availableDays:
//     const availableWeeks = generateWeeksInMonth(selectedMonth, selectedYear)
//
//     // Update the getPeriodInfo function:
//     const getPeriodInfo = () => {
//         if (filterType === "monthly") {
//             return `${selectedMonthName} ${selectedYear} - ${dataToDisplay.length} kun`
//         } else if (filterType === "weekly") {
//             const weeksInMonth = generateWeeksInMonth(selectedMonth, selectedYear)
//             const selectedWeekData = weeksInMonth.find((week) => week.number === selectedWeek)
//             return `${selectedMonthName} ${selectedYear}, ${selectedWeekData?.fullLabel || `${selectedWeek}-hafta`} - haftalik ko'rinish`
//         } else {
//             return `${selectedDay} ${selectedMonthName} ${selectedYear} - kunlik ko'rinish`
//         }
//     }
//
//     return (
//         <div className={"attendanceR-page"}>
//             <h1>Groups Attendance</h1>
//             <div className={styles.container}>
//                 <div className={styles.header}>
//                     <div className={styles.headerContent}>
//                         <h1>Talabalar Davomat Jadvali</h1>
//                         <p>Talabalar davomatini kuzatish va boshqarish</p>
//                     </div>
//                     <div style={{ display: "flex", gap: "0.5rem" }}>
//                         <button onClick={addNewDate} className={styles.addDateButton} >
//                             Add newDate
//                         </button>
//                         <button
//                             className={`${styles.editButton} ${isEditing ? styles.editing : ""}`}
//                             onClick={isEditing ? cancelEditing : startEditing}
//                         >
//                             {isEditing ? <X size={16} /> : <Edit size={16} />}
//                             {isEditing ? "Bekor qilish" : "Tahrirlash"}
//                         </button>
//                         <button className={styles.exportButton}>
//                             <Download size={16} />
//                             Export
//                         </button>
//                     </div>
//                 </div>
//
//                 <div className={styles.card}>
//                     <div className={styles.cardHeader}>
//                         <h2 className={styles.cardTitle}>
//                             <Filter size={20} />
//                             Filtrlar
//                         </h2>
//                     </div>
//                     <div className={styles.cardContent}>
//                         <div className={styles.filtersContainer}>
//                             <div className={styles.filterGroup}>
//                                 <label className={styles.filterLabel}>
//                                     <Users size={16} />
//                                     Guruhni tanlang
//                                 </label>
//                                 <select
//                                     className={styles.select}
//                                     value={selectedGroup}
//                                     onChange={(e) => setSelectedGroup(e.target.value)}
//                                     disabled={isEditing}
//                                 >
//                                     {mockGroups.map((group) => (
//                                         <option key={group.id} value={group.id.toString()}>
//                                             {group.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//
//                             <div className={styles.filterGroup}>
//                                 <label className={styles.filterLabel}>
//                                     <Calendar size={16} />
//                                     Vaqt davri
//                                 </label>
//                                 <select
//                                     className={styles.select}
//                                     value={filterType}
//                                     onChange={(e) => handleFilterChange(e.target.value)}
//                                     disabled={isEditing}
//                                 >
//                                     <option value="daily">Kunlik ko'rinish</option>
//                                     <option value="weekly">Haftalik ko'rinish</option>
//                                     <option value="monthly">Oylik ko'rinish</option>
//                                 </select>
//                             </div>
//
//                             {filterType === "daily" && (
//                                 <div className={styles.filterGroup}>
//                                     <label className={styles.filterLabel}>
//                                         <Calendar size={16} />
//                                         Yil, oy va kunni tanlang
//                                     </label>
//                                     <div className={styles.dateSelector}>
//                                         <select
//                                             className={styles.yearSelect}
//                                             value={selectedYear}
//                                             onChange={(e) => handleYearChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {generateYears().map((year) => (
//                                                 <option key={year} value={year}>
//                                                     {year}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <select
//                                             className={styles.monthSelect}
//                                             value={selectedMonth}
//                                             onChange={(e) => handleMonthChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {months.map((month) => (
//                                                 <option key={month.value} value={month.value}>
//                                                     {month.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <select
//                                             className={styles.daySelect}
//                                             value={selectedDay}
//                                             onChange={(e) => handleDayChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {availableDays.map((day) => (
//                                                 <option key={day} value={day}>
//                                                     {day}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                             )}
//
//                             {filterType === "weekly" && (
//                                 <div className={styles.filterGroup}>
//                                     <label className={styles.filterLabel}>
//                                         <Calendar size={16} />
//                                         Yil, oy va haftani tanlang
//                                     </label>
//                                     <div className={styles.weekSelector}>
//                                         <select
//                                             className={styles.yearSelect}
//                                             value={selectedYear}
//                                             onChange={(e) => handleYearChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {generateYears().map((year) => (
//                                                 <option key={year} value={year}>
//                                                     {year}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <select
//                                             className={styles.monthSelect}
//                                             value={selectedMonth}
//                                             onChange={(e) => handleMonthChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {months.map((month) => (
//                                                 <option key={month.value} value={month.value}>
//                                                     {month.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <select
//                                             className={styles.weekSelect}
//                                             value={selectedWeek}
//                                             onChange={(e) => handleWeekChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {generateWeeksInMonth(selectedMonth, selectedYear).map((week) => (
//                                                 <option key={week.number} value={week.number}>
//                                                     {week.fullLabel}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                             )}
//
//                             {filterType === "monthly" && (
//                                 <div className={styles.filterGroup}>
//                                     <label className={styles.filterLabel}>
//                                         <Calendar size={16} />
//                                         Oy va yilni tanlang
//                                     </label>
//                                     <div className={styles.monthYearSelector}>
//                                         <select
//                                             className={styles.monthSelect}
//                                             value={selectedMonth}
//                                             onChange={(e) => handleMonthChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {months.map((month) => (
//                                                 <option key={month.value} value={month.value}>
//                                                     {month.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <select
//                                             className={styles.yearSelect}
//                                             value={selectedYear}
//                                             onChange={(e) => handleYearChange(e.target.value)}
//                                             disabled={isEditing}
//                                         >
//                                             {generateYears().map((year) => (
//                                                 <option key={year} value={year}>
//                                                     {year}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//
//                         <div className={styles.selectedPeriodInfo}>
//                             <h4 className={styles.periodTitle}>Tanlangan davr:</h4>
//                             <p className={styles.periodDetails}>{getPeriodInfo()}</p>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className={styles.card}>
//                     <div className={styles.cardHeader}>
//                         <div className={styles.tableHeader}>
//                             <h2 className={styles.cardTitle}>
//                                 Davomat jadvali - {selectedGroupName}
//                                 {isEditing && <span style={{ color: "#f59e0b", marginLeft: "0.5rem" }}>(Tahrirlash rejimi)</span>}
//                             </h2>
//                             <div className={styles.legend}>
//                                 <div className={styles.legendItem}>
//                                     <div className={`${styles.statusDot} ${styles.present}`} />
//                                     <span>Kelgan</span>
//                                 </div>
//                                 <div className={styles.legendItem}>
//                                     <div className={`${styles.statusDot} ${styles.absent}`} />
//                                     <span>Kelmagan</span>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {isEditing && (
//                             <div>
//                                 <h3 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem" }}>Ommaviy amallar:</h3>
//                                 <div className={styles.bulkActions}>
//                                     {dataToDisplay.slice(0, 10).map((day, dateIndex) => (
//                                         <div key={dateIndex} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                     <span style={{ fontSize: "0.75rem", minWidth: "80px" }}>
//                       {filterType === "monthly" ? new Date(day.date).getDate() : day.date}:
//                     </span>
//                                             <button
//                                                 className={`${styles.bulkButton} ${styles.present}`}
//                                                 onClick={() => markAllForDate(dateIndex, true)}
//                                             >
//                                                 Hammasi kelgan
//                                             </button>
//                                             <button
//                                                 className={`${styles.bulkButton} ${styles.absent}`}
//                                                 onClick={() => markAllForDate(dateIndex, false)}
//                                             >
//                                                 Hammasi kelmagan
//                                             </button>
//                                         </div>
//                                     ))}
//                                     {dataToDisplay.length > 10 && (
//                                         <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
//                                             ... va yana {dataToDisplay.length - 10} ta kun
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className={styles.cardContent}>
//                         <div className={styles.tableContainer}>
//                             <table className={styles.table}>
//                                 <thead className={styles.tableHead}>
//                                 <tr>
//                                     <th className={styles.stickyColumn}>Talaba</th>
//                                     {filterType === "daily" && <th className={styles.center}>Sabab</th>}
//                                     {dataToDisplay.map((day, index) => (
//                                         <th key={index} className={`${styles.center} ${styles.dateHeader}`}>
//                       <span className={styles.dateType}>
//                         {filterType === "daily" ? "Kun" : filterType === "weekly" ? "Hafta kuni" : "Kun"}
//                       </span>
//                                             <span className={styles.dateValue}>
//                         {filterType === "weekly" && day.weekday ? (
//                             <>
//                                 <div className={styles.weekdayName}>{day.weekday}</div>
//                                 <div className={styles.dayNumber}>{day.dayNumber}</div>
//                             </>
//                         ) : filterType === "monthly" ? (
//                             new Date(day.date).getDate()
//                         ) : (
//                             day.date
//                         )}
//                       </span>
//                                         </th>
//                                     ))}
//                                     <th className={styles.center}>Davomat %</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody className={styles.tableBody}>
//                                 {mockStudents.map((student,index) => (
//                                     <tr key={student.id}>
//                                         <td className={`${styles.studentCell} ${styles.stickyColumn}`}>
//                                             <div className={styles.studentInfo}>
//                                                 <div className={styles.avatar}>
//                                                     {student.name
//                                                         .split(" ")
//                                                         .map((n) => n[0])
//                                                         .join("")}
//                                                 </div>
//                                                 <span>{student.name}</span>
//                                             </div>
//                                         </td>
//
//                                         {filterType === "daily" && (
//                                             <td className={styles.reasonCell}>
//                                                 {dataToDisplay.length > 0 && dataToDisplay[index].status === true && (
//                                                     <>
//                                                         {isEditing ? (
//                                                             <select
//                                                                 value={dataToDisplay[index].reason || "Sababsiz"}
//                                                                 onChange={(e) => updateReason(0, student.id, e.target.value)}
//                                                                 className={styles.reasonSelect}
//                                                             >
//                                                                 {absentReasons.map((reason) => (
//                                                                     <option key={reason} value={reason}>
//                                                                         {reason}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         ) : (
//                                                             <span className={styles.reasonText}>
//                                 {dataToDisplay[index].reason || "Sababsiz"}
//                               </span>
//                                                         )}
//                                                     </>
//                                                 )}
//                                             </td>
//                                         )}
//
//                                         {dataToDisplay.map((day, dayIndex) => (
//                                             <td key={dayIndex} className={`${styles.attendanceCell} ${isEditing ? styles.editingCell : ""}`}>
//                                                 <div className={styles.attendanceIndicator}>
//                                                     {isEditing ? (
//                                                         <select
//                                                             value={day.status}
//                                                             onChange={(e) =>
//                                                                 updateAttendance(
//                                                                     dayIndex,
//                                                                     student.id,
//                                                                     e.target.value,
//                                                                     e.target.value === false ? day.reason || "Sababsiz" : null,
//                                                                 )
//                                                             }
//                                                             className={styles.attendanceSelect}
//                                                         >
//                                                             <option value={true}>Kelgan</option>
//                                                             <option value={false}>Kelmagan</option>
//                                                         </select>
//                                                     ) : (
//                                                         <div className={styles.attendanceDisplay}>
//                                                             {getAttendanceIcon(index)}
//                                                             {getAttendanceBadge(index)}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         ))}
//                                         <td className={styles.percentageCell}>
//                       <span
//                           className={`${styles.percentageBadge} ${styles[getPercentageClass(calculateAttendanceStats(student.id))]}`}
//                       >
//                         {dataToDisplay[index].percent+"%"}
//                       </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//
//                         {isEditing && (
//                             <div className={styles.editingActions}>
//               <span className={styles.editingMessage}>
//                 Siz hozir davomat yozuvlarini tahrirlamoqdasiz. O'zgarishlar "Saqlash" tugmasini bosganda saqlanadi.
//               </span>
//                                 <button onClick={saveChanges} className={styles.saveButton}>
//                                     <Save size={16} />
//                                     Saqlash
//                                 </button>
//                                 <button onClick={cancelEditing} className={styles.cancelButton}>
//                                     <X size={16} />
//                                     Bekor qilish
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className={styles.statsGrid}>
//                     <div className={styles.statCard}>
//                         <div className={styles.statContent}>
//                             <div className={styles.statText}>
//                                 <p>Jami talabalar</p>
//                                 <p className={styles.statValue}>{mockStudents.length}</p>
//                             </div>
//                             <div className={`${styles.statIcon} ${styles.blue}`}>
//                                 <Users size={20} />
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className={styles.statCard}>
//                         <div className={styles.statContent}>
//                             <div className={styles.statText}>
//                                 <p>O'rtacha davomat</p>
//                                 <p className={`${styles.statValue} ${styles.green}`}>
//                                     {Math.round(
//                                         mockStudents.reduce((acc, student) => acc + calculateAttendanceStats(student.id), 0) /
//                                         mockStudents.length,
//                                     )}
//                                     %
//                                 </p>
//                             </div>
//                             <div className={`${styles.statIcon} ${styles.green}`} />
//                         </div>
//                     </div>
//
//                     <div className={styles.statCard}>
//                         <div className={styles.statContent}>
//                             <div className={styles.statText}>
//                                 <p>Tanlangan kunda kelganlar</p>
//                                 <p className={`${styles.statValue} ${styles.blue}`}>
//                                     {dataToDisplay.length > 0
//                                         ? Object.values(dataToDisplay).filter(
//                                             (att) => att.status === true,
//                                         ).length
//                                         : 0}
//                                 </p>
//                             </div>
//                             <div className={`${styles.statIcon} ${styles.blue}`} />
//                         </div>
//                     </div>
//
//                     <div className={styles.statCard}>
//                         <div className={styles.statContent}>
//                             <div className={styles.statText}>
//                                 <p>Tanlangan kunda kelmaganlar</p>
//                                 <p className={`${styles.statValue} ${styles.red}`}>
//                                     {dataToDisplay.length > 0
//                                         ? Object.values(dataToDisplay).filter(
//                                             (att) => att.status === false,
//                                         ).length
//                                         : 0}
//                                 </p>
//                             </div>
//                             <div className={`${styles.statIcon} ${styles.red}`} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default AttendanceR;