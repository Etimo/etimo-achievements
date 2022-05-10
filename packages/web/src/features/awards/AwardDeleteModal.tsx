import { deleteAward } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { toastResponse } from '../../common/utils/toast-response';
import ConfirmModal from '../../components/ConfirmModal';
import RequirePermission from '../../components/RequirePermission';
import { AwardComposite } from './award-types';
import { getSingleAward } from './award-utils';

type Props = {
  awardId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const AwardDeleteModal: React.FC<Props> = ({ awardId, onClose, onSubmit }) => {
  const [award, setAward] = useState<AwardComposite>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSingleAward(awardId).then(setAward);
  }, [awardId]);

  const trashHandler = async (awardId: string) => {
    setLoading(true);
    const response = await deleteAward(awardId).wait();
    if (response.success) {
      onSubmit();
      setTimeout(onClose, 1);
    }
    setLoading(false);
    toastResponse(response, 'Award deleted successfully', 'Award could not be deleted');
  };

  return (
    <RequirePermission remove="awards">
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
        <div className="text-center">Are you sure you want to delete this award?</div>
        <div className="text-center pt-5 text-2xl">
          {award?.achievement?.name} (awarded to {award?.awardedTo?.name})
        </div>
      </ConfirmModal>
    </RequirePermission>
  );
};

export default AwardDeleteModal;
