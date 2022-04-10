import React from 'react';
import ReactModal from 'react-modal';
import CloseButton from './buttons/CloseButton';
import Header from './Header';

type Props = {
  title: string;
  showModal: boolean;
  onRequestClose: () => void;
};

const Modal: React.FC<Props> = ({ title, showModal, onRequestClose, children }) => {
  return (
    <ReactModal isOpen={showModal} className="w-1/3 mx-auto" onRequestClose={onRequestClose}>
      <div className="bg-slate-200 mt-8 align-middle p-4">
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
