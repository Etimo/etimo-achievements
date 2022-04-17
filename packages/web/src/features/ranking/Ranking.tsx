import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import Header from '../../components/Header';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../../components/table';
import { RankingService } from './ranking-service';
import { rankingSelector } from './ranking-slice';

const Ranking: React.FC = () => {
  const { rankings } = useAppSelector(rankingSelector);
  const rankingService = new RankingService();
  const formatNumber = Intl.NumberFormat('sv-SE').format;

  useEffect(() => {
    rankingService.load();
  }, []);

  return (
    <div className="w-1/2 mx-auto">
      <Header>Rankings</Header>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Achievements</TableColumn>
          <TableColumn>Points</TableColumn>
        </TableHeader>
        <TableBody>
          {[...rankings]
            .sort((a, b) => (a.totalPoints < b.totalPoints ? 1 : -1))
            .map((row) => (
              <TableRow key={row.user.id}>
                <TableCell>{row.user.name}</TableCell>
                <TableCell>{formatNumber(row.totalAchievements)}</TableCell>
                <TableCell>{formatNumber(row.totalPoints)} pts</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Ranking;
