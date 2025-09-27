import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const SavingsByResource = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  // Data for the donut chart
  const donutData = {
    labels: ['VM', 'Database', 'Storage'],
    datasets: [
      {
        data: [750, 450, 300],
        backgroundColor: [
          'rgba(66, 133, 244, 0.8)',
          'rgba(52, 168, 83, 0.8)',
          'rgba(251, 188, 5, 0.8)',
        ],
        borderWidth: 0,
        cutout: '70%'
      },
    ],
  };

  // Data for the horizontal bars
  const barData = {
    labels: ['VM', 'Database', 'Storage'],
    datasets: [
      {
        data: [750, 450, 300],
        backgroundColor: [
          'rgba(66, 133, 244, 0.8)',
          'rgba(52, 168, 83, 0.8)',
          'rgba(251, 188, 5, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    cutout: '70%'
  };

  const barOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Savings by Resource Type</Typography>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Box sx={{ height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut data={donutData} options={donutOptions} />
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Box sx={{ height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {['VM', 'Database', 'Storage'].map((label, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: index === 0 ? 'rgba(66, 133, 244, 0.8)' : 
                                      index === 1 ? 'rgba(52, 168, 83, 0.8)' : 
                                      'rgba(251, 188, 5, 0.8)',
                      mr: 1 
                    }} 
                  />
                  <Typography variant="body2" sx={{ mr: 1 }}>{label}</Typography>
                  <Box sx={{ flexGrow: 1, height: 10 }}>
                    <Bar 
                      data={{
                        labels: [''],
                        datasets: [{
                          data: [index === 0 ? 750 : index === 1 ? 450 : 300],
                          backgroundColor: index === 0 ? 'rgba(66, 133, 244, 0.8)' : 
                                          index === 1 ? 'rgba(52, 168, 83, 0.8)' : 
                                          'rgba(251, 188, 5, 0.8)',
                          borderWidth: 0
                        }]
                      }} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false }
                        }
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SavingsByResource;
