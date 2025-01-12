import {EntityBase, IThumbnail} from './common';

export interface IChannelStatistic {
  view_count: number;
  subcsriber_count: number;
  video_count: number;
}
export interface IChannel extends EntityBase {
  title: string;
  description: string;
  custom_url: string;
  published_at: Date;
  youtube_id: string;
  deleted_at: null;
  thumbnail: IThumbnail;
  sync_youtube_at: Date;
  statistics: IChannelStatistic;
}
