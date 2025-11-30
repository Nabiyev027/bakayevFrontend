import React, {useEffect, useState} from "react";
import "./page.module.scss";

import { PaymentForm } from "./components/payment-form"
import { PaymentsList } from "./components/payments-list"
import styles from "./page.module.scss"
import ApiCall from "../../../Utils/ApiCall";
import {toast} from "react-toastify";

export default function Payment() {

    const useRole = localStorage.getItem("selectedRole");
    const userId = localStorage.getItem("userId");
    const [paymentYearly, setPaymentYearly] = useState({});
    const [paymentMonthly, setPaymentMonthly] = useState({});
    const [paymentWeekly, setPaymentWeekly] = useState({});
    const [paymentDaily, setPaymentDaily] = useState({});

    useEffect(() => {
        const id = useRole === "ROLE_RECEPTION" ? userId.toString() : "all";
        console.log("Role:", useRole, "Sending ID:", id);

        getPaymentsAmountByFilial(id);
    }, [useRole, userId]);

    async function getPaymentsAmountByFilial(id) {
        try {
            const res = await ApiCall(`/payment/paymentsAmount/${id}`, { method: "GET" });
            setPaymentYearly(res.data[0])
            setPaymentMonthly(res.data[1])
            setPaymentWeekly(res.data[2])
            setPaymentDaily(res.data[3])
        } catch (err) {
            toast.error(err.response?.data || "Error to get paymentAmount info");
        }
    }

    const [activeTab, setActiveTab] = useState("new-payment")


    const addPayment = (payment) => {
        const newPayment = {
            ...payment,
            id: Date.now().toString(),
        }
    }


  return (
      <div className={styles.paymentPageRec}>

              <div className={styles.wrapper}>
                  {/* Header */}
                  <div className={styles.header}>
                      <div className={styles.headerContent}>

                          <h1 className={styles.title}>Students payments</h1>
                      </div>

                  </div>

                  <div className={styles.statsGrid}>
                      <div className={`${styles.statsCard} ${styles.statsCardGreen}`}>
                          <div className={styles.statsCardContent}>
                              <div className={styles.statsCardInner}>
                                  <div>
                                      <p className={styles.statsLabel}>Yearly</p>
                                      <p className={styles.statsValue}>
                                          {/* Bu yerda ma'lumotlar kiritiladi */}
                                          <h4>Count: {paymentYearly.numPayments} </h4>
                                          <h4>Amount: {paymentYearly.paymentAmount} </h4>
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className={`${styles.statsCard} ${styles.statsCardBlue}`}>
                          <div className={styles.statsCardContent}>
                              <div className={styles.statsCardInner}>
                                  <div>
                                      <p className={styles.statsLabel}>Monthly</p>
                                      <p className={styles.statsValue}>
                                          <h4>Count: {paymentMonthly.numPayments} </h4>
                                          <h4>Amount: {paymentMonthly.paymentAmount} </h4>
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className={`${styles.statsCard} ${styles.statsCardPurple}`}>
                          <div className={styles.statsCardContent}>
                              <div className={styles.statsCardInner}>
                                  <div>
                                      <p className={styles.statsLabel}>Weekly</p>
                                      <p className={styles.statsValue}>
                                          <h4>Count: {paymentWeekly.numPayments} </h4>
                                          <h4>Amount: {paymentWeekly.paymentAmount} </h4>
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className={`${styles.statsCard} ${styles.statsCardCyan}`}>
                          <div className={styles.statsCardContent}>
                              <div className={styles.statsCardInner}>
                                  <div>
                                      <p className={styles.statsLabel}>Daily</p>
                                      <p className={styles.statsValue}>
                                          <h4>Count: {paymentDaily.numPayments} </h4>
                                          <h4>Amount: {paymentDaily.paymentAmount} </h4>
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Main Content */}
                  <div className={styles.mainCard}>
                      <div className={styles.mainCardContent}>
                          <div className={styles.tabs}>
                              <div className={styles.tabsHeader}>
                                  <div className={styles.tabsList}>
                                      <button
                                          className={`${styles.tabsTrigger} ${activeTab === "new-payment" ? styles.active : ""}`}
                                          onClick={() => setActiveTab("new-payment")}
                                      >
                                          New Payment
                                      </button>
                                      <button
                                          className={`${styles.tabsTrigger} ${activeTab === "payments-list" ? styles.active : ""}`}
                                          onClick={() => setActiveTab("payments-list")}
                                      >
                                          Payments List
                                      </button>
                                  </div>
                              </div>

                              {activeTab === "new-payment" && (
                                  <div className={styles.tabContent}>
                                      <div className={styles.formWrapper}>
                                          <div className={styles.formHeader}>
                                              <h2 className={styles.formTitle}>Yangi To'lov Qo'shish</h2>
                                              <p className={styles.formSubtitle}>Talaba ma'lumotlarini kiriting va to'lov turini tanlang</p>
                                          </div>
                                          <PaymentForm onAddPayment={addPayment} />
                                      </div>
                                  </div>
                              )}

                              {activeTab === "payments-list" && (
                                  <div className={styles.tabContent}>
                                      <div className={styles.listHeader}>
                                          <h2 className={styles.listTitle}>To'lovlar Tarixi</h2>
                                          <p className={styles.listSubtitle}>Barcha amalga oshirilgan to'lovlarni ko'ring va boshqaring</p>
                                      </div>
                                      <PaymentsList />
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
      </div>
  )
}
