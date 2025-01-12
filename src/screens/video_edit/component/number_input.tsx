import {Text, TextInput, View} from 'react-native';
import React from 'react';
import {sizes} from '@utils';
import {COLORS} from '@src/themes';
interface Props {
  label: string;
  input_width?: number;
}
export function NumberInput({label, input_width}: Props) {
  return (
    <View style={{}}>
      <Text style={{fontSize: sizes._13sdp, color: COLORS.DarkCharcoal}}>
        {label}
      </Text>
      <TextInput
        placeholder="Enter seconds"
        style={{
          width: input_width ?? sizes._160sdp,
          paddingVertical: sizes._6sdp,
          borderWidth: sizes._1sdp,
          borderRadius: sizes._4sdp,
          borderColor: COLORS.DarkCharcoal,
          fontSize: sizes._13sdp,
          color: COLORS.DarkCharcoal,
          paddingHorizontal: sizes._8sdp,
          marginTop: sizes._4sdp,
        }}
      />
    </View>
  );
}
