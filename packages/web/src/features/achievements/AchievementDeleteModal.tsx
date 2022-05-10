import { AchievementDto, deleteAchievement } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { toastResponse } from '../../common/utils/toast-response';
import ConfirmModal from '../../components/ConfirmModal';
import RequirePermission from '../../components/RequirePermission';
import { getSingleAchievement } from './achievement-utils';

type Props = {
  achievementId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const AchievementDeleteModal: React.FC<Props> = ({ achievementId, onClose, onSubmit }) => {
  const [achievement, setAchievement] = useState<AchievementDto>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSingleAchievement(achievementId).then(setAchievement);
  }, [achievementId]);

  const trashHandler = async (achievementId: string) => {
    setLoading(true);
    const response = await deleteAchievement(achievementId).wait();
    if (response.success) {
      onSubmit();
      setTimeout(onClose, 1);
    }
    setLoading(false);
    toastResponse(response, 'Achievement deleted successfully', 'Achievement could not be deleted');
  };

  return (
    <RequirePermission remove="achievements">
      <ConfirmModal
        title="Confirm delete"
        cancelLabel="No"
        confirmLabel="Yes"
        loading={loading}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          trashHandler(achievementId);
        }}
      >
        <div className="text-center">Are you sure you want to delete this achievement?</div>
        <div className="text-center pt-5 text-2xl">{achievement?.name}</div>
      </ConfirmModal>
    </RequirePermission>
  );
};

export default AchievementDeleteModal;
