import axios from "axios";

// export const apiClient = axios.create({
//   baseURL: process.env.REACT_APP_BACKEND_API_URL,
//   timeout: process.env.REACT_APP_BACKEND_API_DEFAULT_TIMEOUT_MS,
//   withCredentials: true
// });

export const apiClientPrivate = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  timeout: process.env.REACT_APP_BACKEND_API_DEFAULT_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

apiClientPrivate.interceptors.request.use(
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
    return await apiClientPrivate.post("/auth/login", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const register = async (data) => {
  try {
    return await apiClientPrivate.post("/auth/register", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const reset = async (data) => {
  try {
    return await apiClientPrivate.post("/auth/reset", data, { timeout: 5000 });
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const verifyresettoken = async (data) => {
  try {
    return await apiClientPrivate.post("/auth/verifyresettoken", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const resetpassword = async (data) => {
  try {
    return await apiClientPrivate.post("/auth/resetpassword", data);
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
    return await apiClientPrivate.get("/data/tracks");
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
