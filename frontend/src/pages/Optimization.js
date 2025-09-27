import React from 'react';
import { Box, Typography, Grid, Tabs, Tab, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import RightsizingHistory from '../components/RightsizingHistory';
import LicenseOptimization from '../components/LicenseOptimization';
import DataLifecycleRecommendations from '../components/DataLifecycleRecommendations';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`optimization-tabpanel-${index}`}
      aria-labelledby={`optimization-tab-${index}`}
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

const Optimization = () => {
  const [tabValue, setTabValue] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const runAIOptimizationAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai-agents/run/OptiCloud Agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setAiAnalysis(data);
    } catch (error) {
      console.error('Error running AI optimization analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Auto-run AI analysis when component mounts
    runAIOptimizationAnalysis();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advanced Optimization
        </Typography>
        <Button 
          variant="contained" 
          onClick={runAIOptimizationAnalysis}
          disabled={isAnalyzing}
          sx={{ mb: 2 }}
        >
          {isAnalyzing ? 'Optimizing...' : 'Run AI Optimization'}
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Track optimization implementations, manage licenses, and optimize data lifecycle for maximum cost efficiency.
      </Typography>

      {aiAnalysis && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6">AI Optimization Insights</Typography>
          <Typography variant="body2">{aiAnalysis.analysis}</Typography>
          {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Optimization Recommendations:</Typography>
              {aiAnalysis.recommendations.map((rec, index) => (
                <Typography key={index} variant="body2">• {rec}</Typography>
              ))}
            </Box>
          )}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="optimization tabs">
          <Tab label="Rightsizing History" />
          <Tab label="License Management" />
          <Tab label="Data Lifecycle" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <RightsizingHistory />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <LicenseOptimization />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <DataLifecycleRecommendations />
      </TabPanel>
    </Box>
  );
};

export default Optimization;