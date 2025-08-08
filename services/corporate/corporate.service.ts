import httpClient from '@/config/axios.corp';
import nextApi from '@/config/nextApi';
export const findAll = async (params: FetchParams) => {
  const query = new URLSearchParams({
    search: params.search?.trim() ?? '',
    page: String(params.page ?? ""),
    limit: String(params.limit ?? ""),
    sort: params.sort ?? 'created_at',
    order: params.order ?? 'DESC',
    status: params.status ?? '',
  }).toString();

  // const response = await nextApi.get(`/api/corporate`);
  const response = await httpClient.get(`/corporate?${query}`);
  console.log("response", response);
  return response.data;
};
export const findOne = async (id: number) => {
  const response = await httpClient.get('/corporate/corporate-id/' + id);
  // const response = await nextApi.get('/api/corporate/' + id);
  return response.data;
};
export const create = async (data: any) => {
  const response = await httpClient.post('/corporate', data);
  return response.data;
};
export const update = async (payload: CorporateUpdatePayload) => {
  const response = await httpClient.patch(`/request/update-biz-request-status`, payload);
  return response.data;
};
export const remove = async (id: number) => {
  const response = await httpClient.delete(`/corporate/${id}`);
  return response.data;
};
