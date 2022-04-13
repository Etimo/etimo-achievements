import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import Header from '../../components/Header';
import { AwardService } from './award-service';
import { awardSelector } from './award-slice';

const AwardsList: React.FC = () => {
  const { awards } = useAppSelector(awardSelector);
  const awardService = new AwardService();
  const [loading, setLoading] = useState(false);
  const formatNumber = Intl.NumberFormat('sv-SE').format;

  useEffect(() => {
    awardService.load();
  }, []);

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    awardService.delete(e.currentTarget.id).then((success) => {
      setLoading(false);
      if (success) {
        toast.success('Award deleted successfully.');
      } else {
        toast.error('Award could not be deleted');
      }
    });
  };

  return (
    <div className="w-1/2 mx-auto">
      <Header>Awards</Header>
    </div>
  );
};

export default AwardsList;
