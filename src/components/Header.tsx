/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '@src/themes';
import {sizes} from '@utils';
import React, {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {StatusBar} from './StatusBar';
interface Props {
  title?: string;
  disableBack?: boolean;
  onBack?: () => void;
}
export const Header: FC<Props> = ({title, onBack, disableBack}) => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'column'}}>
      <StatusBar />
      <View
        style={{
          paddingVertical: sizes._10sdp,
          backgroundColor: COLORS.LightSkyBlue,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: sizes._20sdp,
        }}>
        {!disableBack ? (
          <TouchableOpacity
            onPress={() => {
              onBack ? onBack() : navigation.goBack();
            }}
            style={{}}>
            <Text
              style={{
                fontSize: sizes._14sdp,
                fontWeight: '500',
                color: COLORS.white,
              }}>
              Back
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <Text
          style={{
            flex: 1,
            fontSize: sizes._16sdp,
            fontWeight: '500',
            color: COLORS.white,
            textAlign: 'center',
          }}>
          {title}
        </Text>
        {!disableBack ? <View style={{width: sizes._30sdp}} /> : <View />}
      </View>
    </View>
  );
};
