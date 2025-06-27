import React, { useState, useEffect } from "react";
import "./teachers.scss";
import imgPlaceholder from "../../../Images/HomePageImages/rasm7.png";

function Teachers() {
  // Tilni o'qish va listener
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

  // Tarjimalar va o'qituvchilar ma'lumotlari
  const data = {
    UZ: {
      header: "Bizning O'qituvchilarimiz",
      labels: {
        ball: "IELTS ball",
        certificate: "Sertifikati",
        experience: "Tajribasi",
        pupils: "O'quvchilari",
      },
      teachers: [
        {
          id: 1,
          name: "Nabiyev Abduvali",
          ball: "9.0",
          certificate: "CELTA",
          experience: "10+",
          pupils: "650+",
          img: "http://hybridrecruiters.com/assests/site/uploads/2022/02/hr-1.png",
          text: "O’zbekistanda 8-bo’lib IELTS 9.0 ballni qo’lga kiritganman va bu o’zimga bo’lgan ishonchimni orttirgan...",
        },
        // Boshqa o'qituvchilar…
      ],
    },
    EN: {
      header: "Our Teachers",
      labels: {
        ball: "IELTS Score",
        certificate: "Certificate",
        experience: "Experience",
        pupils: "Students",
      },
      teachers: [
        {
          id: 1,
          name: "Nabiyev Abduvali",
          ball: "9.0",
          certificate: "CELTA",
          experience: "10+ years",
          pupils: "650+",
          img: "http://hybridrecruiters.com/assests/site/uploads/2022/02/hr-1.png",
          text: "I was the 8th in Uzbekistan to achieve an IELTS 9.0, boosting my confidence...",
        },
        // Other teachers...
      ],
    },
    RU: {
      header: "Наши преподаватели",
      labels: {
        ball: "Баллы IELTS",
        certificate: "Сертификат",
        experience: "Опыт",
        pupils: "Студенты",
      },
      teachers: [
        {
          id: 1,
          name: "Nabiyev Abduvali",
          ball: "9.0",
          certificate: "CELTA",
          experience: "10+ лет",
          pupils: "650+",
          img: "http://hybridrecruiters.com/assests/site/uploads/2022/02/hr-1.png",
          text: "Я был 8-м в Узбекистане, кто получил 9.0 IELTS, что повысило мою уверенность...",
        },
        // Другие преподаватели...
      ],
    },
  };

  const { header, labels, teachers: teacherList } = data[selectedLang];

  const [selTeach, setSelTeach] = useState(teacherList[0]);

  return (
    <div className="wrap-teachers">
      <div className="container">
        <div className="header">
          <h1>{header}</h1>
        </div>

        <div className="teachers-covered">
          <div className="wrap-title">
            {teacherList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelTeach(item)}
                className={`title-box ${
                  selTeach.id === item.id ? "active-teach" : ""
                }`}
              >
                <img src={item.img} alt={item.name} />
                <div className="box-t">
                  <h4>{item.name}</h4>
                  <h4>
                    {labels.ball.split(" ")[0]} {item.ball}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <div className="wrap-boxes">
            <div className="img-box">
              <img src={selTeach.img} alt={selTeach.name} />
            </div>
            <div className="text-box">
              <div className="boxes">
                {selTeach.ball && (
                  <div className="mini-box">
                    <h1>{selTeach.ball}</h1>
                    <h3>{labels.ball}</h3>
                  </div>
                )}
                {selTeach.certificate && (
                  <div className="mini-box">
                    <h1>{selTeach.certificate}</h1>
                    <h3>{labels.certificate}</h3>
                  </div>
                )}
                {selTeach.experience && (
                  <div className="mini-box">
                    <h1>{selTeach.experience}</h1>
                    <h3>{labels.experience}</h3>
                  </div>
                )}
                {selTeach.pupils && (
                  <div className="mini-box">
                    <h1>{selTeach.pupils}</h1>
                    <h3>{labels.pupils}</h3>
                  </div>
                )}
              </div>
              <div className="text">
                <p>{selTeach.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teachers;
