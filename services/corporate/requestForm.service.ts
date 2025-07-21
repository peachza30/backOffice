import httpClient from '@/config/axios.corp';
import nextApi from '@/config/nextApi';
export const findAll = async () => {
  const response = await httpClient.get(`/corporate/corporate-request-form`);
  console.log("response", response);
  return response.data;
};
export const findOne = async (id: number) => {
  // const response = await httpClient.get('/corporate/' + id);
  const response = await nextApi.get('/api/request/' + id);
  return response.data;
};
