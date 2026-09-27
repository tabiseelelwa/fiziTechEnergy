import axios from "axios";

axios.defaults.withCredentials = true;

const EXCLUDED_FROM_REDIRECT = ["/api/login", "/api/me"];

let isRedirecting = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl: string = error.config?.url || "";
    const isExcluded = EXCLUDED_FROM_REDIRECT.some((path) =>
      requestUrl.includes(path),
    );

    if (error.response?.status === 401 && !isExcluded && !isRedirecting) {
      isRedirecting = true;

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login?expired=1";
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
