import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CostOverview from './components/CostOverview';
import CostTrends from './components/CostTrends';
import SavingsByResource from './components/SavingsByResource';
import ProjectedCost from './components/ProjectedCost';
import CostPrediction from './components/CostPrediction';
import AIRecommendations from './components/AIRecommendations';

import Overview from './pages/Overview';
import Recommendations from './pages/Recommendations';
import StartupTools from './pages/StartupTools';
import SavingsAnalytics from './pages/SavingsAnalytics';
import Analytics from './pages/Analytics';
import Optimization from './pages/Optimization';
import Forecasting from './pages/Forecasting';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AIAgents from './pages/AIAgents';
import AutomationPanel from './components/AutomationPanel';
import { fetchCostOverview, fetchCostTrends, fetchRecommendations, fetchSavingsByResource, fetchProjectedCost } from './services/api';
import realTimeDataService from './services/realTimeDataService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4',
    },
    secondary: {
      main: '#34a853',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [costOverview, setCostOverview] = useState({
    totalCost: 4250,
    estimatedSavings: 1200,
    idleResources: 5,
    oversizedResources: 3
  });
  const [costTrends, setCostTrends] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    data: [1000, 950, 1100, 1200, 1500]
  });
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Shut down idle VM',
      description: 'VM has been idle for 30 days',
      savings: 350,
      resourceType: 'VM'
    },
    {
      id: 2,
      title: 'Resize oversized database',
      description: 'Database is provisioned with excess capacity',
      savings: 450,
      resourceType: 'Database'
    },
    {
      id: 3,
      title: 'Schedule off-hours for VM',
      description: 'VM can be scheduled to shut down during non-business hours',
      savings: 400,
      resourceType: 'VM'
    }
  ]);
  const [savingsByResource, setSavingsByResource] = useState({
    VM: 750,
    Database: 450,
    Storage: 300
  });
  const [projectedCost, setProjectedCost] = useState({
    current: 4250,
    recommended: 3050
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use real-time ML-generated data
        const overviewData = await realTimeDataService.getCostOverview();
        const trendsData = await realTimeDataService.getCostTrends();
        const recommendationsData = await realTimeDataService.getRecommendations();
        const savingsData = await realTimeDataService.getSavingsByResource();
        const projectedData = await realTimeDataService.getProjectedCost();

        setCostOverview(overviewData);
        setCostTrends(trendsData);
        setRecommendations(recommendationsData);
        setSavingsByResource(savingsData);
        setProjectedCost(projectedData);
      } catch (error) {
        console.error('Error fetching real-time data:', error);
        // Fallback to original API if real-time service fails
        try {
          const overviewData = await fetchCostOverview();
          const trendsData = await fetchCostTrends();
          const recommendationsData = await fetchRecommendations();
          const savingsData = await fetchSavingsByResource();
          const projectedData = await fetchProjectedCost();

          setCostOverview(overviewData);
          setCostTrends(trendsData);
          setRecommendations(recommendationsData);
          setSavingsByResource(savingsData);
          setProjectedCost(projectedData);
        } catch (fallbackError) {
          console.error('Error fetching fallback data:', fallbackError);
          // Keep existing dummy data as final fallback
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Header />
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                padding: 3,
                backgroundColor: '#f8f9fa',
              }}
            >
              <Routes>
                <Route path="/" element={<Overview 
                  costOverview={costOverview} 
                  costTrends={costTrends} 
                  savingsByResource={savingsByResource} 
                  projectedCost={projectedCost} 
                />} />
                <Route path="/automation" element={<AutomationPanel />} />
                <Route path="/recommendations" element={<Recommendations recommendations={recommendations} />} />
                <Route path="/startup-tools" element={<StartupTools />} />
                <Route path="/savings" element={<SavingsAnalytics savingsByResource={savingsByResource} />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/optimization" element={<Optimization />} />
                <Route path="/forecasting" element={<Forecasting />} />
                <Route path="/ai-agents" element={<AIAgents />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;