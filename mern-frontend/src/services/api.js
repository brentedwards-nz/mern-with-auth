import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL,
  timeout: process.env.REACT_APP_BACKEND_API_DEFAULT_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

axiosClient.interceptors.request.use(
  (config) => {
    if (config.baseURL === undefined) {
      console.log("Server not set in api client")
      return Promise.reject("Server not available");
    }

    const userDetails = localStorage.getItem("userDetails");
    if (!config.headers.Authorization && userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      const response = await axiosClient.get('/auth/refresh');
      if (response.status === 200) {
        const newAccessToken = response.data.accessToken;
        return axiosClient({
          ...prevRequest,
          headers: { ...prevRequest.headers, Authorization: `Bearer ${newAccessToken}` },
          sent: true
        });
      }
      else {
        return Promise.reject(response.message);
      }

    }
    return Promise.reject(error);
  })

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
    if (config.baseURL === undefined) {
      console.log("Server not set in api client")
      return Promise.reject("Server not available");
    }

    const userDetails = localStorage.getItem("userDetails");
    if (!config.headers.Authorization && userDetails) {
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
