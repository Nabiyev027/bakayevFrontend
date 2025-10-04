import axios from "axios";

export default function refreshToken() {
    return axios.post("http://localhost:8080/auth/refresh", null, {
        headers: {
            key: localStorage.getItem("refresh_token")
        }
    })
        .then(res => {
            console.log("Yangi access token:", res.data.accessToken);
            localStorage.setItem("token", res.data.accessToken);
        })
        .catch(err => {
            console.error("Refresh token xatolik:", err);
            throw err; // api.js ushlashi uchun tashlaymiz
        });
}

