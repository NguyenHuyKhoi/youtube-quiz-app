/* eslint-disable react-native/no-inline-styles */
import {Header, List, Tabs} from '@components';
import {appUrl} from '@config/api';
import {IVideo} from '@model';
import {COLORS} from '@src/themes';
import {_screen_width, sizes} from '@utils';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {VideoItem} from './component';

const VIDEO_TABS: {label: string; value: undefined | boolean}[] = [
  {
    label: 'All',
    value: undefined,
  },
  {
    label: 'Can play',
    value: true,
  },
  {
    label: 'Play later',
    value: false,
  },
];
export function VideoList() {
  const [tab, setTab] = useState<number>(0);
  const [resultCount, setResultCount] = useState<number>(0);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.anti_flash_white,
      }}>
      <Header title="Video list" disableBack />
      <Tabs
        data={VIDEO_TABS}
        selectedTab={tab}
        onSelectTab={setTab}
        style={{width: _screen_width, alignSelf: 'center'}}
        styleItem={{flex: 1}}
      />
      <Text
        style={{
          fontSize: sizes._14sdp,
          fontWeight: '500',
          color: COLORS.DarkCharcoal,
          alignSelf: 'flex-end',
          marginRight: sizes._10sdp,
          marginVertical: sizes._6sdp,
        }}>
        {resultCount + ' videos'}
      </Text>
      <List
        url={`${appUrl}/videos`}
        params={{
          has_answers: VIDEO_TABS[tab].value,
        }}
        keyExtractor={(item: IVideo) => item.id}
        renderItem={({item}) => <VideoItem data={item} />}
        onChangeDataSize={setResultCount}
        renderListFooter={() => <View style={{height: sizes._50sdp}} />}
      />
    </View>
  );
}
