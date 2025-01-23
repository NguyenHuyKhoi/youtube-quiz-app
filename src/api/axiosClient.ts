import {handleResponseAxios} from '@common';
import {appUrl} from '@config/api';
import {store} from '@store';
import axios, {AxiosRequestConfig, AxiosRequestHeaders} from 'axios';
import queryString from 'query-string';
const axiosClient = axios.create({
  baseURL: appUrl,
  headers: {
    'Content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  return config;
});

axiosClient.interceptors.response.use((response: any) => {
  if (response && response.data) {
    const result = handleResponseAxios(response);
    return result;
  }
  return response;
});
export default axiosClient;

export const getAuthHeader = (): AxiosRequestHeaders => {
  return {
    Authorization: 'Bearer ' + store.getState().profile.profile?.id,
  };
};
