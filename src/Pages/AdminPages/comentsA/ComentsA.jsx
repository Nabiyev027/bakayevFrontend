// ComentsA.js
import React, { useState } from "react";
import "./comentsA.scss";

const initialComments = [
  {
    id: 1,
    text: "Great post! Learned a lot.",
    user_name: "Alice",
    user_photo: "https://i.pravatar.cc/40?img=1",
    date: "2025-04-10",
    rating: 5,
    status: "",
  },
  {
    id: 2,
    text: "Interesting perspective.",
    user_name: "Bob",
    user_photo: "https://i.pravatar.cc/40?img=2",
    date: "2025-04-11",
    rating: 4,
    status: "",
  },
  {
    id: 3,
    text: "Could use more examples.",
    user_name: "Charlie",
    user_photo: "https://i.pravatar.cc/40?img=3",
    date: "2025-04-12",
    rating: 3,
    status: "",
  },
  {
    id: 4,
    text: "Loved the visuals!",
    user_name: "Dana",
    user_photo: "https://i.pravatar.cc/40?img=4",
    date: "2025-04-13",
    rating: 5,
    status: "",
  },
  {
    id: 5,
    text: "Not sure I agree.",
    user_name: "Eve",
    user_photo: "https://i.pravatar.cc/40?img=5",
    date: "2025-04-14",
    rating: 2,
    status: "",
  },
  {
    id: 6,
    text: "Thanks for sharing.",
    user_name: "Frank",
    user_photo: "https://i.pravatar.cc/40?img=6",
    date: "2025-04-15",
    rating: 4,
    status: "",
  },
  {
    id: 7,
    text: "Helpful and concise.",
    user_name: "Grace",
    user_photo: "https://i.pravatar.cc/40?img=7",
    date: "2025-04-16",
    rating: 5,
    status: "",
  },
  {
    id: 8,
    text: "Where can I find more?",
    user_name: "Heidi",
    user_photo: "https://i.pravatar.cc/40?img=8",
    date: "2025-04-17",
    rating: 3,
    status: "",
  },
  {
    id: 9,
    text: "Well written.",
    user_name: "Ivan",
    user_photo: "https://i.pravatar.cc/40?img=9",
    date: "2025-04-18",
    rating: 4,
    status: "",
  },
  {
    id: 10,
    text: "Needs editing.",
    user_name: "Judy",
    user_photo: "https://i.pravatar.cc/40?img=10",
    date: "2025-04-19",
    rating: 2,
    status: "",
  },
  {
    id: 11,
    text: "Fantastic overview.",
    user_name: "Kyle",
    user_photo: "https://i.pravatar.cc/40?img=11",
    date: "2025-04-20",
    rating: 5,
    status: "",
  },
  {
    id: 12,
    text: "I disagree.",
    user_name: "Laura",
    user_photo: "https://i.pravatar.cc/40?img=12",
    date: "2025-04-21",
    rating: 1,
    status: "",
  },
  {
    id: 13,
    text: "Looking forward to more.",
    user_name: "Mallory",
    user_photo: "https://i.pravatar.cc/40?img=13",
    date: "2025-04-22",
    rating: 4,
    status: "",
  },
];

export default function ComentsA() {
  const [comments, setComments] = useState(initialComments);
  const [showModal, setShowModal] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [closing, setClosing] = useState(false);

  const onDeleteClick = (id) => {
    setPendingId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
      setPendingId(null);
    }, 300);
  };

  const confirmDelete = () => {
    setComments((prev) => prev.filter((c) => c.id !== pendingId));
    closeModal();
  };

  const onConfirmClick = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
    );
  };

  return (
    <div className="coments-page">
      <h1 className="coments-page__header">Comments</h1>

      <div className="coments-page__list">
        {comments.map((c) => (
          <div key={c.id} className="coments-page__item">
            <div className="info">
              <div className="top">
                <span className="name">{c.user_name}</span>
                <span className="date">{c.date}</span>
              </div>
              <p className="text">{c.text}</p>
              <div className="stars">
                {Array(c.rating)
                  .fill()
                  .map((_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                {Array(5 - c.rating)
                  .fill()
                  .map((_, i) => (
                    <span key={i} className="off">
                      &#9733;
                    </span>
                  ))}
              </div>

              {c.status === "approved" ? (
                <span className="confirmed-text">Tasdiqlandi</span>
              ) : (
                <button
                  className="btn confirm"
                  onClick={() => onConfirmClick(c.id)}
                >
                  Tasdiqlash
                </button>
              )}
            </div>

            <button className="delete" onClick={() => onDeleteClick(c.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className={`modal-sheet ${closing ? "exit" : "enter"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete Comment?</h2>
            <p>This action cannot be undone.</p>
            <div className="actions">
              <button className="btn confirm" onClick={confirmDelete}>
                Delete
              </button>
              <button className="btn cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
