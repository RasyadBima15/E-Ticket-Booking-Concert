import axios from "axios";
import queryString from "query-string";

const baseURL = "http://127.0.0.1:5000";

const privateClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params),
});

privateClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("token");
    return {
        ...config,
        headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        },
    };
});

privateClient.interceptors.response.use((response) => {
    if (response && response.data) return response.data;
    return response;
}, (err) => {
    throw err.response;
});

export default privateClient;