import React, { useState } from "react";
import "./page.module.scss";

import { PaymentForm } from "./components/payment-form"
import { PaymentsList } from "./components/payments-list"
import { CreditCard, DollarSign, GraduationCap } from "lucide-react"
import styles from "./page.module.scss"

export default function Payment() {
    const [activeTab, setActiveTab] = useState("new-payment")


    const [payments, setPayments] = useState([
        {
            id: "1",
            studentName: "Alisher Karimov",
            courseName: "Frontend Development",
            amount: 1500000,
            paymentMethod: "card",
            date: "2024-01-15",
            status: "completed",
        },
        {
            id: "2",
            studentName: "Malika Tosheva",
            courseName: "Backend Development",
            amount: 1800000,
            paymentMethod: "cash",
            date: "2024-01-14",
            status: "completed",
        },
        {
            id: "3",
            studentName: "Bobur Rahimov",
            courseName: "Mobile Development",
            amount: 2000000,
            paymentMethod: "card",
            date: "2024-01-13",
            status: "pending",
        },
    ])

    const addPayment = (payment) => {
        const newPayment = {
            ...payment,
            id: Date.now().toString(),
        }
        setPayments((prev) => [newPayment, ...prev])
    }

    const totalAmount = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

    const todayPayments = payments.filter((p) => {
        const today = new Date().toISOString().split("T")[0]
        return p.date === today && p.status === "completed"
    }).length

  return (
      <div className={styles.paymentPageRec}>

              <div className={styles.wrapper}>
                  {/* Header */}
                  <div className={styles.header}>
                      <div className={styles.headerContent}>
                          <div className={styles.headerIcon}>
                              <GraduationCap className={styles.icon} />
                          </div>
                          <h1 className={styles.title}>Kurs To'lovlari</h1>
                      </div>
                      <p className={styles.subtitle}>Talabalar uchun kurs to'lovlarini boshqarish tizimi</p>
                  </div>

                  {/* Stats Cards */}
                  <div className={styles.statsGrid}>
                      <div className={`${styles.statsCard} ${styles.statsCardGreen}`}>
                          <div className={styles.statsCardContent}>
                              <div className={styles.statsCardInner}>
                                  <div>
                                      <p className={styles.statsLabel}>Jami Tushum</p>
                                      <p className={styles.statsValue}>{totalAmount.toLocaleString()} so'm</p>
                                  </div>
                                  <DollarSign className={styles.statsIcon} />
                              </div>
                          </div>
                      </div>

                      <div className={`${styles.statsCard} ${styles.statsCardBlue}`}>
                          <div className={styles.statsCardContent}>
                              <div className={styles.statsCardInner}>
                                  <div>
                                      <p className={styles.statsLabel}>Bugungi To'lovlar</p>
                                      <p className={styles.statsValue}>{todayPayments}</p>
                                  </div>
                                  <CreditCard className={styles.statsIcon} />
                              </div>
                          </div>
                      </div>

                      <div className={`${styles.statsCard} ${styles.statsCardPurple}`}>
                          <div className={styles.statsCardContent}>
                              <div className={styles.statsCardInner}>
                                  <div>
                                      <p className={styles.statsLabel}>Jami To'lovlar</p>
                                      <p className={styles.statsValue}>{payments.length}</p>
                                  </div>
                                  <GraduationCap className={styles.statsIcon} />
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
                                          Yangi To'lov
                                      </button>
                                      <button
                                          className={`${styles.tabsTrigger} ${activeTab === "payments-list" ? styles.active : ""}`}
                                          onClick={() => setActiveTab("payments-list")}
                                      >
                                          To'lovlar Ro'yxati
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
