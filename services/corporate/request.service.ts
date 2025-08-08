import httpClient from '@/config/axios.corp';
import nextApi from '@/config/nextApi';

export const findAll = async (params: FetchParams) => {
  const query = new URLSearchParams({
    search: params.search?.trim() ?? '',
    page: String(params.page ?? ""),
    limit: String(params.limit ?? ""),
    sort: params.sort ?? 'createDate',
    order: params.order ?? 'DESC',
    requestStatus: params.requestStatus ?? '',
    requestFormId: params.requestFormId ?? '',
    startDate: params.startDate ?? '',
    endDate: params.endDate ?? '',
  }).toString();

  // const response = await nextApi.get(`/api/request`);
  const response = await httpClient.get(`/corporate/corporate-request?${query}`);
  return response.data;
};
export const findOne = async (id: number) => {
  // const response = await httpClient.get('/corporate/' + id);
  const response = await httpClient.get('/corporate/corporate-request/' + id);
  return response.data;
};
export const findOneByCorporate = async (corporateId: number) => {
  // const response = await httpClient.get('/corporate/' + id);
  const response = await httpClient.get('/corporate/corporate-request-corporate-id/' + corporateId);
  console.log("findOneByCorporate", response);
  return response.data;
};
export const findDocs = async (id: number) => {
  const response = await httpClient.get('/corporate/document-url/' + id);
  // const response = await nextApi.get(`/api/request/${id}?cookie=${cookie}`);
  return response.data;
};
export const findEdit = async () => {
  const response = await nextApi.get(`/api/edit-list`);
  return response.data;
};

export const create = async (data: any) => {
  const response = await httpClient.post('/corporate', data);
  return response.data;
};
export const update = async (id: number, data: any) => {
  console.log("Updating corporate with ID:", id, "and data:", data);
  const response = await httpClient.patch(`/corporate/${id}`, data);
  return response.data;
};
export const remove = async (id: number) => {
  const response = await httpClient.delete(`/corporate/${id}`);
  return response.data;
};

