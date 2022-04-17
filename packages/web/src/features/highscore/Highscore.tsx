import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import Header from '../../components/Header';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../../components/table';
import { HighscoreService } from './highscore-service';
import { highscoreSelector } from './highscore-slice';

const Highscores: React.FC = () => {
  const { highscores } = useAppSelector(highscoreSelector);
  const highscoreService = new HighscoreService();
  const formatNumber = Intl.NumberFormat('sv-SE').format;

  useEffect(() => {
    highscoreService.load();
  }, []);

  return (
    <div className="w-1/2 mx-auto">
      <Header>Highscores</Header>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Achievements</TableColumn>
          <TableColumn>Points</TableColumn>
        </TableHeader>
        <TableBody>
          {highscores.map((row) => (
            <TableRow key={row.user.id}>
              <TableCell>{row.user.name}</TableCell>
              <TableCell>{formatNumber(row.achievements)}</TableCell>
              <TableCell>{formatNumber(row.points)} pts</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Highscores;
