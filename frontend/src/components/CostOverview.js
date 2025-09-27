import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const CostOverview = ({ totalCost, monthlyCost, yearlyProjection }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Cost Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Current Total Cost
            </Typography>
            <Typography variant="h4" color="primary">
              ${totalCost || '0.00'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Monthly Average
            </Typography>
            <Typography variant="h4" color="primary">
              ${monthlyCost || '0.00'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Yearly Projection
            </Typography>
            <Typography variant="h4" color="primary">
              ${yearlyProjection || '0.00'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CostOverview;