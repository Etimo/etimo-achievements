import React, { FormEventHandler } from 'react';

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const Form: React.FC<Props> = ({ onSubmit, children }) => {
  return (
    <>
      <div className="w-full border-2 border-slate-200 p-6 bg-slate-100">
        <form onSubmit={onSubmit}>{children}</form>
      </div>
    </>
  );
};

export default Form;
