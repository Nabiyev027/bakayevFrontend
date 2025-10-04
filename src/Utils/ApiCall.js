import axios from "axios";
import refreshToken from "./RefreshTokenCall";

export default async function ApiCall(url, options, data, headers) {
    try {
        const res = await axios({
            baseURL: "http://localhost:8080",
            url,
            method: options.method,
            data,
            headers: {
                ...headers,
                key: localStorage.getItem("token"),
                lang: localStorage.getItem("lang"),
            },
        });
        return res;
    } catch (err) {
        if (err.response && err.response.status === 401) {
            try {
                // refresh token chaqirish
                await refreshToken();
                // qayta urinish yangi token bilan
                return axios({
                    baseURL: "http://localhost:8080",
                    url,
                    method: options.method,
                    data,
                    headers: {
                        ...headers,
                        key: localStorage.getItem("token"), // yangilangan token
                        lang: localStorage.getItem("lang"),
                    },
                });
            } catch (refreshErr) {
                console.error("Refresh ishlamadi:", refreshErr);
                window.location.href = "/login";
            }
        }
        throw err;
    }
}