const express = require('express');
const router = express.Router();
const MLDataGenerator = require('../services/mlDataGenerator');
const CostPredictionModel = require('../services/costPredictionModel');
const ResourceUsageSimulator = require('../services/resourceUsageSimulator');

// Initialize ML services
const mlGenerator = new MLDataGenerator();
const predictionModel = new CostPredictionModel();
const resourceSimulator = new ResourceUsageSimulator();

// Store for real-time data updates
let realTimeDataStore = {
  lastUpdate: null,
  data: null
};

// Update interval for real-time data (30 seconds)
const UPDATE_INTERVAL = 30000;

// Initialize real-time data generation
function initializeRealTimeData() {
  updateRealTimeData();
  setInterval(updateRealTimeData, UPDATE_INTERVAL);
}

// Update real-time data
function updateRealTimeData() {
  try {
    const mlData = mlGenerator.generateRealTimeData();
    const predictionData = predictionModel.getPredictionReport();
    const resourceData = resourceSimulator.getSimulationData();
    
    realTimeDataStore = {
      lastUpdate: Date.now(),
      data: {
        overview: mlData.overview,
        trends: mlData.trends,
        recommendations: mlData.recommendations,
        savingsByResource: mlData.savingsByResource,
        projectedCost: mlData.projectedCost,
        predictions: predictionData.predictions,
        costDrivers: predictionData.costDrivers,
        anomalies: predictionData.anomalies,
        resourceUsage: resourceData.statistics,
        instances: resourceData.instances.slice(0, 20), // Limit to first 20 for performance
        scalingEvents: resourceData.scalingEvents,
        metadata: {
          ...mlData.metadata,
          predictionAccuracy: predictionData.modelMetrics.accuracy,
          totalInstances: resourceData.metadata.totalInstances,
          updateInterval: UPDATE_INTERVAL
        }
      }
    };
    
    console.log(`Real-time data updated at ${new Date(realTimeDataStore.lastUpdate).toISOString()}`);
  } catch (error) {
    console.error('Error updating real-time data:', error);
  }
}

// GET /api/realtime/overview - Get real-time cost overview
router.get('/overview', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.overview,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview data',
      message: error.message
    });
  }
});

// GET /api/realtime/trends - Get real-time cost trends
router.get('/trends', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.trends,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trends data',
      message: error.message
    });
  }
});

// GET /api/realtime/recommendations - Get ML-generated recommendations
router.get('/recommendations', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.recommendations,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations data',
      message: error.message
    });
  }
});

// GET /api/realtime/savings - Get savings by resource
router.get('/savings', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.savingsByResource,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching savings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch savings data',
      message: error.message
    });
  }
});

// GET /api/realtime/projected - Get projected costs
router.get('/projected', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.projectedCost,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching projected costs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projected costs data',
      message: error.message
    });
  }
});

// GET /api/realtime/predictions - Get cost predictions
router.get('/predictions', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    const periods = parseInt(req.query.periods) || 6;
    const predictions = realTimeDataStore.data.predictions.slice(0, periods);
    
    res.json({
      success: true,
      data: predictions,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch predictions data',
      message: error.message
    });
  }
});

// GET /api/realtime/cost-drivers - Get cost driver analysis
router.get('/cost-drivers', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.costDrivers,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching cost drivers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cost drivers data',
      message: error.message
    });
  }
});

// GET /api/realtime/anomalies - Get cost anomalies
router.get('/anomalies', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.anomalies,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch anomalies data',
      message: error.message
    });
  }
});

// GET /api/realtime/resource-usage - Get resource usage statistics
router.get('/resource-usage', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    res.json({
      success: true,
      data: realTimeDataStore.data.resourceUsage,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching resource usage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resource usage data',
      message: error.message
    });
  }
});

// GET /api/realtime/instances - Get instance details
router.get('/instances', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const type = req.query.type;
    const status = req.query.status;
    
    let instances = realTimeDataStore.data.instances;
    
    // Apply filters
    if (type) {
      instances = instances.filter(instance => instance.type === type);
    }
    
    if (status) {
      instances = instances.filter(instance => instance.status === status);
    }
    
    // Apply pagination
    const paginatedInstances = instances.slice(offset, offset + limit);
    
    res.json({
      success: true,
      data: paginatedInstances,
      pagination: {
        total: instances.length,
        limit,
        offset,
        hasMore: offset + limit < instances.length
      },
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching instances:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch instances data',
      message: error.message
    });
  }
});

// GET /api/realtime/scaling-events - Get scaling events
router.get('/scaling-events', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    const limit = parseInt(req.query.limit) || 10;
    const events = realTimeDataStore.data.scalingEvents.slice(0, limit);
    
    res.json({
      success: true,
      data: events,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching scaling events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scaling events data',
      message: error.message
    });
  }
});

// GET /api/realtime/dashboard - Get complete dashboard data
router.get('/dashboard', (req, res) => {
  try {
    if (!realTimeDataStore.data) {
      updateRealTimeData();
    }
    
    // Return comprehensive dashboard data
    const dashboardData = {
      overview: realTimeDataStore.data.overview,
      trends: realTimeDataStore.data.trends,
      recommendations: realTimeDataStore.data.recommendations.slice(0, 5),
      savingsByResource: realTimeDataStore.data.savingsByResource,
      projectedCost: realTimeDataStore.data.projectedCost,
      resourceUsage: {
        summary: realTimeDataStore.data.resourceUsage.summary,
        statusDistribution: realTimeDataStore.data.resourceUsage.statusDistribution,
        topOptimizations: realTimeDataStore.data.resourceUsage.topOptimizations.slice(0, 5)
      },
      recentEvents: realTimeDataStore.data.scalingEvents.slice(0, 5),
      metadata: realTimeDataStore.data.metadata
    };
    
    res.json({
      success: true,
      data: dashboardData,
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

// POST /api/realtime/refresh - Force refresh of real-time data
router.post('/refresh', (req, res) => {
  try {
    updateRealTimeData();
    
    res.json({
      success: true,
      message: 'Real-time data refreshed successfully',
      lastUpdated: realTimeDataStore.lastUpdate
    });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh data',
      message: error.message
    });
  }
});

// GET /api/realtime/status - Get system status
router.get('/status', (req, res) => {
  try {
    const status = {
      isRunning: true,
      lastUpdate: realTimeDataStore.lastUpdate,
      updateInterval: UPDATE_INTERVAL,
      dataAvailable: !!realTimeDataStore.data,
      services: {
        mlGenerator: 'active',
        predictionModel: 'active',
        resourceSimulator: 'active'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch status',
      message: error.message
    });
  }
});

// Initialize real-time data generation when module loads
initializeRealTimeData();

module.exports = router;