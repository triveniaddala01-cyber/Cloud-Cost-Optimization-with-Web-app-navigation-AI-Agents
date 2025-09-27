import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
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
  Slider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  AlertTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';

const WhatIfAnalysis = () => {
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState({
    name: '',
    changeType: 'instance_type',
    resourcePercentage: 50,
    newInstanceType: 't3.medium',
    userGrowth: 0,
    additionalServices: [],
    timeframe: 12
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExistingScenarios();
  }, []);

  const fetchExistingScenarios = async () => {
    try {
      const response = await fetch('/api/what-if-scenarios');
      const data = await response.json();
      setScenarios(data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/what-if-scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentScenario),
      });
      const result = await response.json();
      setAnalysisResult(result);
      
      // Add to scenarios list
      setScenarios(prev => [...prev, result]);
    } catch (error) {
      console.error('Error running analysis:', error);
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

  const getImpactColor = (impact) => {
    if (impact > 0) return 'error';
    if (impact < 0) return 'success';
    return 'info';
  };

  const getImpactIcon = (impact) => {
    if (impact > 0) {
      return <span style={{ fontSize: '16px' }}>📈</span>;
    } else if (impact < 0) {
      return <span style={{ fontSize: '16px' }}>📉</span>;
    } else {
      return <span style={{ fontSize: '16px' }}>📊</span>;
    }
  };

  const chartData = analysisResult ? {
    labels: analysisResult.projectedCosts.map((_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Current Trajectory',
        data: analysisResult.baselineCosts,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'What-If Scenario',
        data: analysisResult.projectedCosts,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cost Projection Comparison'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        What-If Scenario Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Scenario Builder */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create New Scenario
              </Typography>

              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Scenario Name"
                  value={currentScenario.name}
                  onChange={(e) => setCurrentScenario(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Change Type</InputLabel>
                  <Select
                    value={currentScenario.changeType}
                    onChange={(e) => setCurrentScenario(prev => ({ ...prev, changeType: e.target.value }))}
                  >
                    <MenuItem value="instance_type">Instance Type Change</MenuItem>
                    <MenuItem value="user_growth">User Growth</MenuItem>
                    <MenuItem value="service_addition">Add Services</MenuItem>
                    <MenuItem value="region_change">Region Migration</MenuItem>
                    <MenuItem value="reserved_instances">Reserved Instance Purchase</MenuItem>
                  </Select>
                </FormControl>

                {currentScenario.changeType === 'instance_type' && (
                  <>
                    <Typography gutterBottom>
                      Percentage of Resources to Change: {currentScenario.resourcePercentage}%
                    </Typography>
                    <Slider
                      value={currentScenario.resourcePercentage}
                      onChange={(e, value) => setCurrentScenario(prev => ({ ...prev, resourcePercentage: value }))}
                      min={10}
                      max={100}
                      step={10}
                      marks
                      sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>New Instance Type</InputLabel>
                      <Select
                        value={currentScenario.newInstanceType}
                        onChange={(e) => setCurrentScenario(prev => ({ ...prev, newInstanceType: e.target.value }))}
                      >
                        <MenuItem value="t3.micro">t3.micro</MenuItem>
                        <MenuItem value="t3.small">t3.small</MenuItem>
                        <MenuItem value="t3.medium">t3.medium</MenuItem>
                        <MenuItem value="t3.large">t3.large</MenuItem>
                        <MenuItem value="m5.large">m5.large</MenuItem>
                        <MenuItem value="m5.xlarge">m5.xlarge</MenuItem>
                        <MenuItem value="c5.large">c5.large</MenuItem>
                        <MenuItem value="r5.large">r5.large</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}

                {currentScenario.changeType === 'user_growth' && (
                  <>
                    <Typography gutterBottom>
                      Expected User Growth: {currentScenario.userGrowth}%
                    </Typography>
                    <Slider
                      value={currentScenario.userGrowth}
                      onChange={(e, value) => setCurrentScenario(prev => ({ ...prev, userGrowth: value }))}
                      min={0}
                      max={200}
                      step={10}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                        { value: 200, label: '200%' }
                      ]}
                      sx={{ mb: 2 }}
                    />
                  </>
                )}

                <Typography gutterBottom>
                  Analysis Timeframe: {currentScenario.timeframe} months
                </Typography>
                <Slider
                  value={currentScenario.timeframe}
                  onChange={(e, value) => setCurrentScenario(prev => ({ ...prev, timeframe: value }))}
                  min={3}
                  max={36}
                  step={3}
                  marks={[
                    { value: 3, label: '3m' },
                    { value: 12, label: '1y' },
                    { value: 24, label: '2y' },
                    { value: 36, label: '3y' }
                  ]}
                  sx={{ mb: 3 }}
                />

                <Typography
                  variant="body1"
                  onClick={runAnalysis}
                  disabled={loading || !currentScenario.name}
                  sx={{ 
                    cursor: 'pointer', 
                    color: (loading || !currentScenario.name) ? 'text.disabled' : 'primary.main', 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    py: 1
                  }}
                >
                  {loading ? 'Analyzing...' : 'Run Analysis'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Results */}
        <Grid item xs={12} md={6}>
          {analysisResult ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Results: {analysisResult.scenarioName}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {formatCurrency(analysisResult.currentMonthlyCost)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current Monthly Cost
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography 
                        variant="h4" 
                        color={getImpactColor(analysisResult.projectedMonthlyCost - analysisResult.currentMonthlyCost)}
                      >
                        {formatCurrency(analysisResult.projectedMonthlyCost)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Projected Monthly Cost
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Alert 
                  severity={analysisResult.totalImpact < 0 ? 'success' : 'warning'}
                  icon={getImpactIcon(analysisResult.totalImpact)}
                  sx={{ mb: 2 }}
                >
                  <AlertTitle>
                    {analysisResult.totalImpact < 0 ? 'Cost Savings' : 'Cost Increase'}
                  </AlertTitle>
                  {Math.abs(analysisResult.totalImpact) < 0 ? 'Save' : 'Additional cost of'} {' '}
                  {formatCurrency(Math.abs(analysisResult.totalImpact))} over {currentScenario.timeframe} months
                </Alert>

                {chartData && (
                  <Box sx={{ height: 300, mb: 2 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                )}

                <Typography variant="subtitle1" gutterBottom>
                  Key Metrics
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Chip 
                      label={`ROI: ${analysisResult.roi}%`} 
                      color={analysisResult.roi > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip 
                      label={`Payback: ${analysisResult.paybackMonths}m`} 
                      color="info"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: '#666', marginBottom: '16px', display: 'block' }}>📊</span>
                  <Typography variant="h6" color="text.secondary">
                    No Scenarios Created Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first what-if scenario to start analyzing cost impacts
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Saved Scenarios */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scenario History
              </Typography>

              {scenarios.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Scenario Name</TableCell>
                        <TableCell>Change Type</TableCell>
                        <TableCell align="right">Current Cost</TableCell>
                        <TableCell align="right">Projected Cost</TableCell>
                        <TableCell align="right">Impact</TableCell>
                        <TableCell align="right">ROI</TableCell>
                        <TableCell>Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scenarios.map((scenario) => (
                        <TableRow key={scenario.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {scenario.scenarioName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={scenario.changeType.replace('_', ' ')} 
                              size="small" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(scenario.currentMonthlyCost)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(scenario.projectedMonthlyCost)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              variant="body2" 
                              color={getImpactColor(scenario.totalImpact)}
                              fontWeight="bold"
                            >
                              {formatCurrency(scenario.totalImpact)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              variant="body2" 
                              color={scenario.roi > 0 ? 'success.main' : 'error.main'}
                            >
                              {scenario.roi}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(scenario.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                 <Box textAlign="center" py={4}>
                   <span style={{ fontSize: '48px', color: '#666', marginBottom: '16px', display: 'block' }}>📊</span>
                   <Typography variant="h6" color="text.secondary">
                     No Scenarios Created Yet
                   </Typography>
                   <Typography variant="body2" color="text.secondary">
                     Create your first what-if scenario to start analyzing cost impacts
                   </Typography>
                 </Box>
               )}
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Tips */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<span>▼</span>}>
              <Typography variant="h6">What-If Analysis Tips</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>Instance Type Changes</AlertTitle>
                    Consider CPU, memory, and network requirements when changing instance types. 
                    Test performance impact before implementing.
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Reserved Instances</AlertTitle>
                    Reserved instances can provide 30-60% savings for predictable workloads. 
                    Analyze your usage patterns first.
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <AlertTitle>Growth Planning</AlertTitle>
                    Factor in seasonal variations and business growth when projecting user increases. 
                    Plan for peak capacity needs.
                  </Alert>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Migration Costs</AlertTitle>
                    Remember to include migration costs, downtime impact, and testing overhead 
                    in your analysis.
                  </Alert>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WhatIfAnalysis;