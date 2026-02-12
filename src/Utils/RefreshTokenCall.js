import axios from "axios";

export default function refreshToken() {
    const refresh_token = localStorage.getItem("refresh_token");

    if (!refresh_token) {
        return Promise.reject("No refresh token");
    }

    return axios.post("http://localhost:8080/auth/refresh", null, {
        headers: {
            "Authorization": `Bearer ${refresh_token}`
        }
    })
        .then(res => {
            // MUHIM: Kelgan ma'lumotni tekshiramiz
            if (res.data && res.data.accessToken) {
                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken || refresh_token); // Agar yangi refresh token kelmasa, eski tokenni saqlaymiz
                return res.data.accessToken;
            } else {
                throw new Error("Token formatida xatolik");
            }
        })
        .catch(err => {
            console.error("Refresh fail:", err.response?.data || err.message);
            localStorage.clear();
            // Faqat haqiqiy xato bo'lsagina login'ga otish
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            throw err;
        });
}