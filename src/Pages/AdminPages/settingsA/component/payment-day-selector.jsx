import { useState } from "react"
import "./payment-day-selector.css"

export default function PaymentDaySelector({ value, onChange, label }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleDaySelect = (day, e) => {
        e.preventDefault()
        onChange(day)        // endi raqam yuboradi
        setIsOpen(false)
    }

    const days = Array.from({ length: 31 }, (_, i) => i + 1)

    return (
        <div className="payment-day-selector">
            <label className="selector-label">
                <h3>{label}</h3>
            </label>

            <div className="selector-container">
                <button
                    className="selector-trigger"
                    onClick={() => setIsOpen((prev) => !prev)}
                    type="button"
                >
                    {value !== null ? `Day ${value}` : "Select day"}
                    <span className={`selector-arrow ${isOpen ? "open" : ""}`}>▼</span>
                </button>

                {isOpen && (
                    <div className="selector-dropdown">
                        <div className="days-grid">
                            {days.map((day) => (
                                <button
                                    key={day}
                                    className={`day-button ${Number(value) === Number(day) ? "selected" : ""}`}
                                    onClick={(e) => handleDaySelect(day, e)}
                                    type="button"
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
