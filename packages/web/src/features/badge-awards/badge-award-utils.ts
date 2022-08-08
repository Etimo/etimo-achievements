import {
  BadgeAwardDto,
  createBadgeAward,
  getBadge,
  getBadgeAward,
  getBadgeAwards,
  getUser,
  listBadges,
  listUsers,
  uniq,
} from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';
import { BadgeAwardComposite } from './badge-award-types';

export const giveBadge = async (userId: string, badgeId: string) => {
  return createBadgeAward({
    userId,
    badgeId,
  } as BadgeAwardDto).wait();
};

export const getSingleBadgeAward = async (id: string) => {
  const response = await getBadgeAward(id);
  if (response.success) {
    const badgeAward = await response.data();
    const badgePromise = (await getBadge(badgeAward.badgeId)).data();
    const awardedToPromise = (await getUser(badgeAward.userId)).data();
    const awardedByPromise = (await getUser(badgeAward.awardedByUserId)).data();

    await Promise.allSettled([badgePromise, awardedToPromise, awardedByPromise]);
    const badge = await badgePromise;
    const awardedTo = await awardedToPromise;
    const awardedBy = await awardedByPromise;

    if (badge && awardedTo && awardedBy) {
      return { badge, badgeAward, awardedTo, awardedBy };
    }
  } else {
    toast.error('Could not get badge award: ' + (await response.errorMessage));
  }
};

export const getManyBadgeAwards = async (input: PaginationRequestInput) => {
  const { page, size, order, sort } = input;
  const response = await getBadgeAwards((page - 1) * size, size, sort, order);
  if (response.success) {
    const badgeAwards = await response.data();
    const badgeIds = uniq(badgeAwards.map((b) => b.badgeId));
    const badgePromise = (await listBadges(badgeIds)).data();

    const userIds = uniq([...badgeAwards.map((b) => b.userId), ...badgeAwards.map((b) => b.awardedByUserId)]);
    const userPromise = (await listUsers(userIds)).data();

    await Promise.allSettled([badgePromise, userPromise]);
    const badges = await badgePromise;
    const users = await userPromise;

    const composites = badgeAwards
      .map((b) => {
        const badge = badges?.find((badge) => badge.id === b.badgeId);
        const awardedBy = users?.find((u) => u.id === b.awardedByUserId);
        const awardedTo = users?.find((u) => u.id === b.userId);
        const badgeAward = b;

        if (badge && awardedBy && awardedTo) {
          return {
            awardedBy,
            awardedTo,
            badge,
            badgeAward,
          };
        }
      })
      .filter((c) => !!c) as BadgeAwardComposite[];

    return {
      pagination: response.pagination!,
      data: composites,
    };
  } else {
    toast.error('Could not get badges: ' + (await response.errorMessage));
  }
};
