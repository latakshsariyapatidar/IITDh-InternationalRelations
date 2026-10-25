import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "/api/v1";
  }
  return "http://localhost:3000/api/v1";
};

const baseURL = getBaseURL();

// Create the axios instance
const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Crucial for refresh cookies
});

let adminAccessToken = null;
let campusAccessToken = null;

export const setAdminAccessToken = (token) => {
  adminAccessToken = token;
};

export const setCampusAccessToken = (token) => {
  campusAccessToken = token;
};

// Backward compatibility alias for admin context
export const setAccessToken = (token) => {
  adminAccessToken = token;
};

export const getAdminAccessToken = () => adminAccessToken;
export const getCampusAccessToken = () => campusAccessToken;

const isCampusEndpoint = (config) => {
  if (config.authType === 'campus') return true;
  if (config.authType === 'admin') return false;
  const url = config.url || '';
  const method = config.method?.toLowerCase();
  if (url.includes('/campus-auth')) return true;
  if (url.includes('/opportunities/feed')) return true;
  if (url.includes('/outbound-applications/mine')) return true;
  if (url === '/outbound-applications' && method === 'post') return true;
  return false;
};

// Request interceptor: attach the appropriate access token
apiClient.interceptors.request.use((config) => {
  const isCampus = isCampusEndpoint(config);
  
  if (isCampus) {
    if (campusAccessToken) {
      config.headers.Authorization = `Bearer ${campusAccessToken}`;
      config._tokenType = 'campus';
    }
  } else {
    if (adminAccessToken) {
      config.headers.Authorization = `Bearer ${adminAccessToken}`;
      config._tokenType = 'admin';
    } else if (campusAccessToken && (config.url?.includes('/mous/') && config.url?.includes('/download'))) {
      // Campus users can download public/IITDh MOUs
      config.headers.Authorization = `Bearer ${campusAccessToken}`;
      config._tokenType = 'campus';
    }
  }

  return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle 401 Unauthorized by attempting a token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      alert("Your account doesn't have access");
    }

    if (error.response?.status === 429) {
      alert(error.response?.data?.message || "Too many requests");
    }

    // If error is 401 and we haven't already retried this exact request,
    // AND the original request was NOT a login or refresh attempt
    if (
      error.response?.status === 401 && 
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/campus-auth/refresh') &&
      !originalRequest.url?.includes('/campus-auth/google')
    ) {
      originalRequest._retry = true;
      const isCampus = originalRequest._tokenType === 'campus' || isCampusEndpoint(originalRequest);

      if (isCampus) {
        try {
          const refreshResponse = await axios.post(`${baseURL}/campus-auth/refresh`, {}, {
            withCredentials: true
          });
          const newAccessToken = refreshResponse.data?.data?.accessToken;
          setCampusAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          setCampusAccessToken(null);
          window.dispatchEvent(new Event('campus-session-expired'));
          return Promise.reject(refreshError);
        }
      } else {
        try {
          const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {}, {
            withCredentials: true
          });
          const newAccessToken = refreshResponse.data?.data?.accessToken;
          setAdminAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          setAdminAccessToken(null);
          window.dispatchEvent(new Event('auth-session-expired'));
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
