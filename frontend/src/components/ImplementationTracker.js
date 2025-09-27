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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Error as ErrorIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CloudDone as CloudDoneIcon,
  Security as SecurityIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';

const ImplementationTracker = () => {
  const [implementations, setImplementations] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImplementation, setSelectedImplementation] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    actualSavings: '',
    notes: '',
    completionDate: ''
  });

  useEffect(() => {
    fetchImplementations();
    fetchSummary();
  }, []);

  const fetchImplementations = async () => {
    try {
      const response = await fetch('/api/implementation-tracker');
      const data = await response.json();
      setImplementations(data);
    } catch (error) {
      console.error('Error fetching implementations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/implementation-tracker/summary');
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const updateImplementation = async () => {
    try {
      const response = await fetch(`/api/implementation-tracker/${selectedImplementation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        fetchImplementations();
        fetchSummary();
        setDialogOpen(false);
        setSelectedImplementation(null);
      }
    } catch (error) {
      console.error('Error updating implementation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'planned': return 'warning';
      case 'on_hold': return 'default';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'completed': () => <span>✅</span>,
      'in_progress': '📅',
      'planned': '📊',
      'on_hold': '⏸️',
      'failed': ErrorIcon,
      'default': '📅'
    };
    
    const IconComponent = iconMap[status] || iconMap['default'];
    if (typeof IconComponent === 'string') {
      return <span style={{ fontSize: '16px' }}>{IconComponent}</span>;
    }
    return React.createElement(IconComponent, { fontSize: 'small' });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'cost': '💰',
      'performance': '⚡',
      'compute': '💻',
      'storage': '💾',
      'database': '💾',
      'networking': CloudDoneIcon,
      'security': SecurityIcon,
      'default': '💰'
    };
    
    const IconComponent = iconMap[category] || iconMap['default'];
    if (typeof IconComponent === 'string') {
      return <span style={{ fontSize: '16px' }}>{IconComponent}</span>;
    }
    return React.createElement(IconComponent, { fontSize: 'small' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateROI = (actualSavings, estimatedSavings) => {
    if (!estimatedSavings || estimatedSavings === 0) return 0;
    return ((actualSavings / estimatedSavings) * 100).toFixed(1);
  };

  const savingsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Estimated Savings',
        data: [15000, 18000, 22000, 25000, 28000, 32000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Actual Savings',
        data: [12000, 16000, 24000, 27000, 30000, 35000],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estimated vs Actual Savings Over Time'
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
    return <Typography>Loading implementation tracker...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Implementation Tracker
        </Typography>
        <Typography
          variant="body1"
          onClick={() => setDialogOpen(true)}
          sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
        >
          Add Implementation
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span>✅</span>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Completed
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {summary.completed || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Implementations finished
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
                  In Progress
                </Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {summary.inProgress || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently being implemented
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ fontSize: '24px', marginRight: '8px' }}>💰</span>
                <Typography variant="h6">
                  Total Savings
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {formatCurrency(summary.totalActualSavings || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Realized savings to date
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ fontSize: '24px', marginRight: '8px' }}>⚡</span>
                <Typography variant="h6">
                  Success Rate
                </Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {summary.successRate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Implementation success rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Savings Performance Overview
              </Typography>
              <Box height={300}>
                <Line data={savingsChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Implementation Health
              </Typography>
              
              <Box mb={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Overall Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={summary.overallProgress || 0} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {summary.overallProgress || 0}% Complete
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Savings Achievement
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={summary.savingsAchievement || 0} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {summary.savingsAchievement || 0}% of estimated savings realized
                </Typography>
              </Box>

              <Alert severity="info">
                <AlertTitle>Performance Insight</AlertTitle>
                Your implementations are performing {summary.savingsAchievement > 100 ? 'above' : 'at'} expectations with {formatCurrency(summary.totalActualSavings || 0)} in realized savings.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Implementation Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Implementation Activity
              </Typography>
              
              <List>
                {implementations.slice(0, 5).map((impl, index) => (
                  <React.Fragment key={impl.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getStatusColor(impl.status) + '.main' }}>
                          {getCategoryIcon(impl.category)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={impl.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {impl.description}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <Chip 
                                label={impl.status.replace('_', ' ')} 
                                color={getStatusColor(impl.status)}
                                size="small"
                              />
                              <Typography variant="caption" color="text.secondary">
                                Est: {formatCurrency(impl.estimatedSavings)} | 
                                Actual: {formatCurrency(impl.actualSavings || 0)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(impl.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          onClick={() => {
                            setSelectedImplementation(impl);
                            setUpdateData({
                              status: impl.status,
                              actualSavings: impl.actualSavings || '',
                              notes: impl.notes || '',
                              completionDate: impl.completionDate || ''
                            });
                            setDialogOpen(true);
                          }}
                          sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
                        >
                          View
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Implementation Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Implementations
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Implementation</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Estimated Savings</TableCell>
                      <TableCell>Actual Savings</TableCell>
                      <TableCell>ROI</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {implementations.map((impl) => (
                      <TableRow key={impl.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {impl.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {impl.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getCategoryIcon(impl.category)}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {impl.category}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(impl.status)}
                            label={impl.status.replace('_', ' ')}
                            color={getStatusColor(impl.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(impl.startDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="info.main">
                            {formatCurrency(impl.estimatedSavings)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color={impl.actualSavings > 0 ? 'success.main' : 'text.secondary'}
                          >
                            {impl.actualSavings ? formatCurrency(impl.actualSavings) : 'TBD'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2"
                            color={
                              calculateROI(impl.actualSavings, impl.estimatedSavings) >= 100 
                                ? 'success.main' 
                                : 'warning.main'
                            }
                          >
                            {impl.actualSavings ? `${calculateROI(impl.actualSavings, impl.estimatedSavings)}%` : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Typography
                              variant="body2"
                              onClick={() => {
                                setSelectedImplementation(impl);
                                setUpdateData({
                                  status: impl.status,
                                  actualSavings: impl.actualSavings || '',
                                  notes: impl.notes || '',
                                  completionDate: impl.completionDate || ''
                                });
                                setDialogOpen(true);
                              }}
                              sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
                            >
                              Update
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {implementations.length === 0 && (
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: '#9e9e9e', marginBottom: '16px', display: 'block' }}>📊</span>
                  <Typography variant="h6" color="text.secondary">
                    No Implementations Tracked Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start tracking your optimization implementations to measure success
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Update Implementation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedImplementation ? 'Update Implementation' : 'Add New Implementation'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            {selectedImplementation && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>{selectedImplementation.title}</AlertTitle>
                {selectedImplementation.description}
              </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={updateData.status}
                onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="planned">Planned</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Actual Savings ($)"
              type="number"
              value={updateData.actualSavings}
              onChange={(e) => setUpdateData(prev => ({ ...prev, actualSavings: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Completion Date"
              type="date"
              value={updateData.completionDate}
              onChange={(e) => setUpdateData(prev => ({ ...prev, completionDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={updateData.notes}
              onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes about the implementation progress, challenges, or results..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Typography 
            onClick={() => setDialogOpen(false)}
            sx={{ cursor: 'pointer', color: 'text.secondary', mr: 2 }}
          >
            Cancel
          </Typography>
          <Typography 
            onClick={updateImplementation} 
            sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
          >
            {selectedImplementation ? 'Update' : 'Add'} Implementation
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImplementationTracker;