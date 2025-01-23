import {IVideo} from '@model';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
export interface GamePlayState {
  video?: IVideo;
  video_current_time: number;
  quiz_index: number;
  answers: (number | undefined)[];
  answer_all: boolean;
}
const initialState: GamePlayState = {
  quiz_index: 0,
  video_current_time: 0,
  answers: [],
  answer_all: false,
};
const slice = createSlice({
  name: 'GAME_PLAY',
  initialState: initialState,
  reducers: {
    setVideo: (state, {payload}: PayloadAction<IVideo>) => {
      if (state.video?.id !== payload.id) {
        state.answer_all = false;
      }
      state.video = payload;
      state.quiz_index = 0;
      state.answers = payload.quizzes.map(_ => undefined);
    },
    replay: state => {
      state.answer_all = false;
      state.quiz_index = 0;
      state.answers = state.video?.quizzes?.map(_ => undefined) ?? [];
    },

    setVideoCurrentTime: (state, {payload}: PayloadAction<number>) => {
      state.video_current_time = payload;
      //  state.video_current_time = state.quiz_index * state.quiz_index + payload;
    },
    setQuizIndex: (state, {payload}: PayloadAction<number>) => {
      state.quiz_index = payload;
    },
    selectPrevQuiz: state => {
      if (!state.video) {
        return;
      }
      if (state.quiz_index > 0) {
        state.quiz_index--;
      } else {
        state.quiz_index = state.video.quizzes.length - 1;
      }
    },
    selectNextQuiz: state => {
      if (!state.video) {
        return;
      }
      if (state.quiz_index < state.video.quizzes.length - 1) {
        state.quiz_index++;
      } else {
        state.quiz_index = 0;
      }
    },
    answer: (state, {payload}: PayloadAction<number>) => {
      state.answers[state.quiz_index] = payload;

      var non_answer_index = state.answers.findIndex(u => u === undefined);
      console.log('non answer index', non_answer_index);
      if (non_answer_index === -1) {
        state.answer_all = true;
      }
    },
  },
});
export const {actions: gamePlayActions, reducer: gamePlayReducer} = slice;
