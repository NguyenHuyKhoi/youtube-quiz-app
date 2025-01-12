/* eslint-disable react-native/no-inline-styles */
import {List} from '@components';
import {appUrl} from '@config/api';
import {IVideo} from '@model';
import {COLORS} from '@src/themes';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {VideoItem} from './component';
export function VideoList() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.anti_flash_white,
      }}>
      <List
        url={`${appUrl}/videos`}
        keyExtractor={(item: IVideo) => item.id}
        renderItem={({item}) => <VideoItem data={item} />}
      />
    </SafeAreaView>
  );
}
