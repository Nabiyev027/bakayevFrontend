import React, {useEffect, useState} from "react";
import "./PaymentS.scss";
import ApiCall from "../../../Utils/ApiCall";
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";

export default function PaymentS() {

    const [coursePrice, setCoursePrice] = useState(0);

    const [payments, setPayments] = useState([]);
    const userToken = localStorage.getItem("token");
    const userId = jwtDecode(userToken).userId;

    useEffect(() => {
        getCoursePrice()
        getCoursePayments()
    }, []);

    async function getCoursePrice() {
        try {
            const res = await ApiCall(`/payment/coursePrice/${userId}`,{method: "GET"});
            setCoursePrice(res.data);
        } catch (err) {
            const res = err.message || "Info not found";
            toast.error(res);
        }

    }

    async function getCoursePayments() {
        try {
            const res = await ApiCall(`/payment/student/${userId}`,{method: "GET"});
            setPayments(res.data);
        } catch (err) {
            const res = err.message || "Payments not found";
            toast.error(res);
        }

    }


    const formatMonthDay = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = [
            'january', 'february', 'march', 'april',
            'may', 'june', 'july', 'avgust',
            'september', 'october', 'november', 'december'
        ];
        const month = monthNames[date.getMonth()];
        return `${day} ${month}`;
    };


  return (
    <div className="payment-page">
      <h1 className={"section-title"}>My payments</h1>

      {/* Container */}

        <div className={"pay-nav"}>
            <h3>Payment price for you: {coursePrice} so'm </h3>
            <h3>All payments: {payments.length} </h3>
        </div>
      <div className="payment-container">

          <div className="payments-grid">
              {payments.map((payment) => (
                  <div key={payment.id} className="payment-card">
                      <div className="card-header">
                          <h3 className="full-name">{formatMonthDay(payment.paymentDate)}</h3>
                          {payment.paymentStatus}
                      </div>

                      <div className="card-body">
                          <div className="info-row">
                              <span className="label">Umumiy to‘lov:</span>
                              <span className="value amount">{payment.paidAmount}</span>
                          </div>

                          {payment.discountAmount > 0 && (
                              <div className="info-row discount">
                                  <span className="label">Chegirma:</span>
                                  <span className="value">-{payment.discountAmount}</span>
                              </div>
                          )}

                          <div className="info-row">
                              <span className="label">Sana:</span>
                              <span className="value">{payment.paymentDate}</span>
                          </div>
                      </div>

                      <div className="card-footer">
                          <div className="transactions-title">To‘lov usullari:</div>
                          {payment.transactions.map((tx, idx) => (
                              <div key={idx} className="transaction-item">
                <span className="method">
                  {tx.paymentMethod}
                </span>
                                  <span>{tx.paymentDate}</span>
                                  <span className="tx-amount">{tx.paidAmount}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>

      </div>
    </div>
  );
}
