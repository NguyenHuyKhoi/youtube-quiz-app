import {COLORS} from '@src/themes';
import {_screen_statusbar_height} from '@utils';
import React from 'react';
import {
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
} from 'react-native';
export const StatusBar = ({
  backgroundColor,
  ...props
}: {
  backgroundColor?: string;
}) => (
  <View
    style={[
      styles.statusBar,
      {backgroundColor: backgroundColor || COLORS.LightSkyBlue},
    ]}>
    <SafeAreaView>
      <RNStatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
const styles = StyleSheet.create({
  statusBar: {
    height: _screen_statusbar_height,
  },
});
