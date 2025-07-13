import axios from "axios";
import Cookie from 'js-cookie';

const cookie = Cookie.get(process.env.NEXT_PUBLIC_COOKIES_NAME as string) || '';
const masterURL = process.env.NEXT_PUBLIC_MASTER_URL;

const httpClient = axios.create({
  baseURL: masterURL,
});

httpClient.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Authorization'] = `Bearer ${cookie}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default httpClient;
