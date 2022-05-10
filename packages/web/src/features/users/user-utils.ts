import { getProfile, getUser, getUsers } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';

export const getAllUsers = async () => {
  const response = await getUsers();
  if (response.success) {
    return response.data();
  } else {
    toast.error('Could not get users: ' + (await response.errorMessage));
  }
};

export const getManyUsers = async (input: PaginationRequestInput) => {
  const { size, page, sort, order } = input;
  const response = await getUsers((page - 1) * size, size, sort, order);
  if (response.success) {
    const data = await response.data();
    return { pagination: response.pagination!, data };
  } else {
    toast.error('Could not get achievements: ' + (await response.errorMessage));
  }
};

export const getSingleUser = async (id: string) => {
  const response = await getUser(id);
  if (response.success) {
    const data = await response.data();
    return data;
  } else {
    toast.error('Could not fetch user: ' + (await response.errorMessage));
  }
};

export const getMyUser = async () => {
  const response = await getProfile();
  if (response.success) {
    const data = await response.data();
    return data;
  } else {
    toast.error('Could not fetch profile: ' + (await response.errorMessage));
  }
};
