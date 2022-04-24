import React from 'react';
import ReactModal from 'react-modal';
import { mergeClasses } from '../common/utils/merge-classes';
import CloseButton from './buttons/CloseButton';
import Header from './Header';

type Props = {
  title: string;
  showModal: boolean;
  className?: string;
  onRequestClose: () => void;
};

const Modal: React.FC<Props> = ({ title, showModal, className, onRequestClose, children }) => {
  return (
    <ReactModal isOpen={showModal} className="w-1/3 mx-auto" onRequestClose={onRequestClose}>
      <div className={mergeClasses('bg-slate-200 mt-8 align-middle p-4', className)}>
        <Header className="pb-0">
          {title}
          <CloseButton onClick={onRequestClose} />
        </Header>
      </div>
      {children}
    </ReactModal>
  );
};

export default Modal;
