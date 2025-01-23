import {appUrl} from '@config/api';
import axiosClient, {getAuthHeader} from '../axiosClient';
const URL = `${appUrl}/results`;

const result = {
  create: (data: {video: string; score: number}) => {
    return axiosClient.post(`${URL}`, data, {
      headers: getAuthHeader(),
    });
  },
};
export {result};
