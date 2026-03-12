import axios from "axios";
// import {
//   ENV,
//   DEV_API_URL,
//   PRD_API_URL,
//   LOCAL_API_URL
// } from "./config";

let BaseUrl = "http://localhost:5000/";

// if (ENV === "dev") {
//   BaseUrl = DEV_API_URL;
// } else if (ENV === "prd") {
//   BaseUrl = PRD_API_URL;
// } else {
//   BaseUrl = LOCAL_API_URL;
// }

 
const instance = axios.create({
    baseURL: BaseUrl,
    headers: {
        "Content-Type": "application/json"
    }
});


// Request Interceptor
instance.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem("auth_data") || "null");
        if (auth?.token) {
            config.headers["Authorization"] = `Bearer ${auth.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Response Interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response) {

            if (error.response.status === 401) {
                window.location.href = "/apps/login?session=expired";
            } else {
                console.error(
                    `Unexpected error code ${error.response.status}:`,
                    error.response.data
                );
            }

        }

        return Promise.reject(error);
    }
);

export default instance;