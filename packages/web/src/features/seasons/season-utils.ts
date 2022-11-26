import { getSeasons } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';

export const getManySeasons = async (input: PaginationRequestInput) => {
  const { size, page, sort, order } = input;
  const response = await getSeasons((page - 1) * size, size, sort, order);
  if (response.success) {
    const data = await response.data();
    return { pagination: response.pagination!, data };
  } else {
    toast.error('Could not get seasons: ' + (await response.errorMessage));
  }
};
