import React from 'react';
import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import CustomReports from '../components/CustomReports';
import ImplementationTracker from '../components/ImplementationTracker';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
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

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Tracking
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate custom reports and track the implementation status of your cost optimization recommendations.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reports tabs">
          <Tab label="Custom Reports" />
          <Tab label="Implementation Tracker" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <CustomReports />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ImplementationTracker />
      </TabPanel>
    </Box>
  );
};

export default Reports;