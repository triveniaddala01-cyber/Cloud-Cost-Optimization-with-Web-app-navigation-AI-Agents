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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Alert,
  Checkbox,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon
} from '@mui/icons-material';

const CustomReports = () => {
  const [reports, setReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    name: '',
    type: 'cost_analysis',
    metrics: [],
    dateRange: 'last_30_days',
    format: 'pdf',
    schedule: {
      enabled: false,
      frequency: 'monthly',
      recipients: []
    },
    filters: {
      environment: 'all',
      service: 'all',
      region: 'all'
    }
  });

  const reportTypes = [
    { value: 'cost_analysis', label: 'Cost Analysis Report' },
    { value: 'savings_summary', label: 'Savings Summary Report' },
    { value: 'optimization_status', label: 'Optimization Status Report' },
    { value: 'budget_performance', label: 'Budget Performance Report' },
    { value: 'resource_utilization', label: 'Resource Utilization Report' },
    { value: 'compliance_audit', label: 'Compliance Audit Report' }
  ];

  const availableMetrics = {
    cost_analysis: [
      'Total Cost',
      'Cost by Service',
      'Cost by Environment',
      'Cost Trends',
      'Top Cost Drivers'
    ],
    savings_summary: [
      'Total Savings',
      'Savings by Category',
      'Implemented Recommendations',
      'Pending Recommendations',
      'ROI Analysis'
    ],
    optimization_status: [
      'Rightsizing Opportunities',
      'Reserved Instance Coverage',
      'License Optimization',
      'Data Lifecycle Status',
      'Anomaly Detection'
    ],
    budget_performance: [
      'Budget vs Actual',
      'Forecast Accuracy',
      'Alert History',
      'Variance Analysis',
      'Trend Analysis'
    ]
  };

  useEffect(() => {
    fetchReports();
    fetchScheduledReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledReports = async () => {
    try {
      const response = await fetch('/api/scheduled-reports');
      const data = await response.json();
      setScheduledReports(data);
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
    }
  };

  const generateReport = async () => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportConfig),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${reportConfig.name}.${reportConfig.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        fetchReports();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const scheduleReport = async () => {
    try {
      const response = await fetch('/api/scheduled-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportConfig),
      });

      if (response.ok) {
        fetchScheduledReports();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error scheduling report:', error);
    }
  };

  const handleMetricChange = (metric, checked) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: checked 
        ? [...prev.metrics, metric]
        : prev.metrics.filter(m => m !== metric)
    }));
  };

  const formatFileSize = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading reports...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Custom Reports & Analytics
        </Typography>
        <Typography
          variant="body1"
          onClick={() => setDialogOpen(true)}
          sx={{ cursor: 'pointer', color: 'primary.main' }}
        >
          Create Report
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Report Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📊</span>
                <Typography variant="h6">
                  Generated Reports
                </Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {reports.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total reports created
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '24px' }}>📅</span>
                <Typography variant="h6">
                  Scheduled Reports
                </Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                {scheduledReports.filter(r => r.enabled).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active automated reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <span style={{ marginRight: '8px', fontSize: '20px' }}>📧</span>
                <Typography variant="h6">
                  Email Recipients
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {scheduledReports.reduce((sum, r) => sum + (r.recipients?.length || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total report subscribers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Report Generation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="outlined"
                    onClick={() => {
                      setReportConfig({
                        ...reportConfig,
                        name: 'Monthly Cost Analysis',
                        type: 'cost_analysis',
                        metrics: ['Total Cost', 'Cost by Service', 'Cost Trends']
                      });
                      setDialogOpen(true);
                    }}
                  >
                    Cost Analysis
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="outlined"
                    onClick={() => {
                      setReportConfig({
                        ...reportConfig,
                        name: 'Savings Summary',
                        type: 'savings_summary',
                        metrics: ['Total Savings', 'Savings by Category', 'ROI Analysis']
                      });
                      setDialogOpen(true);
                    }}
                  >
                    Savings Report
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="outlined"
                    onClick={() => {
                      setReportConfig({
                        ...reportConfig,
                        name: 'Budget Performance',
                        type: 'budget_performance',
                        metrics: ['Budget vs Actual', 'Forecast Accuracy']
                      });
                      setDialogOpen(true);
                    }}
                  >
                    Budget Report
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography
                    variant="outlined"
                    onClick={() => {
                      setReportConfig({
                        ...reportConfig,
                        name: 'Optimization Status',
                        type: 'optimization_status',
                        metrics: ['Rightsizing Opportunities', 'Reserved Instance Coverage']
                      });
                      setDialogOpen(true);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    Optimization Report
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Reports */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Reports
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Generated</TableCell>
                      <TableCell>Format</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {report.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={report.type.replace('_', ' ')} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {report.format === 'pdf' ? <span style={{ fontSize: '16px' }}>📄</span> : <span style={{ fontSize: '16px' }}>📊</span>}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {report.format.toUpperCase()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatFileSize(report.fileSize)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.status}
                            color={getStatusColor(report.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Typography
                              variant="body2"
                              sx={{ 
                                cursor: report.status === 'completed' ? 'pointer' : 'default',
                                color: report.status === 'completed' ? 'primary.main' : 'text.disabled'
                              }}
                            >
                              Download
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ 
                                cursor: report.status === 'completed' ? 'pointer' : 'default',
                                color: report.status === 'completed' ? 'primary.main' : 'text.disabled'
                              }}
                            >
                              Share
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {reports.length === 0 && (
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: '#9e9e9e', marginBottom: '16px', display: 'block' }}>📊</span>
                  <Typography variant="h6" color="text.secondary">
                    No Reports Generated Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first custom report to get started
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Scheduled Reports */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scheduled Reports
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Next Run</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scheduledReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {report.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={report.frequency} 
                            size="small" 
                            color="info"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {report.recipients?.length || 0} recipients
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(report.nextRun).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.enabled ? 'Active' : 'Paused'}
                            color={report.enabled ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Typography
                              variant="body2"
                              sx={{ cursor: 'pointer', color: 'primary.main' }}
                            >
                              Edit
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ cursor: 'pointer', color: 'error.main' }}
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

              {scheduledReports.length === 0 && (
                <Box textAlign="center" py={4}>
                  <span style={{ fontSize: '48px', color: '#9e9e9e', marginBottom: '16px', display: 'block' }}>📅</span>
                  <Typography variant="h6" color="text.secondary">
                    No Scheduled Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Set up automated report delivery to stay informed
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Report Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Custom Report</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Report Name"
              value={reportConfig.name}
              onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportConfig.type}
                onChange={(e) => setReportConfig(prev => ({ 
                  ...prev, 
                  type: e.target.value,
                  metrics: [] // Reset metrics when type changes
                }))}
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle1" gutterBottom>
              Select Metrics to Include
            </Typography>
            <FormGroup sx={{ mb: 2 }}>
              {availableMetrics[reportConfig.type]?.map((metric) => (
                <FormControlLabel
                  key={metric}
                  control={
                    <Checkbox
                      checked={reportConfig.metrics.includes(metric)}
                      onChange={(e) => handleMetricChange(metric, e.target.checked)}
                    />
                  }
                  label={metric}
                />
              ))}
            </FormGroup>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={reportConfig.dateRange}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <MenuItem value="last_7_days">Last 7 Days</MenuItem>
                    <MenuItem value="last_30_days">Last 30 Days</MenuItem>
                    <MenuItem value="last_90_days">Last 90 Days</MenuItem>
                    <MenuItem value="last_year">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={reportConfig.format}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Accordion>
              <AccordionSummary expandIcon={<span>▼</span>}>
                <Typography>Schedule Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  control={
                    <Switch
                      checked={reportConfig.schedule.enabled}
                      onChange={(e) => setReportConfig(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, enabled: e.target.checked }
                      }))}
                    />
                  }
                  label="Enable Scheduled Delivery"
                  sx={{ mb: 2 }}
                />

                {reportConfig.schedule.enabled && (
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        value={reportConfig.schedule.frequency}
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          schedule: { ...prev.schedule, frequency: e.target.value }
                        }))}
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="quarterly">Quarterly</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Email Recipients (comma-separated)"
                      placeholder="user1@company.com, user2@company.com"
                      onChange={(e) => setReportConfig(prev => ({
                        ...prev,
                        schedule: { 
                          ...prev.schedule, 
                          recipients: e.target.value.split(',').map(email => email.trim()) 
                        }
                      }))}
                    />
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions>
          <Typography 
            onClick={() => setDialogOpen(false)}
            sx={{ cursor: 'pointer', color: 'text.secondary' }}
          >
            Cancel
          </Typography>
          <Typography 
            onClick={scheduleReport} 
            sx={{ cursor: 'pointer', color: 'primary.main' }}
          >
            Schedule Report
          </Typography>
          <Typography 
            onClick={generateReport} 
            sx={{ cursor: 'pointer', color: 'primary.main' }}
          >
            Generate Now
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomReports;