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
  // Every faculty portal route requires the faculty member's campus token.
  if (url.startsWith('/faculty-portal')) return true;
  if (url.includes('/opportunities/feed')) return true;
  if (url.includes('/outbound-applications/mine')) return true;
  if (url === '/outbound-applications' && method === 'post') return true;
  return false;
};

// GET /mous/:id/document (the signed PDF) accepts an admin token or a campus one.
const isMouDocument = (config) =>
  config.method?.toLowerCase() === 'get' &&
  /^\/mous\/[^/?#]+\/document(?:[?#]|$)/.test(config.url || '');

const sessions = {
  admin: { refreshPath: '/auth/refresh', setToken: setAdminAccessToken, getToken: getAdminAccessToken },
  campus: { refreshPath: '/campus-auth/refresh', setToken: setCampusAccessToken, getToken: getCampusAccessToken },
};
const refreshesInFlight = { admin: null, campus: null };

/**
 * Renews a session from its refresh cookie and resolves with the response's
 * `data` ({ accessToken } for admins; campus adds role and faculty).
 *
 * Callers that overlap share one request. Every refresh rotates the cookie,
 * and the backend answers a second refresh of the same cookie with 401
 * "Invalid refresh token", so two at once would sign the user out.
 */
const refreshSession = (kind) => {
  if (!refreshesInFlight[kind]) {
    refreshesInFlight[kind] = axios
      .post(`${baseURL}${sessions[kind].refreshPath}`, {}, { withCredentials: true })
      .then((res) => {
        const data = res.data?.data;
        sessions[kind].setToken(data?.accessToken ?? null);
        return data;
      })
      .finally(() => {
        refreshesInFlight[kind] = null;
      });
  }
  return refreshesInFlight[kind];
};

export const refreshAdminSession = () => refreshSession('admin');
export const refreshCampusSession = () => refreshSession('campus');

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
    } else if (campusAccessToken && isMouDocument(config)) {
      // Campus users can open public/IITDh MOU documents
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
    // AND the original request was NOT a login or refresh attempt,
    // AND it carried a token (a request sent signed out has no session to renew)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest._tokenType &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/campus-auth/refresh') &&
      !originalRequest.url?.includes('/campus-auth/google')
    ) {
      originalRequest._retry = true;
      const kind = originalRequest._tokenType;
      const session = sessions[kind];

      // Another request may already have renewed the token this one was sent with.
      const sentToken = String(originalRequest.headers.Authorization || '').replace(/^Bearer /, '');
      const currentToken = session.getToken();
      if (currentToken && currentToken !== sentToken) {
        originalRequest.headers.Authorization = `Bearer ${currentToken}`;
        return axios(originalRequest);
      }

      try {
        const data = await refreshSession(kind);
        originalRequest.headers.Authorization = `Bearer ${data?.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        session.setToken(null);
        window.dispatchEvent(new Event(kind === 'campus' ? 'campus-session-expired' : 'auth-session-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
