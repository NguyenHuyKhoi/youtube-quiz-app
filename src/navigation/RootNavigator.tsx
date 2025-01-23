import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VideoList, VideoEdit, VideoPlay} from '@screens';
import {Api} from '@src/api';
import {getDeviceId} from '@utils';
import React, {useCallback, useEffect} from 'react';
import {APP_SCREEN, RootStackParamList} from './ScreenTypes';
import {dispatch, useSelector} from '@common';
import {profileActions} from '@reducer/profile';
import {Alert} from 'react-native';
const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const {profile} = useSelector(x => x.profile);
  const loginByDevice = useCallback(async () => {
    const device_id = await getDeviceId();
    if (!device_id) {
      return;
    }
    Api.profile
      .device_login(device_id)
      .then(res => {
        var user_profile = res?.data;
        if (!user_profile) {
          Alert.alert('Some thing errors.');
          return;
        }

        dispatch(profileActions.setProfile(user_profile));
      })
      .catch(e => {
        console.log('e: ', JSON.stringify(e, null, 2));
      });
  }, []);

  useEffect(() => {
    loginByDevice();
  }, [loginByDevice]);

  if (!profile) {
    return;
  }
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
      <RootStack.Screen
        name={APP_SCREEN.VIDEO_PLAY}
        component={VideoPlay}
        options={{gestureEnabled: false, headerShown: false}}
      />
    </RootStack.Navigator>
  );
};
