import React from 'react';
import { Box, Typography, Grid, Tabs, Tab, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import CostByEnvironment from '../components/CostByEnvironment';
import ReservedInstanceCoverage from '../components/ReservedInstanceCoverage';
import AnomalyDetection from '../components/AnomalyDetection';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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

const Analytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const runAIAnalyticsAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai-agents/run/CloudGenius AI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setAiAnalysis(data);
    } catch (error) {
      console.error('Error running AI analytics analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Auto-run AI analysis when component mounts
    runAIAnalyticsAnalysis();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advanced Analytics
        </Typography>
        <Button 
          variant="contained" 
          onClick={runAIAnalyticsAnalysis}
          disabled={isAnalyzing}
          sx={{ mb: 2 }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run AI Analytics'}
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Deep dive into your cloud costs with granular breakdowns, anomaly detection, and coverage analysis.
      </Typography>

      {aiAnalysis && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6">AI Analytics Insights</Typography>
          <Typography variant="body2">{aiAnalysis.analysis}</Typography>
          {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Analytics Recommendations:</Typography>
              {aiAnalysis.recommendations.map((rec, index) => (
                <Typography key={index} variant="body2">• {rec}</Typography>
              ))}
            </Box>
          )}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab label="Cost Breakdown" />
          <Tab label="Reserved Instances" />
          <Tab label="Anomaly Detection" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <CostByEnvironment />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ReservedInstanceCoverage />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <AnomalyDetection />
      </TabPanel>
    </Box>
  );
};

export default Analytics;