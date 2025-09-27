import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Chip, 
  Card, 
  CardContent, 
  Grid, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Alert, 
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
import UserInputForm from '../components/UserInputForm';
import { 
  RecommendationCardFallback, 
  AccordionFallback, 
  RecommendationSkeleton, 
  EmptyRecommendations 
} from '../components/FallbackUI';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [userContext, setUserContext] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const generateAIRecommendations = async () => {
    setIsGeneratingAI(true);
    try {
      // Run all AI agents to generate comprehensive recommendations
      const response = await fetch('http://localhost:5000/api/ai-agents/run-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      
      // Collect all recommendations from different agents
      const allRecommendations = [];
      if (data.results) {
        Object.values(data.results).forEach(result => {
          if (result.recommendations) {
            allRecommendations.push(...result.recommendations.map(rec => ({
              ...rec,
              agent: result.agent || 'AI Agent',
              analysis: result.analysis
            })));
          }
        });
      }
      
      setAiRecommendations(allRecommendations);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const fetchRecommendations = async (userInputData = null) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[Recommendations] Starting data fetch with user context:', userInputData);
      
      // Prepare the request body with user context
      const requestBody = userInputData ? {
        userContext: userInputData,
        includeAlternatives: true // Request alternative cloud providers
      } : {};
      
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      console.log('[Recommendations] Raw API response:', data);
        
        // Validate and set recommendations with enhanced logging
        const validatedRecommendations = (data.recommendations || []).map((rec, index) => {
          const validated = {
            id: rec?.id || `rec-${index}`,
            title: rec?.title || 'Untitled Recommendation',
            description: rec?.description || 'No description available',
            category: rec?.category || 'General',
            priority: rec?.priority || 'Medium',
            effort: rec?.effort || 'Unknown',
            estimatedSavings: rec?.estimatedSavings || 'Not specified',
            timeline: rec?.timeline || 'Not specified',
            implementation: rec?.implementation || 'No implementation details',
            risks: rec?.risks || 'No risks identified'
          };
          
          if (rec?.id !== validated.id || rec?.title !== validated.title) {
            console.warn(`[Recommendations] Data validation applied to recommendation ${index}:`, {
              original: rec,
              validated: validated
            });
          }
          
          return validated;
        });
        
        console.log(`[Recommendations] Validated ${validatedRecommendations.length} recommendations`);
        setRecommendations(validatedRecommendations);

        // Validate and set AI insights with enhanced logging
        const validatedAiInsights = (data.aiInsights || []).map((insight, index) => {
          const validated = {
            id: insight?.id || `insight-${index}`,
            title: insight?.title || 'Untitled Insight',
            description: insight?.description || 'No description available',
            priority: insight?.priority || 'Medium',
            effort: insight?.effort || 'Unknown',
            implementation: insight?.implementation || 'No implementation details',
            risks: insight?.risks || 'No risks identified',
            estimatedSavings: insight?.estimatedSavings || 'Not specified'
          };
          
          if (insight?.id !== validated.id || insight?.title !== validated.title) {
            console.warn(`[Recommendations] Data validation applied to AI insight ${index}:`, {
              original: insight,
              validated: validated
            });
          }
          
          return validated;
        });
        
        console.log(`[Recommendations] Validated ${validatedAiInsights.length} AI insights`);
        setAiInsights(validatedAiInsights);
        
        console.log('[Recommendations] Data fetch completed successfully');
      } catch (err) {
        console.error('[Recommendations] Error fetching data:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const handleFormSubmit = (formData) => {
      console.log('[Recommendations] Form submitted with data:', formData);
      setUserContext(formData);
      setShowForm(false);
      fetchRecommendations(formData);
    };

    const handleEditContext = () => {
      setShowForm(true);
    };

    // Initial load without user context (for fallback recommendations)
    useEffect(() => {
      if (!showForm && !userContext) {
        fetchRecommendations();
      }
      // Auto-generate AI recommendations when component mounts
      generateAIRecommendations();
    }, [showForm, userContext]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading AI-powered recommendations...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {typeof error === 'string' ? error : 'An error occurred while loading recommendations.'}
        </Alert>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            AI-Powered Cloud Recommendations
          </Typography>
          <Button 
            variant="contained" 
            onClick={generateAIRecommendations}
            disabled={isGeneratingAI}
            sx={{ mb: 2 }}
          >
            {isGeneratingAI ? 'Generating...' : 'Generate AI Recommendations'}
          </Button>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Get personalized recommendations to optimize your cloud infrastructure
        </Typography>

        {/* AI Recommendations Section */}
        {aiRecommendations.length > 0 && (
          <Paper sx={{ p: 3, mb: 4, bgcolor: 'info.50' }}>
            <Typography variant="h5" gutterBottom color="info.main">
              🤖 AI Agent Recommendations ({aiRecommendations.length})
            </Typography>
            <Grid container spacing={2}>
              {aiRecommendations.map((rec, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%', border: '1px solid', borderColor: 'info.light' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {rec.title || rec}
                        </Typography>
                        <Chip 
                          label={rec.agent} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                        />
                      </Box>
                      {rec.analysis && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {rec.analysis}
                        </Typography>
                      )}
                      {typeof rec === 'string' && (
                        <Typography variant="body2">
                          {rec}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {showForm ? (
          <UserInputForm onSubmit={handleFormSubmit} />
        ) : (
          <>
            {userContext && (
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    Recommendations based on your context
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleEditContext}
                  >
                    Edit Context
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Cloud Provider: {userContext.currentArchitecture?.primaryProvider || 'Not specified'} | 
                  Monthly Spend: ${userContext.currentArchitecture?.monthlySpend || 'Not specified'} | 
                  Team Size: {userContext.businessRequirements?.teamSize || 'Not specified'}
                </Typography>
              </Paper>
            )}

            {loading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Generating personalized recommendations...
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {!loading && recommendations.length === 0 && !error && (
              <EmptyRecommendations />
            )}

        {/* AI Insights Section */}
        {aiInsights && aiInsights.length > 0 && (
          <Paper sx={{ 
            p: 3, 
            mb: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            overflow: 'hidden'
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              wordBreak: 'break-word'
            }}>
              <span style={{ marginRight: '8px', fontSize: '1.1em' }}>🤖</span>
              AI-Generated Insights
            </Typography>
            <Grid container spacing={2}>
              {aiInsights.map((insight) => {
                // Defensive rendering with fallback
                if (!insight || typeof insight !== 'object') {
                  return (
                    <Grid item xs={12} md={6} lg={4} key={`fallback-${Math.random()}`}>
                      <RecommendationCardFallback />
                    </Grid>
                  );
                }
                
                return (
                  <Grid item xs={12} md={6} lg={4} key={insight.id}>
                    <Card sx={{ 
                      height: '100%', 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      overflow: 'hidden'
                    }}>
                      <CardContent sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}>
                        <Typography variant="h6" sx={{ 
                          color: 'white', 
                          mb: 1,
                          wordBreak: 'break-word',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {insight.title || 'Untitled Recommendation'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(255,255,255,0.8)', 
                          mb: 2,
                          flex: 1,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {insight.description || 'No description available'}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          flexWrap: 'wrap',
                          mt: 'auto'
                        }}>
                          <Chip 
                            label={`Priority: ${insight.priority || 'medium'}`} 
                            color={getPriorityColor(insight.priority || 'medium')}
                            size="small"
                          />
                          <Chip 
                            label={`Savings: ${insight.estimatedSavings || 'TBD'}`} 
                            color="success"
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        )}

        {/* Detailed AI Recommendations */}
        {aiInsights && aiInsights.length > 0 && (
          <ErrorBoundary
            fallbackTitle="Error in Recommendations Section"
            fallbackMessage="There was an error displaying the detailed recommendations. The data may be malformed or incomplete."
            onRetry={() => window.location.reload()}
          >
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Detailed Implementation Guide
              </Typography>
              {aiInsights.map((recommendation, index) => {
                // Defensive rendering with fallback for accordion items
                if (!recommendation || typeof recommendation !== 'object' || !recommendation.id) {
                  console.warn('Invalid recommendation data detected:', recommendation);
                  return (
                    <AccordionFallback key={`fallback-accordion-${index}`} />
                  );
                }
                
                return (
                  <Accordion key={recommendation.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<span>🔽</span>}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {recommendation.title || 'Untitled Recommendation'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                          <Chip 
                            label={recommendation.priority || 'medium'} 
                            color={getPriorityColor(recommendation.priority || 'medium')}
                            size="small"
                          />
                          <Chip 
                            label={`${recommendation.effort || 'medium'} effort`} 
                            color={getEffortColor(recommendation.effort || 'medium')}
                            size="small"
                          />
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="body1" paragraph>
                            {recommendation.description || 'No description available'}
                          </Typography>
                          
                          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Implementation Steps:
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                            {recommendation.implementation || 'Implementation details not available'}
                          </Typography>
                          
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              <strong>Risks & Considerations:</strong> {recommendation.risks || 'No specific risks identified'}
                            </Typography>
                          </Alert>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Quick Stats
                              </Typography>
                              <List dense>
                                <ListItem>
                                  <ListItemIcon>
                                    <span>📈</span>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Estimated Savings" 
                                    secondary={recommendation.estimatedSavings || 'N/A'}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemIcon>
                                    <span>ℹ️</span>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Timeline" 
                                    secondary={recommendation.timeline || 'N/A'}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemIcon>
                                    <span>✅</span>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary="Category" 
                                    secondary={typeof recommendation.category === 'string' ? recommendation.category : 'General'}
                                  />
                                </ListItem>
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Paper>
          </ErrorBoundary>
        )}

        {/* Traditional Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Standard Recommendations
            </Typography>
            <Box>
              {recommendations.map((rec, index) => {
                // Defensive rendering for traditional recommendations
                if (!rec || typeof rec !== 'object') {
                  console.warn('Invalid traditional recommendation data:', rec);
                  return (
                    <Box key={`fallback-traditional-${index}`} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Invalid recommendation data
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This recommendation could not be displayed due to data issues.
                      </Typography>
                    </Box>
                  );
                }
                
                return (
                  <Box key={rec.id || `traditional-${index}`} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">{rec.title || 'Untitled Recommendation'}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">{rec.description || 'No description available'}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}

          </>
        )}
      </Container>
    </ErrorBoundary>
  );
 };
 
 export default Recommendations;