import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const RightsizingHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch('/api/rightsizing-history');
      const data = await response.json();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching rightsizing history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 95) return 'success';
    if (rate >= 85) return 'warning';
    return 'error';
  };

  const totalEstimatedSavings = historyData.reduce((sum, item) => sum + item.estimatedSavings, 0);
  const totalActualSavings = historyData.reduce((sum, item) => sum + item.actualSavings, 0);
  const overallSuccessRate = historyData.length > 0 
    ? historyData.reduce((sum, item) => sum + item.successRate, 0) / historyData.length 
    : 0;

  if (loading) {
    return <Typography>Loading rightsizing history...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Rightsizing Implementation History
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📊</span>
                <Typography variant="h6">
                  Total Implementations
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {historyData.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed rightsizing actions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📈</span>
                <Typography variant="h6">
                  Realized Savings
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {formatCurrency(totalActualSavings)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs {formatCurrency(totalEstimatedSavings)} estimated
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>✅</span>
                <Typography variant="h6">
                  Success Rate
                </Typography>
              </Box>
              <Typography variant="h3" color={getSuccessRateColor(overallSuccessRate)}>
                {overallSuccessRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average accuracy of estimates
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Alert */}
        {overallSuccessRate > 90 && (
          <Grid item xs={12}>
            <Alert severity="success">
              <AlertTitle>Excellent Rightsizing Performance</AlertTitle>
              Your rightsizing implementations are highly accurate with a {overallSuccessRate.toFixed(1)}% success rate. 
              Actual savings are closely matching estimates.
            </Alert>
          </Grid>
        )}

        {/* History Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Implementation History
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Resource ID</TableCell>
                      <TableCell>Change</TableCell>
                      <TableCell align="right">Estimated Savings</TableCell>
                      <TableCell align="right">Actual Savings</TableCell>
                      <TableCell align="right">Success Rate</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {item.resourceId.substring(0, 19)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip 
                              label={item.oldInstanceType} 
                              size="small" 
                              variant="outlined"
                              color="error"
                            />
                            <Typography variant="body2" component="span" sx={{ mx: 1 }}>
                              →
                            </Typography>
                            <Chip 
                              label={item.newInstanceType} 
                              size="small" 
                              variant="outlined"
                              color="success"
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatCurrency(item.estimatedSavings)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={item.actualSavings >= item.estimatedSavings ? 'success.main' : 'warning.main'}
                          >
                            {formatCurrency(item.actualSavings)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={getSuccessRateColor(item.successRate)}
                            >
                              {item.successRate.toFixed(1)}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={item.successRate}
                              color={getSuccessRateColor(item.successRate)}
                              sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {historyData.length === 0 && (
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: '#9e9e9e', marginBottom: '16px', display: 'block' }}>📊</span>
                  <Typography variant="h6" color="text.secondary">
                    No Rightsizing History Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Implement some rightsizing recommendations to see tracking data here
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RightsizingHistory;