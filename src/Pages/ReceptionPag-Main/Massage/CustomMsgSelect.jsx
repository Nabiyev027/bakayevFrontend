import { useState } from "react";
import "./customMsgSelect.scss";

export default function CustomMsgSelect({ msgTexts = [], onSelect, onAdd, onDelete }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [selected, setSelected] = useState(null);

    const addItem = () => {
        if (!value.trim()) return;
        onAdd(value); // Parentdagi handleAddMsg chaqiriladi
        setValue("");
    };

    const chooseItem = (item) => {
        setSelected(item);
        onSelect?.(item);
        setOpen(false);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation(); // Dropdown yopilib ketmasligi uchun
        if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
            onDelete(id); // Parentdagi handleDeleteMsg chaqiriladi
            if (selected?.id === id) setSelected(null);
        }
    };

    return (
        <div className="msg-select-root">
            <div
                className="msg-select-selected"
                onClick={() => setOpen(!open)}
            >
                {selected ? selected.description : "Select message text"}
                <span className={open ? "open" : ""}>▾</span>
            </div>

            {open && (
                <div className="msg-select-dropdown">
                    {msgTexts.map(item => (
                        <div key={item.id} className="msg-select-item" onClick={() => chooseItem(item)}>
                            <span>{item.description}</span>
                            <button
                                className="del-btn"
                                onClick={(e) => handleDelete(e, item.id)}
                            >
                                🗑
                            </button>
                        </div>
                    ))}

                    <div className="msg-select-add">
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="New text ..."
                        />
                        <button onClick={addItem}>+</button>
                    </div>
                </div>
            )}
        </div>
    );
}