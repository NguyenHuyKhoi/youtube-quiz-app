import {IVideo} from '@model';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
export interface IQuiz {
  answer?: number;
}
export interface GameEditState {
  video?: IVideo;
  video_end_time: number;
  video_begin_time: number;
  video_duration: number;
  quiz_index: number;
  video_current_time: number;
  quiz_current_time: number;
  quiz_count: number;
  quiz_explanation_time: number;
  quiz_time: number;
  quizzes: IQuiz[];
}
const initialState: GameEditState = {
  quiz_count: 0,
  video_begin_time: 0,
  quiz_time: 0,
  quizzes: [],
  video_duration: 0,
  video_current_time: 0,
  quiz_index: 0,
  quiz_current_time: 0,
  video_end_time: 0,
  quiz_explanation_time: 0,
};
const slice = createSlice({
  name: 'GAME_EDIT',
  initialState: initialState,
  reducers: {
    setVideo: (state, {payload}: PayloadAction<IVideo>) => {
      state.video = payload;
      state.video_begin_time = payload.video_begin_time ?? 0;
      state.video_end_time = payload.video_end_time ?? 0;
      state.quiz_count = payload.quiz_count ?? 0;
      state.video_duration = payload.duration;
      state.quiz_time = payload.quiz_time ?? 0;
      state.quizzes = payload.quizzes ?? [];
      state.quiz_current_time = 0;
      state.quiz_index = 0;
      state.video_current_time = 0;
    },
    setQuizCount: (state, {payload}: PayloadAction<number>) => {
      if (state.quiz_count === payload) {
        return;
      }
      var cur_count = state.quizzes.length;
      if (payload > state.quiz_count) {
        for (var i = cur_count; i < payload; i++) {
          state.quizzes.push({answer: undefined});
        }
      } else {
        for (var i = payload; i < cur_count; i++) {
          state.quizzes.pop();
        }
      }
      state.quiz_count = payload;
      state.quiz_index = Math.min(state.quiz_index, payload - 1);
    },
    setQuizTime: (state, {payload}: PayloadAction<number>) => {
      state.quiz_time = payload;
    },
    setVideoBeginTime: (state, {payload}: PayloadAction<number>) => {
      state.video_begin_time = payload;
    },
    setVideoEndTime: (state, {payload}: PayloadAction<number>) => {
      state.video_end_time = payload;
    },
    setQuizExplantionTime: (state, {payload}: PayloadAction<number>) => {
      state.quiz_explanation_time = payload;
    },
    setQuizCurrentTime: (state, {payload}: PayloadAction<number>) => {
      state.quiz_current_time = payload;
    },
    setVideoCurrentTime: (state, {payload}: PayloadAction<number>) => {
      state.video_current_time = payload;
      //  state.video_current_time = state.quiz_index * state.quiz_index + payload;
    },
    setQuizIndex: (state, {payload}: PayloadAction<number>) => {
      if (payload >= 0 && payload < state.quizzes.length) {
        state.quiz_index = payload;
      }
    },
    selectPrevQuiz: state => {
      if (state.quiz_index > 0) {
        state.quiz_index--;
      } else {
        state.quiz_index = state.quizzes.length - 1;
      }
    },
    selectNextQuiz: state => {
      if (state.quiz_index < state.quizzes.length - 1) {
        state.quiz_index++;
      } else {
        state.quiz_index = 0;
      }
    },
    selectCorrectAnswer: (state, {payload}: PayloadAction<number>) => {
      if (state.quiz_index > state.quizzes.length - 1) {
        return;
      }
      state.quizzes[state.quiz_index].answer = payload;
    },
  },
});
export const {actions: gameEditActions, reducer: gameEditReducer} = slice;
