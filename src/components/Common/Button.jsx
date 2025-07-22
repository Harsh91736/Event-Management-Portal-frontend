import React from 'react';
import clsx from 'clsx';

const Button = ({ type = 'button', onClick, children, disabled, className, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
