/* eslint-disable react-native/no-inline-styles */
import {useSelector} from '@common';
import {Button} from '@components';
import {IVideo} from '@model';
import {APP_SCREEN, RootStackParamList} from '@navigation/ScreenTypes';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS} from '@src/themes';
import {sizes} from '@utils';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
export function VideoItem({data}: {data: IVideo}) {
  const {profile} = useSelector(x => x.profile);
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, APP_SCREEN.VIDEO_LIST>
    >();
  const {title, thumbnail, statistics, quiz_count, quiz_time, best_score} =
    data;
  const img_height = sizes._160sdp;
  return (
    <View
      style={{
        marginVertical: sizes._10sdp,
        marginHorizontal: sizes._16sdp,
      }}>
      <TouchableOpacity
        onPress={() => {
          if (!data.quiz_count) {
            Alert.alert('Video can not play now!');
            return;
          }
          navigation.navigate(APP_SCREEN.VIDEO_PLAY, {
            id: data.id,
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
        {best_score ? (
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: sizes._5sdp,
              left: sizes._45sdp,
              paddingVertical: sizes._4sdp,
              paddingHorizontal: sizes._8sdp,
              borderRadius: sizes._4sdp,
              backgroundColor: COLORS.white,
            }}>
            <Text
              style={{
                fontSize: sizes._13sdp,
                fontWeight: '800',
                color: COLORS.DarkCharcoal,
              }}>
              {`Best: ${best_score} / ${quiz_count}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {profile?.is_admin ? (
          <Button
            label="Edit"
            onPress={() => {
              navigation.navigate(APP_SCREEN.VIDEO_EDIT, {
                id: data.id,
              });
            }}
            style={{
              position: 'absolute',
              bottom: sizes._10sdp,
              right: sizes._50sdp,
            }}
          />
        ) : (
          <View />
        )}
      </TouchableOpacity>

      <Text
        style={{
          fontSize: sizes._14sdp,
          fontWeight: '500',
          flex: 1,
          marginTop: sizes._6sdp,
        }}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: sizes._4sdp,
          justifyContent: 'space-between',
        }}>
        <Text style={styles.field_label}>
          {statistics.view_count.toLocaleString() + ' views'}
        </Text>
        {quiz_count > 0 ? (
          <Text style={styles.field_label}>{quiz_count + ' quizzes'}</Text>
        ) : (
          <View />
        )}

        {quiz_time > 0 ? (
          <Text style={styles.field_label}>{quiz_count + ' s/quiz'}</Text>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  field_label: {
    fontSize: sizes._13sdp,
    fontWeight: '400',
    color: COLORS.DarkCharcoal,
  },
});
