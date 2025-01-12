export interface PaginationEntity {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface ListEntity<T> {
  data: T[];
  pagination: PaginationEntity;
}
export interface EntityBase {
  id: string;
  created_at: Date;
}

export interface IThumbnail {
  width: number;
  height: number;
  url: string;
}
