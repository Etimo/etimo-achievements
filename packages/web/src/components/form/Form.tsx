import React, { FormEventHandler } from 'react';

type Props = {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
};

const Form: React.FC<Props> = ({ title, onSubmit, children }) => {
  return (
    <>
      <h1 className="font-sans text-2xl font-bold text-center pb-6">{title}</h1>
      <div className="w-full border-2 border-slate-200 rounded p-6 bg-slate-100">
        <form onSubmit={onSubmit}>{children}</form>
      </div>
    </>
  );
};

export default Form;
