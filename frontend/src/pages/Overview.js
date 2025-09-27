import React from 'react';
import { Box, Container, Grid, Paper, Typography, Card, CardContent, LinearProgress, Chip, Alert, AlertTitle } from '@mui/material';
import CostTrends from '../components/CostTrends';
import SavingsByResource from '../components/SavingsByResource';
import ProjectedCost from '../components/ProjectedCost';

const Overview = ({ costOverview, costTrends, savingsByResource, projectedCost }) => {
  // Calculate some dashboard metrics
  const savingsPercentage = costOverview?.totalCost > 0 
    ? ((costOverview?.estimatedSavings || 0) / (costOverview?.totalCost || 1)) * 100 
    : 0;
  
  const totalResources = (costOverview?.idleResources || 0) + (costOverview?.oversizedResources || 0);
  const optimizationScore = totalResources > 0 ? Math.max(0, 100 - (totalResources * 5)) : 85;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Cloud Cost Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your cloud spending, track savings opportunities, and optimize resource usage
        </Typography>
      </Box>

      {/* Key Metrics Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 3,
        '& > *': {
          minWidth: { xs: '100%', sm: '200px' },
          flex: { xs: '1 1 100%', sm: '1 0 200px' }
        }
      }}>
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }} noWrap>Total Cost</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, wordBreak: 'break-word' }}>
            ${costOverview?.totalCost || '0.00'}
          </Typography>
        </Paper>
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }} noWrap>Estimated Savings</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, wordBreak: 'break-word' }}>
            ${costOverview?.estimatedSavings || '0.00'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {savingsPercentage.toFixed(1)}% potential savings
          </Typography>
        </Paper>
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }} noWrap>Idle Resources</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, wordBreak: 'break-word' }}>
            {costOverview?.idleResources || '0'}
          </Typography>
        </Paper>
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white'
        }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }} noWrap>Oversized Resources</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, wordBreak: 'break-word' }}>
            {costOverview?.oversizedResources || '0'}
          </Typography>
        </Paper>
      </Box>

      {/* Optimization Score and Quick Insights */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optimization Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 2 }}>
                  {optimizationScore}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  / 100
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={optimizationScore} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  mb: 2,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: optimizationScore > 80 ? '#4caf50' : optimizationScore > 60 ? '#ff9800' : '#f44336'
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {optimizationScore > 80 ? 'Excellent optimization!' : 
                 optimizationScore > 60 ? 'Good, but room for improvement' : 
                 'Significant optimization opportunities available'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Insights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {savingsPercentage > 20 && (
                  <Alert severity="warning" sx={{ py: 0.5 }}>
                    <AlertTitle sx={{ fontSize: '0.875rem', mb: 0 }}>High Savings Potential</AlertTitle>
                    You could save over {savingsPercentage.toFixed(0)}% on your cloud costs
                  </Alert>
                )}
                {(costOverview?.idleResources || 0) > 5 && (
                  <Alert severity="info" sx={{ py: 0.5 }}>
                    <AlertTitle sx={{ fontSize: '0.875rem', mb: 0 }}>Idle Resources Detected</AlertTitle>
                    {costOverview?.idleResources} resources are currently idle
                  </Alert>
                )}
                {totalResources === 0 && (
                  <Alert severity="success" sx={{ py: 0.5 }}>
                    <AlertTitle sx={{ fontSize: '0.875rem', mb: 0 }}>Well Optimized</AlertTitle>
                    Your resources are efficiently utilized
                  </Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>Cost Trends</Typography>
            <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
              <CostTrends data={costTrends} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>Savings by Resource Type</Typography>
            <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
              <SavingsByResource data={savingsByResource} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '400px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>Projected Cost</Typography>
            <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
              <ProjectedCost data={projectedCost} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Resource Status Overview
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Active Resources</Typography>
                    <Chip label="Healthy" color="success" size="small" />
                  </Box>
                  <LinearProgress variant="determinate" value={85} sx={{ height: 6, borderRadius: 3 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Cost Efficiency</Typography>
                    <Chip 
                      label={optimizationScore > 80 ? "Excellent" : optimizationScore > 60 ? "Good" : "Needs Work"} 
                      color={optimizationScore > 80 ? "success" : optimizationScore > 60 ? "warning" : "error"} 
                      size="small" 
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={optimizationScore} 
                    sx={{ height: 6, borderRadius: 3 }}
                    color={optimizationScore > 80 ? "success" : optimizationScore > 60 ? "warning" : "error"}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Savings Potential</Typography>
                    <Chip 
                      label={`${savingsPercentage.toFixed(0)}%`} 
                      color={savingsPercentage > 15 ? "warning" : "success"} 
                      size="small" 
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(savingsPercentage * 2, 100)} 
                    sx={{ height: 6, borderRadius: 3 }}
                    color={savingsPercentage > 15 ? "warning" : "success"}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Overview;