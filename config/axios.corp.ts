import axios from "axios";
import Cookie from 'js-cookie';

const cookie = Cookie.get(process.env.NEXT_PUBLIC_COOKIES_NAME as string) || '';
const corpURL = process.env.NEXT_PUBLIC_CORP_URL;

const httpClient = axios.create({
  baseURL: corpURL,
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
