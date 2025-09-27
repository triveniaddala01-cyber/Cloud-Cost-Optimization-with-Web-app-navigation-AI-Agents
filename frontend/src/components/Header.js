import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cloud Cost Optimizer
        </Typography>
        <Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;