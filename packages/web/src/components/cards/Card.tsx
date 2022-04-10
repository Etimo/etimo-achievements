import React from 'react';

const Card: React.FC = ({ children }) => {
  return <div className="w-full border-2 border-slate-200 p-6 bg-slate-100">{children}</div>;
};

export default Card;
