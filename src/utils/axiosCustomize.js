import axios from "axios";

// Định nghĩa các hằng số thay thế cho các import bị thiếu
const RoutePaths = {
  LOGIN: "/signin",
  HOME: "/"
};

const EAuthToken = {
  ACCESS_TOKEN: "accessToken"
};

const instance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const requestHandler = (config) => {
  const token = localStorage.getItem(EAuthToken.ACCESS_TOKEN);
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  config.params = {
    ...config.params,
    version: Date.now(),
  };

  return config;
};

const responseErrorHandler = async (err) => {
  if (err?.response?.status === 401) {
    localStorage.clear();
    window.location.pathname = RoutePaths.LOGIN;
    return;
  }

  if (err?.response?.status === 403) {
    window.location.pathname = RoutePaths.HOME;
    return;
  }

  return Promise.reject(err.response?.data);
};

instance.interceptors.request.use(requestHandler, (error) =>
  Promise.reject(error)
);
instance.interceptors.response.use((res) => res, responseErrorHandler);

export default instance;
