import {IQuiz} from '@reducer/game_edit';
import {IChannel} from './channel';
import {EntityBase, IThumbnail} from './common';

export interface IVideoStatistics {
  view_count: number;
  like_count: number;
  favorite_count: number;
  comment_count: number;
}
export interface IVideo extends EntityBase {
  title: string;
  description: string;
  channel: IChannel;
  channel_youtube_id: string;
  best_score?: number;
  duration: number;
  published_at: Date;
  tags: string[];
  youtube_id: string;
  deleted_at: null;
  thumbnail: IThumbnail;
  statistics: IVideoStatistics;
  video_begin_time: number;
  video_end_time: number;
  quiz_count: number;
  quiz_time: number;
  quizzes: IQuiz[];
}
