import { UserDto } from '@etimo-achievements/common';

export type HighscoreState = {
  highscores: HighscoreComposite[];
};

export type HighscoreComposite = {
  user: UserDto;
  achievements: number;
  points: number;
};
