import {IVideo} from '@model';

export enum APP_SCREEN {
  HOME = 'HOME',
  MAIN_APP = 'MAIN_APP',
  VIDEO_LIST = 'VIDEO_LIST',
  VIDEO_EDIT = 'VIDEO_EDIT',
}

export type RootStackParamList = {
  [APP_SCREEN.MAIN_APP]: undefined;
  [APP_SCREEN.HOME]: undefined;
  [APP_SCREEN.VIDEO_LIST]: undefined;
  [APP_SCREEN.VIDEO_EDIT]: {
    video: IVideo;
  };
};
