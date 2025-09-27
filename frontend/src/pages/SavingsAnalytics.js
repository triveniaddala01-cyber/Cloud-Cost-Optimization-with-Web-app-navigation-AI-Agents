import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import SavingsByResource from '../components/SavingsByResource';

const SavingsAnalytics = ({ savingsByResource }) => {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>Savings Analytics</Typography>
        <SavingsByResource data={savingsByResource} />
      </Paper>
    </Container>
  );
};

export default SavingsAnalytics;