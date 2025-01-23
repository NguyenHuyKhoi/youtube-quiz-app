import {IUser} from '@model';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
export interface ProfileState {
  profile?: IUser;
}
const initialState: ProfileState = {};
const slice = createSlice({
  name: 'PROFILE',
  initialState: initialState,
  reducers: {
    setProfile: (state, {payload}: PayloadAction<IUser>) => {
      state.profile = payload;
    },
  },
});
export const {actions: profileActions, reducer: profileReducer} = slice;
