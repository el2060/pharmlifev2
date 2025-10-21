import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
}) => {
  const cardClass = clsx(
    'card',
    {
      'cursor-pointer': onClick || hoverable,
    },
    className
  );

  if (onClick || hoverable) {
    return (
      <motion.div
        className={cardClass}
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cardClass}>{children}</div>;
};
