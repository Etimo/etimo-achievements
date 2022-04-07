import { PaginatedData } from './paginated-data';

export type ResponseDto<T> = {
  data: T[];
  pagination: PaginatedData<T>;
};
