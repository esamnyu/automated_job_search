// components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white shadow rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
