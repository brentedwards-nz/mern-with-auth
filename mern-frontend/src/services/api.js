import axios from "axios";
//import { logout } from "../utils/auth";

const BASE_URL = "http://localhost:5020/api";
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  withCredentials: true
});

export const apiClientPrivate = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("userDetails");

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

export const getTracks = async (data) => {
  try {
    return await apiClient.get("/data/tracks");
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

/*
const checkResponseCode = (exception) => {
  const responseCode = exception?.response?.status;

  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout();
  }
};
*/
