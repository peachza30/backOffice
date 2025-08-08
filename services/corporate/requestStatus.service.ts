import httpClient from '@/config/axios.corp';
export const findAll = async () => {
  const response = await httpClient.get(`/corporate/corporate-request-status`);
  return response.data;
};