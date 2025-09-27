import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProjectedCost = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  const chartData = {
    labels: ['Current Cost', 'Recommended Cost'],
    datasets: [
      {
        data: [data.current, data.recommended],
        backgroundColor: ['rgba(66, 133, 244, 0.6)', 'rgba(52, 168, 83, 0.6)'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const savings = data.current - data.recommended;
  const savingsPercentage = Math.round((savings / data.current) * 100);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Projected Cost</Typography>
        <Bar data={chartData} options={options} height={100} />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1" color="secondary">
            Potential Monthly Savings: ${savings} ({savingsPercentage}%)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectedCost;