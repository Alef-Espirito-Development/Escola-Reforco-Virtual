import React from 'react';
import { Box, Typography, IconButton, Grid, Link } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        backgroundColor: '#2e7d32',
        color: 'white',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        E. R. T - Escola de Reforço para todos
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <IconButton component={Link} href="https://www.facebook.com" target="_blank" rel="noopener" sx={{ color: 'white' }}>
            <Facebook />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton component={Link} href="https://www.twitter.com" target="_blank" rel="noopener" sx={{ color: 'white' }}>
            <Twitter />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton component={Link} href="https://www.instagram.com/alef_espirito/?next=%2F" target="_blank" rel="noopener" sx={{ color: 'white' }}>
            <Instagram />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton component={Link} href="https://www.linkedin.com" target="_blank" rel="noopener" sx={{ color: 'white' }}>
            <LinkedIn />
          </IconButton>
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {'Copyright © '}
        {new Date().getFullYear()}
        {'. Todos os direitos reservados.'}
      </Typography>
    </Box>
  );
};

export default Footer;
