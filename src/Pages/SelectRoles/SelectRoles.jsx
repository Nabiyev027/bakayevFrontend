import "./selectRoles.scss";
import React, { useEffect, useState } from 'react';
import mainRres from "../../Images/Logos/mainReception.png"
import res from "../../Images/Logos/reception.png"
import admin from "../../Images/Logos/administrator.png"
import student from "../../Images/Logos/student2.png"
import teacher from "../../Images/Logos/teacher.png"
import {useNavigate} from "react-router-dom";

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
                return { name: "Reception", path: res };
            case "ROLE_MAIN_RECEPTION":
                return { name: "Main Reception", path: mainRres };
            case "ROLE_TEACHER":
                return { name: "Teacher", path: teacher };
            case "ROLE_STUDENT":
                return { name: "Student", path: student };
            case "ROLE_ADMIN":
                return { name: "Admin", path: admin };
            default:
                return { name: role.replace("ROLE_", "").toLowerCase(), path: "" };
        }
    };

    function selectRole(role) {
        const readableRole = getReadableRole(role);
        localStorage.setItem("selectedRole", JSON.stringify(readableRole.name));
        if(readableRole.name === "Teacher") {
            navigate("/teacher");
        }else if(readableRole.name === "Student") {
            navigate("/student");
        }else if(readableRole.name === "Admin") {
            navigate("/admin");
        }else if(readableRole.name === "Reception") {
            navigate("/reception");
        }else if(readableRole.name === "Main Reception") {
            navigate("/reception");
        }
    }

    return (
        <div className="wrapper-roles">
            <h1>Select Your Role</h1>

            <div className={roles.length === 1 ? "single" : "wrap-role-cards"}>
                {roles.map((role, index) => {
                    const readableRole = getReadableRole(role);
                    return (
                        <div key={index} className="role-card">
                            <h1>{readableRole.name}</h1>
                            {readableRole.path && <img src={readableRole.path} alt={readableRole.name} width="80" />}
                            <button onClick={()=>selectRole(role)}>
                                Continue as {readableRole.name}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SelectRoles;
