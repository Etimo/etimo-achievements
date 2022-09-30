import { faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { BadgeAwardComposite } from '../badge-awards/badge-award-types';

interface Props {
  badge: BadgeAwardComposite;
}

const BadgeAward: React.VFC<Props> = ({ badge: { badge } }) => {
  return (
    <div className="flex flex-col text-center p-5 max-w-[300px] max-h-[200px] relative m-3">
      {/* TODO: Insert image here eventually */}
      <FontAwesomeIcon size="4x" icon={faShield} />
      <span className="font-bold mt-2 break-all">{badge.name}</span>
      <span className="text-xs break-all truncate">{badge.description}</span>
    </div>
  );
};

export default BadgeAward;
