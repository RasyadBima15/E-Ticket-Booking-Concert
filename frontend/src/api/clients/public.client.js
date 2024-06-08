import axios from "axios";
import queryString from "query-string";

const baseURL = "http://127.0.0.1:5000";

const publicClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params),
});

publicClient.interceptors.request.use(async (config) => {
    return {
        ...config,
        headers: {
            ...config.headers,
            "Content-Type": "appliaction/json",
        },
    };
});

publicClient.interceptors.response.use((response) => {
    if (response && response.data) return response.data;
    return response;
}, (err) => {
    throw err.response.data;
});

export default publicClient;