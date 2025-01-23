import {appUrl} from '@config/api';
import {IUser} from '@model';
import axiosClient from '../axiosClient';
const URL = `${appUrl}/auth`;
const profile = {
  device_login: (device_id: string) => {
    return axiosClient.patch<IUser>(`${URL}/device-login`, {device_id});
  },
};
export {profile};
