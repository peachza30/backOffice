// lib/corpClient.ts
import axios from 'axios';

export const getCorpClient = (token?: string) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CORP_URL,
  });
  instance.interceptors.request.use(cfg => {
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    cfg.headers['Content-Type'] = 'application/json';
    return cfg;
  });
  return instance;
};
