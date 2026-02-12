import axios from "axios";
import refreshToken from "./RefreshTokenCall";

export default async function ApiCall(url, options = { method: "GET" }, data = null, headers = {}) {
    const token = localStorage.getItem("token");


    const authHeaders = {
        ...headers,
        "lang": localStorage.getItem("lang") || "uz",
    };

    // FormData tekshiruvi (oldingi suhbatda aytganimdek)
    if (!(data instanceof FormData)) {
        authHeaders["Content-Type"] = "application/json";
    }

    if (token) {
        authHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
        return await axios({
            baseURL: "http://localhost:8080",
            url,
            method: options.method || options,
            data,
            headers: authHeaders,
        });
    } catch (err) {
        // Agar xato 401 bo'lsa VA bizda token bo'lgan bo'lsa (demak u eskirgan)
        if (err.response && (err.response.status === 401 || err.response.status === 403) && token) {
            try {
                const tokenResult = await refreshToken();
                if (tokenResult) {
                    const newToken = localStorage.getItem("token");
                    return await axios({
                        baseURL: "http://localhost:8080",
                        url: url,
                        method: options?.method || "GET",
                        data: data,
                        headers: {
                            ...authHeaders,
                            "Authorization": `Bearer ${newToken}`
                        }
                    });
                }
            } catch (refreshErr) {
                window.location.href = "/login";
                localStorage.clear();
                return Promise.reject(refreshErr);
            }
        }

        // AGAR token bo'lmasa va 401 bersa, shunchaki xatoni qaytarish kerak, loginga otish emas!
        throw err;
    }
}