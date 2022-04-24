import React from 'react';
import { Card } from './cards';
import Modal from './Modal';

type Props = {
  title: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<Props> = ({ title, confirmLabel, cancelLabel, onCancel, onConfirm, children }) => {
  return (
    <Modal title={title} showModal={true} onRequestClose={onCancel}>
      <Card>
        <div className="flex mb-5">
          <div className="block text-slate-500 w-full">{children}</div>
        </div>
        <div className="flex mb-5">
          <div className="w-1/2 text-center">
            <button
              className="shadow w-4/5 bg-slate-500 hover:bg-slate-600 hover:cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 rounded"
              onClick={onCancel}
            >
              {cancelLabel || 'Cancel'}
            </button>
          </div>
          <div className="w-1/2 text-center">
            <button
              className="shadow w-4/5 bg-slate-500 hover:bg-slate-600 hover:cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 rounded"
              onClick={onConfirm}
            >
              {confirmLabel || 'Confirm'}
            </button>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default ConfirmModal;
