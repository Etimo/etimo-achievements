import { getProfile } from '@etimo-achievements/common';
import toast from 'react-hot-toast';

export const getMyUser = async () => {
  const response = await getProfile();
  if (response.success) {
    const data = await response.data();
    return data;
  } else {
    toast.error('Could not fetch profile: ' + (await response.errorMessage));
  }
};
