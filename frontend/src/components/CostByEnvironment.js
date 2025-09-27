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
  Paper
} from '@mui/material';
import { Pie } from 'react-chartjs-2';

const CostByEnvironment = () => {
  const [environmentData, setEnvironmentData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnvironmentData();
    fetchTagData();
  }, []);

  const fetchEnvironmentData = async () => {
    try {
      const response = await fetch('/api/cost-by-environment');
      const data = await response.json();
      setEnvironmentData(data);
    } catch (error) {
      console.error('Error fetching environment data:', error);
    }
  };

  const fetchTagData = async () => {
    try {
      const response = await fetch('/api/cost-by-tags');
      const data = await response.json();
      setTagData(data);
    } catch (error) {
      console.error('Error fetching tag data:', error);
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

  const environmentChartData = {
    labels: environmentData.map(env => env.environment),
    datasets: [
      {
        data: environmentData.map(env => env.cost),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const percentage = ((value / environmentData.reduce((sum, env) => sum + env.cost, 0)) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return <Typography>Loading environment data...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Cost Breakdown Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Environment Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost by Environment
              </Typography>
              <Box height={300}>
                <Pie data={environmentChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Environment Table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Environment Details
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Environment</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {environmentData.map((env) => (
                      <TableRow key={env.environment}>
                        <TableCell>
                          <Chip 
                            label={env.environment} 
                            variant="outlined" 
                            size="small"
                            color={env.environment === 'Production' ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(env.cost)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {env.percentage}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tag-based Cost Analysis */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost by Project Tags
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Tag</TableCell>
                      <TableCell align="right">Monthly Cost</TableCell>
                      <TableCell align="right">Resources</TableCell>
                      <TableCell align="right">Avg Cost per Resource</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tagData.map((tag) => (
                      <TableRow key={tag.tag}>
                        <TableCell>
                          <Chip 
                            label={tag.tag} 
                            variant="outlined" 
                            size="small"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(tag.cost)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {tag.resources}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatCurrency(tag.cost / tag.resources)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CostByEnvironment;