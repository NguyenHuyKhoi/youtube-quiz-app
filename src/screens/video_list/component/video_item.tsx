/* eslint-disable react-native/no-inline-styles */
import {IVideo} from '@model';
import {APP_SCREEN} from '@navigation/ScreenTypes';
import {useNavigation} from '@react-navigation/native';
import {sizes} from '@utils';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
export function VideoItem({data}: {data: IVideo}) {
  const navigation = useNavigation();
  const {title, thumbnail, statistics} = data;
  const img_height = sizes._200sdp;
  return (
    <View
      style={{
        marginVertical: sizes._10sdp,
        marginHorizontal: sizes._16sdp,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(APP_SCREEN.VIDEO_EDIT, {
            video: data,
          });
        }}>
        <Image
          source={{uri: thumbnail.url}}
          style={{
            height: img_height,
            width: img_height * 1.66,
            alignSelf: 'center',
            borderRadius: sizes._4sdp,
          }}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: sizes._14sdp,
          flexWrap: 'wrap',
          fontWeight: '500',
          marginTop: sizes._6sdp,
        }}>
        {title}
      </Text>
      <View style={{flexDirection: 'row', marginTop: sizes._4sdp}}>
        <Text
          style={{
            fontSize: sizes._12sdp,
            flexWrap: 'wrap',
          }}>
          {statistics.view_count.toLocaleString() + ' views'}
        </Text>
      </View>
    </View>
  );
}
