import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./myModal.scss";
import ApiCall from "../../Utils/ApiCall";

const MyModal = ({ isOpen, onClose }) => {
  // Til holatini o'qish va hodisa listener
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("lang") || "UZ"
  );

  useEffect(() => {
    const onLangChange = () => {
      setSelectedLang(localStorage.getItem("lang") || "UZ");
    };
    window.addEventListener("languageChanged", onLangChange);
    return () => window.removeEventListener("languageChanged", onLangChange);
  }, []);

  // Matnlar va joyboshlovchilar
  const translations = {
    UZ: {
      header: "Ma’lumotlaringizni qoldiring!",
      labels: {
        name: "Ism Familiya:",
        phone: "Telefon raqami:",
        telegram: "Telegram username:",
      },
      placeholders: {
        name: "Ismingizni kiriting",
        phone: "Raqamingizni kiriting",
        telegram: "Telegram username",
      },
      buttons: {
        cancel: "Bekor qilish",
        submit: "Yuborish",
      },
    },
    EN: {
      header: "Leave Your Details",
      labels: {
        name: "Full Name:",
        phone: "Phone Number:",
        telegram: "Telegram Username:",
      },
      placeholders: {
        name: "Enter your full name",
        phone: "Enter your phone number",
        telegram: "Enter Telegram username",
      },
      buttons: {
        cancel: "Cancel",
        submit: "Submit",
      },
    },
    RU: {
      header: "Оставьте свои данные",
      labels: {
        name: "ФИО:",
        phone: "Номер телефона:",
        telegram: "Имя пользователя телеграммы:",
      },
      placeholders: {
        name: "Введите ваше полное имя",
        phone: "Введите номер телефона",
        telegram: "Введите Telegram username",
      },
      buttons: {
        cancel: "Отмена",
        submit: "Отправить",
      },
    },
  };

  const { header, labels, placeholders, buttons } = translations[selectedLang];

  const [user, setUser] = useState({
    name: "",
    phone: "",
    telegramUserName: "",
  });

  function postReference() {
    ApiCall("/reference/post", { method: "POST" }, user).then((res) => {
      onClose();
      clearModal();
    });
  }

  function clearModal() {
    setUser({ name: "", phone: "", telegramUserName: "" });
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h1>{header}</h1>

          <div className="inp-container">
            <label htmlFor="fullname">
              <h3>{labels.name}</h3>
              <input
                type="text"
                id="fullname"
                placeholder={placeholders.name}
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </label>
            <label htmlFor="phone">
              <h3>{labels.phone}</h3>
              <input
                type="text"
                id="phone"
                placeholder={placeholders.phone}
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </label>
            <label htmlFor="username">
              <h3>{labels.telegram}</h3>
              <input
                type="text"
                id="username"
                placeholder={placeholders.telegram}
                value={user.telegramUserName}
                onChange={(e) =>
                  setUser({ ...user, telegramUserName: e.target.value })
                }
              />
            </label>
          </div>

          <div className="buttons">
            <button className="btn b-1" onClick={onClose}>
              {buttons.cancel}
            </button>
            <button className="btn b-2" onClick={postReference}>
              {buttons.submit}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MyModal;
