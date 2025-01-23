/* eslint-disable react-native/no-inline-styles */
import {COLORS} from '@src/themes';
import {sizes} from '@utils';
import React, {FC, useEffect, useRef} from 'react';
import {FlatList, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
export interface TabModel {
  label: string;
  value: any;
}
interface TabItemProps {
  data: TabModel;
  selected?: boolean;
  style?: ViewStyle;
  labelStyle?: ViewStyle;
  onSelect: (i: any) => void;
}
const TabItem: FC<TabItemProps> = ({
  data,
  selected,
  onSelect,
  style,
  labelStyle,
}) => {
  const {label, value} = data;
  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={[
        {
          //  backgroundColor: selected ? COLORS.BrightGray : COLORS.white,
          borderBottomColor: selected ? COLORS.Crimson : COLORS.BrightGray,
          height: sizes._44sdp,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: sizes._1sdp,
          padding: sizes._10sdp,
        },
        style,
      ]}>
      <Text
        style={{
          fontSize: sizes._14sdp,
          fontWeight: '500',
          color: selected ? COLORS.Crimson : COLORS.DarkCharcoal,
          ...(labelStyle ? labelStyle : {}),
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface Props {
  data: TabModel[];
  selectedTab: number;
  onSelectTab: (index: number) => void;
  style?: ViewStyle;
  styleItem?: ViewStyle;
  styleItemLabel?: ViewStyle;
  disableScroll?: boolean;
}
export const Tabs: FC<Props> = ({
  data,
  selectedTab,
  onSelectTab,
  style,
  styleItem,
  styleItemLabel,
  disableScroll,
}) => {
  const listRef = useRef<FlatList<TabModel>>(null);
  useEffect(() => {
    try {
      if (listRef?.current && data.length - 1 >= selectedTab) {
        listRef?.current?.scrollToIndex({
          animated: true,
          index: selectedTab,
          viewPosition: 0.5,
        });
      }
    } catch (error) {}
  }, [selectedTab, data.length]);
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', ...(style ?? {})}}>
      {data.map((item, index) => (
        <TabItem
          key={index}
          data={item}
          selected={selectedTab === index}
          onSelect={() => onSelectTab(index)}
          style={styleItem}
          labelStyle={styleItemLabel}
        />
      ))}
    </View>
  );
};
