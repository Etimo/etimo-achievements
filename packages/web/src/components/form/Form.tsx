import React, { FormEventHandler } from 'react';
import Card from '../cards/Card';

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const Form: React.FC<Props> = ({ onSubmit, children }) => {
  return (
    <Card>
      <form onSubmit={onSubmit}>{children}</form>
    </Card>
  );
};

export default Form;
