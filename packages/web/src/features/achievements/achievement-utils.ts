import { getAchievement, getManyAchievements } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { FetchPaginatedDataInput } from '../../components/table/PaginatedTable';

export const getPaginatedAchievements = async (input: FetchPaginatedDataInput) => {
  const { size, page, sort, order } = input;
  const response = await getManyAchievements((page - 1) * size, size, sort, order).wait();
  if (response.success) {
    const data = await response.data();
    return { pagination: response.pagination!, data };
  } else {
    toast.error('Could not get achievements');
  }
};

export const getSingleAchievement = async (id: string) => {
  const response = await getAchievement(id).wait();
  if (response.success) {
    const data = await response.data();
    return data;
  } else {
    toast.error('Could not fetch achievement');
  }
};
