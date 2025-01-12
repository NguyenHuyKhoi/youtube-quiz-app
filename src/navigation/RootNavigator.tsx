import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home, VideoList} from '@screens';
import React from 'react';
import {APP_SCREEN, RootStackParamList} from './ScreenTypes';
import {VideoEdit} from '@src/screens/video_edit';
const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name={APP_SCREEN.VIDEO_LIST}
        component={VideoList}
        options={{gestureEnabled: false, headerShown: false}}
      />
      <RootStack.Screen
        name={APP_SCREEN.VIDEO_EDIT}
        component={VideoEdit}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </RootStack.Navigator>
  );
};
