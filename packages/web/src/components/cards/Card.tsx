import React from 'react';
import { mergeClasses } from '../../common/utils/merge-classes';

type Props = {
  className?: string;
};

const Card: React.FC<Props> = ({ children, className }) => {
  return <div className={mergeClasses('border-2 border-slate-200 p-6 pb-0 bg-slate-100', className)}>{children}</div>;
};

export default Card;
