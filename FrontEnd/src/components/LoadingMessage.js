import React from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingMessage = ({ loading, message }) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          {message && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </motion.div>
    </Backdrop>
  );
};

export default LoadingMessage;
