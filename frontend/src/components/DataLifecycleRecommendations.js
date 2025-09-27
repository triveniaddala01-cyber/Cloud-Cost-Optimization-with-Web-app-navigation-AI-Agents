import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

const DataLifecycleRecommendations = () => {
  const [lifecycleData, setLifecycleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLifecycleData();
  }, []);

  const fetchLifecycleData = async () => {
    try {
      const response = await fetch('/api/data-lifecycle-recommendations');
      const data = await response.json();
      setLifecycleData(data);
    } catch (error) {
      console.error('Error fetching data lifecycle recommendations:', error);
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

  const formatBytes = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStorageTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'standard': return 'primary';
      case 'infrequent access': return 'warning';
      case 'glacier': return 'info';
      case 'deep archive': return 'success';
      default: return 'default';
    }
  };

  const getAccessFrequencyColor = (frequency) => {
    if (frequency === 'Daily') return 'error';
    if (frequency === 'Weekly') return 'warning';
    if (frequency === 'Monthly') return 'info';
    return 'success';
  };

  const totalCurrentCost = lifecycleData.reduce((sum, item) => sum + item.currentMonthlyCost, 0);
  const totalPotentialSavings = lifecycleData.reduce((sum, item) => sum + item.potentialSavings, 0);
  const totalDataSize = lifecycleData.reduce((sum, item) => sum + item.sizeGB, 0);

  if (loading) {
    return <Typography>Loading data lifecycle recommendations...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Data Lifecycle & Storage Optimization
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>💾</span>
                <Typography variant="h6">
                  Total Data
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {formatBytes(totalDataSize * 1024 * 1024 * 1024)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all storage tiers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📉</span>
                <Typography variant="h6">
                  Monthly Savings
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {formatCurrency(totalPotentialSavings)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((totalPotentialSavings / totalCurrentCost) * 100).toFixed(1)}% reduction
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📅</span>
                <Typography variant="h6">
                  Current Cost
                </Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {formatCurrency(totalCurrentCost)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly storage costs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📦</span>
                <Typography variant="h6">
                  Opportunities
                </Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {lifecycleData.filter(item => item.potentialSavings > 0).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optimization candidates
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Optimization Alert */}
        {totalPotentialSavings > 500 && (
          <Grid item xs={12}>
            <Alert severity="info">
              <AlertTitle>Data Lifecycle Optimization Opportunity</AlertTitle>
              You could save {formatCurrency(totalPotentialSavings)} monthly by implementing data lifecycle policies. 
              Consider moving infrequently accessed data to cheaper storage tiers.
            </Alert>
          </Grid>
        )}

        {/* Data Lifecycle Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Storage Analysis & Recommendations
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Dataset</TableCell>
                      <TableCell>Current Tier</TableCell>
                      <TableCell align="right">Size</TableCell>
                      <TableCell>Access Pattern</TableCell>
                      <TableCell>Recommended Tier</TableCell>
                      <TableCell align="right">Current Cost</TableCell>
                      <TableCell align="right">Potential Savings</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lifecycleData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {item.datasetName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.location}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.currentTier} 
                            size="small" 
                            color={getStorageTierColor(item.currentTier)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatBytes(item.sizeGB * 1024 * 1024 * 1024)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              label={item.accessFrequency}
                              size="small"
                              color={getAccessFrequencyColor(item.accessFrequency)}
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                              Last accessed: {item.lastAccessed}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.recommendedTier} 
                            size="small" 
                            color={getStorageTierColor(item.recommendedTier)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatCurrency(item.currentMonthlyCost)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={item.potentialSavings > 0 ? 'success.main' : 'text.secondary'}
                          >
                            {item.potentialSavings > 0 ? formatCurrency(item.potentialSavings) : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Move to ${item.recommendedTier}`}>
                            <Typography
                              size="small"
                              disabled={item.potentialSavings === 0}
                              sx={{ 
                                cursor: item.potentialSavings === 0 ? 'not-allowed' : 'pointer', 
                                color: item.potentialSavings === 0 ? 'text.disabled' : 'primary.main',
                                fontWeight: 'bold',
                                padding: '4px 8px',
                                border: '1px solid',
                                borderColor: item.potentialSavings === 0 ? 'text.disabled' : 'primary.main',
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                opacity: item.potentialSavings === 0 ? 0.5 : 1,
                                '&:hover': item.potentialSavings > 0 ? {
                                  backgroundColor: 'primary.light',
                                  color: 'white'
                                } : {}
                              }}
                            >
                              Migrate
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {lifecycleData.length === 0 && (
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: '#9e9e9e', marginBottom: '16px', display: 'block' }}>💾</span>
                  <Typography variant="h6" color="text.secondary">
                    No Data Lifecycle Analysis Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect your storage systems to analyze data access patterns and lifecycle opportunities
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Storage Tier Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Storage Tier Comparison
              </Typography>
              
              <Accordion>
                <AccordionSummary expandIcon={<span>▼</span>}>
                  <Typography variant="subtitle1">AWS S3 Storage Classes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Alert severity="info" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">Standard</Typography>
                        <Typography variant="body2">
                          Frequently accessed data. $0.023/GB/month. Millisecond access.
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Alert severity="warning" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">Infrequent Access (IA)</Typography>
                        <Typography variant="body2">
                          Less frequently accessed. $0.0125/GB/month. Millisecond access.
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Alert severity="info" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">Glacier Instant Retrieval</Typography>
                        <Typography variant="body2">
                          Archive with instant access. $0.004/GB/month. Millisecond access.
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Alert severity="success" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">Glacier Deep Archive</Typography>
                        <Typography variant="body2">
                          Long-term archive. $0.00099/GB/month. 12-hour retrieval.
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<span>▼</span>}>
                  <Typography variant="subtitle1">Best Practices</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="start" mb={2}>
                        <span style={{ marginRight: '8px', marginTop: '4px', fontSize: '20px' }}>ℹ️</span>
                        <Box>
                          <Typography variant="subtitle2">Automated Lifecycle Policies</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Set up automatic transitions based on object age and access patterns
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="start" mb={2}>
                        <span style={{ marginRight: '8px', marginTop: '4px', fontSize: '20px' }}>ℹ️</span>
                        <Box>
                          <Typography variant="subtitle2">Access Pattern Analysis</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Monitor CloudTrail logs to understand actual data access patterns
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="start" mb={2}>
                        <span style={{ marginRight: '8px', marginTop: '4px', fontSize: '20px' }}>ℹ️</span>
                        <Box>
                          <Typography variant="subtitle2">Intelligent Tiering</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Use S3 Intelligent-Tiering for automatic cost optimization
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="start" mb={2}>
                        <span style={{ marginRight: '8px', marginTop: '4px', fontSize: '20px' }}>ℹ️</span>
                        <Box>
                          <Typography variant="subtitle2">Deletion Policies</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Implement automatic deletion for temporary and log data
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataLifecycleRecommendations;