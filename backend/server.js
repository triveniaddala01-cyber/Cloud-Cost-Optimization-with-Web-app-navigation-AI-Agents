const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { costData } = require('./data/costData');
const costPredictor = require('./models/costPredictor');
const geminiAI = require('./services/geminiAI');
const knowledgebaseReader = require('./services/knowledgebaseReader');
const PersonalizedMLAnalyzer = require('./services/PersonalizedMLAnalyzer');
const AIAgentsService = require('./services/AIAgentsService');
const realTimeDataRoutes = require('./routes/realTimeData');
const personalizedAnalysisRoutes = require('./routes/personalizedAnalysis');
const automationRoutes = require('./routes/automation');

// Initialize Gemini AI with knowledgebase
const geminiService = new geminiAI(process.env.GEMINI_API_KEY);
geminiService.initializeKnowledgebase(
  path.join(__dirname, 'services/knowledgebase'),
  knowledgebaseReader
);

// Initialize knowledgebase reader
let knowledgebaseData = null;

// Load knowledgebase data on startup
async function initializeKnowledgebase() {
  try {
    console.log('Initializing knowledgebase...');
    knowledgebaseData = await knowledgebaseReader.loadAllData();
    console.log('Knowledgebase initialized successfully:', knowledgebaseData.loaded);
  } catch (error) {
    console.error('Failed to initialize knowledgebase:', error);
  }
}

// Initialize knowledgebase on startup
initializeKnowledgebase();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize AI Agents Service
const aiAgentsService = new AIAgentsService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Real-time ML data routes
app.use('/api/realtime', realTimeDataRoutes);

// Personalized ML analysis routes
app.use('/api/personalized', personalizedAnalysisRoutes);

// Automation routes for cloud dashboard integration
app.use('/api/automation', automationRoutes);

// API Routes
app.get('/api/cost-overview', (req, res) => {
  res.json({
    totalCost: costData.totalCost,
    estimatedSavings: costData.estimatedSavings,
    idleResources: costData.idleResources,
    oversizedResources: costData.oversizedResources
  });
});

app.get('/api/cost-trends', (req, res) => {
  res.json(costData.costTrends);
});

app.get('/api/recommendations', async (req, res) => {
  try {
    let recommendations = [];
    let aiInsights = [];

    // Use knowledgebase data if available
    if (knowledgebaseData && knowledgebaseData.loaded.services) {
      console.log('[API] Using knowledgebase data for recommendations');
      recommendations = knowledgebaseReader.generateRecommendations();
      
      // Get AI-powered recommendations with knowledgebase context
      try {
        aiInsights = await geminiService.generateRecommendations(
          { ...costData, knowledgebase: knowledgebaseData },
          {
            environment: req.query.environment || 'production',
            resourceType: req.query.resourceType || 'all',
            timeframe: req.query.timeframe || '30d'
          }
        );
      } catch (aiError) {
        console.warn('[API] AI recommendations failed, using knowledgebase only:', aiError.message);
      }
    } else {
      console.log('[API] Knowledgebase not available, using fallback data');
      // Fallback to dummy data if knowledgebase is not available
      recommendations = costData.recommendations || [];
      
      try {
        aiInsights = await geminiService.generateRecommendations(
          costData,
          {
            environment: req.query.environment || 'production',
            resourceType: req.query.resourceType || 'all',
            timeframe: req.query.timeframe || '30d'
          }
        );
      } catch (aiError) {
        console.warn('[API] AI recommendations failed:', aiError.message);
      }
    }
    
    // Combine knowledgebase recommendations with AI insights
    const enhancedRecommendations = {
      recommendations: recommendations,
      aiInsights: aiInsights
    };
    
    res.json(enhancedRecommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Ultimate fallback to original dummy data
    res.json({
      recommendations: costData.recommendations || [],
      aiInsights: []
    });
  }
});

// New POST endpoint for personalized recommendations with user context
app.post('/api/recommendations', async (req, res) => {
  try {
    const { userContext, includeAlternatives } = req.body;
    
    console.log('[API] Received user context for recommendations:', userContext);
    
    let recommendations = [];
    let aiInsights = [];

    // Use knowledgebase data if available
    if (knowledgebaseData && knowledgebaseData.loaded.services) {
      console.log('[API] Using knowledgebase data for personalized recommendations');
      recommendations = knowledgebaseReader.generateRecommendations(userContext);
      
      // Get AI-powered recommendations with knowledgebase context and user input
      try {
        aiInsights = await geminiService.generateRecommendations(
          { ...costData, knowledgebase: knowledgebaseData },
          {
            environment: req.query.environment || 'production',
            resourceType: req.query.resourceType || 'all',
            timeframe: req.query.timeframe || '30d',
            userContext: userContext,
            includeAlternatives: includeAlternatives
          }
        );
      } catch (aiError) {
        console.warn('[API] AI recommendations failed, using knowledgebase only:', aiError.message);
      }
    } else {
      console.log('[API] Knowledgebase not available, using fallback data for personalized recommendations');
      // Fallback to dummy data if knowledgebase is not available
      recommendations = costData.recommendations || [];
      
      try {
        aiInsights = await geminiService.generateRecommendations(
          costData,
          {
            environment: req.query.environment || 'production',
            resourceType: req.query.resourceType || 'all',
            timeframe: req.query.timeframe || '30d',
            userContext: userContext,
            includeAlternatives: includeAlternatives
          }
        );
      } catch (aiError) {
        console.warn('[API] AI recommendations failed:', aiError.message);
      }
    }
    
    // Combine knowledgebase recommendations with AI insights
    const enhancedRecommendations = {
      recommendations: recommendations,
      aiInsights: aiInsights
    };
    
    res.json(enhancedRecommendations);
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    // Ultimate fallback to original dummy data
    res.json({
      recommendations: costData.recommendations || [],
      aiInsights: []
    });
  }
});

app.get('/api/savings-by-resource', (req, res) => {
  res.json(costData.savingsByResource);
});

app.get('/api/projected-cost', (req, res) => {
  res.json(costData.projectedCost);
});

app.get('/api/cost-predictions', (req, res) => {
  const periods = parseInt(req.query.periods) || 3;
  const modelType = req.query.modelType || 'ensemble';
  
  // Generate prediction data based on the requested parameters
  const predictions = costPredictor.generatePredictions(periods, modelType);
  res.json(predictions);
});

// Enhanced API endpoints for new features
app.get('/api/cost-by-environment', (req, res) => {
  res.json(costData.costByEnvironment);
});

app.get('/api/cost-by-tags', (req, res) => {
  res.json(costData.costByTags);
});

app.get('/api/reserved-instance-coverage', (req, res) => {
  res.json(costData.reservedInstanceCoverage);
});

app.get('/api/anomalies', async (req, res) => {
  try {
    const resolved = req.query.resolved;
    let anomalies = costData.anomalies;
    
    if (resolved !== undefined) {
      anomalies = anomalies.filter(anomaly => anomaly.resolved === (resolved === 'true'));
    }
    
    // Get AI-powered anomaly analysis
    const aiAnomalies = await geminiService.analyzeAnomalies(anomalies);
    
    // Enhance anomalies with AI insights
    const enhancedAnomalies = anomalies.map(anomaly => ({
      ...anomaly,
      aiAnalysis: aiAnomalies.find(ai => ai.id === anomaly.id)?.analysis || null
    }));
    
    res.json(enhancedAnomalies);
  } catch (error) {
    console.error('Error analyzing anomalies with AI:', error);
    // Fallback to original anomalies if AI fails
    const resolved = req.query.resolved;
    let anomalies = costData.anomalies;
    
    if (resolved !== undefined) {
      anomalies = anomalies.filter(anomaly => anomaly.resolved === (resolved === 'true'));
    }
    
    res.json(anomalies);
  }
});

app.get('/api/rightsizing-history', (req, res) => {
  res.json(costData.rightsizingHistory);
});

app.get('/api/license-optimization', (req, res) => {
  res.json(costData.licenseOptimization);
});

app.get('/api/data-lifecycle-recommendations', (req, res) => {
  res.json(costData.dataLifecycleRecommendations);
});

app.get('/api/budget-alerts', (req, res) => {
  res.json(costData.budgetAlerts);
});

app.get('/api/what-if-scenarios', (req, res) => {
  res.json(costData.whatIfScenarios);
});

app.post('/api/what-if-scenarios', (req, res) => {
  const { name, changeType, resourcePercentage, newInstanceType, userGrowth, timeframe } = req.body;
  
  // Generate realistic analysis results based on scenario type
  const baselineCost = 12500.75;
  let projectedCost = baselineCost;
  let totalImpact = 0;
  let roi = 0;
  
  // Calculate impact based on change type
  switch (changeType) {
    case 'instance_type':
      // Simulate cost change based on instance type and percentage
      const instanceSavings = resourcePercentage * 0.002; // 0.2% savings per percentage point
      projectedCost = baselineCost * (1 - instanceSavings);
      break;
    case 'user_growth':
      // Simulate cost increase based on user growth
      projectedCost = baselineCost * (1 + (userGrowth / 100) * 0.8); // 80% of growth translates to cost
      break;
    case 'reserved_instances':
      // Simulate reserved instance savings
      projectedCost = baselineCost * 0.75; // 25% savings
      break;
    case 'region_change':
      // Simulate region cost differences
      projectedCost = baselineCost * 0.85; // 15% savings
      break;
    default:
      projectedCost = baselineCost * 0.9; // 10% default savings
  }
  
  totalImpact = projectedCost - baselineCost;
  roi = totalImpact < 0 ? Math.abs((totalImpact / baselineCost) * 100) : 0;
  
  // Generate baseline and projected cost arrays for chart
  const baselineCosts = [];
  const projectedCosts = [];
  
  for (let i = 0; i < timeframe; i++) {
    const monthlyGrowth = 1 + (i * 0.01); // 1% monthly growth
    baselineCosts.push(Math.round(baselineCost * monthlyGrowth));
    projectedCosts.push(Math.round(projectedCost * monthlyGrowth));
  }
  
  const newScenario = {
    id: costData.whatIfScenarios.length + 1,
    scenarioName: name,
    changeType,
    currentMonthlyCost: baselineCost,
    projectedMonthlyCost: projectedCost,
    totalImpact: Math.round(totalImpact * timeframe), // Total impact over timeframe
    roi: Math.round(roi * 100) / 100,
    paybackMonths: totalImpact < 0 ? 0 : Math.ceil(Math.abs(totalImpact) / 100),
    baselineCosts,
    projectedCosts,
    createdAt: new Date().toISOString()
  };
  
  costData.whatIfScenarios.push(newScenario);
  res.json(newScenario);
});

// Custom reports endpoints
app.get('/api/reports', (req, res) => {
  res.json(costData.reports);
});

app.get('/api/scheduled-reports', (req, res) => {
  res.json(costData.scheduledReports);
});

app.post('/api/reports/generate', (req, res) => {
  // Simulate report generation
  const newReport = {
    id: costData.reports.length + 1,
    ...req.body,
    status: 'completed',
    fileSize: Math.floor(Math.random() * 5000000) + 500000, // Random file size
    createdAt: new Date().toISOString()
  };
  costData.reports.push(newReport);
  
  // Simulate file download response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${req.body.name}.${req.body.format}"`);
  res.send(Buffer.from('Mock report content'));
});

app.post('/api/scheduled-reports', (req, res) => {
  const newScheduledReport = {
    id: costData.scheduledReports.length + 1,
    ...req.body,
    nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    lastRun: null
  };
  costData.scheduledReports.push(newScheduledReport);
  res.json(newScheduledReport);
});

// AI Agents API endpoints
app.get('/api/ai-agents/status', (req, res) => {
  res.json(aiAgentsService.getAgentsStatus());
});

app.post('/api/ai-agents/start', async (req, res) => {
  try {
    const { intervalMinutes = 30 } = req.body;
    const result = await aiAgentsService.startAutomation(intervalMinutes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai-agents/stop', (req, res) => {
  try {
    const result = aiAgentsService.stopAutomation();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai-agents/run-all', async (req, res) => {
  try {
    const results = await aiAgentsService.runAllAgents();
    res.json({
      success: true,
      message: 'All AI agents executed successfully',
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai-agents/run/:agentKey', async (req, res) => {
  try {
    const { agentKey } = req.params;
    const result = await aiAgentsService.runAgent(agentKey);
    res.json({
      success: true,
      message: `Agent ${agentKey} executed successfully`,
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ai-agents/recommendations', (req, res) => {
  try {
    const recommendations = aiAgentsService.getAllRecommendations();
    res.json({
      success: true,
      totalRecommendations: recommendations.length,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ai-agents/recommendations/:agentKey', (req, res) => {
  try {
    const { agentKey } = req.params;
    const result = aiAgentsService.getAgentRecommendations(agentKey);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ai-agents/:agentKey/toggle', (req, res) => {
  try {
    const { agentKey } = req.params;
    const { active } = req.body;
    const result = aiAgentsService.toggleAgent(agentKey, active);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Automated analysis endpoint that runs all agents and returns comprehensive results
app.get('/api/automated-analysis', async (req, res) => {
  try {
    const agentResults = await aiAgentsService.runAllAgents();
    const recommendations = aiAgentsService.getAllRecommendations();
    const status = aiAgentsService.getAgentsStatus();
    
    // Calculate total potential savings
    const totalSavings = recommendations.reduce((sum, rec) => sum + (rec.savings || 0), 0);
    
    res.json({
      success: true,
      message: 'Automated analysis completed',
      timestamp: new Date().toISOString(),
      summary: {
        totalAgents: status.totalAgents,
        activeAgents: status.activeAgents,
        totalRecommendations: recommendations.length,
        totalPotentialSavings: Math.round(totalSavings * 100) / 100,
        automationStatus: status.isRunning ? 'active' : 'inactive'
      },
      agentResults,
      recommendations: recommendations.slice(0, 10), // Top 10 recommendations
      status
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Implementation tracker endpoints
app.get('/api/implementation-tracker', (req, res) => {
  res.json(costData.implementationTracker);
});

app.get('/api/implementation-tracker/summary', (req, res) => {
  res.json(costData.implementationSummary);
});

app.put('/api/implementation-tracker/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const implementationIndex = costData.implementationTracker.findIndex(impl => impl.id === id);
  
  if (implementationIndex !== -1) {
    costData.implementationTracker[implementationIndex] = {
      ...costData.implementationTracker[implementationIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json(costData.implementationTracker[implementationIndex]);
  } else {
    res.status(404).json({ error: 'Implementation not found' });
  }
});

app.post('/api/implementation-tracker', (req, res) => {
  const newImplementation = {
    id: costData.implementationTracker.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  costData.implementationTracker.push(newImplementation);
  res.json(newImplementation);
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});