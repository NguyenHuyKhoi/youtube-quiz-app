/* eslint-disable react-native/no-inline-styles */
import {dispatch, useSelector} from '@common';
import {Button, Header} from '@components';
import {APP_SCREEN, RootStackParamList} from '@navigation/ScreenTypes';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {gamePlayActions} from '@reducer/game_play';
import {Api} from '@src/api';
import {COLORS} from '@src/themes';
import {_screen_width, formatToMMSS, sizes} from '@utils';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import YoutubePlayer, {YoutubeIframeRef} from 'react-native-youtube-iframe';
export function VideoPlay() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, APP_SCREEN.VIDEO_LIST>
    >();
  const {video, quiz_index, video_current_time, answers, answer_all} =
    useSelector(x => x.game_play);

  const {profile} = useSelector(x => x.profile);
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [playing, setPlaying] = useState(false);
  const route =
    useRoute<RouteProp<RootStackParamList, APP_SCREEN.VIDEO_PLAY>>();

  const {id} = route.params ?? {};
  const {youtube_id, video_begin_time, duration, quiz_time, quiz_count} =
    video ?? {};
  const getDetail = useCallback(() => {
    console.log('Get id: ', id);
    if (!id) {
      return;
    }
    Api.video
      .show(id)
      .then(res => {
        var video_detail = res?.data ?? {};
        console.log('Get detail: ', video_detail.title);
        if (!video_detail) {
          return;
        }
        dispatch(gamePlayActions.setVideo(video_detail));
      })
      .catch(_ => {
        console.log('E: ', e);
      });
  }, [id]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        playerRef.current
          .getCurrentTime()
          .then(time => {
            dispatch(gamePlayActions.setVideoCurrentTime(Math.floor(time)));

            if (video_begin_time && quiz_time && time >= video_begin_time) {
              const q_index = Math.floor((time - video_begin_time) / quiz_time);

              if (q_index !== quiz_index) {
                dispatch(gamePlayActions.setQuizIndex(q_index));
              }
            }
          })
          .catch(error => console.error('Error getting current time:', error));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz_index, quiz_time, video_begin_time]);

  useEffect(() => {
    if (!video_begin_time || !quiz_time) {
      return;
    }
    playerRef?.current?.seekTo(video_begin_time + quiz_index * quiz_time, true);
  }, [quiz_index, quiz_time, video_begin_time]);
  const quizzes = useMemo(() => video?.quizzes ?? [], [video?.quizzes]);

  const getQuizColor = useCallback(
    (index: number) => {
      if (quiz_index === index) {
        return COLORS.MellowApricot;
      }
      if (answers[index] == undefined) {
        return COLORS.nickel + '88';
      }
      if (answers[index] === quizzes[index].answer) {
        return COLORS.DarkSpringGreen;
      }
      return COLORS.Crimson;
    },
    [quiz_index, answers, quizzes],
  );

  const getAnswerColor = useCallback(
    (answer_index: number) => {
      if (answers[quiz_index] === undefined) {
        return COLORS.nickel + '88';
      }
      if (quizzes[quiz_index].answer === answer_index) {
        return COLORS.DarkSpringGreen;
      }
      return COLORS.Crimson;
    },
    [answers, quiz_index, quizzes],
  );

  var score = answers.filter((u, i) => u === quizzes[i].answer).length;

  const saveHistory = useCallback(async () => {
    console.log('video  ', video?.id, profile);
    if (!video || !profile) {
      return;
    }
    try {
      await Api.result.create({
        video: video.id,
        score,
      });
    } catch (e) {
      console.log('Error ', e);
    }
    navigation.goBack();
  }, [navigation, profile, score, video]);

  console.log('id: ', id);
  if (!video) {
    return <View />;
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      <Header title={`Correct: ${score} / ${quiz_count}`} />
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
            formatToMMSS(duration ?? 0)}
        </Text>
      </View>
      {quiz_count && quiz_count > 0 ? (
        <>
          <FlatList
            style={{
              alignSelf: 'center',
              marginTop: sizes._12sdp,
            }}
            data={quizzes ?? []}
            keyExtractor={(_, index) => index + ''}
            numColumns={5}
            renderItem={({_, index}) => (
              <TouchableOpacity
                disabled={quiz_index === index}
                onPress={() => {
                  dispatch(gamePlayActions.setQuizIndex(index));
                }}
                style={{
                  width: sizes._50sdp,
                  height: sizes._26sdp,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: sizes._3sdp,
                  backgroundColor: getQuizColor(index),
                  marginTop: sizes._4sdp,
                  marginHorizontal: sizes._3sdp,
                }}>
                <Text
                  style={{
                    fontSize: sizes._12sdp,
                    color: COLORS.white,
                    fontWeight: '500',
                  }}>{`${index + 1} - ${
                  answers[index] !== undefined ? 'ABCD'[answers[index]] : ''
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
                dispatch(gamePlayActions.selectPrevQuiz());
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
                dispatch(gamePlayActions.selectNextQuiz());
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
          <FlatList
            style={{alignSelf: 'center', marginTop: sizes._10sdp}}
            data={['A', 'B', 'C', 'D']}
            keyExtractor={item => item}
            numColumns={2}
            renderItem={({item, index}) => (
              <TouchableOpacity
                disabled={answers[quiz_index] !== undefined}
                onPress={() => {
                  dispatch(gamePlayActions.answer(index));
                  setTimeout(() => {
                    dispatch(gamePlayActions.selectNextQuiz());
                  }, 1000);
                }}
                style={{
                  width: sizes._120sdp,
                  height: sizes._40sdp,
                  borderRadius: sizes._4sdp,
                  backgroundColor: getAnswerColor(index),
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
      {answer_all ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: sizes._20sdp,
            alignSelf: 'center',
          }}>
          <Button
            onPress={() => {
              dispatch(gamePlayActions.replay());
            }}
            label="Replay"
            style={{alignSelf: 'center', marginRight: sizes._20sdp}}
          />
          <Button
            onPress={saveHistory}
            label="Complete"
            style={{alignSelf: 'center'}}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  );
}
