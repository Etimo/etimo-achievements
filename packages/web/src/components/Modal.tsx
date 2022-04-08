import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactModal from 'react-modal';
import Header from './Header';

type Props = {
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
};

const Modal: React.FC<Props> = ({ title, isOpen, onRequestClose, children }) => {
  return (
    <>
      <ReactModal isOpen={isOpen} className="w-1/3 mx-auto">
        <div className="bg-slate-200 mt-8 align-middle p-4">
          <Header>
            {title}
            <button onClick={onRequestClose} className="float-right mr-4">
              <FontAwesomeIcon icon={faClose} />
            </button>
          </Header>
        </div>
        {children}
      </ReactModal>
    </>
  );
};

export default Modal;
