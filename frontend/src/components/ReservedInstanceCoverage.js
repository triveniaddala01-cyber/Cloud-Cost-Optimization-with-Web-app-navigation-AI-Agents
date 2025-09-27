import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';

const ReservedInstanceCoverage = () => {
  const [coverageData, setCoverageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoverageData();
  }, []);

  const fetchCoverageData = async () => {
    try {
      const response = await fetch('/api/reserved-instance-coverage');
      const data = await response.json();
      setCoverageData(data);
    } catch (error) {
      console.error('Error fetching coverage data:', error);
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

  if (loading) {
    return <Typography>Loading reserved instance coverage data...</Typography>;
  }

  if (!coverageData) {
    return <Typography>No coverage data available</Typography>;
  }

  const getCoverageColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Reserved Instance Coverage Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Coverage Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Coverage Status
              </Typography>
              
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">
                    Reserved Instance Coverage
                  </Typography>
                  <Typography variant="h6" color={getCoverageColor(coverageData.coveragePercentage)}>
                    {coverageData.coveragePercentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={coverageData.coveragePercentage}
                  color={getCoverageColor(coverageData.coveragePercentage)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} bgcolor="background.paper" borderRadius={2}>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(coverageData.reservedCoverage)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reserved Coverage
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} bgcolor="background.paper" borderRadius={2}>
                    <Typography variant="h4" color="warning.main">
                      {formatCurrency(coverageData.onDemandCost)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      On-Demand Cost
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Potential Savings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>💰</span>
                <Typography variant="h6">
                  Potential Savings
                </Typography>
              </Box>
              
              <Typography variant="h3" color="success.main" gutterBottom>
                {formatCurrency(coverageData.potentialSavings)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Monthly savings available through reserved instance optimization
              </Typography>

              <Box mt={2}>
                <Chip
                  label={`${((coverageData.potentialSavings / coverageData.totalUsage) * 100).toFixed(1)}% Additional Savings`}
                  color="success"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reserved Instance Recommendations
              </Typography>

              {coverageData.coveragePercentage < 70 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <AlertTitle>Low Reserved Instance Coverage</AlertTitle>
                  Your current coverage is below the recommended 70%. Consider purchasing additional reserved instances to optimize costs.
                </Alert>
              )}

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Instance Type</TableCell>
                      <TableCell align="right">Current On-Demand</TableCell>
                      <TableCell align="right">Recommended Reserved</TableCell>
                      <TableCell align="right">Monthly Savings</TableCell>
                      <TableCell align="right">Annual Savings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coverageData.recommendations.map((rec, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            label={rec.instanceType} 
                            variant="outlined" 
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {rec.currentOnDemand} instances
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {rec.recommendedReserved} instances
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            {formatCurrency(rec.monthlySavings)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            {formatCurrency(rec.monthlySavings * 12)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  * Savings calculations are based on 1-year reserved instance terms with standard payment options
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReservedInstanceCoverage;