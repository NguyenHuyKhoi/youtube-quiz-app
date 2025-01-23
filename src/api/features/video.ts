import {appUrl} from '@config/api';
import {IVideo} from '@model';
import {IQuiz} from '@reducer/game_edit';
import axiosClient, {getAuthHeader} from '../axiosClient';
const URL = `${appUrl}/videos`;
const video = {
  show: (id: string) => {
    return axiosClient.get<IVideo>(`${URL}/${id}`, {
      headers: getAuthHeader(),
    });
  },
  update: (
    id: string,
    data: {
      video_end_time: number;
      video_begin_time: number;
      quiz_count: number;
      quiz_time: number;
      quizzes: IQuiz[];
    },
  ) => {
    return axiosClient.patch<IVideo>(`${URL}/${id}`, data, {
      headers: getAuthHeader(),
    });
  },
};
export {video};
