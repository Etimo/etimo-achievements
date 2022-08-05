import { BadgeAwardDto, createBadgeAward, getBadges } from '@etimo-achievements/common';
import toast from 'react-hot-toast';

export const getAllBadges = async () => {
  const response = await getBadges();
  if (response.success) {
    return response.data();
  } else {
    toast.error('Could not get badges: ' + (await response.errorMessage));
  }
};

export const giveBadge = async (userId: string, badgeId: string) => {
  return createBadgeAward({
    userId,
    badgeId,
  } as BadgeAwardDto).wait();
};
