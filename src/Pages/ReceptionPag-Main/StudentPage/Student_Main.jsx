import React, { useState } from "react";
import "./student.scss";

function Student_Main() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ali Valiyev",
      age: 20,
      phone: "+998901234567",
      password: "ali123",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      group: "Group 1",
    },
    {
      id: 2,
      name: "Laylo Karimova",
      age: 19,
      phone: "+998909876543",
      password: "laylo321",
      photo: "https://randomuser.me/api/portraits/women/65.jpg",
      group: "Group 2",
    },
    {
      id: 3,
      name: "Sardor Eshonov",
      age: 21,
      phone: "+998933215432",
      password: "sardor456",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      group: "Group 1",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});
  const [infoStudent, setInfoStudent] = useState(null);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleGroupFilter = (e) => setSelectedGroup(e.target.value);
  const handleEdit = (id) => {
    const s = students.find((x) => x.id === id);
    setEditingId(id);
    setEditedStudent({ ...s });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    setStudents((prev) =>
      prev.map((s) => (s.id === editingId ? editedStudent : s))
    );
    setEditingId(null);
    setEditedStudent({});
  };
  const handleCancel = () => {
    setEditingId(null);
    setEditedStudent({});
  };
  const handleDelete = (id) =>
    setStudents((prev) => prev.filter((s) => s.id !== id));
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm) &&
      (selectedGroup ? s.group === selectedGroup : true)
  );

  return (
    <div className="student-page">
      <div className="student-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          onChange={handleSearch}
        />
        <h2>Students</h2>
        <div className="branch-select">
          <select id="branch" className="select-box">
            <option value="1">Fillial 1</option>
            <option value="2">Fillial 2</option>
          </select>
        </div>
        <select className="group-select" onChange={handleGroupFilter}>
          <option value="">All Groups</option>
          <option value="Group 1">Group 1</option>
          <option value="Group 2">Group 2</option>
        </select>
      </div>

      <div className="table-boxx">
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Group</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((st) => (
              <tr key={st.id}>
                <td>{st.id}</td>
                <td>
                  <img src={st.photo} alt={st.name} />
                </td>
                <td>
                  {editingId === st.id ? (
                    <input
                      name="name"
                      value={editedStudent.name}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    st.name
                  )}
                </td>
                <td>
                  {editingId === st.id ? (
                    <input
                      name="age"
                      type="number"
                      value={editedStudent.age}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    st.age
                  )}
                </td>
                <td>
                  {editingId === st.id ? (
                    <input
                      name="phone"
                      value={editedStudent.phone}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    st.phone
                  )}
                </td>
                <td>
                  {editingId === st.id ? (
                    <select
                      name="group"
                      value={editedStudent.group}
                      onChange={handleInputChange}
                      className="input-edit"
                    >
                      <option>Group 1</option>
                      <option>Group 2</option>
                    </select>
                  ) : (
                    st.group
                  )}
                </td>
                <td>
                  {editingId === st.id ? (
                    <input
                      name="password"
                      value={editedStudent.password}
                      onChange={handleInputChange}
                      className="input-edit"
                    />
                  ) : (
                    st.password
                  )}
                </td>
                <td className="actions">
                  <button
                    className="infoBtn"
                    onClick={() => setInfoStudent(st)}
                  >
                    Info
                  </button>
                  {editingId === st.id ? (
                    <>
                      <button className="saveBtn" onClick={handleSave}>
                        Save
                      </button>
                      <button className="cancelBtn" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="editBtn"
                        onClick={() => handleEdit(st.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(st.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {infoStudent && (
        <div className="modal-overlay" onClick={() => setInfoStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Student Info</h3>
            <img src={infoStudent.photo} alt={infoStudent.name} />
            <p>
              <strong>ID:</strong> {infoStudent.id}
            </p>
            <p>
              <strong>Name:</strong> {infoStudent.name}
            </p>
            <p>
              <strong>Age:</strong> {infoStudent.age}
            </p>
            <p>
              <strong>Phone:</strong> {infoStudent.phone}
            </p>
            <p>
              <strong>Group:</strong> {infoStudent.group}
            </p>
            <p>
              <strong>Password:</strong> {infoStudent.password}
            </p>
            <button className="closeBtn" onClick={() => setInfoStudent(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Student_Main;
