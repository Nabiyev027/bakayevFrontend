import { useState } from "react"
import "./comentsA.scss"

const CommentsA = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Alice",
      text: "Great post! Learned a lot.",
      rating: 5,
      date: "2025-04-10",
      status: true, // approved
    },
    {
      id: 2,
      name: "Bob",
      text: "Interesting perspective.",
      rating: 4,
      date: "2025-04-11",
      status: false, // pending
    },
    {
      id: 3,
      name: "Charlie",
      text: "Could use more examples.",
      rating: 3,
      date: "2025-04-12",
      status: true, // approved
    },
    {
      id: 4,
      name: "Dana",
      text: "Loved the visuals!",
      rating: 5,
      date: "2025-04-13",
      status: false, // pending
    },
    {
      id: 5,
      name: "Eve",
      text: "Not sure I agree.",
      rating: 2,
      date: "2025-04-14",
      status: true, // approved
    },
    {
      id: 6,
      name: "Frank",
      text: "Thanks for sharing this information.",
      rating: 4,
      date: "2025-04-15",
      status: false, // pending
    },
  ])

  const handleApprove = (id) => {
    setComments(comments.map((comment) => (comment.id === id ? { ...comment, status: !comment.status } : comment)))
  }

  const handleDelete = (id) => {
    setComments(comments.filter((comment) => comment.id !== id))
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ))
  }

  return (
      <div className="comments-container">
        <h2 className="comments-title">Comments</h2>
        <div className="comments-list">
          {comments.map((comment) => (
              <div key={comment.id} className={`comment-item ${comment.status ? "approved" : "pending"}`}>
                <div className="comment-content">
                  <div className="comment-header">
                    <h4 className="comment-author">{comment.name}</h4>
                    <div className="comment-meta">
                  <span className={`status-badge ${comment.status ? "approved" : "pending"}`}>
                    {comment.status ? "Tasdiqlangan" : "Kutilmoqda"}
                  </span>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-rating">{renderStars(comment.rating)}</div>
                </div>
                <div className="comment-actions">
                  <button
                      className={`approve-btn ${comment.status ? "approved" : "pending"}`}
                      onClick={() => handleApprove(comment.id)}
                  >
                    {comment.status ? "Bekor qilish" : "Tasdiqlash"}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(comment.id)}>
                    ×
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  )
}

export default CommentsA



