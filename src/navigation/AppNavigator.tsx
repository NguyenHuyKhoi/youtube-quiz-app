import {RXStore} from '@common';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {navigationRef} from './NavigationServices';
import {RootNavigation} from './RootNavigator';
export const AppContainer = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigation />
      <RXStore />
    </NavigationContainer>
  );
};
