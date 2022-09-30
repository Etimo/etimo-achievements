import { BadgeDto, deleteBadge } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { toastResponse } from '../../common/utils/toast-response';
import ConfirmModal from '../../components/ConfirmModal';
import RequirePermission from '../../components/RequirePermission';
import { getSingleBadge } from './badge-utils';

type Props = {
  badgeId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const BadgeDeleteModal: React.FC<Props> = ({ badgeId, onClose, onSubmit }) => {
  const [badge, setBadge] = useState<BadgeDto>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSingleBadge(badgeId).then(setBadge);
  }, [badgeId]);

  const trashHandler = async (badgeId: string) => {
    setLoading(true);
    const response = await deleteBadge(badgeId).wait();
    if (response.success) {
      onSubmit();
      setTimeout(onClose, 1);
    }
    setLoading(false);
    toastResponse(response, 'Badge deleted successfully', 'Badge could not be deleted');
  };

  return (
    <RequirePermission remove="badges">
      <ConfirmModal
        title="Confirm delete"
        cancelLabel="No"
        confirmLabel="Yes"
        loading={loading}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          trashHandler(badgeId);
        }}
      >
        <div className="text-center">Are you sure you want to delete this badge?</div>
        <div className="text-center pt-5 text-2xl">{badge?.name}</div>
      </ConfirmModal>
    </RequirePermission>
  );
};

export default BadgeDeleteModal;
