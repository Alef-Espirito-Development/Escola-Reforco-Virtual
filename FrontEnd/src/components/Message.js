import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Message = ({ type, text }) => {
  const getColor = () => {
    switch (type) {
      case 'success':
        return '#4caf50'; // green
      case 'error':
        return '#f44336'; // red
      case 'warning':
        return '#ff9800'; // orange
      default:
        return '#000'; // black
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2,
          p: 2,
          borderRadius: 1,
          backgroundColor: getColor(),
          color: '#fff',
          boxShadow: 3,
        }}
      >
        <Typography variant="h6">{text}</Typography>
      </Box>
    </motion.div>
  );
};

export default Message;
