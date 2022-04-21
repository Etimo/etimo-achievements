import { PaginationInfo } from './pagination-info';

export type PaginatedData<T> = {
  data: T[];
  pagination: PaginationInfo;
  nextPageToken?: string;
};
