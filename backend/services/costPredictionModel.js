const MLDataGenerator = require('./mlDataGenerator');

class CostPredictionModel {
  constructor() {
    this.mlGenerator = new MLDataGenerator();
    this.historicalData = [];
    this.modelWeights = {
      trend: 0.4,
      seasonal: 0.3,
      cyclical: 0.2,
      noise: 0.1
    };
    
    // Initialize with some historical data
    this.initializeHistoricalData();
  }

  // Initialize historical data for training
  initializeHistoricalData() {
    const now = Date.now();
    const monthsBack = 12;
    
    for (let i = monthsBack; i >= 0; i--) {
      const timestamp = now - (i * 30 * 24 * 60 * 60 * 1000);
      const baseValue = 10000 + (i * 200); // Growing trend
      const seasonalFactor = this.mlGenerator.getSeasonalFactor(timestamp);
      const noise = this.mlGenerator.generateGaussianNoise(0, 0.05);
      
      this.historicalData.push({
        timestamp,
        cost: Math.round(baseValue * seasonalFactor * (1 + noise)),
        utilization: 0.6 + Math.random() * 0.3,
        resourceCount: 50 + Math.round(Math.random() * 20)
      });
    }
  }

  // Linear regression for trend analysis
  calculateTrend(data) {
    const n = data.length;
    if (n < 2) return 0;
    
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, item) => sum + item.cost, 0);
    const sumXY = data.reduce((sum, item, i) => sum + (i * item.cost), 0);
    const sumXX = data.reduce((sum, _, i) => sum + (i * i), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  // Moving average for smoothing
  calculateMovingAverage(data, window = 3) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const subset = data.slice(start, i + 1);
      const average = subset.reduce((sum, item) => sum + item.cost, 0) / subset.length;
      result.push(average);
    }
    return result;
  }

  // Exponential smoothing for forecasting
  exponentialSmoothing(data, alpha = 0.3) {
    if (data.length === 0) return [];
    
    const result = [data[0].cost];
    for (let i = 1; i < data.length; i++) {
      const smoothed = alpha * data[i].cost + (1 - alpha) * result[i - 1];
      result.push(smoothed);
    }
    return result;
  }

  // Detect seasonal patterns
  detectSeasonality(data) {
    const monthlyAverages = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);
    
    data.forEach(item => {
      const month = new Date(item.timestamp).getMonth();
      monthlyAverages[month] += item.cost;
      monthlyCounts[month]++;
    });
    
    // Calculate averages
    for (let i = 0; i < 12; i++) {
      if (monthlyCounts[i] > 0) {
        monthlyAverages[i] /= monthlyCounts[i];
      }
    }
    
    const overallAverage = monthlyAverages.reduce((sum, avg) => sum + avg, 0) / 12;
    return monthlyAverages.map(avg => avg / overallAverage);
  }

  // Predict future costs using ensemble method
  predictFutureCosts(periodsAhead = 6) {
    const recentData = this.historicalData.slice(-6); // Use last 6 months
    const trend = this.calculateTrend(this.historicalData);
    const seasonalFactors = this.detectSeasonality(this.historicalData);
    const smoothedData = this.exponentialSmoothing(this.historicalData);
    const lastSmoothed = smoothedData[smoothedData.length - 1];
    
    const predictions = [];
    
    for (let i = 1; i <= periodsAhead; i++) {
      const futureTimestamp = Date.now() + (i * 30 * 24 * 60 * 60 * 1000);
      const futureMonth = new Date(futureTimestamp).getMonth();
      
      // Trend component
      const trendComponent = trend * i;
      
      // Seasonal component
      const seasonalComponent = seasonalFactors[futureMonth] || 1;
      
      // Base prediction using exponential smoothing
      const basePrediction = lastSmoothed + trendComponent;
      
      // Apply seasonal adjustment
      const seasonalPrediction = basePrediction * seasonalComponent;
      
      // Add some realistic variance
      const variance = this.mlGenerator.generateGaussianNoise(0, 0.03);
      const finalPrediction = seasonalPrediction * (1 + variance);
      
      // Calculate confidence interval
      const confidence = Math.max(0.6, 0.9 - (i * 0.05)); // Decreasing confidence over time
      const confidenceInterval = finalPrediction * 0.1 * (1 - confidence);
      
      predictions.push({
        period: i,
        timestamp: futureTimestamp,
        predictedCost: Math.round(finalPrediction),
        confidence: Math.round(confidence * 100) / 100,
        lowerBound: Math.round(finalPrediction - confidenceInterval),
        upperBound: Math.round(finalPrediction + confidenceInterval),
        factors: {
          trend: Math.round(trendComponent),
          seasonal: Math.round(seasonalComponent * 100) / 100,
          base: Math.round(basePrediction)
        }
      });
    }
    
    return predictions;
  }

  // Analyze cost drivers
  analyzeCostDrivers() {
    const recentData = this.historicalData.slice(-3);
    const avgCost = recentData.reduce((sum, item) => sum + item.cost, 0) / recentData.length;
    const avgUtilization = recentData.reduce((sum, item) => sum + item.utilization, 0) / recentData.length;
    const avgResourceCount = recentData.reduce((sum, item) => sum + item.resourceCount, 0) / recentData.length;
    
    return {
      primaryDrivers: [
        {
          factor: 'Resource Count',
          impact: 'High',
          currentValue: Math.round(avgResourceCount),
          trend: 'Increasing',
          contribution: 0.45
        },
        {
          factor: 'Utilization Rate',
          impact: 'Medium',
          currentValue: Math.round(avgUtilization * 100) + '%',
          trend: avgUtilization > 0.7 ? 'Stable' : 'Needs Improvement',
          contribution: 0.35
        },
        {
          factor: 'Seasonal Demand',
          impact: 'Medium',
          currentValue: 'Variable',
          trend: 'Cyclical',
          contribution: 0.20
        }
      ],
      recommendations: this.generateDriverRecommendations(avgUtilization, avgResourceCount)
    };
  }

  // Generate recommendations based on cost drivers
  generateDriverRecommendations(utilization, resourceCount) {
    const recommendations = [];
    
    if (utilization < 0.6) {
      recommendations.push({
        type: 'Utilization Optimization',
        description: 'Low utilization detected. Consider rightsizing or auto-scaling.',
        potentialSavings: Math.round(resourceCount * 50 * (0.6 - utilization))
      });
    }
    
    if (resourceCount > 60) {
      recommendations.push({
        type: 'Resource Consolidation',
        description: 'High resource count. Evaluate consolidation opportunities.',
        potentialSavings: Math.round((resourceCount - 60) * 75)
      });
    }
    
    recommendations.push({
      type: 'Predictive Scaling',
      description: 'Implement ML-based predictive scaling to optimize costs.',
      potentialSavings: Math.round(resourceCount * 25)
    });
    
    return recommendations;
  }

  // Get anomaly detection results
  detectCostAnomalies() {
    const recentData = this.historicalData.slice(-6);
    const costs = recentData.map(item => item.cost);
    const mean = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
    const variance = costs.reduce((sum, cost) => sum + Math.pow(cost - mean, 2), 0) / costs.length;
    const stdDev = Math.sqrt(variance);
    
    return recentData.map((item, index) => {
      const zScore = (item.cost - mean) / stdDev;
      const isAnomaly = Math.abs(zScore) > 2;
      
      return {
        timestamp: item.timestamp,
        cost: item.cost,
        isAnomaly,
        severity: isAnomaly ? (Math.abs(zScore) > 3 ? 'High' : 'Medium') : 'Normal',
        zScore: Math.round(zScore * 100) / 100,
        explanation: isAnomaly ? this.explainAnomaly(zScore, item) : null
      };
    });
  }

  // Explain detected anomalies
  explainAnomaly(zScore, dataPoint) {
    if (zScore > 2) {
      return `Cost spike detected: ${Math.round((zScore - 2) * 50)}% above normal range. Possible causes: resource scaling, new deployments, or seasonal demand.`;
    } else if (zScore < -2) {
      return `Cost drop detected: ${Math.round((Math.abs(zScore) - 2) * 50)}% below normal range. Possible causes: resource optimization, downtime, or reduced usage.`;
    }
    return null;
  }

  // Update model with new data point
  updateModel(newDataPoint) {
    this.historicalData.push(newDataPoint);
    
    // Keep only last 12 months of data
    if (this.historicalData.length > 12) {
      this.historicalData = this.historicalData.slice(-12);
    }
    
    // Retrain model weights based on recent performance
    this.adjustModelWeights();
  }

  // Adjust model weights based on prediction accuracy
  adjustModelWeights() {
    // Simple adaptive weighting (in a real implementation, this would be more sophisticated)
    const recentAccuracy = this.calculateRecentAccuracy();
    
    if (recentAccuracy > 0.8) {
      // Model is performing well, maintain current weights
      return;
    } else {
      // Adjust weights to improve performance
      this.modelWeights.trend *= 0.95;
      this.modelWeights.seasonal *= 1.05;
      this.modelWeights.noise *= 0.9;
    }
  }

  // Calculate recent prediction accuracy (simplified)
  calculateRecentAccuracy() {
    // In a real implementation, this would compare predictions with actual values
    return 0.75 + Math.random() * 0.2; // Simulated accuracy between 75-95%
  }

  // Get comprehensive prediction report
  getPredictionReport() {
    return {
      predictions: this.predictFutureCosts(),
      costDrivers: this.analyzeCostDrivers(),
      anomalies: this.detectCostAnomalies(),
      modelMetrics: {
        accuracy: this.calculateRecentAccuracy(),
        weights: this.modelWeights,
        dataPoints: this.historicalData.length,
        lastUpdated: Date.now()
      }
    };
  }
}

module.exports = CostPredictionModel;