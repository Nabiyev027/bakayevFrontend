import {useEffect, useState} from "react"
import "./comentsA.scss"
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../Utils/ApiCall";

const CommentsA = () => {
  const [comments, setComments] = useState([])

  useEffect(() => {
    getComments()
  },[])

  async function getComments() {
    try {
      const res = await ApiCall("/comment", {method: "GET"})
      console.log(res.data)
      setComments(res.data)
    } catch (err) {
      const message =
          err.response?.data || "Xatolik yuz berdi";
      toast.warn(message);
    }
  }


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ))
  }

  async function handleApprove(id) {
    try {
      const res = await ApiCall(`/comment/${id}`, {method: "PUT"})
      toast.success(res.data);
      await getComments();
    } catch (err) {
      const message =
          err.response?.data || "Xatolik yuz berdi";
      toast.warn(message);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await ApiCall(`/comment/${id}`, {method: "DELETE"})
      toast.success(res.data);
      await getComments();
    } catch (err) {
      const message =
          err.response?.data || "Xatolik yuz berdi";
      toast.warn(message);
    }
  }

  return (
      <div className="comments-container">
        <ToastContainer/>
        <h2 className="comments-title">Comments</h2>
        <div className="comments-list">
          {comments&&comments.map((comment) =>
              <div key={comment.id} className={`comment-item ${comment.status ? "approved" : "pending"}`}>
                <div className="comment-content">
                  <div className="comment-header">
                    <h4 className="comment-author">{comment.firstName + " " + comment.lastName}</h4>
                    <div className="comment-meta">
                  <span className={`status-badge ${comment.status ? "approved" : "pending"}`}>
                    {comment.status ? "Tasdiqlangan" : "Kutilmoqda"}
                  </span>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-rating">{renderStars(comment.rate)}</div>
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
          )}
        </div>
      </div>
  )
}

export default CommentsA



