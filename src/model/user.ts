import {EntityBase} from './common';

export interface IUser extends EntityBase {
  is_admin?: boolean;
  device_id: string;
}
