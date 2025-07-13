import httpClient from '@/config/axios.master';

export const findOne = async (id: number) => {
  const response = await httpClient.get('/corporate-business-type/' + id);
  return response.data;
};

