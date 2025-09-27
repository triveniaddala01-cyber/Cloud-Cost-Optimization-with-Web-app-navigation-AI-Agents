import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
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
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
const AnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnomalies();
  }, [showResolved]);

  const fetchAnomalies = async () => {
    try {
      const response = await fetch(`/api/anomalies?resolved=${showResolved}`);
      const data = await response.json();
      setAnomalies(data);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    const iconMap = {
      'critical': () => <span style={{ fontSize: '16px' }}>🔴</span>,
      'high': () => <span style={{ fontSize: '16px' }}>🔴</span>,
      'medium': () => <span style={{ fontSize: '16px' }}>ℹ️</span>,
      'low': () => <span style={{ fontSize: '16px' }}>✅</span>,
      'default': () => <span style={{ fontSize: '16px' }}>ℹ️</span>
    };
    
    const IconComponent = iconMap[severity] || iconMap['default'];
    return IconComponent();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const unresolvedAnomalies = anomalies.filter(anomaly => !anomaly.resolved);
  const highSeverityCount = unresolvedAnomalies.filter(anomaly => anomaly.severity === 'high').length;

  if (loading) {
    return <Typography>Loading anomaly data...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Cost Anomaly Detection
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
            />
          }
          label="Show Resolved"
        />
      </Box>

      {highSeverityCount > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>High Priority Anomalies Detected</AlertTitle>
          {highSeverityCount} high-severity cost anomalies require immediate attention.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Cost Anomalies
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Normal Cost</TableCell>
                  <TableCell>Actual Cost</TableCell>
                  <TableCell>Variance</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {anomalies.map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell>{new Date(anomaly.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={anomaly.service} variant="outlined" size="small" />
                    </TableCell>
                    <TableCell>{formatCurrency(anomaly.normalCost)}</TableCell>
                    <TableCell>{formatCurrency(anomaly.actualCost)}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography
                          variant="body2"
                          color={anomaly.variance > 50 ? 'error' : 'warning'}
                          fontWeight="bold"
                        >
                          +{anomaly.variance.toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getSeverityIcon(anomaly.severity)}
                        <Chip
                          label={anomaly.severity.toUpperCase()}
                          color={getSeverityColor(anomaly.severity)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {anomaly.resolved ? (
                        <Chip
                          label="Resolved"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Active"
                          color="error"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={anomaly.description}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {anomaly.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {anomalies.length === 0 && (
            <Box textAlign="center" py={4}>
              <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>✅</span>
              <Typography variant="h6" color="text.secondary">
                {showResolved ? 'No resolved anomalies found' : 'No active anomalies detected'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your cloud costs are within normal parameters
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnomalyDetection;