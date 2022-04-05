import { PageInfoType } from '@etimo-achievements/common';

export type ResponseDto<T> = {
  data: T[];
  pagination: PageInfoType;
};
