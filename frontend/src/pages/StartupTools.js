import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Paper,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import MVPBlueprintGenerator from '../components/MVPBlueprintGenerator';
import TCOCalculator from '../components/TCOCalculator';
import DeveloperServiceComparison from '../components/DeveloperServiceComparison';
import IaCExporter from '../components/IaCExporter';

const StartupTools = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [showIaCExporter, setShowIaCExporter] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBlueprintSelect = (blueprint) => {
    setSelectedBlueprint(blueprint);
  };

  const handleExportIaC = () => {
    if (selectedBlueprint) {
      setShowIaCExporter(true);
    }
  };

  const tools = [
    {
      title: 'MVP Stack Blueprint Generator',
      description: 'Pre-defined, one-click templates for common startup architectures. Deploy your MVP in minutes, not days.',
      icon: <Box sx={{ fontSize: 40, color: '#4285f4' }}>🚀</Box>,
      benefits: ['Reduces deployment time from days to minutes', 'Uses minimum-cost services', 'Production-ready templates'],
      tabIndex: 0
    },
    {
      title: 'TCO Comparison Tool',
      description: 'Compare total cost of ownership across 5 cloud providers including all hidden costs like egress and IOPS.',
      icon: <Box sx={{ fontSize: 40, color: '#34a853' }}>🧮</Box>,
      benefits: ['Eliminates pricing shock', 'Proves cost advantage of alternatives', 'Includes egress optimization'],
      tabIndex: 1
    },
    {
      title: 'Developer Service Comparison',
      description: 'Serverless vs VM breakeven calculator and managed database feature/price matrix for informed decisions.',
      icon: <Box sx={{ fontSize: 40, color: '#ea4335' }}>⚖️</Box>,
      benefits: ['Quantifiable cost thresholds', 'Future scaling considerations', 'Technology selection guidance'],
      tabIndex: 2
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a73e8' }}>
          Startup Cloud Tools
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Simplify complexity, emphasize rapid deployment, and discover competitive alternatives to hyperscalers
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Built for Startups:</strong> These tools focus on time-to-market, cost predictability, 
            and modern architecture decisions. Perfect for teams that need to deploy fast and scale smart.
          </Typography>
        </Alert>
      </Box>

      {/* Tool Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {tools.map((tool, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                },
                border: activeTab === tool.tabIndex ? '2px solid #4285f4' : '1px solid #e0e0e0'
              }}
              onClick={() => setActiveTab(tool.tabIndex)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {tool.icon}
                  <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                    {tool.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tool.benefits.map((benefit, idx) => (
                    <Chip 
                      key={idx} 
                      label={benefit} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant={activeTab === tool.tabIndex ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab(tool.tabIndex)}
                >
                  {activeTab === tool.tabIndex ? 'Active' : 'Select Tool'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Export Infrastructure as Code Button */}
      {selectedBlueprint && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<span>💻</span>}
            onClick={handleExportIaC}
            sx={{ 
              bgcolor: '#34a853',
              '&:hover': { bgcolor: '#2d8f47' },
              px: 4,
              py: 1.5
            }}
          >
            Export Infrastructure as Code
          </Button>
        </Box>
      )}

      {/* Tool Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab 
            label="MVP Blueprint Generator" 
            icon={<span>🚀</span>} 
            iconPosition="start"
          />
          <Tab 
            label="TCO Calculator" 
            icon={<span>🧮</span>} 
            iconPosition="start"
          />
          <Tab 
            label="Service Comparison" 
            icon={<span>⚖️</span>} 
            iconPosition="start"
          />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {/* Tab Content */}
        {activeTab === 0 && (
          <MVPBlueprintGenerator 
            onSelectBlueprint={handleBlueprintSelect}
            selectedBlueprint={selectedBlueprint}
          />
        )}
        
        {activeTab === 1 && (
          <TCOCalculator />
        )}
        
        {activeTab === 2 && (
          <DeveloperServiceComparison />
        )}
      </Paper>

      {/* Key Benefits Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Why These Tools Matter for Startups
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ fontSize: 48, color: '#4285f4', mb: 2 }}>⚡</Box>
              <Typography variant="h6" gutterBottom>
                Rapid Deployment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Deploy your MVP in minutes with pre-configured, production-ready templates. 
                Focus on building your product, not infrastructure.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ fontSize: 48, color: '#34a853', mb: 2 }}>📉</Box>
              <Typography variant="h6" gutterBottom>
                Cost Predictability
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avoid pricing shock with comprehensive TCO analysis including hidden costs. 
                Make informed decisions with transparent pricing comparisons.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ fontSize: 48, color: '#ea4335', mb: 2 }}>⚖️</Box>
              <Typography variant="h6" gutterBottom>
                Smart Scaling
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Understand breakeven points and scaling thresholds. Choose the right 
                architecture for your current needs and future growth.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Infrastructure as Code Export Dialog */}
      {showIaCExporter && (
        <IaCExporter 
          blueprint={selectedBlueprint}
          onClose={() => setShowIaCExporter(false)}
        />
      )}
    </Container>
  );
};

export default StartupTools;