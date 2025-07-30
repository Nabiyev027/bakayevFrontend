import React, {useEffect, useState} from 'react';
import "./footerSect.scss"
import {toast, ToastContainer} from "react-toastify";
import ApiCall from "../../../../../Utils/ApiCall";

function FooterSect(props) {
    const [footerInfo, setFooterInfo] = useState({
        phone1:"",
        phone2:"",
        email:"",
        instagramUrl:"",
        telegramUrl:"",
        facebookUrl:"",
    });

    useEffect(() => {
       getFooterInfo()
    },[])

    async function getFooterInfo() {
            try {
                const res = await ApiCall("/footerSection/get", {method: "GET"}, footerInfo)
                setFooterInfo(res.data)
            } catch (err) {
                toast.error(err);
            }
    }

    async function saveFooterInfo() {
        try {
            const res = await ApiCall("/footerSection", {method: "POST"}, footerInfo)
            toast.success(res.data)
        } catch (err) {
            toast.error(err);
        }
    }

    return (
        <div className={"footer-sect"}>
            <ToastContainer/>
            <h1>Footer</h1>
            <div   className={"btn-floater"}>
                <button className={"btn-e"} onClick={saveFooterInfo} >Save </button>
            </div>

            <div className={"sect-box"}>

                <div className={"box"}>
                    <h2>Connections</h2>

                    <label>
                        <h3>Phone 1</h3>
                        <input onChange={(e)=>setFooterInfo({...footerInfo,phone1: e.target.value})}
                               value={footerInfo.phone1} className={"inp"} type="text"/>
                    </label>
                    <label>
                        <h3>Phone 2</h3>
                        <input onChange={(e)=>setFooterInfo({...footerInfo,phone2: e.target.value})}
                               value={footerInfo.phone2} className={"inp"} type="text"/>
                    </label>
                    <label>
                        <h3>Email</h3>
                        <input onChange={(e)=>setFooterInfo({...footerInfo,email: e.target.value})}
                               value={footerInfo.email} className={"inp"} type="text"/>
                    </label>

                </div>
                <div className={"box"}>
                    <h2>Social networks</h2>

                    <label>
                        <h3>Instagram</h3>
                        <input onChange={(e)=>setFooterInfo({...footerInfo,instagramUrl: e.target.value})}
                               value={footerInfo.instagramUrl} className={"inp"} type="text"/>
                    </label>
                    <label>
                        <h3>Telegram</h3>
                        <input onChange={(e)=>setFooterInfo({...footerInfo,telegramUrl: e.target.value})}
                               value={footerInfo.telegramUrl} className={"inp"} type="text"/>
                    </label>
                    <label>
                        <h3>Facebook</h3>
                        <input onChange={(e)=>setFooterInfo({...footerInfo,facebookUrl: e.target.value})}
                               value={footerInfo.facebookUrl} className={"inp"} type="text"/>
                    </label>
                </div>

            </div>


        </div>
    );
}

export default FooterSect;