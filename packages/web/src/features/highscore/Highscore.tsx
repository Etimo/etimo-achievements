import { SeasonDto } from '@etimo-achievements/common';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormSelect } from '../../components/form';
import Header from '../../components/Header';
import { getManySeasons } from '../seasons/season-utils';
import { HighscoreTable } from './HighscoreTable';

const Highscores: React.FC = () => {
  const [seasons, setSeasons] = useState<SeasonDto[]>([]);
  const [search, setSearch] = useSearchParams();

  const getSeasonId = () => search.get('seasonId') ?? '';
  const setSeasonId = (value: string) => {
    if (!value) {
      search.delete('seasonId');
      setSearch(search);
    } else {
      setSearch({ seasonId: value });
    }
  };

  const getSeasons = async () => {
    // TODO: Infinite scrolling, this won't work in about 4 years
    const response = await getManySeasons({ page: 1, size: 50 });
    if (response) {
      setSeasons(response.data);
      if (response.data.length !== 0) {
        setSeasonId(response.data[0].id);
      }
    }
  };

  useEffect(() => {
    getSeasons();
  }, []);

  const mappedSeasons = useMemo(() => {
    return seasons.map((s) => ({ label: s.name, value: s.id }));
  }, [seasons]);

  return (
    <div className="w-2/3 mx-auto">
      <Header>Highscores</Header>
      <div className="flex flex-row mb-2">
        <FormSelect
          allowDeselect={false}
          onChange={setSeasonId}
          options={mappedSeasons}
          value={getSeasonId()}
          nothingFound="No seasons found"
          placeholder="Select season"
          type="single-line"
        />
      </div>
      {!!getSeasonId() && <HighscoreTable seasonId={getSeasonId()} />}
    </div>
  );
};

export default Highscores;
