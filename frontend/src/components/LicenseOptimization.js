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
  AlertTitle,
  Tooltip
} from '@mui/material';
import {
  Error as ErrorIcon
} from '@mui/icons-material';

const LicenseOptimization = () => {
  const [licenseData, setLicenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLicenseData();
  }, []);

  const fetchLicenseData = async () => {
    try {
      const response = await fetch('/api/license-optimization');
      const data = await response.json();
      setLicenseData(data);
    } catch (error) {
      console.error('Error fetching license data:', error);
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

  const getUtilizationColor = (utilization) => {
    if (!utilization && utilization !== 0) return 'error';
    if (utilization >= 80) return 'success';
    if (utilization >= 60) return 'warning';
    return 'error';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const totalCurrentCost = licenseData.reduce((sum, item) => sum + item.currentCost, 0);
  const totalPotentialSavings = licenseData.reduce((sum, item) => sum + item.potentialSavings, 0);
  const averageUtilization = licenseData.length > 0 
    ? licenseData.reduce((sum, item) => sum + item.utilization, 0) / licenseData.length 
    : 0;

  if (loading) {
    return <Typography>Loading license optimization data...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        License Management & Optimization
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📄</span>
                <Typography variant="h6">
                  Total License Cost
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {formatCurrency(totalCurrentCost)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly software licensing
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📉</span>
                <Typography variant="h6">
                  Potential Savings
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {formatCurrency(totalPotentialSavings)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalCurrentCost > 0 ? ((totalPotentialSavings / totalCurrentCost) * 100).toFixed(1) : 0}% reduction possible
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span>✅</span>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Avg Utilization
                </Typography>
              </Box>
              <Typography variant="h3" color={getUtilizationColor(averageUtilization)}>
                {averageUtilization ? averageUtilization.toFixed(1) : 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                License usage efficiency
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Optimization Alert */}
        {totalPotentialSavings > 1000 && (
          <Grid item xs={12}>
            <Alert severity="warning">
              <AlertTitle>Significant License Optimization Opportunity</AlertTitle>
              You could save {formatCurrency(totalPotentialSavings)} monthly by optimizing your software licenses. 
              Review underutilized licenses and consider rightsizing or alternative licensing models.
            </Alert>
          </Grid>
        )}

        {/* License Details Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                License Analysis & Recommendations
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Software</TableCell>
                      <TableCell>License Type</TableCell>
                      <TableCell align="right">Licenses</TableCell>
                      <TableCell align="right">Utilization</TableCell>
                      <TableCell align="right">Current Cost</TableCell>
                      <TableCell align="right">Potential Savings</TableCell>
                      <TableCell>Recommendation</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {licenseData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {item.software}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.version}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.licenseType} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box>
                            <Typography variant="body2">
                              {item.usedLicenses} / {item.totalLicenses}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.totalLicenses - item.usedLicenses} unused
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={getUtilizationColor(item.utilization)}
                            >
                              {item.utilization ? item.utilization.toFixed(1) : 0}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={item.utilization}
                              color={getUtilizationColor(item.utilization)}
                              sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatCurrency(item.currentCost)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color="success.main"
                          >
                            {formatCurrency(item.potentialSavings)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              icon={
              item.severity === 'high' ? <span style={{ fontSize: '16px' }}>🔴</span> :
              item.severity === 'medium' ? <span style={{ fontSize: '16px' }}>ℹ️</span> :
              <span style={{ fontSize: '16px' }}>✅</span>
            }
                              label={item.recommendation}
                              color={getSeverityColor(item.severity)}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                              {item.details}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Implement ${item.recommendation ? item.recommendation.toLowerCase() : 'optimization'}`}>
                            <Typography
                              variant="body2"
                              sx={{ 
                                cursor: item.severity === 'low' ? 'default' : 'pointer',
                                color: item.severity === 'low' ? 'text.disabled' : 'primary.main',
                                fontWeight: 'bold'
                              }}
                              disabled={item.severity === 'low'}
                            >
                              Optimize
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {licenseData.length === 0 && (
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: '#9e9e9e', marginBottom: '16px', display: 'block' }}>📄</span>
                  <Typography variant="h6" color="text.secondary">
                    No License Data Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect your software asset management system to see license optimization opportunities
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* License Optimization Tips */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                License Optimization Best Practices
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>Regular Audits</AlertTitle>
                    Conduct quarterly license audits to identify unused or underutilized software
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Volume Discounts</AlertTitle>
                    Consolidate purchases to take advantage of enterprise volume pricing
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <AlertTitle>Alternative Models</AlertTitle>
                    Consider subscription vs perpetual licenses based on usage patterns
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Compliance Risk</AlertTitle>
                    Ensure license compliance to avoid costly penalties and legal issues
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LicenseOptimization;