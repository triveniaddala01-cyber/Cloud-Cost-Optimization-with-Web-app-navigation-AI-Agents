import React, { useState, useEffect } from 'react';
import { getAIRecommendations } from '../services/aiService';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Chip, LinearProgress, Divider } from '@mui/material';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [modelInfo, setModelInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const data = await getAIRecommendations(3);
      setRecommendations(data.recommendations || []);
      setModelInfo(data.modelInfo || {});
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          AI Recommendations
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          AI-Powered Cost Optimization
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Using {modelInfo.type || 'ML Ensemble'} model with {(modelInfo.accuracy * 100).toFixed(0)}% accuracy
        </Typography>
      </Box>

      {recommendations.length > 0 ? (
        <List>
          {recommendations.map((recommendation, index) => (
            <Card key={recommendation.id} sx={{ mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {recommendation.name}
                  </Typography>
                  <Chip 
                    label={`${recommendation.potentialSavings * 100}% savings`}
                    color="primary"
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {recommendation.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip 
                    label={`Complexity: ${recommendation.complexity}`}
                    size="small"
                    sx={{ 
                      bgcolor: getComplexityColor(recommendation.complexity),
                      color: 'white'
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    Est. savings: ${recommendation.estimatedMonthlySavings}/mo
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                  Implementation Steps:
                </Typography>
                
                <List dense>
                  {recommendation.implementationSteps.map((step, stepIndex) => (
                    <ListItem key={stepIndex} sx={{ py: 0 }}>
                      <ListItemText primary={`${stepIndex + 1}. ${step}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No AI recommendations available at this time.
        </Typography>
      )}
    </Box>
  );
};

export default AIRecommendations;