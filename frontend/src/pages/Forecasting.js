import React from 'react';
import { Box, Typography, Grid, Tabs, Tab, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import WhatIfAnalysis from '../components/WhatIfAnalysis';
import BudgetAlerts from '../components/BudgetAlerts';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`forecasting-tabpanel-${index}`}
      aria-labelledby={`forecasting-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Forecasting = () => {
  const [tabValue, setTabValue] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const runAIForecastingAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai-agents/run/CloudPilot AI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setAiAnalysis(data);
    } catch (error) {
      console.error('Error running AI forecasting analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Auto-run AI analysis when component mounts
    runAIForecastingAnalysis();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Predictive Forecasting
        </Typography>
        <Button 
          variant="contained" 
          onClick={runAIForecastingAnalysis}
          disabled={isAnalyzing}
          sx={{ mb: 2 }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Analyze what-if scenarios and manage budget alerts to stay ahead of cost overruns with predictive insights.
      </Typography>

      {aiAnalysis && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6">AI Forecasting Insights</Typography>
          <Typography variant="body2">{aiAnalysis.analysis}</Typography>
          {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Recommendations:</Typography>
              {aiAnalysis.recommendations.map((rec, index) => (
                <Typography key={index} variant="body2">• {rec}</Typography>
              ))}
            </Box>
          )}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="forecasting tabs">
          <Tab label="What-If Analysis" />
          <Tab label="Budget Alerts" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <WhatIfAnalysis />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <BudgetAlerts />
      </TabPanel>
    </Box>
  );
};

export default Forecasting;