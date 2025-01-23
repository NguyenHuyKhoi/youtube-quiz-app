import {Text, TextInput, View} from 'react-native';
import React from 'react';
import {sizes} from '@utils';
import {COLORS} from '@src/themes';
interface Props {
  value: number;
  label: string;
  input_width?: number;
  onChange: (a: number) => void;
}
export function NumberInput({value, label, input_width, onChange}: Props) {
  return (
    <View style={{}}>
      <Text style={{fontSize: sizes._13sdp, color: COLORS.DarkCharcoal}}>
        {label}
      </Text>
      <TextInput
        value={value + ''}
        placeholder="Enter seconds"
        keyboardType="decimal-pad"
        onChangeText={u => {
          try {
            if (isNaN(Number(u))) {
              return;
            }
            var val = Number(u);
            onChange(val);
          } catch (e) {}
        }}
        style={{
          width: input_width,
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
