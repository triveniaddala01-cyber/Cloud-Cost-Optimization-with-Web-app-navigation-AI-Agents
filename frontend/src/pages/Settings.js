import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

const Settings = () => {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        <Typography variant="body1">Configure your cloud cost management settings here.</Typography>
      </Paper>
    </Container>
  );
};

export default Settings;