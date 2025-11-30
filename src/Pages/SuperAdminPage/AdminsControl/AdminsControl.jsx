import React, {useState, useMemo, useEffect} from "react";
import "./adminsControl.scss"
import ApiCall from "../../../Utils/ApiCall";
import {toast} from "react-toastify";
import {FaUserCircle} from "react-icons/fa";

export default function AdminsControl() {
    const[admins,setAdmins] = useState([]);

    useEffect(() => {
        getAdmins()
    }, []);


    async function getAdmins() {
        try {
            const res = await ApiCall(`/user/admins`,{method: "GET"});
            setAdmins(res.data);
        } catch (err) {
            const res = err.message || "Groups not found";
            toast.error(res);
        }

    }


    return (
        <div className="adminsControl-page">
            <button className={"add-btn"}>Add admin</button>
            <div className={"wrap-adm"}>
                {
                    admins && admins.map((ad) => <div className={"adm-card"}>

                        <FaUserCircle className={"img-icon"} />

                        <h2>Full Name:
                            <br/>
                            <span>
                                {ad.firstName+" "+ad.lastName}
                            </span>
                        </h2>
                        <h3>Username:
                            <span>{ad.username}</span>
                        </h3>
                        <div className={"wrap-btns"}>
                            <button className={"btn e"}>Edit</button>
                            <button className={"btn d"}>Delete</button>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
}
