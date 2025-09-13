import axios from "axios";

let setGlobalLoading = null;

export const registerGlobalLoader = (fn) => {
  setGlobalLoading = fn;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

//request interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (setGlobalLoading) setGlobalLoading(true); //Start Loader
    return config;
  },
  (error) => {
    if (setGlobalLoading) setGlobalLoading(true); //Stop Loarder if error
    return Promise.reject(error);
  }
);

//response interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    if (setGlobalLoading) setGlobalLoading(false);
    return response;
  },
  (error) => {
    if (setGlobalLoading) setGlobalLoading(false); //Stop Loarder if error
    return Promise.reject(error);
  }
);

export default axiosInstance;
