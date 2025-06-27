import React, { useState } from "react";
import "./payment.scss";
import { GrInProgress } from "react-icons/gr";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

export default function Payment_Main() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      studentId: 123,
      totalAmount: 5000,
      paymentDate: "2023-10-01",
      status: "Paid",
      paidAmount: 5000,
      type: "card",
    },
    {
      id: 2,
      studentId: 124,
      totalAmount: 3000,
      paymentDate: "2023-10-02",
      status: "Pending",
      paidAmount: 0,
      type: "cash",
    },
    {
      id: 3,
      studentId: 125,
      totalAmount: 4000,
      paymentDate: "2023-10-03",
      status: "Paid",
      paidAmount: 4000,
      type: "card",
    },
    {
      id: 4,
      studentId: 126,
      totalAmount: 6000,
      paymentDate: "2023-10-04",
      status: "Pending",
      paidAmount: 0,
      type: "cash",
    },
    {
      id: 5,
      studentId: 127,
      totalAmount: 7000,
      paymentDate: "2023-10-05",
      status: "Paid",
      paidAmount: 7000,
      type: "card",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleMethodClick = (method) => {
    if (method === "click") {
      window.location.href = "https://click.uz";
      return;
    }
    setPaymentMethod(method);
  };

  const handlePay = () => {
    if (
      !payerName ||
      !payerPhone ||
      !paymentAmount ||
      (paymentMethod === "card" && !cardNumber)
    ) {
      alert("Please fill all fields");
      return;
    }
    const newPayment = {
      id: payments.length + 1,
      studentId: "--",
      totalAmount: paymentAmount,
      paymentDate: new Date().toISOString().split("T")[0],
      status: "Paid",
      paidAmount: Number(paymentAmount),
      type: paymentMethod,
    };
    setPayments([...payments, newPayment]);
    setShowModal(false);
    setPaymentMethod("");
    setPayerName("");
    setPayerPhone("");
    setPaymentAmount("");
    setCardNumber("");
  };

  return (
    <div className="payment-page">
      <div className="branch-selectP">
        <select id="branch" className="select-box">
          <option value="1">Fillial 1</option>
          <option value="2">Fillial 2</option>
        </select>
      </div>
      <h1>Payments</h1>
      <button className="pay-button" onClick={() => setShowModal(true)}>
        Pay
      </button>

      <div className="payment-container">
        <div className="table-box">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Student Id</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.studentId}</td>
                  <td>{p.totalAmount}</td>
                  <td>{p.paymentDate}</td>
                  <td>
                    {p.status === "Pending" ? (
                      <GrInProgress />
                    ) : (
                      <IoCheckmarkDoneCircle />
                    )}
                  </td>
                  <td>{p.paidAmount}</td>
                  <td>
                    {p.type === "card" ? <FaCreditCard /> : <FaMoneyBillWave />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-box">
          {payments.map((p) => (
            <div className="payment-card" key={p.id}>
              <h3>Payment #{p.id}</h3>
              <p>
                <strong>Student:</strong> {p.studentId}
              </p>
              <p>
                <strong>Amount:</strong> {p.totalAmount} so’m
              </p>
              <p className="status">
                <strong>Status:</strong>{" "}
                {p.status === "Pending" ? (
                  <GrInProgress />
                ) : (
                  <IoCheckmarkDoneCircle />
                )}
              </p>
              <p>
                <strong>Paid:</strong> {p.paidAmount} so’m
              </p>
              <p className="type">
                <strong>Type:</strong>{" "}
                {p.type === "card" ? <FaCreditCard /> : <FaMoneyBillWave />}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-x" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h1>Select Payment Method</h1>

            <a href="https://click.uz/ru" className="click-button">
              <img
                src="https://ictweek.uz/uploads/F5Q8C3029/click-01.png"
                alt=""
              />
            </a>

            <div className="payment-methods">
              <button
                className={paymentMethod === "cash" ? "active" : ""}
                onClick={() => handleMethodClick("cash")}
              >
                Cash
              </button>
              <button
                className={paymentMethod === "card" ? "active" : ""}
                onClick={() => handleMethodClick("card")}
              >
                Card
              </button>
            </div>

            {(paymentMethod === "cash" || paymentMethod === "card") && (
              <div className="payment-form">
                <div className="payment-input">
                  <label>Name</label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                  />
                </div>
                <div className="payment-input">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                  />
                </div>
                {paymentMethod === "card" && (
                  <div className="payment-input">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                )}
                <div className="payment-input">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <button className="pay-button" onClick={handlePay}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
