import { deleteBadgeAward } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { toastResponse } from '../../common/utils/toast-response';
import ConfirmModal from '../../components/ConfirmModal';
import RequirePermission from '../../components/RequirePermission';
import { BadgeAwardComposite } from './badge-award-types';
import { getSingleBadgeAward } from './badge-award-utils';

type Props = {
  awardId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const BadgeAwardDeleteModal: React.FC<Props> = ({ awardId, onClose, onSubmit }) => {
  const [badgeAward, setBadgeAward] = useState<BadgeAwardComposite>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSingleBadgeAward(awardId).then(setBadgeAward);
  }, [awardId]);

  const trashHandler = async (awardId: string) => {
    setLoading(true);
    const response = await deleteBadgeAward(awardId).wait();
    if (response.success) {
      onSubmit();
      setTimeout(onClose, 1);
    }
    setLoading(false);
    toastResponse(response, 'Badge award deleted successfully', 'Badge award could not be deleted');
  };

  return (
    <RequirePermission remove="badge-awards">
      <ConfirmModal
        title="Confirm delete"
        cancelLabel="No"
        confirmLabel="Yes"
        loading={loading}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          trashHandler(awardId);
        }}
      >
        <div className="text-center">Are you sure you want to delete this badge award?</div>
        <div className="text-center pt-5 text-2xl">
          {badgeAward?.badge?.name} (awarded to {badgeAward?.awardedTo?.name})
        </div>
      </ConfirmModal>
    </RequirePermission>
  );
};

export default BadgeAwardDeleteModal;
