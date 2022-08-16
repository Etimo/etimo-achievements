import { AchievementDto, sort } from '@etimo-achievements/common';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  addAchievementFavorite,
  getAchievementFavorites,
  removeAchievementFavorite,
} from '../features/awards/award-utils';

// Hook that handles set and get of achievement favorites
const useFavoriteAchievement = (achievements: AchievementDto[]) => {
  const [favorites, setFavorites] = useState<AchievementDto[]>([]);

  useEffect(() => {
    getAchievementFavorites().then(setFavorites);
  }, []);

  const toggleFavorite = async (achievementId: string) => {
    if (!achievements.find((a) => a.id === achievementId)) return;

    if (favorites.find((f) => f.id === achievementId)) {
      try {
        await removeAchievementFavorite(achievementId);
        setFavorites(favorites.filter((f) => f.id !== achievementId));
      } catch (err) {
        toast.error('Could not remove favorite achievement ' + err);
      }
    } else {
      try {
        await addAchievementFavorite(achievementId);
        setFavorites(sort([...favorites, achievements.find((a) => a.id === achievementId)!], 'name', 'asc'));
      } catch (err) {
        toast.error('Could not add achievement to favorites ' + err);
      }
    }
  };

  return { favorites, toggleFavorite };
};

export default useFavoriteAchievement;
