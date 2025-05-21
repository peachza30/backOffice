// services/userService.ts
import { httpClient } from '@/config/axios.config';

// TODO: Users API
export const getUsersSetting = async () => {
  const response = await httpClient.get('/users');
  return response.data;
};
export const createUsersSetting = async (data: Settings) => {
  const response = await httpClient.post('/users', data);
  return response.data;
};
export const updateUsersSetting = async (data: Settings, id: number) => {
  const response = await httpClient.patch(`/users/${id}`, data);
  return response.data;
};
export const deleteUsersSetting = async (id: number) => {
  const { data: response } = await httpClient.delete(`/users/${id}`);
  return response.data;
};

// TODO: Partners API
// export async function getPartnersSetting({
//   page = 1,
//   limit = 5,
//   sort = "partner_id:ASC",
// }: {
//   page?: number;
//   limit?: number;
//   sort?: string;
// }): Promise<Partner[]> {
//   const query = `search=&sort=${sort}&limit=${limit}&page=${page}`;
//   const res = await fetch(`https://auth-dev.tfac.or.th/partners?search=&sort=partner_id%3AASC&limit=5&page=1`);

//   if (!res.ok) throw new Error("Failed to fetch partners");

//   const json: PartnersResponse = await res.json();
//   return json.data;
// }
export const getPartnersSetting = async () => {
  const response = await httpClient.get('/partners');
  // const response = await httpClient.get('/partners?search=&sort=partner_id%3AASC&limit=5&page=1');
  return response.data;
};
export const createPartnersSetting = async (data: Partner) => {
  const response = await httpClient.post('/partners', data);
  console.log("response api: ", response);
  return response.data;
};
export const updatePartnersSetting = async (data: { role_id: number }, id: number) => {
  console.log("data", data);
  const response = await httpClient.patch(`/partners/${id}`, data);
  return response.data;
};

export const deletePartnersSetting = async (id: number) => {
  const { data: response } = await httpClient.delete(`/partners/${id}`);
  return response.data;
};
// TODO: Members API
export const getMembersSetting = async () => {
  const response = await httpClient.get('/members');
  return response.data;
};
export const createMembersSetting = async (data: Settings) => {
  const response = await httpClient.post('/members', data);
  return response.data;
};
export const updateMembersSetting = async (data: Settings, id: number) => {
  const response = await httpClient.patch(`/members/${id}`, data);
  return response.data;
};
export const deleteMembersSetting = async (id: number) => {
  const { data: response } = await httpClient.delete(`/members/${id}`);
  return response.data;
};

// TODO: Check rolesAPI in app/api/roles/[scopeId]/route.ts
export const getRolesSetting = async (scopeId) => {
  console.log("scopeId: ", scopeId);
  const response = await httpClient.get(`/scopes/${scopeId}`);
  return await response.data;
};

