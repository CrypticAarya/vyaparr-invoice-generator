import React from 'react';
import { motion } from 'framer-motion';

const FloatingCard = ({ children, className = '', bgColor = 'bg-white', rotation = 0, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotation }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotate: rotation,
        transition: {
          delay,
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1]
        }
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      className={`absolute p-5 premium-card ${bgColor} ${className}`}
      style={{ '--rotation': `${rotation}deg` }}
    >
      <div className="floating-element">
        {children}
      </div>
    </motion.div>
  );
};

export default FloatingCard;
