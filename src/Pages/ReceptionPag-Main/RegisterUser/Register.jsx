import "./register.scss";
import { LuImageUp } from "react-icons/lu";
import { PiImageDuotone } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiCall from "../../../Utils/ApiCall";
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";

const initialUser = {
  firstName: "",
  lastName: "",
  phoneLocal: "",
  parentPhoneLocal: "",
  username: "",
  password: "",
  role: "",
  filialId: "",
  teacherId: "",
  groupId: "",
  discount: "",
  discountTime: "",
  teacherSalary:"",
  receptionSalary:"",
};

function Register() {
  const userRole = localStorage.getItem("selectedRole");

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(initialUser);
  const [errors, setErrors] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [branches, setBranches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);

  const discountTimeOptions = Array.from({ length: 12 }, (_, i) => ({
    name: `${i + 1} month`,
    value: i + 1,
  }));

  /* ================= EFFECTS ================= */

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    if (!user.filialId) {
      setTeachers([]);
      setGroups([]);
      setUser(p => ({ ...p, teacherId: "", groupId: "" }));
      return;
    }

    getTeachersByFilial(user.filialId);

    // branch tanlanganda barcha grouplar
    getGroupsByFilials([user.filialId]);

  }, [user.filialId]);

  useEffect(() => {
    if (user.role === "ROLE_STUDENT" && user.teacherId) {
      getGroupsByTeacher(user.teacherId);
      setUser(p => ({ ...p, groupId: "" }));
    }
  }, [user.teacherId, user.role]);

  /* ================= VALIDATION ================= */

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value) return "Ism kiriting";
        if (!/^[A-Z]/.test(value)) return "Ism katta harf bilan boshlansin";
        break;

      case "lastName":
        if (!value) return "Familiya kiriting";
        if (!/^[A-Z]/.test(value)) return "Familiya katta harf bilan boshlansin";
        break;

      case "phoneLocal":
        if (value.length !== 9) return "Telefon raqam to‘liq emas";
        break;

      case "username":
        if (!value) return "Username kiriting";
        break;

      case "password":
        if (!value) return "Parol kiriting";
        if (value.length < 8) return "Parol kamida 8 ta belgi";
        break;

      case "role":
        if (!value) return "Role tanlang";
        break;

      case "filialId":
        if (!value) return "Filial tanlang";
        break;

      case "discountTime":
        if (user.discount && !value)
          return "Chegirma muddati tanlanishi shart";
        break;

      default:
        break;
    }
    return "";
  };

  /* ================= HANDLERS ================= */

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleDigitInput = field => e => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.startsWith("998")) digits = digits.slice(3);
    digits = digits.slice(0, 9);
    setUser(p => ({ ...p, [field]: digits }));
  };

  const formatPhone = d =>
      [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)]
          .filter(Boolean)
          .join(" ");

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    let blob = file;

    if (file.type === "image/heic") {
      blob = await heic2any({ blob: file, toType: "image/jpeg" });
    }

    const compressed = await imageCompression(blob, {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1280,
      fileType: "image/webp",
    });

    const webpFile = new File([compressed], "avatar.webp", {
      type: "image/webp",
    });

    setSelectedImage(URL.createObjectURL(webpFile));
    setImageFile(webpFile);
  };

  /* ================= API ================= */

  const getBranches = async () => {
    try {
      const res = await ApiCall("/filial/getAll", { method: "GET" });
      setBranches(res.data || []);
    }catch(err) {
      toast.error(err.response.data || "Error to get Branches");
    }
  };

  const getTeachersByFilial = async filialId => {
    try {
      const res = await ApiCall(`/user/teacher/${filialId}`, { method: "GET" });
      setTeachers(res.data || []);
    }catch (err){
      toast.error(err.response?.data || "Error to get teachers");
    }

  };

  const getGroupsByTeacher = async teacherId => {
    try {
      const res = await ApiCall(`/group/teacher/${teacherId}`, { method: "GET" });
      setGroups(res.data || []);
    }catch (err){
      toast.err(err.response?.data || "Error to get groups");
    }
  };

  const getGroupsByFilials = async filialIds => {
    const ids = filialIds.join(",");
    const res = await ApiCall(`/group/getByFilials?ids=${ids}`, {
      method: "GET",
    });
    setGroups(res.data || []);
  };

  /* ================= SAVE ================= */

  const handleSaveUser = async e => {
    e.preventDefault();

    const errs = {};
    Object.entries(user).forEach(([k, v]) => {
      const err = validateField(k, v);
      if (err) errs[k] = err;
    });

    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Formani to‘g‘ri to‘ldiring");
      return;
    }

    const fd = new FormData();
    Object.entries(user).forEach(([k, v]) => fd.append(k, v));
    fd.append("phone", "+998" + user.phoneLocal);

    if (user.parentPhoneLocal) {
      fd.append("parentPhone", "+998" + user.parentPhoneLocal);
    }

    if (imageFile) fd.append("image", imageFile);

    try {
      await ApiCall("/auth/register", { method: "POST" }, fd);

      toast.success("Muvaffaqiyatli saqlandi");

      /* 🔥 RESET FORM */
      setUser(initialUser);
      setErrors({});
      setSelectedImage(null);
      setImageFile(null);
      setTeachers([]);
      setGroups([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      toast.error("Saqlashda xatolik");
    }
  };

  /* ================= JSX ================= */

  return (
      <div className="register-page">
        <div className="form-container">
          <form className="form" onSubmit={handleSaveUser}>
            <h1>Registration</h1>

            <div className="sect-reg">
              <div className="upload-card">
                <div className="image-card">
                  {selectedImage ? (
                      <img src={selectedImage} alt="Uploaded" />
                  ) : (
                      <PiImageDuotone className="icon" />
                  )}
                </div>

                <div
                    className="btn-group"
                    onClick={() => fileInputRef.current.click()}
                >
                  <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept=".png,.jpg,.jpeg,.svg,.webp"
                      onChange={handleImageChange}
                  />
                  <div className="btn">
                    Upload <LuImageUp className="ico" />
                  </div>
                </div>

                <label>
                  <h4>Select Role</h4>
                  <select
                      name="role"
                      value={user.role}
                      onChange={handleChange}
                  >
                    <option value="">
                      Select Role
                    </option>
                    <option value="ROLE_TEACHER">Teacher</option>
                    <option value="ROLE_STUDENT">Student</option>
                    {
                        (userRole ==="ROLE_ADMIN" || userRole==="ROLE_MAIN_RECEPTION") &&
                        <option value="ROLE_RECEPTION">Reception</option>
                    }
                    {
                      userRole==="ROLE_ADMIN" && <option value="ROLE_MAIN_RECEPTION">Main reception</option>
                    }
                  </select>
                  {errors.role && <p className="error">{errors.role}</p>}
                </label>

              </div>

              <div className="info-card">
                <div className="box1">
                  <label>
                    <h4>Firstname</h4>
                    <input
                        name="firstName"
                        type="text"
                        placeholder="Familiya..."
                        value={user.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && (
                        <p className="error">{errors.firstName}</p>
                    )}
                  </label>

                  <label>
                    <h4>Lastname</h4>
                    <input
                        name="lastName"
                        type="text"
                        placeholder="Ism..."
                        value={user.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                  </label>

                  <label>
                    <h4>Phone number</h4>
                    <input
                        type="text"
                        placeholder="+998 __ ___ __ __"
                        value={"+998 " + formatPhone(user.phoneLocal)}
                        onChange={handleDigitInput("phoneLocal")}
                        maxLength={17}
                    />
                    {errors.phoneLocal && (
                        <p className="error">{errors.phoneLocal}</p>
                    )}
                  </label>

                  <label>
                    <h4>Parent phone</h4>
                    <input
                        type="text"
                        placeholder="+998 __ ___ __ __"
                        value={"+998 " + formatPhone(user.parentPhoneLocal)}
                        onChange={handleDigitInput("parentPhoneLocal")}
                        maxLength={17}
                    />
                    {errors.parentPhoneLocal && (
                        <p className="error">{errors.parentPhoneLocal}</p>
                    )}
                  </label>

                  <label>
                    <h4>Username</h4>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username..."
                        value={user.username}
                        onChange={handleChange}
                    />
                    {errors.username && (
                        <p className="error">{errors.username}</p>
                    )}
                  </label>
                </div>

                <div className="box2">
                  <label>
                    <h4>Password</h4>
                    <input
                        name="password"
                        type="password"
                        placeholder="Parol..."
                        value={user.password}
                        onChange={handleChange}
                    />
                    {errors.password && (
                        <p className="error">{errors.password}</p>
                    )}
                  </label>

                  <label>
                    <h4>Select branch</h4>
                    <select
                        name="filialId"
                        value={user.filialId}
                        onChange={handleChange}
                    >
                      <option disabled value="">
                        Select Branch
                      </option>
                      {branches &&
                          branches.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                          ))}
                    </select>
                    {errors.filialId && <p className="error">{errors.filialId}</p>}
                  </label>

                  {
                      user.role === "ROLE_STUDENT" &&
                      <label>
                        <h4>Select Teacher</h4>
                        <select
                            name="teacherId"
                            value={user.teacherId}
                            onChange={handleChange}
                        >
                          <option value="">
                            Select Teacher
                          </option>
                          {teachers &&
                              teachers.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                              ))}
                        </select>
                        {errors.teacherId && <p className="error">{errors.teacherId}</p>}
                      </label>
                  }

                  <label>
                    <h4>Select Group</h4>
                    <select
                        name="groupId"
                        value={user.groupId}
                        onChange={handleChange}
                    >
                      <option disabled value="">
                        Select Group
                      </option>
                      {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                      ))}
                    </select>
                  </label>

                  {user.role === "ROLE_STUDENT" && (
                      <>
                        <label>
                          <h4>Discount (so'm)</h4>
                          <input
                              name="discount"
                              type="number"
                              placeholder="Discount amount..."
                              value={user.discount}
                              onChange={handleChange}
                          />
                          {errors.discount && (
                              <p className="error">{errors.discount}</p>
                          )}
                        </label>

                        <label>
                          <h4>Discount time</h4>
                          <select
                              name="discountTime"
                              value={user.discountTime}
                              onChange={handleChange}
                          >
                            <option value="" disabled>Select limit</option>
                            {discountTimeOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.name}
                                </option>
                            ))}
                          </select>
                          {errors.discountTime && (
                              <p className="error">{errors.discountTime}</p>
                          )}
                        </label>
                      </>
                  )}

                  {
                    user.role === "ROLE_TEACHER" && (
                          <label>
                            <h4>Teacher Salary (% so'm)</h4>
                            <input
                                name="teacherSalary"
                                type="number"
                                placeholder="Salary percent %"
                                value={user.teacherSalary}
                                onChange={handleChange}
                            />
                            {errors.discount && (
                                <p className="error">{errors.discount}</p>
                            )}
                          </label>
                      )
                  }

                  {
                    (user.role === "ROLE_RECEPTION" || user.role==="ROLE_MAIN_RECEPTION") && (
                          <label>
                            <h4>Reception Salary (so'm)</h4>
                            <input
                                name="receptionSalary"
                                type="number"
                                placeholder="Salary amount (so'm)"
                                value={user.receptionSalary}
                                onChange={handleChange}
                            />
                            {errors.discount && (
                                <p className="error">{errors.discount}</p>
                            )}
                          </label>
                      )
                  }
                </div>
              </div>

            </div>

            <button type="submit" className="btn-save">
              Save
            </button>
          </form>

          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
  );
}

export default Register;
