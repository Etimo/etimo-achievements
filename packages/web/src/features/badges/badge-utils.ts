import { getBadge, getBadges } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';

export const getAllBadges = async () => {
  const response = await getBadges();
  if (response.success) {
    return response.data();
  } else {
    toast.error('Could not get badges: ' + (await response.errorMessage));
  }
};

export const getManyBadges = async (input: PaginationRequestInput) => {
  const { size, page, sort, order } = input;
  const response = await getBadges((page - 1) * size, size, sort, order);
  if (response.success) {
    const data = await response.data();
    return { pagination: response.pagination!, data };
  } else {
    toast.error('Could not get badges: ' + (await response.errorMessage));
  }
};

export const getSingleBadge = async (id: string) => {
  const response = await getBadge(id);
  if (response.success) {
    return await response.data();
  } else {
    toast.error('Could not get the badge: ' + (await response.errorMessage));
  }
};
