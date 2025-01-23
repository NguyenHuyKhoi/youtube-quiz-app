import DeviceInfor from 'react-native-device-info';
import {MD5} from 'crypto-js';
export const getDeviceId = async () => {
  try {
    const device_id = await DeviceInfor.getUniqueId();
    const hash = MD5(device_id).toString();
    return hash;
  } catch (error) {
    return '';
  }
};
