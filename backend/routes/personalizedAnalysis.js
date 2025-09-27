const express = require('express');
const router = express.Router();
const PersonalizedMLAnalyzer = require('../services/PersonalizedMLAnalyzer');

// Initialize the ML analyzer
const mlAnalyzer = new PersonalizedMLAnalyzer();

// Store for user analysis results (in production, use a proper database)
const analysisStore = new Map();

/**
 * POST /api/personalized/analyze
 * Analyze user's cloud resources and provide personalized recommendations
 */
router.post('/analyze', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validate required fields
    if (!userData.companySize || !userData.currentMonthlyCost) {
      return res.status(400).json({
        error: 'Missing required fields: companySize and currentMonthlyCost'
      });
    }

    // Validate that at least one resource is provided
    const totalResources = (userData.ec2Instances?.length || 0) + 
                          (userData.rdsInstances?.length || 0) + 
                          (userData.s3Buckets?.length || 0) + 
                          (userData.lambdaFunctions?.length || 0);
    
    if (totalResources === 0) {
      return res.status(400).json({
        error: 'At least one cloud resource must be provided for analysis'
      });
    }

    // Perform ML analysis
    const analysis = mlAnalyzer.analyzeUserInput(userData);
    
    // Generate unique analysis ID
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store analysis result
    analysisStore.set(analysisId, {
      ...analysis,
      userData: userData,
      timestamp: new Date().toISOString(),
      id: analysisId
    });

    // Return analysis with ID
    res.json({
      success: true,
      analysisId: analysisId,
      analysis: analysis,
      metadata: {
        timestamp: new Date().toISOString(),
        resourcesAnalyzed: totalResources,
        analysisVersion: '1.0'
      }
    });

  } catch (error) {
    console.error('Error in personalized analysis:', error);
    res.status(500).json({
      error: 'Internal server error during analysis',
      message: error.message
    });
  }
});

/**
 * GET /api/personalized/analysis/:id
 * Retrieve a previously generated analysis
 */
router.get('/analysis/:id', (req, res) => {
  try {
    const analysisId = req.params.id;
    const analysis = analysisStore.get(analysisId);
    
    if (!analysis) {
      return res.status(404).json({
        error: 'Analysis not found',
        message: 'The requested analysis ID does not exist or has expired'
      });
    }
    
    res.json({
      success: true,
      analysis: analysis
    });
    
  } catch (error) {
    console.error('Error retrieving analysis:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/personalized/quick-estimate
 * Provide a quick cost estimate based on basic parameters
 */
router.get('/quick-estimate', (req, res) => {
  try {
    const { 
      companySize = 'medium', 
      industry = 'Technology', 
      monthlyBudget = 1000,
      resourceCount = 5 
    } = req.query;

    // Generate quick estimate using ML analyzer
    const quickData = {
      companySize,
      industry,
      currentMonthlyCost: monthlyBudget,
      ec2Instances: Array(Math.floor(resourceCount * 0.6)).fill(null).map((_, i) => ({
        id: i,
        name: `instance-${i}`,
        instanceType: 't3.medium',
        region: 'us-east-1',
        utilizationRate: 50 + Math.random() * 30,
        monthlyCost: (50 + Math.random() * 100).toFixed(2)
      })),
      rdsInstances: Array(Math.floor(resourceCount * 0.2)).fill(null).map((_, i) => ({
        id: i,
        name: `database-${i}`,
        instanceType: 'db.t3.small',
        region: 'us-east-1',
        utilizationRate: 40 + Math.random() * 40,
        monthlyCost: (80 + Math.random() * 120).toFixed(2)
      })),
      s3Buckets: Array(Math.floor(resourceCount * 0.2)).fill(null).map((_, i) => ({
        id: i,
        name: `bucket-${i}`,
        region: 'us-east-1',
        utilizationRate: 60 + Math.random() * 30,
        monthlyCost: (20 + Math.random() * 50).toFixed(2)
      })),
      lambdaFunctions: [],
      businessHours: { start: 9, end: 17 },
      weekendUsage: false,
      seasonalVariation: false,
      expectedGrowth: 15,
      costReductionTarget: 25,
      performanceRequirements: 'balanced',
      complianceRequirements: []
    };

    const quickAnalysis = mlAnalyzer.analyzeUserInput(quickData);
    
    res.json({
      success: true,
      estimate: {
        totalCost: quickAnalysis.totalCost,
        estimatedSavings: quickAnalysis.estimatedSavings,
        optimizationScore: quickAnalysis.optimizationScore,
        topRecommendations: quickAnalysis.recommendations.slice(0, 3),
        benchmarkComparison: quickAnalysis.benchmarkComparison
      },
      disclaimer: 'This is a quick estimate based on typical configurations. For accurate analysis, please provide your actual resource details.'
    });

  } catch (error) {
    console.error('Error generating quick estimate:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/personalized/compare-scenarios
 * Compare multiple optimization scenarios
 */
router.post('/compare-scenarios', async (req, res) => {
  try {
    const { baseScenario, optimizationScenarios } = req.body;
    
    if (!baseScenario || !optimizationScenarios || !Array.isArray(optimizationScenarios)) {
      return res.status(400).json({
        error: 'Invalid request format. Expected baseScenario and optimizationScenarios array.'
      });
    }

    // Analyze base scenario
    const baseAnalysis = mlAnalyzer.analyzeUserInput(baseScenario);
    
    // Analyze each optimization scenario
    const scenarioComparisons = optimizationScenarios.map((scenario, index) => {
      const scenarioAnalysis = mlAnalyzer.analyzeUserInput(scenario);
      
      return {
        scenarioId: index + 1,
        name: scenario.name || `Scenario ${index + 1}`,
        analysis: scenarioAnalysis,
        comparison: {
          costDifference: scenarioAnalysis.totalCost - baseAnalysis.totalCost,
          savingsDifference: scenarioAnalysis.estimatedSavings - baseAnalysis.estimatedSavings,
          scoreDifference: scenarioAnalysis.optimizationScore - baseAnalysis.optimizationScore
        }
      };
    });

    res.json({
      success: true,
      baseScenario: {
        analysis: baseAnalysis
      },
      scenarios: scenarioComparisons,
      recommendation: scenarioComparisons.reduce((best, current) => 
        current.analysis.optimizationScore > best.analysis.optimizationScore ? current : best
      )
    });

  } catch (error) {
    console.error('Error comparing scenarios:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/personalized/industry-benchmarks
 * Get industry benchmarks for comparison
 */
router.get('/industry-benchmarks', (req, res) => {
  try {
    const { industry } = req.query;
    
    // Get all industry benchmarks or specific industry
    const benchmarks = mlAnalyzer.industryBenchmarks;
    
    if (industry && benchmarks[industry]) {
      res.json({
        success: true,
        industry: industry,
        benchmark: benchmarks[industry],
        comparison: 'Provide your resource data to see how you compare to industry standards'
      });
    } else {
      res.json({
        success: true,
        availableIndustries: Object.keys(benchmarks),
        benchmarks: benchmarks
      });
    }

  } catch (error) {
    console.error('Error retrieving benchmarks:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * DELETE /api/personalized/analysis/:id
 * Delete a stored analysis (for privacy)
 */
router.delete('/analysis/:id', (req, res) => {
  try {
    const analysisId = req.params.id;
    const deleted = analysisStore.delete(analysisId);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Analysis deleted successfully'
      });
    } else {
      res.status(404).json({
        error: 'Analysis not found'
      });
    }

  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/personalized/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Personalized ML Analysis API',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    activeAnalyses: analysisStore.size
  });
});

module.exports = router;