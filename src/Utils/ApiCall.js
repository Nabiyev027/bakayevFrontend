import axios from "axios";
export default function (url, options, data, headers){

    return axios({
        baseURL: "http://localhost:8080",
        url,
        method: options.method,
        data,
        headers: {
            ...headers,
            key: localStorage.getItem("token"),
            lang: localStorage.getItem("lang")
        },
    })
}

