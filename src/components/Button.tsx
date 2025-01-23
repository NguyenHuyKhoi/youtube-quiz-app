/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity, ViewStyle} from 'react-native';
import React = require('react');
import {sizes} from '@utils';
import {COLORS} from '@src/themes';
interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}
export function Button({label, onPress, style}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: sizes._20sdp,
        paddingVertical: sizes._4sdp,
        backgroundColor: COLORS.MellowApricot,
        borderRadius: sizes._4sdp,
        alignSelf: 'baseline',
        ...(style ?? {}),
      }}>
      <Text style={{fontSize: sizes._14sdp, color: COLORS.white}}>{label}</Text>
    </TouchableOpacity>
  );
}
