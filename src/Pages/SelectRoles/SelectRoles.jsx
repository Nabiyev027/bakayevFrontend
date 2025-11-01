import "./selectRoles.scss";
import React, { useEffect, useState } from 'react';
import mainRres from "../../Images/Logos/mainReception.png";
import res from "../../Images/Logos/reception.png";
import admin from "../../Images/Logos/administrator.png";
import student from "../../Images/Logos/student2.png";
import teacher from "../../Images/Logos/teacher.png";
import { useNavigate } from "react-router-dom";

function SelectRoles() {
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRoles = localStorage.getItem("roles");

        if (storedRoles) {
            try {
                const parsedRoles = JSON.parse(storedRoles); // ["ROLE_RECEPTION", "ROLE_TEACHER"]
                setRoles(parsedRoles);
            } catch (error) {
                console.error("Rolesni o‘qishda xatolik:", error);
            }
        }
    }, []);

    const getReadableRole = (role) => {
        switch (role) {
            case "ROLE_RECEPTION":
                return { displayName: "Reception", path: res };
            case "ROLE_MAIN_RECEPTION":
                return { displayName: "Main Reception", path: mainRres };
            case "ROLE_TEACHER":
                return { displayName: "Teacher", path: teacher };
            case "ROLE_STUDENT":
                return { displayName: "Student", path: student };
            case "ROLE_ADMIN":
                return { displayName: "Admin", path: admin };
            default:
                return { displayName: role.replace("ROLE_", ""), path: "" };
        }
    };

    function selectRole(role) {
        // localStorage'ga ROLE_* formatda saqlanadi
        localStorage.setItem("selectedRole", role);

        // role ga qarab navigatsiya qilamiz
        switch (role) {
            case "ROLE_TEACHER":
                navigate("/teacher");
                break;
            case "ROLE_STUDENT":
                navigate("/student");
                break;
            case "ROLE_ADMIN":
                navigate("/admin");
                break;
            case "ROLE_RECEPTION":
            case "ROLE_MAIN_RECEPTION":
                navigate("/reception");
                break;
            default:
                console.warn("Noma’lum rol:", role);
        }
    }

    return (
        <div className="wrapper-roles">
            <h1>Select Your Role</h1>

            <div className={roles.length === 1 ? "single" : "wrap-role-cards"}>
                {roles.map((role, index) => {
                    const { displayName, path } = getReadableRole(role);
                    return (
                        <div key={index} className="role-card">
                            <h1>{displayName}</h1>
                            {path && <img src={path} alt={displayName} width="80" />}
                            <button onClick={() => selectRole(role)}>
                                Continue as {displayName}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SelectRoles;
