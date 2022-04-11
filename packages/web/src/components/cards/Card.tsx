import React from 'react';

const Card: React.FC = ({ children }) => {
  return <div className="border-2 border-slate-200 p-6 pb-0 bg-slate-100">{children}</div>;
};

export default Card;
