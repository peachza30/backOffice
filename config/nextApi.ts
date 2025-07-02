import axios from "axios";

const nextApi = axios.create({
  baseURL: '', // ชี้ไปยัง Next API Routes
});

nextApi.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

export default nextApi;