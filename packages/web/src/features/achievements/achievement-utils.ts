import { getAchievement, getAchievements } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';

export const getAllAchievements = async () => {
  const response = await getAchievements().wait();
  if (response.success) {
    return response.data();
  } else {
    toast.error('Could not get achievements: ' + (await response.errorMessage));
  }
};

export const getManyAchievements = async (input: PaginationRequestInput) => {
  const { size, page, sort, order } = input;
  const response = await getAchievements((page - 1) * size, size, sort, order).wait();
  if (response.success) {
    const data = await response.data();
    return { pagination: response.pagination!, data };
  } else {
    toast.error('Could not get achievements: ' + (await response.errorMessage));
  }
};

export const getSingleAchievement = async (id: string) => {
  const response = await getAchievement(id).wait();
  if (response.success) {
    const data = await response.data();
    return data;
  } else {
    toast.error('Could not fetch achievement: ' + (await response.errorMessage));
  }
};
