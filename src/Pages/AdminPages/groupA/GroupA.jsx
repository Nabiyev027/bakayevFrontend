import React, { useState } from "react";
import "./groupA.scss";

export default function GroupA() {
  // Guruhlar ro'yxati (har bir guruh uchun nom va o'qituvchi)
  const groups = [
    {
      name: "Group 1",
      teacherId: "Teacher A",
    },
    {
      name: "Group 2",
      teacherId: "Teacher B",
    },
    {
      name: "Group 3",
      teacherId: "Teacher C",
    },
  ];

  // Test ma'lumot sifatida kengaytirilgan studentlar
  const students = [
    {
      id: 1,
      name: "Ali Valiyev",
      age: 20,
      phone: "+998901234567",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      group: "Group 1",
      mark: 85,
      attendance: { present: true, reason: "" },
    },
    {
      id: 2,
      name: "Laylo Karimova",
      age: 19,
      phone: "+998909876543",
      photo: "https://randomuser.me/api/portraits/women/65.jpg",
      group: "Group 2",
      mark: 90,
      attendance: { present: false, reason: "Sog'ligi yomon" },
    },
    {
      id: 3,
      name: "Sardor Eshonov",
      age: 21,
      phone: "+998933215432",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      group: "Group 1",
      mark: 78,
      attendance: { present: true, reason: "" },
    },
    {
      id: 4,
      name: "Dilnoza Tadjibayeva",
      age: 22,
      phone: "+998901112233",
      photo: "https://randomuser.me/api/portraits/women/22.jpg",
      group: "Group 3",
      mark: 88,
      attendance: { present: true, reason: "" },
    },
    {
      id: 5,
      name: "Rustam Rasulov",
      age: 23,
      phone: "+998907654321",
      photo: "https://randomuser.me/api/portraits/men/55.jpg",
      group: "Group 2",
      mark: 82,
      attendance: { present: false, reason: "Kechikdi" },
    },
    {
      id: 6,
      name: "Gulnora Xudoyberganova",
      age: 20,
      phone: "+998908776655",
      photo: "https://randomuser.me/api/portraits/women/12.jpg",
      group: "Group 1",
      mark: 91,
      attendance: { present: true, reason: "" },
    },
    {
      id: 7,
      name: "Javlon Rahimov",
      age: 21,
      phone: "+998909998877",
      photo: "https://randomuser.me/api/portraits/men/77.jpg",
      group: "Group 3",
      mark: 76,
      attendance: { present: false, reason: "Trafik sababli kechikdi" },
    },
  ];

  // Har bir guruhning ochiq/yopiq holatini saqlash (key sifatida guruh nomi)
  const [expanded, setExpanded] = useState({});

  const toggleGroup = (groupName) => {
    setExpanded((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="group-page">
      <h2>Guruhlar</h2>
      <div className="groups-accordion">
        {groups.map((group, idx) => (
          <div key={idx} className="group-item">
            <div
              className="group-header"
              onClick={() => toggleGroup(group.name)}
            >
              <div className="group-info">
                <h3>{group.name}</h3>
                <p>{group.teacherId}</p>
              </div>
              <div className={`arrow ${expanded[group.name] ? "open" : ""}`}>
                &#9660;
              </div>
            </div>
            <div
              className={`group-content ${
                expanded[group.name] ? "expanded" : "collapsed"
              }`}
            >
              <div className="student-list">
                {students
                  .filter((student) => student.group === group.name)
                  .map((student) => (
                    <div key={student.id} className="student-card">
                      <img src={student.photo} alt={student.name} />
                      <div className="student-details">
                        <h4>{student.name}</h4>
                        <p>
                          <strong>Yosh:</strong> {student.age}
                        </p>
                        <p>
                          <strong>Telefon:</strong> {student.phone}
                        </p>
                        <p>
                          <strong>Bahosi:</strong> {student.mark}
                        </p>
                        <p>
                          <strong>Davomat:</strong>{" "}
                          <span
                            className={
                              student.attendance.present ? "present" : "absent"
                            }
                          >
                            {student.attendance.present ? "Bor" : "Yo'q"}
                          </span>
                        </p>
                        {!student.attendance.present &&
                          student.attendance.reason && (
                            <p>
                              <strong>Sabab:</strong>{" "}
                              {student.attendance.reason}
                            </p>
                          )}
                      </div>
                    </div>
                  ))}
                {students.filter((s) => s.group === group.name).length ===
                  0 && (
                  <p className="no-students">
                    Ushbu guruhda student mavjud emas
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
