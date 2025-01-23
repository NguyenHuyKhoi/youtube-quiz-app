/* eslint-disable react-native/no-inline-styles */
import {dispatch, useSelector} from '@common';
import {Header} from '@components';
import {APP_SCREEN, RootStackParamList} from '@navigation/ScreenTypes';
import Slider from '@react-native-community/slider';
import {RouteProp, useRoute} from '@react-navigation/native';
import {gameEditActions} from '@reducer/game_edit';
import {Api} from '@src/api';
import {COLORS} from '@src/themes';
import {_screen_width, formatToMMSS, sizes} from '@utils';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import YoutubePlayer, {YoutubeIframeRef} from 'react-native-youtube-iframe';
import {NumberInput} from './component/number_input';
export function VideoEdit() {
  const {
    video,
    video_begin_time,
    quiz_count,
    quiz_time,
    quizzes,
    video_current_time,
    video_duration,
    quiz_index,
    quiz_current_time,
    video_end_time,
    quiz_explanation_time,
  } = useSelector(x => x.game_edit);

  const {youtube_id} = video ?? {};
  const [playing, setPlaying] = useState<boolean>(false);
  const playerRef = useRef<YoutubeIframeRef>(null);

  const route =
    useRoute<RouteProp<RootStackParamList, APP_SCREEN.VIDEO_EDIT>>();

  const {id} = route.params ?? {};
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        playerRef.current
          .getCurrentTime()
          .then(time => {
            dispatch(gameEditActions.setVideoCurrentTime(Math.floor(time)));
          })
          .catch(error => console.error('Error getting current time:', error));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(
      gameEditActions.setQuizCurrentTime(quiz_time - 2 - quiz_explanation_time),
    );
  }, [quiz_explanation_time, quiz_index, quiz_time]);

  useEffect(() => {
    playerRef?.current?.seekTo(
      video_begin_time + quiz_index * quiz_time + quiz_current_time,
      true,
    );
  }, [quiz_current_time, quiz_index, quiz_time, video_begin_time]);

  const getDetail = useCallback(() => {
    if (!id) {
      return;
    }
    Api.video
      .show(id)
      .then(res => {
        var video_detail = res?.data ?? {};
        if (!video_detail) {
          return;
        }
        dispatch(gameEditActions.setVideo(video_detail));
      })
      .catch(e => {});
  }, [id]);

  const getError = useCallback(() => {
    if (quiz_count === 0) {
      return 'There is no quiz';
    }
    if (!video_begin_time) {
      return 'Missing video begin time';
    }
    if (!video_end_time) {
      return 'Missing video end time';
    }
    var non_answer_quiz = quizzes.find(u => u.answer == undefined);
    if (non_answer_quiz) {
      return 'There is quiz missing answer';
    }
    return undefined;
  }, [quiz_count, quizzes, video_begin_time, video_end_time]);

  const msg_error = getError();

  const saveUpdate = useCallback(() => {
    if (!id) {
      return;
    }

    Api.video
      .update(id, {
        video_end_time,
        video_begin_time,
        quiz_count,
        quiz_time,
        quizzes,
      })
      .then(() => {
        getDetail();
        Alert.alert('Cập nhật thành công');
      });
  }, [
    getDetail,
    id,
    quiz_count,
    quiz_time,
    quizzes,
    video_begin_time,
    video_end_time,
  ]);
  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(() => {
    if (quiz_count === 0) {
      return;
    }
    const per_quiz_time =
      Math.floor(
        ((video_duration - video_begin_time - video_end_time) / quiz_count) *
          10,
      ) / 10;
    dispatch(gameEditActions.setQuizTime(per_quiz_time));
  }, [video_begin_time, video_end_time, quiz_count, video_duration]);

  if (!video) {
    return <View />;
  }
  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <Header title="Video detail" />
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <YoutubePlayer
          ref={playerRef}
          height={Math.floor((_screen_width / 16) * 9)}
          play={playing}
          videoId={youtube_id}
          onChangeState={() => {}}
        />
        <View
          style={{
            flexDirection: 'column',
            marginVertical: sizes._6sdp,
            marginHorizontal: sizes._10sdp,
          }}>
          <Text
            style={{
              fontSize: sizes._14sdp,
              color: COLORS.DarkCharcoal,
              fontWeight: '500',
            }}>
            {video.title}
          </Text>
          <Text style={{fontSize: sizes._13sdp}}>
            {formatToMMSS(video_current_time) +
              ' / ' +
              formatToMMSS(video_duration)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <NumberInput
            value={video_begin_time}
            label="Video begin"
            onChange={u => {
              dispatch(gameEditActions.setVideoBeginTime(u));
              playerRef?.current?.seekTo(Math.max(u, video_duration), true);
            }}
          />
          <NumberInput
            label="Quiz count"
            value={quiz_count}
            onChange={u => {
              dispatch(gameEditActions.setQuizCount(u));
            }}
          />
          <NumberInput
            label="Quiz explanation"
            value={quiz_explanation_time}
            onChange={u => {
              dispatch(gameEditActions.setQuizExplantionTime(u));
            }}
          />
          <NumberInput
            label="Video end time"
            value={video_end_time}
            onChange={u => {
              dispatch(gameEditActions.setVideoEndTime(u));
              playerRef?.current?.seekTo(Math.max(0, video_duration - u), true);
            }}
          />
        </View>
        <Text
          style={{
            fontSize: sizes._13sdp,
            marginHorizontal: sizes._10sdp,
            marginTop: sizes._8sdp,
            alignSelf: 'flex-end',
          }}>{`Quiz duration: ${quiz_time} s`}</Text>
        {quiz_count > 0 ? (
          <>
            <FlatList
              style={{
                alignSelf: 'center',
                marginTop: sizes._12sdp,
              }}
              data={quizzes}
              keyExtractor={(_, index) => index + ''}
              numColumns={5}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  disabled={quiz_index === index}
                  onPress={() => {
                    dispatch(gameEditActions.setQuizIndex(index));
                  }}
                  style={{
                    width: sizes._50sdp,
                    height: sizes._26sdp,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: sizes._3sdp,
                    backgroundColor:
                      quiz_index === index
                        ? COLORS.MellowApricot
                        : item.answer !== undefined
                        ? COLORS.LightSkyBlue
                        : COLORS.nickel + '88',
                    marginTop: sizes._4sdp,
                    marginHorizontal: sizes._3sdp,
                  }}>
                  <Text
                    style={{
                      fontSize: sizes._12sdp,
                      color: COLORS.white,
                      fontWeight: '500',
                    }}>{`${index + 1} - ${
                    item.answer !== undefined ? 'ABCD'[item.answer] : ''
                  }`}</Text>
                </TouchableOpacity>
              )}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: sizes._10sdp,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(gameEditActions.selectPrevQuiz());
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: sizes._20sdp,
                  paddingVertical: sizes._4sdp,
                  backgroundColor: COLORS.MellowApricot,
                  borderRadius: sizes._4sdp,
                }}>
                <Text style={{fontSize: sizes._14sdp, color: COLORS.white}}>
                  Prev
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: sizes._14sdp,
                  color: COLORS.DarkCharcoal,

                  marginHorizontal: sizes._20sdp,
                }}>{`${quiz_index + 1} / ${quiz_count}`}</Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(gameEditActions.selectNextQuiz());
                }}
                style={{
                  paddingHorizontal: sizes._20sdp,
                  paddingVertical: sizes._4sdp,
                  backgroundColor: COLORS.MellowApricot,
                  borderRadius: sizes._4sdp,
                }}>
                <Text style={{fontSize: sizes._14sdp, color: COLORS.white}}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text>
                {formatToMMSS(
                  video_begin_time + quiz_index * quiz_time + quiz_current_time,
                )}
              </Text>
              <Slider
                style={{
                  width: _screen_width * 0.6,
                  height: sizes._20sdp,
                  marginHorizontal: sizes._12sdp,
                }}
                value={quiz_current_time}
                minimumValue={0}
                onValueChange={u => {
                  dispatch(gameEditActions.setQuizCurrentTime(u));
                }}
                step={1}
                maximumValue={quiz_time ?? 0}
                minimumTrackTintColor={COLORS.MellowApricot}
                maximumTrackTintColor={COLORS.nickel + '88'}
              />
              <Text>
                {formatToMMSS(video_begin_time + (quiz_index + 1) * quiz_time)}
              </Text>
            </View>
            <FlatList
              style={{alignSelf: 'center', marginTop: sizes._10sdp}}
              data={['A', 'B', 'C', 'D']}
              keyExtractor={item => item}
              numColumns={2}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(gameEditActions.selectCorrectAnswer(index));
                    dispatch(gameEditActions.selectNextQuiz());
                  }}
                  style={{
                    width: sizes._120sdp,
                    height: sizes._40sdp,
                    borderRadius: sizes._4sdp,
                    backgroundColor:
                      quiz_index < quizzes.length &&
                      quizzes[quiz_index].answer === index
                        ? COLORS.LightSkyBlue
                        : COLORS.nickel + '88',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: sizes._6sdp,
                    marginHorizontal: sizes._10sdp,
                  }}>
                  <Text
                    style={{
                      fontSize: sizes._24sdp,
                      fontWeight: '500',
                      color: COLORS.white,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          <View />
        )}
      </ScrollView>

      {msg_error ? (
        <Text
          style={{
            fontSize: sizes._12sdp,
            color: COLORS.nickel,
            marginBottom: sizes._12sdp,
            alignSelf: 'center',
          }}>
          {'*' + msg_error}
        </Text>
      ) : (
        <View />
      )}
      <TouchableOpacity
        onPress={() => {
          if (msg_error) {
            Alert.alert(msg_error);
            return;
          }
          saveUpdate();
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: sizes._20sdp,
          paddingVertical: sizes._4sdp,
          backgroundColor: msg_error ? COLORS.nickel : COLORS.MellowApricot,
          borderRadius: sizes._4sdp,
          width: sizes._200sdp,
          alignSelf: 'center',
          marginBottom: sizes._20sdp,
        }}>
        <Text style={{fontSize: sizes._14sdp, color: COLORS.white}}>
          Save game
        </Text>
      </TouchableOpacity>
    </View>
  );
}
