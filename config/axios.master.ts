// config/masterHttpClient.ts
import axios from "axios";
import Cookie from "js-cookie";
import { isTokenExpired } from "@/utils/token"; // 🔁 import shared helper

const masterURL = process.env.NEXT_PUBLIC_MASTER_URL;
const authURL = process.env.NEXT_PUBLIC_AUTH_URL;

const httpClient = axios.create({
  baseURL: masterURL,
});

httpClient.interceptors.request.use(
  async (config) => {
    let token = Cookie.get(process.env.NEXT_PUBLIC_COOKIES_NAME as string) || '';

    // ✅ Check and refresh token if expired
    if (token && isTokenExpired(token)) {
      try {
        console.log("Token expired. Refreshing...");

        const response = await axios.get(`${authURL}/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const newToken = response?.data?.accessToken;
        if (newToken) {
          Cookie.set(process.env.NEXT_PUBLIC_COOKIES_NAME as string, newToken);
          token = newToken;
          console.log("Token refreshed.");
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        throw err;
      }
    }

    // ✅ Set headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

export default httpClient;
