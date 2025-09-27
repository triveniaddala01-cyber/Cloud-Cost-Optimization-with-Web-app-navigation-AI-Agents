import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const TCOCalculator = () => {
  const [inputs, setInputs] = useState({
    storage: 2000, // GB
    monthlyRequests: 500000,
    egressTraffic: 1000, // GB
    computeHours: 720, // hours per month
    databaseIOPS: 1000,
    region: 'us-east'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const providers = {
    aws: {
      name: 'Amazon Web Services',
      color: '#FF9900',
      pricing: {
        storage: 0.023, // per GB/month
        requests: 0.0000004, // per request
        egress: 0.09, // per GB
        compute: 0.0116, // per hour (t3.micro)
        iops: 0.065 // per IOPS/month
      },
      hiddenCosts: {
        dataTransfer: 0.02,
        apiCalls: 0.0000005,
        monitoring: 3.50
      }
    },
    azure: {
      name: 'Microsoft Azure',
      color: '#0078D4',
      pricing: {
        storage: 0.0208,
        requests: 0.0000004,
        egress: 0.087,
        compute: 0.0134,
        iops: 0.055
      },
      hiddenCosts: {
        dataTransfer: 0.025,
        apiCalls: 0.0000006,
        monitoring: 4.00
      }
    },
    gcp: {
      name: 'Google Cloud Platform',
      color: '#4285F4',
      pricing: {
        storage: 0.020,
        requests: 0.0000004,
        egress: 0.085,
        compute: 0.0104,
        iops: 0.045
      },
      hiddenCosts: {
        dataTransfer: 0.01,
        apiCalls: 0.0000004,
        monitoring: 2.50
      }
    },
    digitalocean: {
      name: 'DigitalOcean',
      color: '#0080FF',
      pricing: {
        storage: 0.015,
        requests: 0.0000002,
        egress: 0.01, // Much cheaper egress
        compute: 0.0089,
        iops: 0.030
      },
      hiddenCosts: {
        dataTransfer: 0.005,
        apiCalls: 0.0000002,
        monitoring: 0.00 // Free monitoring
      }
    },
    backblaze: {
      name: 'Backblaze B2',
      color: '#E31E24',
      pricing: {
        storage: 0.005, // Very cheap storage
        requests: 0.0000001,
        egress: 0.01, // Free first 3x storage
        compute: 0.0150, // Higher compute cost
        iops: 0.020
      },
      hiddenCosts: {
        dataTransfer: 0.001,
        apiCalls: 0.0000001,
        monitoring: 1.00
      }
    }
  };

  const calculateTCO = () => {
    setLoading(true);
    
    const calculations = {};
    
    Object.keys(providers).forEach(providerKey => {
      const provider = providers[providerKey];
      const pricing = provider.pricing;
      const hidden = provider.hiddenCosts;
      
      // Base costs
      const storageCost = inputs.storage * pricing.storage;
      const requestsCost = inputs.monthlyRequests * pricing.requests;
      const egressCost = inputs.egressTraffic * pricing.egress;
      const computeCost = inputs.computeHours * pricing.compute;
      const iopsCost = inputs.databaseIOPS * pricing.iops;
      
      // Hidden costs
      const dataTransferCost = inputs.egressTraffic * hidden.dataTransfer;
      const apiCallsCost = inputs.monthlyRequests * hidden.apiCalls;
      const monitoringCost = hidden.monitoring;
      
      const subtotal = storageCost + requestsCost + egressCost + computeCost + iopsCost;
      const hiddenTotal = dataTransferCost + apiCallsCost + monitoringCost;
      const total = subtotal + hiddenTotal;
      
      calculations[providerKey] = {
        name: provider.name,
        color: provider.color,
        breakdown: {
          storage: storageCost,
          requests: requestsCost,
          egress: egressCost,
          compute: computeCost,
          iops: iopsCost
        },
        hiddenCosts: {
          dataTransfer: dataTransferCost,
          apiCalls: apiCallsCost,
          monitoring: monitoringCost,
          total: hiddenTotal
        },
        subtotal,
        total,
        savings: 0 // Will be calculated after sorting
      };
    });
    
    // Calculate savings compared to most expensive
    const sortedResults = Object.values(calculations).sort((a, b) => a.total - b.total);
    const mostExpensive = sortedResults[sortedResults.length - 1].total;
    
    Object.keys(calculations).forEach(key => {
      calculations[key].savings = ((mostExpensive - calculations[key].total) / mostExpensive * 100);
    });
    
    setResults(calculations);
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const exportToSpreadsheet = () => {
    if (!results) return;
    
    const csvData = [
      ['Provider', 'Storage Cost', 'Requests Cost', 'Egress Cost', 'Compute Cost', 'IOPS Cost', 'Hidden Costs', 'Total Cost', 'Savings %'],
      ...Object.values(results).map(result => [
        result.name,
        result.breakdown.storage.toFixed(2),
        result.breakdown.requests.toFixed(2),
        result.breakdown.egress.toFixed(2),
        result.breakdown.compute.toFixed(2),
        result.breakdown.iops.toFixed(2),
        result.hiddenCosts.total.toFixed(2),
        result.total.toFixed(2),
        result.savings.toFixed(1) + '%'
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tco-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sortedResults = results ? 
    Object.values(results).sort((a, b) => a.total - b.total) : [];

  const cheapestProvider = sortedResults[0];
  const mostExpensiveProvider = sortedResults[sortedResults.length - 1];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        💰 Total Cost of Ownership (TCO) Calculator
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Focus: Predictability</strong> - Compare the complete monthly cost including ALL fees 
          (egress, IOPS, API calls) across 5 providers to eliminate pricing shock.
        </Typography>
      </Alert>

      {/* Input Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Enter Your Requirements
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Required"
                type="number"
                value={inputs.storage}
                onChange={(e) => handleInputChange('storage', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">GB</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Requests"
                type="number"
                value={inputs.monthlyRequests}
                onChange={(e) => handleInputChange('monthlyRequests', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">requests</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Egress Traffic"
                type="number"
                value={inputs.egressTraffic}
                onChange={(e) => handleInputChange('egressTraffic', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">GB</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Compute Hours per Month"
                type="number"
                value={inputs.computeHours}
                onChange={(e) => handleInputChange('computeHours', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">hours</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Database IOPS Required"
                type="number"
                value={inputs.databaseIOPS}
                onChange={(e) => handleInputChange('databaseIOPS', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">IOPS</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Region</InputLabel>
                <Select
                  value={inputs.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  label="Primary Region"
                >
                  <MenuItem value="us-east">US East (N. Virginia)</MenuItem>
                  <MenuItem value="us-west">US West (Oregon)</MenuItem>
                  <MenuItem value="eu-west">EU West (Ireland)</MenuItem>
                  <MenuItem value="eu-central">EU Central (Frankfurt)</MenuItem>
                  <MenuItem value="asia-pacific">Asia Pacific (Singapore)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={calculateTCO}
              disabled={loading}
            >
              📈 {loading ? 'Calculating...' : 'Calculate TCO'}
            </Button>
            
            {results && (
              <Button 
                variant="outlined" 
                onClick={exportToSpreadsheet}
              >
                📥 Export to CSV
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: 'success.light', 
                color: 'success.contrastText',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  textAlign: 'center',
                  p: 3
                }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    ✅ Cheapest Option
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold',
                    mb: 1,
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cheapestProvider?.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    ${cheapestProvider?.total.toFixed(2)}/month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: 'warning.light', 
                color: 'warning.contrastText',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  textAlign: 'center',
                  p: 3
                }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    ⚠️ Most Expensive
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold',
                    mb: 1,
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {mostExpensiveProvider?.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    ${mostExpensiveProvider?.total.toFixed(2)}/month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: 'info.light', 
                color: 'info.contrastText',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  textAlign: 'center',
                  p: 3
                }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    💰 Potential Savings
                  </Typography>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold',
                    mb: 1,
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cheapestProvider?.savings.toFixed(1)}%
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    ${(mostExpensiveProvider?.total - cheapestProvider?.total).toFixed(2)}/month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <Button 
              variant="outlined" 
              onClick={exportToSpreadsheet}
              sx={{ minWidth: '160px' }}
            >
              📥 Export to CSV
            </Button>
            <Button 
              variant="contained" 
              onClick={calculateTCO}
              disabled={loading}
              sx={{ minWidth: '160px' }}
            >
              🔄 Recalculate
            </Button>
          </Box>

          {/* Detailed Comparison Table */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Detailed Cost Breakdown
                </Typography>
              </Box>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Provider</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Storage</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Requests</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Egress</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Compute</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>IOPS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Hidden Costs</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Savings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedResults.map((result, index) => (
                      <TableRow 
                        key={result.name}
                        sx={{ 
                          bgcolor: index === 0 ? 'success.light' : 'inherit',
                          '&:hover': { bgcolor: 'action.hover' },
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              sx={{ 
                                width: 12, 
                                height: 12, 
                                bgcolor: result.color, 
                                borderRadius: '50%', 
                                mr: 2,
                                flexShrink: 0
                              }} 
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {result.name}
                            </Typography>
                            {index === 0 && (
                              <Chip 
                                label="Best" 
                                size="small" 
                                color="success" 
                                sx={{ ml: 1, fontSize: '0.7rem' }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography variant="body2">
                            ${result.breakdown.storage.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography variant="body2">
                            ${result.breakdown.requests.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography variant="body2">
                            ${result.breakdown.egress.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography variant="body2">
                            ${result.breakdown.compute.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography variant="body2">
                            ${result.breakdown.iops.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography variant="body2">
                            ${result.hiddenCosts.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: index === 0 ? 'success.main' : 'inherit',
                              fontWeight: 'bold'
                            }}
                          >
                            ${result.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Chip 
                            label={`${result.savings.toFixed(1)}%`}
                            color={result.savings > 20 ? 'success' : result.savings > 0 ? 'warning' : 'default'}
                            size="small"
                            sx={{ minWidth: '60px' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Egress Cost Analysis */}
          <Accordion>
            <AccordionSummary expandIcon={<span>🔽</span>}>
              <Typography variant="h6">
                🚨 Egress Cost Minimization Recommendations
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>High Egress Traffic Detected!</strong> You're transferring {inputs.egressTraffic}GB/month. 
                  This is often the biggest "hidden" cost for startups with high traffic.
                </Typography>
              </Alert>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Move Static Assets to Backblaze B2 or Wasabi"
                    secondary={`Save up to ${((results.aws.breakdown.egress - results.backblaze.breakdown.egress) / results.aws.breakdown.egress * 100).toFixed(1)}% on egress costs`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Use DigitalOcean Spaces for CDN"
                    secondary="Free egress up to bandwidth limits, then $0.01/GB vs AWS $0.09/GB"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Implement Aggressive Caching"
                    secondary="Reduce egress by 60-80% with proper CDN configuration and browser caching"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};

export default TCOCalculator;