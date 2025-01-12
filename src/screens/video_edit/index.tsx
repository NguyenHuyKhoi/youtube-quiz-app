/* eslint-disable react-native/no-inline-styles */
import {IVideo} from '@model';
import {APP_SCREEN, RootStackParamList} from '@navigation/ScreenTypes';
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {NumberInput} from './component/number_input';
import {sizes} from '@utils';
export function VideoEdit() {
  const route =
    useRoute<RouteProp<RootStackParamList, APP_SCREEN.VIDEO_EDIT>>();
  const [playing, setPlaying] = useState<boolean>(false);

  const {video} = route.params;
  const [data, setData] = useState<IVideo>(video);

  const {youtube_id} = data;
  return (
    <SafeAreaView>
      <YoutubePlayer
        height={sizes._240sdp}
        play={playing}
        videoId={youtube_id}
        onChangeState={() => {}}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <NumberInput label="Video begin:" />
        <NumberInput label="Quiz count:" />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: sizes._4sdp,
        }}>
        <NumberInput label="Video play:" />
        <NumberInput label="Video end:" />
      </View>
    </SafeAreaView>
  );
}
