import httpClient from '@/config/axios.auth';

export const getProfile = async () => {
  const response = await httpClient.get('/users/profile');
  return response.data;
};
