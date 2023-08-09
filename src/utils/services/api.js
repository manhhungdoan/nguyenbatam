import axios from "axios";
import Qs from 'qs';
const request = axios.create();

const BASE_URL = "http://27.71.27.70:8102"

request.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error.response || { data: {} });
    }
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error?.response || { data: {} });
    }
);

const api = (options) => {
    let config = {
        baseURL: BASE_URL,
        ...options,
        paramsSerializer: (params) =>
            Qs.stringify(params, { arrayFormat: "repeat" }),
        headers: {
            ...options.headers,
        },
        cors: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    };
    return request(config);
};

export default api;