import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { fetchCostPredictions } from '../services/api';
import { getCostPredictions, getMLModelInfo } from '../services/aiService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CostPrediction = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periods, setPeriods] = useState(3);
  const [modelType, setModelType] = useState('ml_ensemble');
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        setLoading(true);
        // Use the new AI service for ML predictions
        const data = await getCostPredictions(periods, modelType);
        setPredictionData(data);
        
        // Get model information
        const info = await getMLModelInfo();
        setModelInfo(info);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching prediction data:', err);
        setError('Failed to load prediction data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [periods, modelType]);

  const handlePeriodsChange = (event) => {
    setPeriods(event.target.value);
  };

  const handleModelChange = (event) => {
    setModelType(event.target.value);
  };

  const prepareChartData = () => {
    if (!predictionData) return null;

    // Combine historical and predicted data
    const labels = [...predictionData.nextPeriods];
    
    const datasets = [
      {
        label: 'Predicted Costs',
        data: predictionData.predictions.map(p => p.cost),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Optimized Costs',
        data: predictionData.optimizedPredictions.map(p => p.optimizedCost),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true
      }
    ];

    return { labels, datasets };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Cost ($)'
        }
      }
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI-Powered Cost Predictions
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Prediction Periods</InputLabel>
              <Select
                value={periods}
                label="Prediction Periods"
                onChange={handlePeriodsChange}
              >
                <MenuItem value={1}>1 Month</MenuItem>
                <MenuItem value={3}>3 Months</MenuItem>
                <MenuItem value={6}>6 Months</MenuItem>
                <MenuItem value={12}>12 Months</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Model Type</InputLabel>
              <Select
                value={modelType}
                label="Model Type"
                onChange={handleModelChange}
              >
                <MenuItem value="linear">Linear Regression</MenuItem>
                <MenuItem value="polynomial">Polynomial Regression</MenuItem>
                <MenuItem value="ensemble">Ensemble (Recommended)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{typeof error === 'string' ? error : 'An error occurred while loading cost predictions.'}</Alert>
        ) : (
          <>
            <Box sx={{ height: 300, mb: 2 }}>
              <Line data={prepareChartData()} options={chartOptions} />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Model Accuracy
                    </Typography>
                    <Typography variant="h6">
                      {predictionData?.modelInfo?.accuracy * 100}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on historical data patterns
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Projected Savings
                    </Typography>
                    <Typography variant="h6">
                      {predictionData?.optimizedPredictions[0]?.savingsPercentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      With recommended optimizations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Prediction Confidence
                    </Typography>
                    <Typography variant="h6">
                      {(predictionData?.predictions[0]?.confidence * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Higher is better
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CostPrediction;