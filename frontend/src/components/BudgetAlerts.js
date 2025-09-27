import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import { Line } from 'react-chartjs-2';

const BudgetAlerts = () => {
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [newAlert, setNewAlert] = useState({
    name: '',
    budgetAmount: '',
    period: 'monthly',
    thresholds: [50, 80, 100],
    enabled: true,
    notificationMethods: ['email']
  });

  useEffect(() => {
    fetchBudgetAlerts();
  }, []);

  const fetchBudgetAlerts = async () => {
    try {
      const response = await fetch('/api/budget-alerts');
      const data = await response.json();
      
      // Ensure each alert has a currentUsage property with a default value
      const processedData = data.map(alert => ({
        ...alert,
        currentUsage: alert.currentUsage ?? 0
      }));
      
      setBudgetAlerts(processedData);
    } catch (error) {
      console.error('Error fetching budget alerts:', error);
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'success';
    }
  };

  const getSeverityIcon = (severity) => {
    const iconMap = {
      'critical': () => <span style={{ fontSize: '16px' }}>🔴</span>,
      'high': () => <span style={{ fontSize: '16px' }}>🔴</span>,
      'medium': () => <span style={{ fontSize: '16px' }}>📈</span>,
      'low': () => <span style={{ fontSize: '16px' }}>✅</span>,
      'default': () => <span style={{ fontSize: '16px' }}>ℹ️</span>
    };
    
    const IconComponent = iconMap[severity] || iconMap['default'];
    return IconComponent();
  };

  const getUsageColor = (percentage) => {
    const safePercentage = percentage || 0;
    if (safePercentage >= 100) return 'error';
    if (safePercentage >= 80) return 'warning';
    if (safePercentage >= 50) return 'info';
    return 'success';
  };

  const handleSaveAlert = async () => {
    try {
      const method = editingAlert ? 'PUT' : 'POST';
      const url = editingAlert ? `/api/budget-alerts/${editingAlert.id}` : '/api/budget-alerts';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAlert || newAlert),
      });

      if (response.ok) {
        fetchBudgetAlerts();
        setDialogOpen(false);
        setEditingAlert(null);
        setNewAlert({
          name: '',
          budgetAmount: '',
          period: 'monthly',
          thresholds: [50, 80, 100],
          enabled: true,
          notificationMethods: ['email']
        });
      }
    } catch (error) {
      console.error('Error saving budget alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      const response = await fetch(`/api/budget-alerts/${alertId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBudgetAlerts();
      }
    } catch (error) {
      console.error('Error deleting budget alert:', error);
    }
  };

  const openEditDialog = (alert) => {
    setEditingAlert(alert);
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingAlert(null);
    setDialogOpen(true);
  };

  // Generate forecast chart data
  const generateForecastChart = (alert) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const actualSpend = alert.historicalSpend || [];
    const forecastSpend = alert.forecastSpend || [];
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Actual Spend',
          data: actualSpend,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        },
        {
          label: 'Forecasted Spend',
          data: forecastSpend,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          tension: 0.1
        },
        {
          label: 'Budget Limit',
          data: Array(months.length).fill(alert.budgetAmount),
          borderColor: 'rgb(255, 206, 86)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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

  if (loading) {
    return <Typography>Loading budget alerts...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Budget Alerts & Forecasting
        </Typography>
        <Typography
          variant="body1"
          onClick={openNewDialog}
          sx={{ 
            cursor: 'pointer', 
            color: 'primary.main',
            fontWeight: 'bold',
            padding: '8px 16px',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          Create Alert
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Active Alerts Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ color: '#1976d2', marginRight: '8px', fontSize: '1.2em' }}>🔔</span>
                <Typography variant="h6">
                  Active Alerts
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {budgetAlerts.filter(alert => alert.enabled).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitoring {budgetAlerts.length} total budgets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ color: '#ff9800', marginRight: '8px', fontSize: '1.2em' }}>🚨</span>
                <Typography variant="h6">
                  Triggered Alerts
                </Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {budgetAlerts.filter(alert => (alert.currentUsage || 0) >= 80).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Budgets exceeding 80% threshold
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ color: '#d32f2f', marginRight: '8px', fontSize: '1.2em' }}>❌</span>
                <Typography variant="h6">
                  Over Budget
                </Typography>
              </Box>
              <Typography variant="h3" color="error.main">
                {budgetAlerts.filter(alert => (alert.currentUsage || 0) >= 100).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Budgets exceeded this period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Critical Alerts */}
        {budgetAlerts.some(alert => alert.severity === 'critical') && (
          <Grid item xs={12}>
            <Alert severity="error">
              <AlertTitle>Critical Budget Alerts</AlertTitle>
              {budgetAlerts.filter(alert => alert.severity === 'critical').length} budget(s) have exceeded 
              their limits. Immediate action required to prevent cost overruns.
            </Alert>
          </Grid>
        )}

        {/* Budget Alerts Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Budget Monitoring Dashboard
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Budget Name</TableCell>
                      <TableCell align="right">Budget Amount</TableCell>
                      <TableCell align="right">Current Spend</TableCell>
                      <TableCell align="right">Usage</TableCell>
                      <TableCell align="right">Forecast</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {budgetAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {alert.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {alert.period} budget
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatCurrency(alert.budgetAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(alert.currentSpend)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={getUsageColor(alert.currentUsage)}
                            >
                              {(alert.currentUsage || 0).toFixed(1)}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(alert.currentUsage || 0, 100)}
                              color={getUsageColor(alert.currentUsage)}
                              sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            color={alert.forecastExceedsBudget ? 'error.main' : 'text.primary'}
                          >
                            {formatCurrency(alert.forecastedSpend)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              icon={getSeverityIcon(alert.severity)}
                              label={alert.severity}
                              color={getSeverityColor(alert.severity)}
                              size="small"
                            />
                            {!alert.enabled && (
                              <Chip
                                label="Disabled"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Typography
                              variant="body2"
                              onClick={() => openEditDialog(alert)}
                              sx={{ 
                                cursor: 'pointer', 
                                color: 'primary.main',
                                fontWeight: 'bold',
                                padding: '4px 8px',
                                border: '1px solid',
                                borderColor: 'primary.main',
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'white'
                                }
                              }}
                            >
                              Edit
                            </Typography>
                            <Typography
                              variant="body2"
                              onClick={() => handleDeleteAlert(alert.id)}
                              sx={{ 
                                cursor: 'pointer', 
                                color: 'error.main',
                                fontWeight: 'bold',
                                padding: '4px 8px',
                                border: '1px solid',
                                borderColor: 'error.main',
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                '&:hover': {
                                  backgroundColor: 'error.light',
                                  color: 'white'
                                }
                              }}
                            >
                              Delete
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {budgetAlerts.length === 0 && (
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: 'rgba(0, 0, 0, 0.6)', marginBottom: '16px', display: 'block' }}>🔔</span>
                  <Typography variant="h6" color="text.secondary">
                    No Budget Alerts Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first budget alert to start monitoring spending
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Forecast Charts */}
        {budgetAlerts.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Budget Forecast Analysis
                </Typography>
                <Grid container spacing={3}>
                  {budgetAlerts.slice(0, 2).map((alert) => (
                    <Grid item xs={12} md={6} key={alert.id}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {alert.name}
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <Line 
                            data={generateForecastChart(alert)} 
                            options={chartOptions} 
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Create/Edit Alert Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAlert ? 'Edit Budget Alert' : 'Create Budget Alert'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Alert Name"
              value={editingAlert ? editingAlert.name : newAlert.name}
              onChange={(e) => {
                if (editingAlert) {
                  setEditingAlert(prev => ({ ...prev, name: e.target.value }));
                } else {
                  setNewAlert(prev => ({ ...prev, name: e.target.value }));
                }
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Budget Amount"
              type="number"
              value={editingAlert ? editingAlert.budgetAmount : newAlert.budgetAmount}
              onChange={(e) => {
                if (editingAlert) {
                  setEditingAlert(prev => ({ ...prev, budgetAmount: parseFloat(e.target.value) }));
                } else {
                  setNewAlert(prev => ({ ...prev, budgetAmount: parseFloat(e.target.value) }));
                }
              }}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Budget Period</InputLabel>
              <Select
                value={editingAlert ? editingAlert.period : newAlert.period}
                onChange={(e) => {
                  if (editingAlert) {
                    setEditingAlert(prev => ({ ...prev, period: e.target.value }));
                  } else {
                    setNewAlert(prev => ({ ...prev, period: e.target.value }));
                  }
                }}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={editingAlert ? editingAlert.enabled : newAlert.enabled}
                  onChange={(e) => {
                    if (editingAlert) {
                      setEditingAlert(prev => ({ ...prev, enabled: e.target.checked }));
                    } else {
                      setNewAlert(prev => ({ ...prev, enabled: e.target.checked }));
                    }
                  }}
                />
              }
              label="Enable Alert"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Typography 
            variant="body2"
            onClick={() => setDialogOpen(false)}
            sx={{ 
              cursor: 'pointer', 
              color: 'text.secondary',
              fontWeight: 'bold',
              padding: '8px 16px',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Cancel
          </Typography>
          <Typography 
            variant="body2"
            onClick={handleSaveAlert} 
            sx={{ 
              cursor: 'pointer', 
              color: 'primary.main',
              fontWeight: 'bold',
              padding: '8px 16px',
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white'
              }
            }}
          >
            {editingAlert ? 'Update' : 'Create'}
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetAlerts;