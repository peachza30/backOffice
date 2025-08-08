// config/httpClient.ts or wherever it's defined
import axios from "axios";
import Cookies from 'js-cookie';
import { isTokenExpired } from "@/utils/token"; // <-- use your global function

const authURL = process.env.NEXT_PUBLIC_AUTH_URL;

const httpClient = axios.create({
  baseURL: authURL,
});

httpClient.interceptors.request.use(
  async (config) => {
    let token = Cookies.get(process.env.NEXT_PUBLIC_COOKIES_NAME as string) || '';

    // ✅ Check and refresh token if expired
    if (token && isTokenExpired(token)) {
      try {
        console.log('Token expired. Refreshing...');
        const response = await axios.get(
          `${authURL}/auth/refresh`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newToken = response?.data?.accessToken;
        if (newToken) {
          Cookies.set(process.env.NEXT_PUBLIC_COOKIES_NAME as string, newToken);
          token = newToken;
          console.log('Token refreshed.');
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        throw refreshError;
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;
