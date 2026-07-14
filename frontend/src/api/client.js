import axios from "axios";

// Determine base URL based on environment. In dev, it's typically the proxy or absolute URL
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Create the axios instance
const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Crucial for refresh cookies
});

// A mechanism to inject the token from our AuthContext
// We'll expose a setter so the AuthContext can keep this updated
let currentAccessToken = null;

export const setAccessToken = (token) => {
  currentAccessToken = token;
};

// Request interceptor: attach the access token to every request if we have it
apiClient.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  
  // Cache-busting for GET requests to ensure admin panel gets fresh data
  if (config.method?.toLowerCase() === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }

  return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle 401 Unauthorized by attempting a token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this exact request,
    // AND the original request was NOT a login or refresh attempt
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token. The browser will automatically include the httpOnly refreshToken cookie
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {}, {
          withCredentials: true
        });

        const newAccessToken = refreshResponse.data.data.accessToken;
        
        // Update our local variable
        setAccessToken(newAccessToken);

        // Update the original request's authorization header and retry it
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If the refresh fails, it means the session is truly dead.
        // We should clear the token and force a redirect to login.
        setAccessToken(null);
        
        // Dispatch a custom event so the AuthContext knows we logged out
        window.dispatchEvent(new Event('auth-session-expired'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
