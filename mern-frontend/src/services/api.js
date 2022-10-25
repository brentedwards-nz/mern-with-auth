import axios from "axios";
//import { logout } from "../utils/auth";

const apiClient = axios.create({
  baseURL: "http://localhost:5020/api",
  timeout: 1000,
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// public routes

export const login = async (data) => {
  try {
    return await apiClient.post("/auth/login", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post("/auth/register", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const reset = async (data) => {
  try {
    return await apiClient.post("/auth/reset", data, { timeout: 5000 });
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const verifyresettoken = async (data) => {
  try {
    return await apiClient.post("/auth/verifyresettoken", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const resetpassword = async (data) => {
  try {
    return await apiClient.post("/auth/resetpassword", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

// secure routes

/*
const checkResponseCode = (exception) => {
  const responseCode = exception?.response?.status;

  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout();
  }
};
*/
