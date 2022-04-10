import React from 'react';
import { mergeClasses } from '../common/utils/merge-classes';

type Props = {
  className?: string;
};

const Header: React.FC<Props> = ({ className, children }) => {
  return <h1 className={mergeClasses('font-sans text-2xl font-bold text-center pb-6', className)}>{children}</h1>;
};

export default Header;
