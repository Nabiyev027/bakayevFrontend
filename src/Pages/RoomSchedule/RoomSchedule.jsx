import {useEffect, useRef, useState} from "react"
import "./roomSchedule.scss"
import ApiCall from "../../Utils/ApiCall"
import { ToastContainer, toast } from "react-toastify"


const RoomSchedule = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [timeInterval, setTimeInterval] = useState(30)

    const [branches, setBranches] = useState([])
    const [selBranchId, setSelBranchId] = useState("all")
    const [roomsWithData, setRoomsWithData] = useState([])

    const START_HOUR = 6
    const START_MINUTE = 0

    const SNAP_MINUTES = 5;

    const LEFT_OFFSET = 18 // тот же сдвиг что и раньше (+18)
    const BASE_HOUR_WIDTH = 120
    const MIN_SLOT_WIDTH = 70

    const slotWidth = Math.max(
        MIN_SLOT_WIDTH,
        BASE_HOUR_WIDTH * (timeInterval / 60)
    )

    const PIXELS_PER_MINUTE = slotWidth / timeInterval


    useEffect(() => {
        getBranches()
    }, [])

    const getBranches = async () => {
        try {
            const res = await ApiCall("/filial/getAll", { method: "GET" })
            setBranches(res.data || [])
        } catch (err) {
            toast.error(err?.response?.data || "Error")
        }
    }

    useEffect(() => {
        getRoomsData()
    }, [selBranchId, activeTab])

    const getRoomsData = async () => {
        try {
            const res = await ApiCall(
                `/room/info?filialId=${selBranchId}&dayType=${activeTab}`,
                { method: "GET" }
            )
            // ensure groupRoomInfoResDtos exists
            setRoomsWithData((res.data || []).map(r => ({ ...r, groupRoomInfoResDtos: r.groupRoomInfoResDtos || [] })))
        } catch (err) {
            toast.error(err?.response?.data || "Error")
        }
    }

    const saveClassChanges = async (clsId, newRoomId, newStartTime, newEndTime) => {
        try {
            const res = await ApiCall(`/room/updateInfo`, {
                method: "PUT"
            },
            {
                groupId: clsId,
                roomId: newRoomId,
                startTime: newStartTime,
                endTime: newEndTime
            }
            );
            toast.success(res.data);
        } catch (err) {
            toast.error(err?.response?.data || "Error saving changes");
        }
    };



    const getStartMinutes = () => START_HOUR * 60 + START_MINUTE

    const getDetailedTimeSlots = () => {
        const slots = []
        const totalMinutes = 14 * 60

        for (let i = 0; i <= totalMinutes; i += timeInterval) {
            const minutes = getStartMinutes() + i
            const h = Math.floor(minutes / 60)
            const m = minutes % 60

            slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
        }
        return slots
    }

    const calculatePosition = (time) => {
        const [h, m] = time.split(":").map(Number)
        const totalMinutes = h * 60 + m - getStartMinutes()
        return totalMinutes * PIXELS_PER_MINUTE + LEFT_OFFSET
    }

    const calculateWidthByTime = (start, end) => {
        return calculatePosition(end) - calculatePosition(start)
    }

    const isVisibleByDay = (dayType) => {
        if (activeTab === "all") return true
        return dayType === activeTab.toUpperCase()
    }

    const detailedTimeSlots = getDetailedTimeSlots()


    const roomRefs = useRef({}); // id → DOM element

    const leftToTime = (left) => {
        let totalMinutes =
            (left - LEFT_OFFSET) / PIXELS_PER_MINUTE + getStartMinutes();

        // 🔹 5 minutga snap
        totalMinutes =
            Math.round(totalMinutes / SNAP_MINUTES) * SNAP_MINUTES;

        // 🔒 CHEGARALASH
        if (totalMinutes < MIN_TIME_MINUTES) {
            totalMinutes = MIN_TIME_MINUTES;
        }

        if (totalMinutes > MAX_TIME_MINUTES) {
            totalMinutes = MAX_TIME_MINUTES;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };



    const topToRoomId = (clientY) => {
        for (const roomId in roomRefs.current) {
            const el = roomRefs.current[roomId];
            if (!el) continue;

            const rect = el.getBoundingClientRect();
            if (clientY >= rect.top && clientY <= rect.bottom) {
                return roomId;
            }
        }
        return null;
    };


    // State
    const [draggingClass, setDraggingClass] = useState(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [classStartPos, setClassStartPos] = useState({ left: 0, top: 0 });

// Mouse Down
    const handleMouseDown = (e, cls, roomId) => {
        e.preventDefault();
        // use currentTarget to get the actual block element
        const el = e.currentTarget;
        setDraggingClass({ ...cls, origRoomId: roomId });
        setDragStart({ x: e.clientX, y: e.clientY });
        setClassStartPos({ left: el.offsetLeft, top: el.offsetTop });
        // set grabbing style via state (we use draggingClass to mark)
    };

    const handleMouseMove = (e) => {
        if (!draggingClass) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const hoveredRoomId = topToRoomId(e.clientY);

        setRoomsWithData(prev =>
            prev.map(room => ({
                ...room,
                groupRoomInfoResDtos: room.groupRoomInfoResDtos.map(cls => {
                    if (cls.id === draggingClass.id) {
                        return {
                            ...cls,
                            left: classStartPos.left + deltaX,
                            // 🔒 faqat room ustida bo‘lsa top o‘zgaradi
                            top: hoveredRoomId ? classStartPos.top + deltaY : classStartPos.top
                        };
                    }
                    return cls;
                }),
            }))
        );
    };


    const MIN_TIME_MINUTES = 6 * 60;   // 06:00
    const MAX_TIME_MINUTES = 22 * 60;  // 22:00 (xohlasang o‘zgartir)

    const timeToMinutes = (time) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const minutesToTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const handleMouseUp = (e) => {
        if (!draggingClass) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        // 🔹 yangi start (px → time)
        let newStartTime = leftToTime(classStartPos.left + deltaX);

        // 🔹 duration (minutlarda)
        const durationMinutes =
            timeToMinutes(draggingClass.endTime) -
            timeToMinutes(draggingClass.startTime);

        let startMinutes = timeToMinutes(newStartTime);

        // 🔒 START CHEGARASI
        if (startMinutes < MIN_TIME_MINUTES) {
            startMinutes = MIN_TIME_MINUTES;
        }

        // 🔒 END CHEGARASI (duration bilan)
        if (startMinutes + durationMinutes > MAX_TIME_MINUTES) {
            startMinutes = MAX_TIME_MINUTES - durationMinutes;
        }

        const finalStartTime = minutesToTime(startMinutes);
        const finalEndTime = minutesToTime(startMinutes + durationMinutes);

        // // 🔹 qaysi roomga tushdi
        // const newRoomId = topToRoomId(e.clientY) || draggingClass.origRoomId;

        const droppedRoomId = topToRoomId(e.clientY);

        if (!droppedRoomId) {
            setDraggingClass(null);
            return;
        }

        const newRoomId = droppedRoomId;

        setRoomsWithData(prev => {
            // eski roomdan o‘chirish
            let updated = prev.map(room => {
                if (room.id === draggingClass.origRoomId) {
                    return {
                        ...room,
                        groupRoomInfoResDtos: room.groupRoomInfoResDtos.filter(
                            c => c.id !== draggingClass.id
                        )
                    };
                }
                return room;
            });

            // yangi roomga qo‘shish
            updated = updated.map(room => {
                if (room.id === newRoomId) {
                    return {
                        ...room,
                        groupRoomInfoResDtos: [
                            ...room.groupRoomInfoResDtos,
                            {
                                ...draggingClass,
                                roomId: newRoomId,
                                startTime: finalStartTime,
                                endTime: finalEndTime,
                                left: calculatePosition(finalStartTime),
                                top: newRoomId === draggingClass.origRoomId
                                    ? classStartPos.top + deltaY
                                    : 0
                            }
                        ]
                    };
                }
                return room;
            });

            return updated;
        });

        // 🔹 Backendga saqlash
        saveClassChanges(
            draggingClass.id,
            newRoomId,
            finalStartTime,
            finalEndTime
        );

        setDraggingClass(null);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [draggingClass, dragStart, classStartPos]);

    return (
        <div className="schedule-page">
            <ToastContainer />

            {/* HEADER */}
            <div className="schedule-header">
                <div className="tabs">
                    <select
                        className="filial-select"
                        value={selBranchId}
                        onChange={(e) => setSelBranchId(e.target.value)}
                    >
                        <option value="all">Select branch</option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>

                    {["all", "even", "odd"].map((t) => (
                        <button
                            key={t}
                            className={`tab ${activeTab === t ? "active" : ""}`}
                            onClick={() => setActiveTab(t)}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="interval-selector">
                    <label>Time interval:</label>
                    <select
                        value={timeInterval}
                        onChange={(e) => setTimeInterval(Number(e.target.value))}
                    >
                        <option value={15}>15 minute</option>
                        <option value={30}>30 minute</option>
                        <option value={60}>1 hour</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="schedule-content">
                <div className="schedule-table">

                    {/* TIME HEADER */}
                    <div className="time-header-hours">
                        <div className="time-header-label" />

                        <div className="horizontal-scroll">
                            <div className="hours-row">
                                {detailedTimeSlots.map((time, i) => (
                                    <div
                                        key={i}
                                        className="time-label"
                                        style={{ width: slotWidth}}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ROOMS */}
                    <div className="horizontal-scroll">
                        <div className="rooms-container">

                            {roomsWithData.map((room) => (
                                <div
                                    ref={(el) => (roomRefs.current[room.id] = el)}
                                    key={room.id} className="room-row">

                                    <div className="room-label">{room.roomName}</div>

                                    <div className="classes-container">
                                        {room.groupRoomInfoResDtos
                                            ?.filter((c) => isVisibleByDay(c.dayType))
                                            .map((cls) => {
                                                const leftPx = (cls.left != null ? cls.left : calculatePosition(cls.startTime));
                                                const topPx = (cls.top != null ? cls.top : 0);
                                                const widthPx = calculateWidthByTime(cls.startTime, cls.endTime);
                                                const isDragging = draggingClass?.id === cls.id;
                                                return (
                                                    <div
                                                        key={cls.id}
                                                        className={`class-block card-color ${isDragging ? "dragging" : ""}`}
                                                        style={{
                                                            left: `${leftPx}px`,
                                                            top: `${topPx}px`,
                                                            width: `${widthPx}px`,
                                                        }}
                                                        onMouseDown={(e) => handleMouseDown(e, cls, room.id)}
                                                    >
                                                        <div className="block-info">
                                                            <div className="class-time">
                                                                {cls.startTime} – {cls.endTime}
                                                            </div>

                                                            <div className="class-name">
                                                                {cls.groupName}
                                                            </div>
                                                        </div>

                                                        <div className="class-teacher">
                                                            {cls.teacherNameDtos?.map((t) => {
                                                                const [lastName, firstName] = t.name.split(" ");
                                                                return (
                                                                    <div key={t.id}>
                                                                        {lastName}.{firstName?.charAt(0)}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                    </div>
                                                )})}

                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomSchedule;