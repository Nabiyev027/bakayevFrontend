import React, { useState } from "react";
import "./PaymentS.scss";
import { FaCreditCard } from "react-icons/fa";

export default function PaymentS() {

  const courseFee = 900000;

  const [paymentHistory] = useState([
    { month: "January", status: "paid", amount: courseFee },
    { month: "February", status: "paid", amount: courseFee },
    { month: "March", status: "unpaid", amount: courseFee },
    { month: "April", status: "unpaid", amount: courseFee },
  ]);

  const currentMonth = "March";
  const nextMonth = "April";

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="payment-page">
      <h1>Payment</h1>

      {/* PAY Button */}
      <button className="pay-btn" onClick={() => setIsModalOpen(true)}>
        Pay
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <h2>Enter Card Info</h2>
            <div className="card-drawing">
              <FaCreditCard size={30} />
              <p>8600 1234 5678 9101</p> {/* Direktor kartasi */}
            </div>
            <a href="https://click.uz/" className="go-click-btn">
              <img
                src="https://ictweek.uz/uploads/F5Q8C3029/click-01.png"
                alt="Click Logo"
                className="click-icon"
              />
              Go Click
            </a>
          </div>
        </div>
      )}

      {/* Container */}
      <div className="payment-container">
        {/* Payment History Box */}
        <div className="payment-box">
          <h2>Payment History</h2>
          <div className="history-list">
            {paymentHistory.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-item-header">
                  <span className="month">{item.month}</span>
                  {item.month === currentMonth && (
                    <span className="badge current">Current</span>
                  )}
                  {item.month === nextMonth && (
                    <span className="badge next">Next</span>
                  )}
                </div>
                <div className="history-item-body">
                  <span className={`status ${item.status}`}>{item.status}</span>
                  <span className="amount">
                    {item.amount.toLocaleString()} sum
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
