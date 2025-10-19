import axios from "axios";
import BACKEND_URL from "./backend";

// Create an Axios instance
const Axios = axios.create({
  baseURL: BACKEND_URL, // your backend URL
  withCredentials: true, // include cookies if any
});

// Add a request interceptor to automatically attach token
Axios.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("auth"); // get token from localStorage

    let token;
    if (authToken) {
      token = JSON.parse(authToken).token;
    }

    // console.log("token:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Axios;
