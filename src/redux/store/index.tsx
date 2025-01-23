import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import {gameEditReducer, gamePlayReducer, profileReducer} from '../reducer';
const middleware = [];
middleware.push(createLogger());
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  game_edit: gameEditReducer,
  game_play: gamePlayReducer,
  profile: profileReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  // middleware: [sagaMiddleware, ...middleware],
  middleware: [],
});
const persistor = persistStore(store);
export {persistor, store};
export type RootState = ReturnType<typeof rootReducer>;
